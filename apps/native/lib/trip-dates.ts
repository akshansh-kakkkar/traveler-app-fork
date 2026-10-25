type DateInput = string | Date | null | undefined;

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
