import type { Place } from "@traveler-app/db";

export type TripPrefs = {
	days: number;
	interests: string[];
	pace?: "relaxed" | "normal" | "packed";
	notes?: string;
};

const ITEMS_PER_DAY = {
	relaxed: 3,
	normal: 4,
	packed: 6,
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

export function buildPrompt(prefs: TripPrefs, candidates: Place[]): string {
	const perDay = ITEMS_PER_DAY[prefs.pace ?? "normal"];

	return `You are a Kuala Lumpur travel planner.

Build a ${prefs.days}-day itinerary using ONLY the places listed below.

RULES
- Use each place at most once across the whole trip
- Every placeId MUST be copied exactly from the PLACES list. Never invent one
- ${perDay} items per day
- Order each day so nearby places are visited together; avoid crossing the city twice
- Include a food place around 12:30 and around 19:00 each day
- Respect opening hours when they are given. "hours:?" means unknown: assume open
- Start each day at 09:00. Times are 24-hour "HH:MM
- durationMin: 45 for food, 60-120 for attractions, museums and parks
- reason: one short sentence on why this place fits here

TRAVELLER
- Interests: ${prefs.interests.join(", ")}
- Pace: ${prefs.pace ?? "normal"}
${prefs.notes ? `- Notes: ${prefs.notes}` : ""}

PLACES (id | name | category | indoor | opening hours)
${candidates.map(placeLine).join("\n")}

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
