import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "heroui-native";
import { Pressable, Text, View } from "react-native";
import {
	currentDay,
	daysUntil,
	formatDateRange,
	formatDuration,
	formatTime,
	tripDays,
	tripStatus,
} from "@/lib/trip-dates";
import { MetaPill } from "../ui/MetaPill";

type DateValue = string | Date | null;

type NextStop = {
	title: string;
	startAt: DateValue;
	endAt: DateValue;
};

type Props = {
	name: string;
	startDate: DateValue;
	endDate: DateValue;
	stops: number;
	done: number;
	nextStop?: NextStop;
	onPress: () => void;
};

function statusLabel(startDate: DateValue, endDate: DateValue): string {
	const days = tripDays(startDate, endDate);
	if (tripStatus(startDate, endDate) === "in-progress") {
		return `In progress · Day ${currentDay(startDate)} of ${days}`;
	}
	if (!startDate) return "Upcoming";
	const until = daysUntil(startDate);
	return until === 1 ? "Upcoming · Tomorrow" : `Upcoming · In ${until} days`;
}

export default function CurrentTripCard({
	name,
	startDate,
	endDate,
	stops,
	done,
	nextStop,
	onPress,
}: Props) {
	const accentForeground = useThemeColor("accent-foreground");

	const percent = stops === 0 ? 0 : Math.min(100, (done / stops) * 100);
	const isActive = tripStatus(startDate, endDate) === "in-progress";

	return (
		<Pressable
			onPress={onPress}
			className="gap-4 rounded-3xl bg-surface p-4 active:opacity-90"
		>
			<View className="flex-row items-start justify-between">
				<MetaPill
					label={statusLabel(startDate, endDate)}
					className="bg-category-nature"
				/>

				<View className="h-11 w-11 items-center justify-center rounded-full bg-accent">
					<Ionicons name="arrow-forward" size={20} color={accentForeground} />
				</View>
			</View>

			<View>
				<Text className="font-bold text-foreground text-xl" numberOfLines={2}>
					{name}
				</Text>

				<Text className="text-muted text-sm">
					{formatDateRange(startDate, endDate)}
				</Text>
			</View>

			<View className="flex-row items-center gap-3">
				<View className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
					<View
						className="h-full rounded-full bg-foreground"
						style={{ width: `${percent}%` }}
					/>
				</View>
				<Text className="text-muted text-xs">
					{done} of {stops} due
				</Text>
			</View>

			{nextStop && <NextStopRow stop={nextStop} isActive={isActive} />}
		</Pressable>
	);
}

function NextStopRow({
	stop,
	isActive,
}: {
	stop: NextStop;
	isActive: boolean;
}) {
	const foregroundColor = useThemeColor("foreground");

	const time = formatTime(stop.startAt);
	const prefix = isActive ? "Up next" : "First stop";
	const eyebrow = time ? `${prefix} · ${time}` : prefix;
	const duration = formatDuration(stop.startAt, stop.endAt);

	return (
		<View className="flex-row items-center gap-3 rounded-2xl bg-background p-3">
			<View className="h-10 w-10 items-center justify-center rounded-xl bg-category-shopping">
				<Ionicons name="flag-outline" size={18} color={foregroundColor} />
			</View>
			<View className="flex-1">
				<Text className="text-muted text-xs">{eyebrow}</Text>
				<Text
					className="font-semibold text-foreground text-sm"
					numberOfLines={1}
				>
					{stop.title}
				</Text>
			</View>
			{duration !== "" && (
				<Text className="text-muted text-xs">{duration}</Text>
			)}
		</View>
	);
}
