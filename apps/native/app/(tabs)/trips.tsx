import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useThemeColor } from "heroui-native";
import {
	ActivityIndicator,
	Alert,
	FlatList,
	Pressable,
	View,
} from "react-native";
import { Container } from "@/components/container";
import { EmptyState } from "@/components/ui/EmptyState";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { TripCard } from "@/components/ui/TripCard";
import { authClient } from "@/lib/auth-client";
import { useTabBarSpace } from "@/lib/tab-bar";
import { trpc } from "@/utils/trpc";

const MS_PER_DAY = 86_400_000;

export default function Trips() {
	const { data: session, isPending: sessionPending } = authClient.useSession();
	const tripsQuery = useQuery({
		...trpc.trips.getAll.queryOptions(),
		enabled: !!session,
	});
	const queryClient = useQueryClient();
	const deleteTrip = useMutation(
		trpc.trips.delete.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries(trpc.trips.getAll.queryFilter());
				router.back();
			},
		}),
	);
	const foregroundColor = useThemeColor("foreground");
	const bottomSpace = useTabBarSpace();

	if (sessionPending || (session && tripsQuery.isPending))
		return <ActivityIndicator />;

	const trips = tripsQuery.data ?? [];

	function confirmDelete(trip: { id: string; name: string }) {
		Alert.alert(
			"Delete this trip?",
			`"${trip.name}" and all it stops will be deleted. You can't undo this.`,
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete trip",
					style: "destructive",
					onPress: () => deleteTrip.mutate({ id: trip.id }),
				},
			],
		);
	}

	return (
		<Container className="p-6" isScrollable={false}>
			<ScreenHeader
				title="My trips"
				right={
					<Pressable
						onPress={() => router.push("/plan")}
						accessibilityLabel="Plan a trip"
						className="h-12 w-12 items-center justify-center rounded-full bg-surface"
					>
						<Ionicons name="add" size={24} color={foregroundColor} />
					</Pressable>
				}
			/>

			{!session ? (
				<EmptyState
					icon="person-circle-outline"
					title="Sign in to see your trips"
					message="Trips you plan or get invited to are kept with your account."
					actionLabel="Sign in"
					onAction={() => router.push("/(auth)/sign-in")}
				/>
			) : tripsQuery.isError ? (
				<EmptyState
					icon="cloud-offline-outline"
					tone="error"
					title="Couldn't load your trips"
					message="Check your connection, then try again."
					actionLabel="Try again"
					onAction={() => tripsQuery.refetch()}
				/>
			) : trips.length === 0 ? (
				<EmptyState
					icon="map-outline"
					title="No trips yet"
					message="Plan one and it will show up here."
					actionLabel="Plan a trip"
					onAction={() => router.push("/plan")}
				/>
			) : (
				<FlatList
					data={trips}
					keyExtractor={(trip) => trip.id}
					ItemSeparatorComponent={Separator}
					contentContainerStyle={{ paddingBottom: bottomSpace }}
					renderItem={({ item }) => (
						<TripCard
							name={item.name}
							dateRange={
								item.startDate
									? new Date(item.startDate).toDateString()
									: "No dates"
							}
							days={tripDays(item.startDate, item.endDate)}
							stops={item.stops}
							done={item.done}
							status="upcoming" // TODO determine from dates
							shared={item.role !== "owner"}
							canDelete={item.role === "owner"}
							onPress={() =>
								router.push({ pathname: "/trip/[id]", params: { id: item.id } })
							}
							onDelete={() => confirmDelete(item)}
						/>
					)}
				/>
			)}
		</Container>
	);
}

function Separator() {
	return <View className="h-3" />;
}

// TODO move to shared lib when status and date ranges are done
function tripDays(
	start: string | Date | null,
	end: string | Date | null,
): number {
	if (!start || !end) return 1;
	const diff = new Date(end).getTime() - new Date(start).getTime();
	return Math.max(1, Math.round(diff / MS_PER_DAY) + 1);
}
