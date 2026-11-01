type DateInput = string | Date | null | undefined;

type Dated = { startAt: DateInput };
type Coordinate = { latitude: number; longitude: number };

export type DayGroup<T> = {
	key: string;
	weekday: string;
	date: number; // day of month || day number
	items: T[];
};

const UNSCHEDULED = "unscheduled";
const WEEKDAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];

function localDayKey(date: Date): string {
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${date.getFullYear()}-${month}-${day}`;
}

export function groupByDay<T extends Dated>(
	items: readonly T[],
): DayGroup<T>[] {
	const groups = new Map<string, T[]>();
	for (const item of items) {
		const key = item.startAt
			? localDayKey(new Date(item.startAt))
			: UNSCHEDULED;
		groups.set(key, [...(groups.get(key) ?? []), item]);
	}

	const keys = [...groups.keys()].sort((a, b) => {
		if (a === UNSCHEDULED) return 1;
		if (b === UNSCHEDULED) return -1;
		return a.localeCompare(b);
	});

	return keys.map((key, index) => {
		const dayItems = groups.get(key) ?? [];
		if (key === UNSCHEDULED) {
			return { key, weekday: "Day", date: index + 1, items: dayItems };
		}

		const date = new Date(`${key}T00:00:00`);
		return {
			key,
			weekday: WEEKDAY_LETTERS[date.getDay()],
			date: date.getDate(),
			items: dayItems,
		};
	});
}

export function defaultDayIndex<T extends { done: boolean }>(
	days: readonly DayGroup<T>[],
	now = new Date(),
): number {
	const today = days.findIndex((day) => day.key === localDayKey(now));
	if (today !== -1) return today;
	const unfinished = days.findIndex((day) =>
		day.items.some((item) => !item.done),
	);
	return Math.max(0, unfinished);
}

export function durationMinutes(start: DateInput, end: DateInput): number {
	if (!start || !end) return 0;
	const diff = new Date(end).getTime() - new Date(start).getTime();
	return Math.max(0, Math.round(diff / 60_000));
}

export function isTodayKey(key: string): boolean {
	return key === localDayKey(new Date());
}

export type PinState = "done" | "next" | "todo";

export type RoutePin = {
	id: string;
	latitude: number;
	longitude: number;
	number: number;
	state: PinState;
};

type PinnableStop = {
	id: string;
	done: boolean;
	place: Coordinate | null;
};

export function routePins(stops: readonly PinnableStop[]): RoutePin[] {
	const nextId = stops.find((stop) => !stop.done)?.id;

	return stops.flatMap((stop, index) => {
		if (!stop.place) return [];

		function pinState(
			stop: PinnableStop,
			nextId: string | undefined,
		): PinState {
			if (stop.done) return "done";
			if (stop.id === nextId) return "next";
			return "todo";
		}

		const state = pinState(stop, nextId);

		return [
			{
				id: stop.id,
				latitude: stop.place.latitude,
				longitude: stop.place.longitude,
				number: index + 1,
				state,
			},
		];
	});
}

export function mapsRouteUrl(points: readonly Coordinate[]): string | null {
	if (points.length === 0) return null;

	const toParam = (p: Coordinate) => `${p.latitude},${p.longitude}`;
	const origin = points.length > 1 ? points[0] : null;
	const destination = points[points.length - 1];
	const waypoints = points.slice(1, -1);

	const params = [
		"api=1",
		"travelmode=walking",
		origin && `origin=${toParam(origin)}`,
		`destination=${toParam(destination)}`,
		waypoints.length > 0 &&
			`waypoints=${encodeURIComponent(waypoints.map(toParam).join("|"))}`,
	].filter(Boolean);

	return `https://www.google.com/maps/dir/?${params.join("&")}`;
}
