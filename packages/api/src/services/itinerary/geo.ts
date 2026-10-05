import type { Place } from "@traveler-app/db";

const KM_PER_DEG_LAT = 111;
const KM_PER_DEG_LON = 110.8;

export function distanceKm(
	a: { latitude: number; longitude: number },
	b: { latitude: number; longitude: number },
): number {
	const dLat = (a.latitude - b.latitude) * KM_PER_DEG_LAT;
	const dLon = (a.longitude - b.longitude) * KM_PER_DEG_LON;
	return Math.sqrt(dLat * dLat + dLon * dLon);
}

export function pickAnchors(places: Place[], count: number): Place[] {
	if (places.length === 0) return [];

	const sorted = [...places].sort((a, b) => b.score - a.score);
	const topPool = sorted.slice(0, Math.min(10, sorted.length));

	const first = topPool[Math.floor(Math.random() * topPool.length)];
	if (!first) return [];
	const anchors: Place[] = [first];
	const chosen = new Set(first.id);

	while (anchors.length < count) {
		let best: Place | null = null;
		let bestDistance = -1;

		for (const place of sorted) {
			if (chosen.has(place.id)) continue;

			let nearest = Number.POSITIVE_INFINITY;
			for (const anchor of anchors) {
				const d = distanceKm(anchor, place);
				if (d < nearest) nearest = d;
			}
			if (nearest > bestDistance) {
				bestDistance = nearest;
				best = place;
			}
		}

		if (!best || bestDistance < 1.5) break; // too close to be a separate day
		anchors.push(best);
		chosen.add(best.id);
	}
	return anchors;
}
