import type { Place } from "@traveler-app/db";

export type TripPrefs = {
	days: number;
	interests: string[];
	pace?: "relaxed" | "normal" | "packed";
	notes?: string;
};

const ITEMS_PER_DAY = {
	relaxed: 4,
	normal: 5,
	packed: 7,
} as const;

function placeLine(place: Place): string {
	return [
		place.id,
		place.name,
		place.category,
		place.indoor === null ? "indoor:?" : `indoor:${place.indoor}`,
		place.openingHours ?? "hours:?",
	].join(" | ");
}

export function buildPrompt(
	prefs: TripPrefs,
	candidatesByDay: Place[][],
): string {
	const perDay = ITEMS_PER_DAY[prefs.pace ?? "normal"];

	const placesBlock = candidatesByDay
		.map(
			(places, index) =>
				`AREA ${index + 1} (use these for day ${index + 1}):\n${places
					.map(placeLine)
					.join("\n")}`,
		)
		.join("\n\n");

	return `You are a Kuala Lumpur travel planner.

Build a ${prefs.days}-day itinerary using ONLY the places listed below.

RULES
- Use each place at most once across the whole trip
- Every placeId MUST be copied exactly from the PLACES list. Never invent one
- ${perDay} items per day
- Day N must use ONLY the places listed under AREA N
- Include a food place around 12:30 and around 19:00 each day
- Fill the afternoon: at least one non-food item starting between 14:00 and 17:00
- Leave no gap longer than 2 hours between items
- Respect opening hours when they are given. "hours:?" means unknown: assume open
- Start each day at 09:00. Times are 24-hour "HH:MM"
- durationMin: 45 for food, 60-120 for attractions, museums and parks
- reason: one short sentence on why this place fits here

TRAVELLER
- Interests: ${prefs.interests.join(", ")}
- Pace: ${prefs.pace ?? "normal"}
${prefs.notes ? `- Notes: ${prefs.notes}` : ""}

PLACES (id | name | category | indoor | opening hours)
${placesBlock}

Reply with JSON in exactly this shape, and nothing else:
{
  "days": [
    {
      "day": 1,
      "items": [
        { "placeId": "<id from the list>", "startTime": "09:00", "durationMin": 90, "reason": "..." }
      ]
    }
  ]
}`;
}
