import { Ionicons } from "@expo/vector-icons";
import { cn, useThemeColor } from "heroui-native";
import { Pressable, Text, View } from "react-native";

type IconName = keyof typeof Ionicons.glyphMap;

export type TripTool = {
	icon: IconName;
	label: string;
	onPress: () => void;
	disabled?: boolean;
};

export default function Triptools({ tools }: { tools: readonly TripTool[] }) {
	const foregroundColor = useThemeColor("foreground");

	return (
		<View className="flex-row justify-between">
			{tools.map((tool) => (
				<Pressable
					key={tool.label}
					onPress={tool.onPress}
					disabled={tool.disabled}
					className={cn(
						"w-20 items-center gap-1.5 active:opacity-70",
						tool.disabled && "opacity-40",
					)}
				>
					<View className="h-14 w-14 items-center justify-center rounded-full bg-surface">
						<Ionicons name={tool.icon} size={22} color={foregroundColor} />
					</View>
					<Text className="font-medium text-foreground text-xs">
						{tool.label}
					</Text>
				</Pressable>
			))}
		</View>
	);
}
