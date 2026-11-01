import { Ionicons } from "@expo/vector-icons";
import { cn, useThemeColor } from "heroui-native";
import { Pressable, Text, View } from "react-native";
import ProgressBar from "../ui/ProgressBar";

type Props = {
	weekday: string;
	date: number;
	title: string;
	subtitle: string;
	done: number;
	total: number;
	isToday?: boolean;
	onPress: () => void;
};

export default function DayRow({
	weekday,
	date,
	title,
	subtitle,
	done,
	total,
	isToday,
	onPress,
}: Props) {
	const mutedColor = useThemeColor("muted");

	return (
		<Pressable
			onPress={onPress}
			className="flex-row items-center gap-3 rounded-3xl bg-surface p-3 active:opacity-90"
		>
			<View
				className={cn(
					"h-16 w-12 items-center justify-center rounded-full",
					isToday ? "bg-accent" : "bg-background",
				)}
			>
				<Text className="text-foreground text-xs">{weekday}</Text>
				<Text className="font-bold text-foreground text-lg">{date}</Text>
			</View>

			<View className="flex-1 gap-1">
				<Text className="font-bold text-base text-foreground">{title}</Text>
				{subtitle !== "" && (
					<Text className="text-muted text-xs" numberOfLines={1}>
						{subtitle}
					</Text>
				)}
				<View className="mt-1 flex-row items-center gap-2">
					<ProgressBar done={done} total={total} />
					<Text className="text-muted text-xs">
						{done} of {total}
					</Text>
				</View>
			</View>

			<Ionicons name="chevron-forward" size={18} color={mutedColor} />
		</Pressable>
	);
}
