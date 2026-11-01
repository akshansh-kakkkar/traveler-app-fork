import { Ionicons } from "@expo/vector-icons";
import type { PlaceCategory } from "@traveler-app/db";
import { cn, useThemeColor } from "heroui-native";
import { Pressable, Text, View } from "react-native";
import { CATEGORY_ICONS, CATEGORY_TINTS } from "@/lib/category-icons";
import { formatDuration, formatTime } from "@/lib/trip-dates";
import { CategoryTag } from "../ui/CategoryTag";

type DateValue = string | Date | null;

type Props = {
	title: string;
	category?: PlaceCategory;
	startAt: DateValue;
	endAt: DateValue;
	notes?: string | null;
	dayLabel: string;
	stopLabel: string;
	onDirections?: () => void;
};

export default function UpNextCard({
	title,
	category,
	startAt,
	endAt,
	notes,
	dayLabel,
	stopLabel,
	onDirections,
}: Props) {
	const arrive = formatTime(startAt);
	const leave = formatTime(endAt);
	const duration = formatDuration(startAt, endAt);

	const accentForeground = useThemeColor("accent-foreground");

	return (
		<View className="gap-4 rounded-3xl bg-surface p-4">
			<View className="flex-row items-center justify-between gap-3">
				<Text
					className="flex-1 font-bold text-foreground text-lg"
					numberOfLines={1}
				>
					{title}
				</Text>
				{category && <CategoryTag category={category} />}
			</View>

			{arrive !== "" && leave !== "" && (
				<View className="flex-row items-center gap-3">
					<TimeLabel time={arrive} label="Arrive" />
					<View className="flex-1 items-center">
						<View className="absolute top-5 right-0 left-0 h-px bg-border" />
						<StopIcon category={category} />
						{duration !== "" && (
							<Text className="mt-1 text-muted text-xs">for {duration}</Text>
						)}
					</View>
					<TimeLabel time={leave} label="Leave" alignEnd />
				</View>
			)}

			{notes ? (
				<Text className="text-muted text-sm" numberOfLines={2}>
					{notes}
				</Text>
			) : null}

			<View className="h-px bg-border" />

			<View className="flex-row items-center justify-between">
				<View>
					<Text className="text-muted text-xs">{dayLabel}</Text>
					<Text className="font-semibold text-foreground text-sm">
						{stopLabel}
					</Text>
				</View>
				{onDirections && (
					<Pressable
						onPress={onDirections}
						className="flex-row items-center gap-1.5 rounded-full bg-accent px-4 py-2.5 active:opacity-80"
					>
						<Ionicons name="navigate" size={16} color={accentForeground} />
						<Text className="font-bold text-accent-foreground text-sm">
							Directions
						</Text>
					</Pressable>
				)}
			</View>
		</View>
	);
}

function TimeLabel({
	time,
	label,
	alignEnd,
}: {
	time: string;
	label: string;
	alignEnd?: boolean;
}) {
	return (
		<View className={cn(alignEnd && "items-end")}>
			<Text className="font-bold text-foreground text-xl">{time}</Text>
			<Text className="text-muted text-xs">{label}</Text>
		</View>
	);
}

function StopIcon({ category }: { category?: PlaceCategory }) {
	const foregroundColor = useThemeColor("foreground");

	return (
		<View
			className={cn(
				"h-10 w-10 items-center justify-center rounded-xl",
				category ? CATEGORY_TINTS[category] : "bg-border",
			)}
		>
			<Ionicons
				name={category ? CATEGORY_ICONS[category] : "flag"}
				size={18}
				color={foregroundColor}
			/>
		</View>
	);
}
