import { cn } from "heroui-native";
import { Pressable, Text, View } from "react-native";

type Props = {
	title: string;
	actionLabel?: string;
	onAction?: () => void;
	className?: string;
};

export default function SectionHeader({
	title,
	actionLabel,
	onAction,
	className,
}: Props) {
	return (
		<View
			className={cn("mb-3 flex-row items-center justify-between", className)}
		>
			<Text className="font-bold text-foreground text-lg">{title}</Text>
			{actionLabel && onAction && (
				<Pressable onPress={onAction} hitSlop={8}>
					<Text className="font-medium text-foreground text-sm underline">
						{actionLabel}
					</Text>
				</Pressable>
			)}
		</View>
	);
}
