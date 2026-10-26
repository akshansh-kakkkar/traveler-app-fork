import { MONTHS } from "./format-date";

const MS_PER_DAY = 86_400_000;

type DateInput = string | Date | null | undefined;

export type TripStatus = "upcoming" | "in-progress" | "past";

function startOfDay(date: Date): number {
	return new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
	).getTime();
}

function dayDiff(from: Date, to: Date): number {
	return Math.round((startOfDay(to) - startOfDay(from)) / MS_PER_DAY);
}

export function currentDay(start: DateInput, now = new Date()): number {
	if (!start) return 1;
	return dayDiff(new Date(start), now) + 1;
}

export function tripStatus(
	start: DateInput,
	end: DateInput,
	now = new Date(),
): TripStatus {
	if (!start) return "upcoming";
	const startDate = new Date(start);
	const endDate = new Date(end ?? start);
	if (dayDiff(now, startDate) > 0) return "upcoming";
	if (dayDiff(endDate, now) > 0) return "past";
	return "in-progress";
}

export const TRIP_STATUS_LABEL: Record<TripStatus, string> = {
	upcoming: "Upcoming",
	"in-progress": "In progress",
	past: "Done",
};

export function formatTime(value: DateInput): string {
	if (!value) return "";
	const date = new Date(value);
	const hours = date.getHours();
	const minutes = String(date.getMinutes()).padStart(2, "0");
	const suffix = hours < 12 ? "am" : "pm";
	return `${hours % 12 || 12}:${minutes} ${suffix}`;
}

// "1 hr 30 min", "45 min"
export function formatDuration(start: DateInput, end: DateInput): string {
	if (!start || !end) return "";
	const total = Math.round(
		(new Date(end).getTime() - new Date(start).getTime()) / 60_000,
	);
	if (total <= 0) return "";
	const hours = Math.floor(total / 60);
	const minutes = total % 60;
	if (hours === 0) return `${minutes} min`;
	return minutes === 0 ? `${hours} hr` : `${hours} hr ${minutes} min`;
}

export function tripDays(start: DateInput, end: DateInput): number {
	if (!start || !end) return 1;
	return Math.max(1, dayDiff(new Date(start), new Date(end)) + 1);
}

export function formatDateTile(
	start: DateInput,
	end: DateInput,
): { month: string; days: string } | null {
	if (!start) return null;
	const s = new Date(start);
	const e = new Date(end ?? start);
	const sMonth = MONTHS[s.getMonth()];
	const eMonth = MONTHS[e.getMonth()];
	const month = sMonth === eMonth ? sMonth : `${sMonth}-${eMonth}`;
	const days =
		dayDiff(s, e) <= 0 ? `${s.getDate()}` : `${s.getDate()}-${e.getDate()}`;
	return { month, days };
}

export function formatDateRange(start: DateInput, end: DateInput): string {
	if (!start) return "No dates";
	const s = new Date(start);
	const e = new Date(end ?? start);
	const sMonth = MONTHS[s.getMonth()];
	const eMonth = MONTHS[e.getMonth()];

	if (dayDiff(s, e) <= 0) return `${s.getDate()} ${sMonth}`;
	if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
		return `${s.getDate()}-${e.getDate()} ${sMonth}`;
	}
	return `${s.getDate()} ${sMonth} - ${e.getDate()} ${eMonth}`;
}
