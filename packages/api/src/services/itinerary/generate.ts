import type { Place, PlaceCategory } from "@traveler-app/db";

import { callGroq } from "../../lib/groq";
import { pickCandidates } from "./candidates";
import { buildPrompt, type TripPrefs } from "./prompt";
import { llmItinerarySchema } from "./schema";

export type GeneratedItem = {
	place: Place;
	startTime: string;
	durationMin: number;
	reason?: string;
};

export type GeneratedItinerary = {
	days: { day: number; items: GeneratedItem[] }[];
	droppedItems: number;
};

export async function generateItinerary(input: {
	cityId: string;
	interests: PlaceCategory[];
	days: number;
	pace?: TripPrefs["pace"];
	notes?: string;
}): Promise<GeneratedItinerary> {
	const candidatesByDay = await pickCandidates({
		cityId: input.cityId,
		interests: input.interests,
		days: input.days,
	});
	const byDay = candidatesByDay.map(
		(places) => new Map(places.map((p) => [p.id, p])),
	);

	if (candidatesByDay.every((day) => day.length === 0)) {
		throw new Error(`No candidate places for city: ${input.cityId}`);
	}

	const prefs: TripPrefs = {
		days: input.days,
		interests: input.interests,
		pace: input.pace,
		notes: input.notes,
	};

	let lastError = "";

	// One retry to safeguard LLM
	for (let attempt = 1; attempt <= 2; attempt++) {
		const prompt =
			attempt === 1
				? buildPrompt(prefs, candidatesByDay)
				: `${buildPrompt(prefs, candidatesByDay)}

Your previous reply was rejected: ${lastError}
Return ONLY valid JSON in the required shape using placeIds copied exactly from the PLACES list`;

		const raw = await callGroq(prompt);

		const parsed = safeJsonParse(raw);
		if (!parsed) {
			lastError = "reply was not valid JSON";
			continue;
		}

		const result = llmItinerarySchema.safeParse(parsed);
		if (!result.success) {
			lastError = result.error.issues
				.slice(0, 3)
				.map((issue) => `${issue.path.join(".")}: ${issue.message}`)
				.join("; ");
			continue;
		}

		const { days, dropped, kept } = hydrate(result.data, byDay);

		// If the model invented most of its ids the reply is not usable
		if (kept === 0 || dropped > kept) {
			lastError = `${dropped} of ${dropped + kept} placeIds were not in the list`;
			continue;
		}

		return { days, droppedItems: dropped };
	}

	throw new Error(`Generation failed after 2 attempts: ${lastError}`);
}

function safeJsonParse(raw: string): unknown {
	try {
		return JSON.parse(raw);
	} catch {
		return null;
	}
}

// Swap placeIds for real rows
function hydrate(
	itinerary: {
		days: {
			day: number;
			items: {
				placeId: string;
				startTime: string;
				durationMin: number;
				reason?: string;
			}[];
		}[];
	},
	byDay: Map<string, Place>[],
) {
	let dropped = 0;
	let kept = 0;
	const used = new Set<string>();

	const days = itinerary.days.map((day) => {
		const items: GeneratedItem[] = [];
		// Each day may only use places from its own area.
		const dayPlaces = byDay[day.day - 1];

		for (const item of day.items) {
			const place = dayPlaces?.get(item.placeId);
			if (!place || used.has(item.placeId)) {
				dropped++;
				continue;
			}
			used.add(item.placeId);
			kept++;
			items.push({
				place,
				startTime: item.startTime,
				durationMin: item.durationMin,
				reason: item.reason,
			});
		}

		return { day: day.day, items };
	});

	return { days, dropped, kept };
}
