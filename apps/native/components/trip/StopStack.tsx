import { Ionicons } from "@expo/vector-icons";
import type { PlaceCategory } from "@traveler-app/db";
import { cn, useThemeColor } from "heroui-native";
import { Pressable, Text, View } from "react-native";
import { CATEGORY_ICONS, CATEGORY_TINTS } from "@/lib/category-icons";
import { formatDuration, formatTime } from "@/lib/trip-dates";

type Stop = {
	title: string;
	startAt: string | Date | null;
	endAt: string | Date | null;
	category?: PlaceCategory;
};

type Props = {
	stop?: Stop; // next stop
	peekCount: number; // stops left after current one
	isToggling?: boolean;
	onExpand: () => void;
	onToggle: () => void;
};

const MAX_PEEKS = 2;
const PEEK_STYLES = [
	"bottom-2 left-3 right-3 bg-foreground/60",
	"bottom-0 left-6 right-6 bg-foreground/30",
];

export default function StopStack({
	stop,
	peekCount,
	isToggling,
	onExpand,
	onToggle,
}: Props) {
	const sageColor = useThemeColor("background");
	const foregroundColor = useThemeColor("foreground");
	const peeks = PEEK_STYLES.slice(0, Math.min(peekCount, MAX_PEEKS));

	if (!stop) {
		return (
			<Pressable
				onPress={onExpand}
				className="flex-row items-center gap-3 rounded-3xl bg-border p-4"
			>
				<Ionicons name="checkmark-done" size={22} color={foregroundColor} />
				<Text className="flex-1 font-semibold text-foreground text-sm">
					Every stop this day is done
				</Text>
				<Ionicons name="chevron-up" size={18} color={foregroundColor} />
			</Pressable>
		);
	}

	const time = formatTime(stop.startAt);
	const eyebrow = time ? `Up next · ${time}` : "Up next";
	const duration = formatDuration(stop.startAt, stop.endAt);

	return (
		// make it look either at the bottom pb-4 or top pt-4
		<View className="pb-4">
			{[...peeks].reverse().map((style) => (
				<View key={style} className={cn("absolute h-16 rounded-3xl", style)} />
			))}

			<Pressable
				onPress={onExpand}
				className="flex-row items-center gap-3 rounded-3xl bg-foreground p-3"
			>
				<View
					className={cn(
						"h-14 w-14 items-center justify-center rounded-2xl",
						stop.category ? CATEGORY_TINTS[stop.category] : "bg-surface",
					)}
				>
					<Ionicons
						name={stop.category ? CATEGORY_ICONS[stop.category] : "flag"}
						size={24}
						color={foregroundColor}
					/>
				</View>

				<View className="flex-1 gap-0.5">
					<Text className="text-background/70 text-xs">{eyebrow}</Text>
					<Text
						className="font-bold text-background text-base"
						numberOfLines={1}
					>
						{stop.title}
					</Text>
					{duration !== "" && (
						<Text className="text-background/70 text-xs">{duration}</Text>
					)}
				</View>

				<Pressable
					onPress={onToggle}
					disabled={isToggling}
					hitSlop={10}
					accessibilityRole="checkbox"
					accessibilityState={{ checked: false, busy: isToggling }}
					accessibilityLabel={`Mark ${stop.title} done`}
					className="h-9 w-9 items-center justify-center rounded-full border-2 border-accent"
				>
					{isToggling && (
						<Ionicons name="ellipsis-horizontal" size={14} color={sageColor} />
					)}
				</Pressable>
			</Pressable>
		</View>
	);
}
