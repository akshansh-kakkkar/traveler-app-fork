import type { Prisma } from "../prisma/generated/client";
import { PlaceCategory } from "../prisma/generated/enums";
import prisma from "../src/index";

type OsmElement = {
	type: "node" | "way" | "relation";
	id: number;
	// for nodes
	lat?: number;
	lon?: number;
	// for ways/relations
	center?: { lat: number; lon: number };
	tags?: Record<string, string>;
};

type SkipReason = "no-name" | "no-coords" | "no-category" | "chain";

const CACHE_PATH = `${import.meta.dir}/.cache/osm-kl.json`;

const CATEGORY_MAPPING: Record<string, PlaceCategory> = {
	"amenity=restaurant": PlaceCategory.food,
	"amenity=cafe": PlaceCategory.food,
	"amenity=food_court": PlaceCategory.food,
	"tourism=museum": PlaceCategory.culture,
	"tourism=gallery": PlaceCategory.culture,
	"tourism=attraction": PlaceCategory.attraction,
	"tourism=viewpoint": PlaceCategory.attraction,
	"leisure=park": PlaceCategory.nature,
	"shop=mall": PlaceCategory.shopping,
};

const INDOOR_MAPPING: Record<string, boolean> = {
	"tourism=museum": true,
	"tourism=gallery": true,
	"shop=mall": true,
	"leisure=park": false,
	"tourism=viewpoint": false,
};

// Tags that suggest a palce is notable
const SCORE_SIGNALS: Record<string, number> = {
	wikidata: 40,
	heritage: 25,
	website: 5,
	opening_hours: 5,
	"name:en": 5,
	image: 5,
	description: 5,
};

const OVERPASS_URLS = [
	"https://overpass-api.de/api/interpreter",
	"https://overpass.private.coffee/api/interpreter",
];

const query = `
	[out:json][timeout:90][bbox:3.03,101.61,3.25,101.76];
	(
		nwr["amenity"~"^(restaurant|cafe|food_court)$"]["name"];
		nwr["tourism"~"^(museum|gallery)$"]["name"];
		nwr["historic"]["name"];
		nwr["tourism"~"^(attraction|viewpoint)$"]["name"];
		nwr["leisure"="park"]["name"];
		nwr["shop"="mall"]["name"];
	);
	out center tags;`;

const dryRun = process.argv.includes("--dry-run");
const useCache = process.argv.includes("--cached");

const elements = await loadOsmElements();

const places: Prisma.PlaceCreateInput[] = [];
const skipped: Record<string, number> = {};

for (const element of elements) {
	const result = toPlace(element);
	if (typeof result === "string") {
		skipped[result] = (skipped[result] ?? 0) + 1;
	} else {
		places.push(result);
	}
}

printSummary(elements.length, places, skipped);

if (dryRun) {
	console.log("\nDry run nothing written.");
	process.exit(0);
}

const limitArg = process.argv.find((a) => a.startsWith("--limit="));
const limit = limitArg ? Number(limitArg.split("=")[1]) : places.length;

const toSave = places.slice(0, limit);
console.log(`\nSaving ${toSave.length} places to the database...`);

let saved = 0;
for (const place of toSave) {
	const osmFields = {
		name: place.name,
		latitude: place.latitude,
		longitude: place.longitude,
		openingHours: place.openingHours,
		address: place.address,
	};

	const updated = await prisma.place.updateMany({
		where: { osmId: place.osmId as string, scoreSource: "osm" },
		data: { ...osmFields, score: place.score },
	});

	if (updated.count === 0) {
		await prisma.place.upsert({
			where: { osmId: place.osmId as string },
			create: place,
			update: osmFields,
		});
	}

	await prisma.place.upsert({
		where: { osmId: place.osmId as string },
		create: place,
		update: {
			name: place.name,
			latitude: place.latitude,
			longitude: place.longitude,
			openingHours: place.openingHours,
			address: place.address,
		},
	});
	saved++;
	if (saved % 100 === 0) {
		console.log(`${saved} / ${toSave.length}`);
	}
}

console.log(`\nSaved ${saved} places to the database.`);

await prisma.$disconnect();

function lookupTag<T>(
	tags: Record<string, string>,
	table: Record<string, T>,
): T | null {
	for (const [key, value] of Object.entries(tags)) {
		const match = table[`${key}=${value}`];
		if (match !== undefined) {
			return match;
		}
	}
	return null;
}

function toPlace(element: OsmElement): Prisma.PlaceCreateInput | SkipReason {
	const tags = element.tags ?? {};

	const name = tags["name:en"] ?? tags.name;
	if (!name) {
		return "no-name";
	}

	const lat = element.lat ?? element.center?.lat;
	const lon = element.lon ?? element.center?.lon;
	if (lat === undefined || lon === undefined) {
		return "no-coords";
	}

	const category = tags.historic
		? PlaceCategory.culture
		: lookupTag(tags, CATEGORY_MAPPING);
	if (!category) {
		return "no-category";
	}

	if (tags.brand || tags["brand:wikidata"]) {
		return "chain";
	}

	return {
		osmId: `${element.type}/${element.id}`,
		cityId: "kl",
		source: "osm",
		verified: false,
		name,
		latitude: lat,
		longitude: lon,
		category,
		labels: [],
		score: scorePlace(tags),
		indoor: lookupTag(tags, INDOOR_MAPPING),
		openingHours: tags.opening_hours ?? null,
		address:
			[
				tags["addr:housenumber"],
				tags["addr:street"],
				tags["addr:postcode"],
				tags["addr:city"],
			]
				.filter(Boolean)
				.join(", ") || null,
	};
}

function scorePlace(tags: Record<string, string>): number {
	let total = 0;

	for (const [key, points] of Object.entries(SCORE_SIGNALS)) {
		if (tags[key]) total += points;
	}

	if (!tags.wikidata && tags.wikipedia) total += 30;

	if (tags.tourism === "attraction" || tags.tourism === "viewpoint")
		total += 15;

	if (tags.historic) total += 10;

	return Math.min(total, 100);
}

function count(values: string[]): Record<string, number> {
	const counts: Record<string, number> = {};
	for (const value of values) {
		counts[value] = (counts[value] ?? 0) + 1;
	}
	return counts;
}

function printSummary(
	total: number,
	places: Prisma.PlaceCreateInput[],
	skipped: Record<string, number>,
) {
	console.log(`OSM elements: ${total}, usable places: ${places.length}`);

	console.log("\nPlaces per category:");
	console.table(count(places.map((p) => p.category)));

	console.log("\nSkipped (by reason):");
	console.table(skipped);

	const withHours = places.filter((p) => p.openingHours).length;
	console.log(`\nWith opening hours: ${withHours} / ${places.length}`);

	console.log("\nIndoor flag:");
	console.table(count(places.map((p) => String(p.indoor ?? "unknown"))));

	const duplicates = Object.entries(count(places.map((p) => p.name)))
		.filter(([, n]) => n > 1)
		.sort((a, b) => b[1] - a[1]);
	console.log(`\nNames used more than once: ${duplicates.length} (top 10)`);
	console.table(Object.fromEntries(duplicates.slice(0, 10)));

	console.log("\nScore buckets:");
	console.table(
		count(
			places.map((p) => {
				const s = (p.score as number) ?? 0;
				if (s >= 70) return "70+";
				if (s >= 40) return "40-69";
				if (s >= 1) return "1-39";
				return "0";
			}),
		),
	);

	console.log("\nTop 10 by score:");
	console.table(
		[...places]
			.sort((a, b) => ((b.score as number) ?? 0) - ((a.score as number) ?? 0))
			.slice(0, 10)
			.map((p) => ({ name: p.name, category: p.category, score: p.score })),
	);
}

async function loadOsmElements(): Promise<OsmElement[]> {
	const cacheFile = Bun.file(CACHE_PATH);

	if (useCache && (await cacheFile.exists())) {
		console.log("Using cached OSM data.");
		return (await cacheFile.json()) as OsmElement[];
	}

	const elements = await fetchFromOverpass();
	await Bun.write(CACHE_PATH, JSON.stringify(elements));
	console.log(`Fetched ${elements.length} elements (cached for next time).`);
	return elements;
}

async function fetchFromOverpass(): Promise<OsmElement[]> {
	for (const url of OVERPASS_URLS) {
		try {
			console.log(`Querying ${url}...`);
			const res = await fetch(url, {
				method: "POST",
				headers: { "User-Agent": "TourNet-ingest/0.1" },
				body: new URLSearchParams({ data: query }),
			});
			if (!res.ok) {
				throw new Error(`status ${res.status}`);
			}
			const json = (await res.json()) as { elements: OsmElement[] };
			return json.elements;
		} catch (err) {
			console.warn(`  failed: ${err}`);
		}
	}
	throw new Error("All Overpass servers failed");
}
