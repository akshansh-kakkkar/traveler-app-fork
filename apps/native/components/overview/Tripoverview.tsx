import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { defaultDayIndex, groupByDay, routePins } from "@/lib/itinerary-days";
import { useTabBarSpace } from "@/lib/tab-bar";
import { trpc } from "@/utils/trpc";
import RouteMap from "../trip/RouteMap";

type Props = {
	tripId: string;
};

export function Tripoverview({ tripId }: Props) {
	const bottomSpace = useTabBarSpace();

	const tripQuery = useQuery(trpc.trips.getOne.queryOptions({ id: tripId }));
	const itemsQuery = useQuery(
		trpc.itinerary.getAll.queryOptions({ id: tripId }),
	);

	const days = useMemo(
		() => groupByDay(itemsQuery.data ?? []),
		[itemsQuery.data],
	);
	const dayIndex = defaultDayIndex(days);
	const day = days[dayIndex];

	const pins = useMemo(() => routePins(day?.items ?? []), [day]);

	return (
		<ScrollView
			className="flex-1 bg-background"
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{ paddingBottom: bottomSpace }}
		>
			<View>
				<RouteMap bottomInset={0} pins={pins} isInteractive={false} />
			</View>
		</ScrollView>
	);
}
