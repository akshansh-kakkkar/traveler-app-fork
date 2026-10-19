import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "heroui-native";
import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
	title: string;
	eyebrow?: string;
	subtitle?: string;
	onBack?: () => void;
	right?: ReactNode;
};

export function ScreenHeader({
	title,
	eyebrow,
	subtitle,
	onBack,
	right,
}: Props) {
	const foregroundColor = useThemeColor("foreground");

	return (
		<View className="mb-4 gap-4">
			{onBack && (
				<View className="flex-row items-center justify-between">
					<Pressable
						onPress={onBack}
						accessibilityRole="button"
						accessibilityLabel="Go back"
						className="h-12 w-12 items-center justify-center rounded-full bg-surface"
					>
						<Ionicons name="chevron-back" size={22} color={foregroundColor} />
					</Pressable>
					{right}
				</View>
			)}

			<View className="flex-row items-center justify-between gap-3">
				<View className="flex-1 gap-1">
					{eyebrow && <Text className="text-muted text-sm">{eyebrow}</Text>}
					<Text className="font-bold text-4xl text-foreground">{title}</Text>
					{subtitle && <Text className="text-base text-muted">{subtitle}</Text>}
				</View>
				{!onBack && right}
			</View>
		</View>
	);
}
