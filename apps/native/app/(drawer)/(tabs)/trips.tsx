import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, router } from "expo-router";
import {
	ActivityIndicator,
	Alert,
	FlatList,
	Text,
	TouchableOpacity,
} from "react-native";
import { Container } from "@/components/container";
import { trpc } from "@/utils/trpc";

export default function Trips() {
	const tripsQuery = useQuery(trpc.trips.getAll.queryOptions());
	const queryClient = useQueryClient();
	const deleteTrip = useMutation(
		trpc.trips.delete.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries(trpc.trips.getAll.queryFilter());
				router.back();
			},
		}),
	);

	if (tripsQuery.isPending) return <ActivityIndicator />;

	return (
		<Container className="p-6">
			<Text className="mb-4 font-semibold text-xl">My Trips</Text>

			<FlatList
				data={tripsQuery.data ?? []}
				keyExtractor={(trip) => trip.id}
				ListEmptyComponent={
					<Text className="text-gray-500">
						No trips yet. Generate one from Itinerary tab.
					</Text>
				}
				renderItem={({ item }) => (
					<>
						<Link
							href={{ pathname: "/trip/[id]", params: { id: item.id } }}
							asChild
						>
							<TouchableOpacity className="mb-3 rounded-lg border border-gray-300 p-4">
								<Text className="font-semibold text-lg">{item.name}</Text>
								<Text className="text-gray-500 text-sm">
									{item.startDate
										? new Date(item.startDate).toDateString()
										: "No dates"}
								</Text>
							</TouchableOpacity>
						</Link>
						<TouchableOpacity
							onPress={() => deleteTrip.mutate({ id: item.id })}
							className="px-3 py-2"
						>
							<Text className="text-red-500">Delete</Text>
						</TouchableOpacity>
					</>
				)}
			/>
		</Container>
	);
}
