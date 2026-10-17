import { cn } from "heroui-native";
import { Pressable, Text } from "react-native";

type Props = {
	weekday: string; // "S", "M", "T"
	date: number; // 18, 19, 20
	selected: boolean;
	onPress: () => void;
};

export function Day({ weekday, date, selected, onPress }: Props) {
	return (
		<Pressable
			onPress={onPress}
			className={cn(
				"h-20 w-14 items-center justify-center rounded-full",
				selected ? "bg-accent" : "bg-background",
			)}
		>
			<Text className="text-foreground text-xs">{weekday}</Text>
			<Text className="font-bold text-foreground text-xl">{date}</Text>
		</Pressable>
	);
}
