import { Ionicons } from "@expo/vector-icons";
import { cn, useThemeColor } from "heroui-native";
import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { PrimaryButton } from "../ui/PrimaryButton";

export default function QuickPlanCard({ onPlan }: { onPlan: () => void }) {
	const mutedColor = useThemeColor("muted");

	return (
		<View className="mx-5 -mt-16 gap-2 rounded-3xl bg-surface p-3 shadow-lg">
			<Tile
				icon="location-outline"
				label="City"
				value="Kuala Lumpur"
				onPress={onPlan}
				right={
					<Ionicons name="lock-closed-outline" size={16} color={mutedColor} />
				}
			/>

			<View className="flex-row gap-2">
				<Tile
					icon="calendar-outline"
					label="Start date"
					value="Pick a date"
					onPress={onPlan}
					className="flex-1"
				/>
				<Tile
					icon="time-outline"
					label="Days"
					value="1 to 7 days"
					onPress={onPlan}
					className="flex-1"
				/>
			</View>

			<PrimaryButton label="Plan a trip" onPress={onPlan} className="mt-1" />
		</View>
	);
}

type TileProps = {
	icon: IconName;
	label: string;
	value: string;
	right?: ReactNode;
	onPress: () => void;
	className?: string;
};

type IconName = keyof typeof Ionicons.glyphMap;

function Tile({ icon, label, value, right, onPress, className }: TileProps) {
	const foregroundColor = useThemeColor("foreground");

	return (
		<Pressable
			onPress={onPress}
			className={cn(
				"flex-row items-center gap-3 rounded-2xl bg-border px-4 py-3 active:opacity-80",
				className,
			)}
		>
			<Ionicons name={icon} size={18} color={foregroundColor} />

			<View className="flex-1">
				<Text className="text-muted text-xs">{label}</Text>
				<Text
					className="font-semibold text-foreground text-sm"
					numberOfLines={1}
				>
					{value}
				</Text>
			</View>
			{right}
		</Pressable>
	);
}
