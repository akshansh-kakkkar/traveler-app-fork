import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "heroui-native";
import { Text, View } from "react-native";
import { PrimaryButton } from "./PrimaryButton";

type IconName = keyof typeof Ionicons.glyphMap;

type Props = {
	icon: IconName;
	title: string;
	message: string;
	actionLabel: string;
	onAction: () => void;
	tone?: "default" | "error";
};

export function EmptyState({
	icon,
	title,
	message,
	actionLabel,
	onAction,
	tone = "default",
}: Props) {
	const foregroundColor = useThemeColor("foreground");
	const dangerColor = useThemeColor("danger");

	return (
		<View className="flex-1 items-center justify-center gap-3 px-2">
			<View className="mb-2 h-18 w-18 items-center justify-center rounded-full bg-border">
				<Ionicons
					name={icon}
					size={32}
					color={tone === "error" ? dangerColor : foregroundColor}
				/>
			</View>
			<Text className="text-center font-semibold text-foreground text-lg">
				{title}
			</Text>

			<Text className="mb-2 text-center text-muted text-sm">{message}</Text>

			<PrimaryButton label={actionLabel} onPress={onAction} />
		</View>
	);
}
