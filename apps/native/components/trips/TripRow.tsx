import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "heroui-native";
import { Pressable, Text, View } from "react-native";
import {
	formatDateTile,
	TRIP_STATUS_LABEL,
	tripDays,
	tripStatus,
} from "@/lib/trip-dates";
import { MetaPill } from "../ui/MetaPill";
import ProgressBar from "../ui/ProgressBar";

type DateValue = string | Date | null;

const DATE_TILE_WIDTH = 80;

type Props = {
	name: string;
	startDate: DateValue;
	endDate: DateValue;
	stops: number;
	done: number;
	shared?: boolean;
	canDelete?: boolean;
	onPress: () => void;
	onDelete?: () => void;
};

export default function TripRow({
	name,
	startDate,
	endDate,
	stops,
	done,
	shared,
	canDelete,
	onPress,
	onDelete,
}: Props) {
	const mutedColor = useThemeColor("muted");

	const status = tripStatus(startDate, endDate);
	const days = tripDays(startDate, endDate);
	return (
		<Pressable
			onPress={onPress}
			className="flex-row gap-3 rounded-3xl bg-surface p-3 active:opacity-90"
		>
			<DateTile startDate={startDate} endDate={endDate} />

			<View className="flex-1 gap-2">
				<View className="flex-row items-center justify-between">
					<View className="flex-row gap-1.5">
						<MetaPill
							label={TRIP_STATUS_LABEL[status]}
							className="bg-border py-1"
						/>
						{shared && (
							<MetaPill
								icon="people-outline"
								label="Shared"
								className="bg-border py-1"
							/>
						)}
					</View>
					{canDelete && (
						<Pressable onPress={onDelete} hitSlop={10}>
							<Ionicons name="trash-outline" size={18} color={mutedColor} />
						</Pressable>
					)}
				</View>

				<Text className="font-bold text-base text-foreground" numberOfLines={1}>
					{name}
				</Text>

				<View className="flex-row gap-1.5">
					<MetaPill
						icon="calendar-outline"
						label={`${days} ${days === 1 ? "day" : "days"}`}
						className="bg-border py-1"
					/>
					<MetaPill
						icon="location-outline"
						label={`${stops} ${stops === 1 ? "stop" : "stops"}`}
						className="bg-border py-1"
					/>
				</View>

				<View className="flex-row items-center gap-2">
					<ProgressBar done={done} total={stops} />
					<Text className="text-muted text-xs">
						{done} of {stops} done
					</Text>
				</View>
			</View>
		</Pressable>
	);
}

function DateTile({
	startDate,
	endDate,
}: {
	startDate: DateValue;
	endDate: DateValue;
}) {
	const foregroundColor = useThemeColor("foreground");
	const tile = formatDateTile(startDate, endDate);

	return (
		<View
			className="shrink-0 items-center justify-center gap-1 self-stretch rounded-2xl bg-background px-1"
			style={{ width: DATE_TILE_WIDTH }}
		>
			{tile ? (
				<>
					<Text className="text-muted text-xs" numberOfLines={1}>
						{tile.month}
					</Text>
					<Text
						className="font-bold text-2xl text-foreground"
						numberOfLines={1}
						adjustsFontSizeToFit
						minimumFontScale={0.6}
					>
						{tile.days}
					</Text>
				</>
			) : (
				<>
					<Ionicons name="calendar-outline" size={26} color={foregroundColor} />
					<Text className="text-muted text-xs">No dates</Text>
				</>
			)}
		</View>
	);
}
