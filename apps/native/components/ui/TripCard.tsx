import { Ionicons } from "@expo/vector-icons";
import { cn, useThemeColor } from "heroui-native";
import { Pressable, Text, View } from "react-native";
import { MetaPill } from "./MetaPill";

type Props = {
	name: string;
	dateRange: string;
	days: number;
	stops: number;
	done: number;
	status: "upcoming" | "in-progress" | "past";
	shared?: boolean;
	canDelete?: boolean;
	onPress: () => void;
	onDelete?: () => void;
};

const STATUS_LABEL = {
	upcoming: "Upcoming",
	"in-progress": "In progress",
	past: "Past",
} as const;

export function TripCard({
	name,
	dateRange,
	days,
	stops,
	done,
	status,
	shared,
	canDelete,
	onPress,
	onDelete,
}: Props) {
	const mutedColor = useThemeColor("muted");
	const backgroundColor = useThemeColor("background");

	const isActive = status === "in-progress";
	const percent = stops === 0 ? 0 : Math.min(100, (done / stops) * 100);

	return (
		<Pressable
			onPress={onPress}
			className={cn(
				"overflow-hidden rounded-3xl",
				isActive ? "bg-foreground" : "bg-surface",
			)}
		>
			{/* top: pills, name, dates */}
			<View className="gap-3 p-4">
				<View className="flex-row items-center justify-between">
					<MetaPill
						label={STATUS_LABEL[status]}
						className={isActive ? "bg-surface" : "bg-border"}
					/>

					<View className="flex-row items-center gap-2">
						{shared && (
							<MetaPill
								icon="people-outline"
								label="Shared"
								className="bg-border"
							/>
						)}
						{canDelete && (
							<Pressable
								onPress={onDelete}
								hitSlop={8}
								accessibilityLabel="Delete trip"
							>
								<Ionicons
									name="trash-outline"
									size={20}
									color={isActive ? backgroundColor : mutedColor}
								/>
							</Pressable>
						)}
					</View>
				</View>

				<View>
					<Text
						className={cn(
							"font-bold text-xl",
							isActive ? "text-background" : "text-foreground",
						)}
					>
						{name}
					</Text>
					<Text
						className={cn(
							"text-sm",
							isActive ? "text-background/70" : "text-muted",
						)}
					>
						{dateRange}
					</Text>
				</View>
			</View>

			{/* bottom: stats strip and progress bar */}
			<View className="gap-3 bg-border px-4 py-3">
				<View className="flex-row">
					<Stat value={String(days)} label={days === 1 ? "day" : "days"} />
					<Stat value={String(stops)} label={stops === 1 ? "stop" : "stops"} />
					<Stat value={`${done} of ${stops}`} label="done" />
				</View>

				<View className="h-1.5 overflow-hidden rounded-full bg-surface">
					<View
						className="h-full rounded-full bg-foreground"
						style={{ width: `${percent}%` }}
					/>
				</View>
			</View>
		</Pressable>
	);
}

function Stat({ value, label }: { value: string; label: string }) {
	return (
		<View className="flex-1">
			<Text className="font-bold text-base text-foreground">{value}</Text>
			<Text className="text-muted text-xs">{label}</Text>
		</View>
	);
}
