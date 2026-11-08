import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "heroui-native";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HEADER_TOP_GAP = 20;

function greeting(hour: number): string {
	if (hour < 12) return "Good morning";
	if (hour < 18) return "Good afternoon";
	return "Good evening";
}

export default function HomeHeader({ name }: { name?: string }) {
	const insets = useSafeAreaInsets();
	const background = useThemeColor("background");

	const firstName = name?.trim().split(" ")[0];
	const hello = greeting(new Date().getHours());
	const eyebrow = firstName
		? `${hello}, ${firstName} · Kuala Lumpur`
		: `${hello} · Kuala Lumpur`;

	return (
		<View
			className="rounded-b-[36px] bg-foreground px-6 pb-24"
			style={{ paddingTop: insets.top + HEADER_TOP_GAP }}
		>
			<View className="flex-row items-center gap-1.5">
				<Ionicons name="location-outline" size={14} color={background} />
				<Text className="text-background/80 text-xs">{eyebrow}</Text>
			</View>

			<Text className="mt-2 font-bold text-4xl text-background">
				Where to next?
			</Text>
		</View>
	);
}
