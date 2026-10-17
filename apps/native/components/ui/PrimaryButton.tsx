import { cn, useThemeColor } from "heroui-native";
import { ActivityIndicator, Pressable, Text } from "react-native";

type Props = {
	label: string;
	onPress: () => void;
	loading?: boolean;
	loadingLabel?: string;
	disabled?: boolean;
	className?: string;
};

export function PrimaryButton({
	label,
	onPress,
	loading,
	loadingLabel,
	disabled,
	className,
}: Props) {
	const spinnerColor = useThemeColor("accent-foreground");
	const inactive = disabled || loading;

	return (
		<Pressable
			onPress={onPress}
			disabled={inactive}
			accessibilityRole="button"
			accessibilityState={{ disabled: inactive, busy: loading }}
			className={cn(
				"h-14 w-full flex-row items-center justify-center gap-2 rounded-full bg-accent active:opacity-80",
				disabled && !loading && "opacity-40",
				className,
			)}
		>
			{loading && <ActivityIndicator color={spinnerColor} />}
			<Text className="font-bold text-accent-foreground text-base">
				{loading && loadingLabel ? loadingLabel : label}
			</Text>
		</Pressable>
	);
}
