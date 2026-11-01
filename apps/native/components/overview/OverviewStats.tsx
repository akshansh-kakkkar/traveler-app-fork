import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "heroui-native";
import { Text, View } from "react-native";

type IconName = keyof typeof Ionicons.glyphMap;

type Stat = { icon: IconName; value: string; label: string };

export default function OverviewStats({
	stats,
}: {
	stats: readonly [Stat, Stat, Stat];
}) {
	return (
		<View className="flex-row rounded-3xl bg-foreground py-4">
			{stats.map((stat, index) => (
				<View key={stat.label} className="flex-1 flex-row">
					{index > 0 && <View className="w-px bg-background/20" />}
					<StatCell {...stat} />
				</View>
			))}
		</View>
	);
}

function StatCell({ icon, value, label }: Stat) {
	const sageColor = useThemeColor("background");

	return (
		<View className="flex-1 items-center gap-1.5 px-1">
			<View className="h-8 w-8 items-center justify-center rounded-xl bg-background/15">
				<Ionicons name={icon} size={20} color={sageColor} />
			</View>

			<Text
				className="font-bold text-background text-base"
				numberOfLines={1}
				adjustsFontSizeToFit
			>
				{value}
			</Text>
			<Text className="text-background/70 text-xs">{label}</Text>
		</View>
	);
}
