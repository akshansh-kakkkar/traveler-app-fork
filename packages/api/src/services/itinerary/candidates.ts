import type { Place } from "@traveler-app/db";
import prisma, { type PlaceCategory } from "@traveler-app/db";

const PER_DAY = 40;
const MAX_TOTAL = 120;

export async function pickCandidates(input: {
	cityId: string;
	interests: PlaceCategory[];
	days: number;
}): Promise<Place[]> {
	if (input.interests.length === 0) {
		return [];
	}

	const total = Math.min(input.days * PER_DAY, MAX_TOTAL);
	const perCategory = Math.ceil(total / input.interests.length);

	const perCategoryResults = await Promise.all(
		input.interests.map(
			(category) =>
				prisma.$queryRaw<Place[]>`
				SELECT * FROM place
				WHERE "cityId" = ${input.cityId}
					AND category::text = ${category}
					AND NOT COALESCE('skip' = ANY(labels::text[]), false)
				ORDER BY random() ^ (1.0 / GREATEST(score, 1)) DESC
				LIMIT ${perCategory}
			`,
		),
	);

	return perCategoryResults.flat().slice(0, total);
}
