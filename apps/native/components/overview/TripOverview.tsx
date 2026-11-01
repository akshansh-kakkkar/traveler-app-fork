import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useThemeColor } from "heroui-native";
import { useMemo } from "react";
import { Alert, Linking, Pressable, Share, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { formatDate } from "@/lib/format-date";
import {
	defaultDayIndex,
	groupByDay,
	isTodayKey,
	mapsRouteUrl,
	routePins,
} from "@/lib/itinerary-days";
import { useTabBarSpace } from "@/lib/tab-bar";
import {
	formatDateRange,
	formatTime,
	TRIP_STATUS_LABEL,
	tripDays,
	tripStatus,
} from "@/lib/trip-dates";
import { trpc } from "@/utils/trpc";
import RouteMap from "../trip/RouteMap";
import { EmptyState } from "../ui/EmptyState";
import SectionHeader from "../ui/SectionHeader";
import DayRow from "./DayRow";
import OverviewStats from "./OverviewStats";
import Triptools, { type TripTool } from "./Triptool";
import UpNextCard from "./UpNextCard";

type Props = {
	tripId: string;
};

export function Tripoverview({ tripId }: Props) {
	const bottomSpace = useTabBarSpace();
	const insets = useSafeAreaInsets();

	const foregroundColor = useThemeColor("foreground");

	const tripQuery = useQuery(trpc.trips.getOne.queryOptions({ id: tripId }));
	const itemsQuery = useQuery(
		trpc.itinerary.getAll.queryOptions({ id: tripId }),
	);

	const items = itemsQuery.data ?? [];
	const days = useMemo(
		() => groupByDay(itemsQuery.data ?? []),
		[itemsQuery.data],
	);
	const dayIndex = defaultDayIndex(days);
	const day = days[dayIndex];

	const pins = useMemo(() => routePins(day?.items ?? []), [day]);

	const trip = tripQuery.data;
	if (!trip) {
		return (
			<View>
				<EmptyState
					icon="map-outline"
					title="Trip not found"
					message="It may have been deleted or you no longer have access"
					actionLabel="Go to my trips"
					onAction={() => router.push("/trips")}
				/>
			</View>
		);
	}

	const status = TRIP_STATUS_LABEL[tripStatus(trip.startDate, trip.endDate)];

	const dayStops = day?.items ?? [];
	const nextIndex = dayStops.findIndex((stop) => !stop.done);
	const nextStop = nextIndex === -1 ? undefined : dayStops[nextIndex];
	const isToday = day ? isTodayKey(day.key) : false;

	const tripLength = tripDays(trip.startDate, trip.endDate);
	const dateRange = formatDateRange(trip.startDate, trip.endDate);
	const doneCount = items.filter((item) => item.done).length;

	const remaining = pins.filter((pin) => pin.state !== "done");
	const dayRouteUrl = mapsRouteUrl(remaining.length > 0 ? remaining : pins);
	const nextPin = pins.find((pin) => pin.state === "next");
	const nextStopUrl = nextPin ? mapsRouteUrl([nextPin]) : null;

	function openMap(index = dayIndex) {
		router.push({
			pathname: "/trip/[id]",
			params: { id: tripId, day: String(index) },
		});
	}

	function openUrl(url: string | null) {
		if (!url) return;
		Linking.openURL(url).catch(() =>
			Alert.alert("Couldn't open Maps", "Try again in a moment."),
		);
	}

	function shareTrip() {
		const stops = `${items.length} ${items.length === 1 ? "stop" : "stops"}`;
		Share.share({
			message: `${trip?.name} - Kuala Lumpur - ${dateRange} - ${stops}`,
		}).catch(() => Alert.alert("Couldn't share", "Try again in a moment."));
	}

	const tools: TripTool[] = [
		{ icon: "map-outline", label: "Map", onPress: () => openMap() },
		{ icon: "list-outline", label: "Itinerary", onPress: () => openMap() },
		{
			icon: "navigate-outline",
			label: "Directions",
			onPress: () => openUrl(dayRouteUrl),
			disabled: !dayRouteUrl,
		},
	];

	return (
		<ScrollView
			className="flex-1 bg-background"
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{ paddingBottom: bottomSpace }}
		>
			<View>
				<RouteMap bottomInset={0} pins={pins} isInteractive={false} />

				<Pressable onPress={() => openMap()} />

				<Pressable
					onPress={shareTrip}
					className="absolute right-5 h-12 w-12 items-center justify-center rounded-full bg-surface shadow-md active:opacity-80"
					style={{ top: insets.top + 8 }}
				>
					<Ionicons
						name="share-social-outline"
						size={20}
						color={foregroundColor}
					/>
				</Pressable>
			</View>

			<View className="gap-6 px-5 pt-5">
				<View className="gap-1">
					<Text className="text-muted text-xs">Kuala Lumpur {status}</Text>
					<Text className="font-bold text-4xl text-foreground">
						{trip.name}
					</Text>
				</View>

				<OverviewStats
					stats={[
						{ icon: "calendar-outline", value: dateRange, label: "Dates" },
						{
							icon: "time-outline",
							value: `${tripLength} ${tripLength === 1 ? "day" : "days"}`,
							label: "Duration",
						},
						{
							icon: "location-outline",
							value: `${items.length}`,
							label: `${doneCount} done`,
						},
					]}
				/>

				<View>
					<SectionHeader title="Trip tools" />
					<Triptools tools={tools} />
				</View>

				{day && (
					<View>
						<SectionHeader title="Up next" />
						{nextStop ? (
							<UpNextCard
								title={nextStop.title}
								category={nextStop.place?.category}
								startAt={nextStop.startAt}
								endAt={nextStop.endAt}
								notes={nextStop.notes}
								dayLabel={dayLabel(isToday, nextStop.startAt)}
								stopLabel={`Day ${dayIndex + 1} · stop ${nextIndex + 1} of ${dayStops.length}`}
								onDirections={
									nextStopUrl ? () => openUrl(nextStopUrl) : undefined
								}
							/>
						) : (
							<View className="rounded-3xl bg-surface p-4">
								<Text className="text-muted text-sm">
									{isToday
										? "No more stops for today."
										: "All stops are complete for this trip"}
								</Text>
							</View>
						)}
					</View>
				)}

				{days.length > 0 && (
					<View>
						<SectionHeader title="Day" />
						<View className="gap-3">
							{days.map((group, index) => (
								<DayRow
									key={group.key}
									weekday={group.weekday}
									date={group.date}
									title={
										isTodayKey(group.key)
											? `Day ${index + 1} · Today`
											: `Day ${index + 1}`
									}
									subtitle={daySubtitle(group.items)}
									done={group.items.filter((stop) => stop.done).length}
									total={group.items.length}
									isToday={isTodayKey(group.key)}
									onPress={() => openMap(index)}
								/>
							))}
						</View>
					</View>
				)}
			</View>
		</ScrollView>
	);
}

type TimedStop = {
	startAt: string | Date | null;
	endAt: string | Date | null;
};

function dayLabel(isToday: boolean, startAt: string | Date | null): string {
	if (isToday) return "Today";
	return startAt ? formatDate(new Date(startAt)) : "";
}

function daySubtitle(stops: readonly TimedStop[]): string {
	const count = `${stops.length} ${stops.length === 1 ? "stop" : "stops"}`;
	const first = formatTime(stops[0]?.startAt ?? null);
	const last = formatTime(stops[stops.length - 1]?.endAt ?? null);
	return first && last ? `${first} - ${last} - ${count}` : count;
}
