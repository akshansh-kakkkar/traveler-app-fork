import type { PlaceCategory } from "@traveler-app/db/enums";
import { cn, useThemeColor } from "heroui-native";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withTiming,
} from "react-native-reanimated";
import { MetaPill } from "@/components/ui/MetaPill";
import { CATEGORY_ICONS } from "@/lib/category-icons";

const LONG_WAIT_MS = 15_000;
const RING_SIZE = 240;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

type Props = {
	days: number;
	startDate: Date;
	pace: string;
	interests: PlaceCategory[];
};

function formatDate(date: Date) {
	return `${WEEKDAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

function capitalize(text: string) {
	return text.charAt(0).toUpperCase() + text.slice(1);
}

export function GeneratingView({ days, startDate, pace, interests }: Props) {
	const accentColor = useThemeColor("accent");
	const [longWait, setLongWait] = useState(false);
	const rotation = useSharedValue(0);

	useEffect(() => {
		const timer = setTimeout(() => setLongWait(true), LONG_WAIT_MS);
		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		rotation.value = withRepeat(
			withTiming(360, { duration: 1600, easing: Easing.linear }),
			-1,
			false,
		);
	}, [rotation]);

	const spinStyle = useAnimatedStyle(() => ({
		transform: [{ rotate: `${rotation.value}deg` }],
	}));

	return (
		<View className="flex-1 items-center justify-center px-5">
			<View
				className="items-center justify-center rounded-full bg-border"
				style={{ width: RING_SIZE, height: RING_SIZE }}
			>
				<Animated.View
					style={[
						{
							position: "absolute",
							width: RING_SIZE,
							height: RING_SIZE,
							borderRadius: RING_SIZE / 2,
							borderWidth: 8,
							borderColor: "transparent",
							borderTopColor: accentColor,
							borderRightColor: accentColor,
						},
						spinStyle,
					]}
				/>
				<View className="flex-row gap-2">
					<DayCell day={1} fill="full" />
					<DayCell day={2} fill="half" />
					<DayCell day={3} fill="none" />
				</View>
			</View>

			<View
				className="mt-8 items-center gap-1"
				accessibilityLiveRegion="polite"
			>
				<Text className="text-muted text-sm">Kuala Lumpur</Text>
				<Text className="text-center font-semibold text-3xl text-foreground">
					Building your {days} {days === 1 ? "day" : "days"}
				</Text>
				<Text className="mt-1 text-center text-base text-muted">
					Picking from guide-verified places only.
				</Text>
			</View>

			<View className="mt-6 flex-row flex-wrap justify-center gap-2">
				<MetaPill icon="calendar-outline" label={formatDate(startDate)} />
				<MetaPill icon="time-outline" label={`${capitalize(pace)} pace`} />
				{interests.map((item) => (
					<MetaPill
						key={item}
						icon={CATEGORY_ICONS[item]}
						label={capitalize(item)}
					/>
				))}
			</View>

			{longWait && (
				<Text className="mt-6 text-center text-base text-muted">
					Taking a little longer. Still working.
				</Text>
			)}
		</View>
	);
}

function DayCell({
	day,
	fill,
}: {
	day: number;
	fill: "full" | "half" | "none";
}) {
	return (
		<View
			className={cn(
				"h-18 w-14 items-center justify-center overflow-hidden rounded-full",
				fill === "full" ? "bg-accent" : "bg-surface",
			)}
		>
			{fill === "half" && (
				<View className="absolute right-0 bottom-0 left-0 h-1/2 bg-accent" />
			)}
			<Text
				className={cn(
					"text-[13px]",
					fill === "none" ? "text-muted" : "text-foreground",
				)}
			>
				Day
			</Text>
			<Text className="font-semibold text-foreground text-xl">{day}</Text>
		</View>
	);
}
