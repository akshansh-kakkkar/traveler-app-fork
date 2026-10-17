import { cn } from "heroui-native";
import { Pressable, Text, View } from "react-native";

type Props<T extends string> = {
	options: readonly T[];
	value: T;
	onChange: (v: T) => void;
	className?: string;
};

export function SegmentControl<T extends string>({
	options,
	value,
	onChange,
	className,
}: Props<T>) {
	return (
		<View className={cn("flex-row rounded-full bg-muted/20 p-1", className)}>
			{options.map((item) => {
				const selected = item === value;

				return (
					<Pressable
						key={item}
						onPress={() => onChange(item)}
						className={cn(
							"flex-1 items-center rounded-full py-3",
							selected && "bg-foreground",
						)}
					>
						<Text
							className={cn(
								"text-sm",
								selected ? "font-bold text-background" : "text-foreground",
							)}
						>
							{item}
						</Text>
					</Pressable>
				);
			})}
		</View>
	);
}
