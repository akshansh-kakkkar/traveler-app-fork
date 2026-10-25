type DateInput = string | Date | null | undefined;

type Dated = { startAt: DateInput };
// type Coordinate = { latitude: number; longitude: number };

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
