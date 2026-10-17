import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "heroui-native";
import { Pressable, Text, View } from "react-native";

type Props = {
	value: number;
	onChange: (value: number) => void;
	min?: number;
	max?: number;
};

export function Stepper({ value, onChange, min = 1, max = 7 }: Props) {
	const foregroundColor = useThemeColor("foreground");

	return (
		<View className="flex-row items-center gap-3">
			<Pressable
				onPress={() => onChange(Math.max(min, value - 1))}
				disabled={value <= min}
				accessibilityLabel="Decrease"
				className="h-10 w-10 items-center justify-center rounded-full bg-background disabled:opacity-40"
			>
				<Ionicons name="remove" size={20} color={foregroundColor} />
			</Pressable>

			<Text className="min-w-4 text-center font-bold text-foreground text-lg">
				{value}
			</Text>

			<Pressable
				onPress={() => onChange(Math.min(max, value + 1))}
				disabled={value >= max}
				accessibilityLabel="Increase"
				className="h-10 w-10 items-center justify-center rounded-full bg-background disabled:opacity-40"
			>
				<Ionicons name="add" size={20} color={foregroundColor} />
			</Pressable>
		</View>
	);
}
