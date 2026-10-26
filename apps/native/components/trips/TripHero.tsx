import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "heroui-native";
import { Pressable, Text, View } from "react-native";
import {
	currentDay,
	formatDateRange,
	TRIP_STATUS_LABEL,
	tripDays,
	tripStatus,
} from "@/lib/trip-dates";
import { MetaPill } from "../ui/MetaPill";
import ProgressBar from "../ui/ProgressBar";

type DateValue = string | Date | null;

type Props = {
	name: string;
	startDate: DateValue;
	endDate: DateValue;
	stops: number;
	done: number;
	nextStopTitle?: string;
	canDelete?: boolean;
	onPress: () => void;
	onDelete?: () => void;
};

export default function TripHero({
	name,
	startDate,
	endDate,
	stops,
	done,
	nextStopTitle,
	canDelete,
	onPress,
	onDelete,
}: Props) {
	const sageColor = useThemeColor("background");
	const foregroundColor = useThemeColor("foreground");

	const status = tripStatus(startDate, endDate);
	const days = tripDays(startDate, endDate);
	const dateLine =
		status === "in-progress"
			? `${formatDateRange(startDate, endDate)} · Day ${currentDay(startDate)} of ${days}`
			: formatDateRange(startDate, endDate);
	const nextLine = nextStopTitle
		? `Next: ${nextStopTitle}`
		: stops > 0 && done >= stops
			? "All stops done"
			: "";

	return (
		<Pressable
			onPress={onPress}
			className="gap-4 rounded-3xl bg-foreground p-3 active:opacity-95"
		>
			<View className="h-40 justify-between overflow-hidden rounded-2xl bg-category-nature p-3">
				{/* <RouteSketch /> */}

				<View className="flex-row items-start justify-between">
					<MetaPill label={TRIP_STATUS_LABEL[status]} />
					{canDelete && (
						<Pressable
							onPress={onDelete}
							hitSlop={8}
							className="h-9 w-9 items-center justify-center rounded-full bg-surface"
						>
							<Ionicons
								name="trash-outline"
								size={16}
								color={foregroundColor}
							/>
						</Pressable>
					)}
				</View>

				<View className="flex-row gap-2">
					<MetaPill
						icon="calendar-outline"
						label={`${days} ${days === 1 ? "day" : "days"}`}
					/>
					<MetaPill
						icon="location-outline"
						label={`${stops} ${stops === 1 ? "stop" : "stops"}`}
					/>
				</View>
			</View>

			<View className="gap-1 px-1">
				<Text className="font-bold text-2xl text-background" numberOfLines={2}>
					{name}
				</Text>
				<Text className="text-background/70 text-xs">{dateLine}</Text>
			</View>

			<View className="gap-2 px-1">
				<Text className="text-background/70 text-xs">
					{done} of {stops} stops done
				</Text>
				<ProgressBar
					done={done}
					total={stops}
					trackClassName="flex-none bg-background/20"
					fillClassName="bg-background"
				/>
			</View>

			<View className="flex-row items-center gap-2 px-1 pb-1">
				<Ionicons name="time-outline" size={16} color={sageColor} />
				<Text
					className="flex-1 font-semibold text-background text-xs"
					numberOfLines={1}
				>
					{nextLine}
				</Text>
				<View className="flex-row items-center gap-1 rounded-full bg-surface px-4 py-2">
					<Text className="font-semibold text-foreground text-xs">
						View itinerary
					</Text>
					<Ionicons name="chevron-forward" size={14} color={foregroundColor} />
				</View>
			</View>
		</Pressable>
	);
}
