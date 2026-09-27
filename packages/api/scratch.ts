import { generateItinerary } from "./src/services/itinerary/generate";

const started = Date.now();

const result = await generateItinerary({
	cityId: "kl",
	interests: ["food", "culture", "nature"],
	days: 3,
	pace: "normal",
	notes: "first time in KL, love street food",
});

for (const day of result.days) {
	console.log(`\nDay ${day.day}`);
	for (const item of day.items) {
		console.log(
			`  ${item.startTime}  ${item.place.name} (${item.place.category}, ${item.durationMin}min)`,
		);
		if (item.reason) console.log(`         ${item.reason}`);
	}
}

console.log(`\ndropped items: ${result.droppedItems}`);
console.log(`took ${((Date.now() - started) / 1000).toFixed(1)}s`);

process.exit(0);
