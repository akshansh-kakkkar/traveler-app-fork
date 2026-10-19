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
			{(onBack || right) && (
				<View className="flex-row items-center justify-between">
					{onBack ? (
						<Pressable
							onPress={onBack}
							accessibilityRole="button"
							accessibilityLabel="Go back"
							className="h-12 w-12 items-center justify-center rounded-full bg-surface"
						>
							<Ionicons name="chevron-back" size={22} color={foregroundColor} />
						</Pressable>
					) : (
						<View />
					)}
					{right}
				</View>
			)}

			<View className="gap-1">
				{eyebrow && <Text className="text-muted text-sm">{eyebrow}</Text>}
				<Text className="font-bold text-4xl text-foreground">{title}</Text>
				{subtitle && <Text className="text-base text-muted">{subtitle}</Text>}
			</View>
		</View>
	);
}
