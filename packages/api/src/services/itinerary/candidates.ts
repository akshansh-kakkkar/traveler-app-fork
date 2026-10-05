import type { Place } from "@traveler-app/db";
import prisma, { type PlaceCategory } from "@traveler-app/db";
import { pickAnchors } from "./geo";

const RADII_KM = [3, 6, 12];

export async function pickCandidates(input: {
	cityId: string;
	interests: PlaceCategory[];
	days: number;
}): Promise<Place[][]> {
	const pool = await topScoringPlaces(input.cityId, input.interests, 60);
	const anchors = pickAnchors(pool, Math.min(input.days, 4));
	if (anchors.length === 0) return [];

	const used = new Set<string>();
	const perDay: Place[][] = [];
	const perCategory = Math.ceil(12 / input.interests.length);

	for (let day = 0; day < input.days; day++) {
		const anchor = anchors[day % anchors.length];
		if (!anchor) continue;

		const dayPlaces: Place[] = [];

		for (const category of input.interests) {
			for (const radius of RADII_KM) {
				const found = await nearbyByCategory(
					input.cityId,
					anchor,
					category,
					radius,
					used.size ? [...used] : [""],
					perCategory,
				);
				if (found.length > 0) {
					for (const p of found) {
						used.add(p.id);
						dayPlaces.push(p);
					}
					break;
				}
			}
		}
		perDay.push(dayPlaces);
	}
	return perDay;
}

async function topScoringPlaces(
	cityId: string,
	interests: PlaceCategory[],
	limit: number,
) {
	return prisma.$queryRaw<Place[]>`
		SELECT * FROM place
		WHERE "cityId" = ${cityId}
		  AND category::text = ANY(${interests}::text[])
		  AND NOT COALESCE('skip' = ANY(labels::text[]), false)
		ORDER BY score DESC
		LIMIT ${limit}
	`;
}

async function nearbyByCategory(
	cityId: string,
	anchor: { latitude: number; longitude: number },
	category: PlaceCategory,
	radiusKm: number,
	exclude: string[],
	limit: number,
) {
	return prisma.$queryRaw<Place[]>`
		SELECT * FROM place
		WHERE "cityId" = ${cityId}
		  AND category::text = ${category}
		  AND NOT COALESCE('skip' = ANY(labels::text[]), false)
		  AND NOT (id = ANY(${exclude}::text[]))
		  AND sqrt(
		        power((latitude  - ${anchor.latitude})  * 111,   2) +
		        power((longitude - ${anchor.longitude}) * 110.8, 2)
		      ) < ${radiusKm}
		ORDER BY random() ^ (1.0 / GREATEST(score, 1)) DESC
		LIMIT ${limit}
	`;
}
