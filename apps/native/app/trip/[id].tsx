import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import {
	ActivityIndicator,
	Alert,
	FlatList,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { Container } from "@/components/container";
import { trpc } from "@/utils/trpc";

export default function TripDetail() {
	const { id } = useLocalSearchParams<{ id: string }>();

	const queryClient = useQueryClient();
	const deleteTrip = useMutation(
		trpc.itinerary.delete.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries(trpc.trips.getAll.queryFilter());
				router.back();
			},
		}),
	);

	const updateItem = useMutation(
		trpc.itinerary.update.mutationOptions({
			onSuccess: () =>
				queryClient.invalidateQueries(
					trpc.itinerary.getAll.queryFilter({ id }),
				),
		}),
	);

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

	function confirmDelete() {
		Alert.alert("Delete trip?", "This cannot be undone.", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Delete",
				style: "destructive",
				onPress: () => deleteTrip.mutate({ id }),
			},
		]);
	}

	return (
		<Container className="p-5">
			<Stack.Screen
				options={{
					title: tripQuery.data.name,
					headerRight: () => (
						<TouchableOpacity onPress={confirmDelete} className="px-2">
							<Ionicons name="trash-outline" size={22} color="#ef4444" />
						</TouchableOpacity>
					),
				}}
			/>
			<Text className="mb-4 text-gray-500">
				{days.length} days -{" "}
				{itemsQuery.data?.filter((i) => i.done).length ?? 0} of{" "}
				{itemsQuery.data?.length ?? 0} done
			</Text>

			<FlatList
				data={days}
				keyExtractor={(day) => day.date}
				renderItem={({ item: day }) => (
					<View className="mb-4">
						<Text className="mb-2 font-semibold">Day {day.dayNumber}</Text>
						{day.items.map((item) => (
							<View
								key={item.id}
								className="mb-2 flex-row items-center gap-3 rounded-lg border border-gray-300 p-3"
							>
								<TouchableOpacity
									onPress={() =>
										updateItem.mutate({
											id: item.id,
											done: !item.done,
											version: item.version,
										})
									}
								>
									<Ionicons
										name={item.done ? "checkmark-circle" : "ellipse-outline"}
										size={24}
										color={item.done ? "#22c55e" : "#9ca3af"}
									/>
								</TouchableOpacity>

								<View className="flex-1">
									<Text
										className={`font-medium ${item.done ? "text-gray-400 line-through" : ""}`}
									>
										{item.title}
									</Text>
									<Text className="text-gray-500 text-sm">
										{item.startAt ? item.startAt.slice(11, 16) : "-"}
									</Text>
									{item.notes && (
										<Text className="text-gray-600 text-sm">{item.notes}</Text>
									)}
								</View>
							</View>
						))}
					</View>
				)}
			/>
		</Container>
	);
}
