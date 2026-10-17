import { pickCandidates } from "./src/services/itinerary/candidates";
import { generateItinerary } from "./src/services/itinerary/generate";
import { distanceKm } from "./src/services/itinerary/geo";
import { buildPrompt } from "./src/services/itinerary/prompt";

const days = await pickCandidates({
	cityId: "kl",
	interests: ["food", "culture", "nature"],
	days: 3,
});

days.forEach((places, i) => {
	let spread = 0;
	for (const a of places) {
		for (const b of places) {
			spread = Math.max(spread, distanceKm(a, b));
		}
	}

	const byCategory = places.reduce<Record<string, number>>((acc, p) => {
		acc[p.category] = (acc[p.category] ?? 0) + 1;
		return acc;
	}, {});

	console.log(
		`Day ${i + 1}: ${places.length} places, spread ${spread.toFixed(1)} km`,
		byCategory,
	);
	console.log(
		"  e.g.",
		places
			.slice(0, 3)
			.map((p) => p.name)
			.join(", "),
	);
});

const prompt = buildPrompt(
	{ days: 3, interests: ["food", "culture", "nature"], pace: "normal" },
	days,
);
console.log(prompt.slice(0, 1500));
console.log("...length:", prompt.length);

const trip = await generateItinerary({
	cityId: "kl",
	interests: ["food", "culture", "nature"],
	days: 3,
	pace: "normal",
});

for (const day of trip.days) {
	let travelled = 0;
	for (let i = 1; i < day.items.length; i++) {
		const previous = day.items[i - 1];
		const current = day.items[i];
		if (!previous || !current) continue;
		travelled += distanceKm(previous.place, current.place);
	}
	console.log(`\nDay ${day.day}: ${travelled.toFixed(1)} km total travel`);
	for (const item of day.items) {
		console.log(`  ${item.startTime} ${item.place.name}`);
	}
}
console.log("dropped:", trip.droppedItems);

process.exit(0);
