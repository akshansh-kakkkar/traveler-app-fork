import { cn } from "heroui-native";
import { View } from "react-native";

type Props = {
	done: number;
	total: number;
	trackClassName?: string;
	fillClassName?: string;
};

export default function ProgressBar({
	done,
	total,
	trackClassName,
	fillClassName,
}: Props) {
	const percent = total === 0 ? 0 : Math.min(100, (done / total) * 100);

	return (
		<View
			className={cn(
				"h-1.5 flex-1 overflow-hidden rounded-full bg-border",
				trackClassName,
			)}
		>
			<View
				className={cn("h-full rounded-full bg-foreground", fillClassName)}
				style={{ width: `${percent}%` }}
			/>
		</View>
	);
}
