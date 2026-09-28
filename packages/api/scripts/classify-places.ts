import prisma, { PlaceLabel } from "@traveler-app/db";
import z from "zod";
import { callGroq } from "../src/lib/groq";

const BATCH_SIZE = 25;
const BATCH_DELAY_MS = 32000;

const dryRun = process.argv.includes("--dry-run");
const sample = process.argv.includes("--sample");
const includeUnscored = process.argv.includes("--all");

const limitArg = process.argv.find((a) => a.startsWith("--limit="));
const limit = limitArg ? Number(limitArg.split("=")[1]) : undefined;

const places = await prisma.place.findMany({
  where: {
    cityId: "kl",
    aiLabel: null,
    ...(includeUnscored ? {} : { score: { gt: 0 } }),
  },
  orderBy: sample ? { id: "asc" } : { score: "desc" },
  skip: sample ? Math.floor(Math.random() * 3000) : undefined,
  take: limit,
  select: {
    id: true,
    name: true,
    category: true,
    score: true,
    scoreSource: true,
    address: true,
    openingHours: true,
  },
});

console.log(`${places.length} unclassified places`);

if (places.length === 0) process.exit(0);

const classificationSchema = z.object({
  places: z.array(
    z.object({
      placeId: z.string().min(1),
      label: z.enum(PlaceLabel),
      confidence: z.number().min(0).max(1),
      score: z.number().min(0).max(100),
    }),
  ),
});

function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];

  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }

  return chunks;
}

function placeLine(place: (typeof places)[number]): string {
  return [
    place.id,
    place.name,
    place.category,
    place.address ?? "address:?",
    place.openingHours ?? "hours:?",
  ].join(" | ");
}

function buildPrompt(batch: typeof places): string {
  return `You are curating places for a Kuala Lumpur travel app.

Classify each place below with ONE label:
- popular: a well-known must-see, tourists would recognize it
- hidden: a genuine local favorite, worth surfacing but not famous
- instagram: primarily a photo spot, not much else to do there
- skip: low quality, a chain, or not something a traveller should visit

Also give:
- confidence: 0 to 1, how sure you are of the label
- score: 0 to 100, how must-see this place is overall (0 = skip, 100 = essential)

PLACES (id | name | category | address | opening hours)
${batch.map(placeLine).join("\n")}

Reply with JSON in exactly this shape, one entry per place, and nothing else:
{
  "places": [
    { "placeId": "<id from the list>", "label": "popular", "confidence": 0.9, "score": 80 }
  ]
}
	
Most ordinary neighbourhood restaurants, cafes and shops are "skip".
Only use "hidden" for places a local guide would actively recommend to a visitor.
Expect the majority of food places to be "skip".

"popular" includes major landmarks, national museums, famous temples and
mosques, and well-known markets — anything a first-time visitor would have on
their list (e.g. Jamek Mosque, National Museum, Central Market).
Use "hidden" ONLY for places absent from typical top-20 KL lists.

Classify each place below with ONE label:
- popular: on a typical KL top-20 list. Major landmarks, national museums,
  famous temples/mosques, well-known markets (e.g. Jamek Mosque, National Museum).
- hidden: worth a visit but not on those lists. Independent restaurants,
  kopitiams, hawker stalls, small galleries, neighbourhood parks.
- instagram: the reason to go is the photo. Murals, viewpoints, design cafes.
- skip: not usable as data. Chains and franchises, offices, mis-tagged records,
  permanently closed, generic mall food courts.

"skip" is NOT a judgement of quality. Small and unknown is not "skip".
If the name alone doesn't tell you, use "hidden" with confidence below 0.5.

confidence: 0-1. Be honest — most independent eateries should be below 0.5.
score: 0-100, consistent with the label (popular 70-100, hidden 30-60,
instagram 40-70, skip 0-20).

`;
}

type ClassificationResult = {
  name: string;
  label: PlaceLabel;
  confidence: number;
};

const batches = chunk(places, BATCH_SIZE);
let classified = 0;
let skipped = 0;
const results: ClassificationResult[] = [];

for (const [index, batch] of batches.entries()) {
  console.log(
    `Batch ${index + 1} / ${batches.length} (${batch.length} places)`,
  );

  let raw: string;
  try {
    raw = await callGroq(buildPrompt(batch));
  } catch (err) {
    console.warn(`  batch failed ${err}`);
    skipped += batch.length;
    continue;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    console.warn("  reply was not valid JSON, skipping batch");
    skipped += batch.length;
    continue;
  }

  const result = classificationSchema.safeParse(parsed);
  if (!result.success) {
    console.warn(
      `  reply failed validation, skipping batch: ${result.error.issues[0]?.message}`,
    );
    skipped += batch.length;
    continue;
  }

  const byId = new Map(batch.map((place) => [place.id, place]));

  for (const entry of result.data.places) {
    const place = byId.get(entry.placeId);
    if (!place) {
      skipped++;
      continue;
    }

    results.push({
      name: place.name,
      label: entry.label,
      confidence: entry.confidence,
    });

    if (dryRun) {
      console.log(
        `  ${place.name}: ${entry.label} (${entry.confidence.toFixed(2)}) score ${entry.score}`,
      );
      classified++;
      continue;
    }

    await prisma.place.update({
      where: { id: place.id },
      data: {
        aiLabel: entry.label,
        aiConfidence: entry.confidence,
        labels: { push: entry.label },
        ...(place.scoreSource === "osm"
          ? { score: entry.score, scoreSource: "ai" }
          : {}),
      },
    });
    classified++;
  }

  if (index < batches.length - 1) {
    await Bun.sleep(BATCH_DELAY_MS);
  }
}

console.log(
  `\n${dryRun ? "Would classify" : "Classified"} ${classified}, skipped ${skipped}`,
);

const countsByLabel: Record<string, number> = {};
for (const result of results) {
  countsByLabel[result.label] = (countsByLabel[result.label] ?? 0) + 1;
}
console.log("\nCounts per label:");
console.table(countsByLabel);

const avgConfidence =
  results.reduce((sum, result) => sum + result.confidence, 0) / results.length;
console.log(`\nAverage confidence: ${avgConfidence.toFixed(2)}`);

console.log("\n10 lowest-confidence results:");
console.table(
  [...results]
    .sort((a, b) => a.confidence - b.confidence)
    .slice(0, 10)
    .map((result) => ({
      name: result.name,
      label: result.label,
      confidence: result.confidence.toFixed(2),
    })),
);

process.exit(0);
