import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { Container } from "@/components/container";
import { trpc } from "@/utils/trpc";

export default function TripDetail() {
	const { id } = useLocalSearchParams<{ id: string }>();

	const tripQuery = useQuery(trpc.trips.getOne.queryOptions({ id }));
	const itemsQuery = useQuery(trpc.itinerary.getAll.queryOptions({ id }));

	const days = useMemo(() => {
		const map = new Map<string, NonNullable<typeof itemsQuery.data>>();
		for (const item of itemsQuery.data ?? []) {
			const key = item.startAt?.slice(0, 10) ?? "unscheduled";
			map.set(key, [...(map.get(key) ?? []), item]);
		}

		return [...map.entries()]
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([date, items], index) => ({ date, dayNumber: index + 1, items }));
	}, [itemsQuery.data]);

	if (tripQuery.isPending || itemsQuery.isPending) {
		return <ActivityIndicator />;
	}

	if (!tripQuery.data) {
		return <Text>Trip not found</Text>;
	}

	return (
		<Container className="p-5">
			<Stack.Screen options={{ title: tripQuery.data.name }} />
			<Text className="mb-4 text-gray-500">
				{days.length} days - {itemsQuery.data?.length ?? 0} stops
			</Text>

			<FlatList
				data={days}
				keyExtractor={(day) => day.date}
				renderItem={({ item: day }) => (
					<View className="mb-6">
						<Text className="mb-2 font-semibold">Day {day.dayNumber}</Text>
						{day.items.map((item) => (
							<View
								key={item.id}
								className="mb-2 rounded-lg border border-gray-300 p-3"
							>
								<Text className="font-medium">{item.title}</Text>
								<Text className="text-gray-500 text-sm">
									{item.startAt ? item.startAt.slice(11, 16) : "-"}
								</Text>
								{item.notes && (
									<Text className="text-gray-600 text-sm">{item.notes}</Text>
								)}
							</View>
						))}
					</View>
				)}
			/>
		</Container>
	);
}
