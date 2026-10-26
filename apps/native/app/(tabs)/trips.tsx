import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useThemeColor } from "heroui-native";
import { useState } from "react";
import {
	ActivityIndicator,
	Alert,
	FlatList,
	Pressable,
	Text,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Container } from "@/components/container";
import TripHero from "@/components/trips/TripHero";
import TripRow from "@/components/trips/TripRow";
import TripStats from "@/components/trips/TripStats";
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import SectionHeader from "@/components/ui/SectionHeader";
import { authClient } from "@/lib/auth-client";
import { useTabBarSpace } from "@/lib/tab-bar";
import { type TripStatus, tripStatus } from "@/lib/trip-dates";
import { trpc } from "@/utils/trpc";

const FILTERS = ["All", "Upcoming", "Past", "Shared"] as const;
type Filter = (typeof FILTERS)[number];

type FilterableTrip = {
	startDate: string | Date | null;
	endDate: string | Date | null;
	role: string;
};

function matchesFilter(trip: FilterableTrip, filter: Filter) {
	if (filter === "Upcoming") return statusOf(trip) !== "past";
	if (filter === "Past") return statusOf(trip) === "past";
	if (filter === "Shared") return trip.role !== "owner";
	return true;
}

function statusOf(trip: FilterableTrip): TripStatus {
	return tripStatus(trip.startDate, trip.endDate);
}

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
	const insets = useSafeAreaInsets();
	const bottomSpace = useTabBarSpace();
	const [filter, setFilter] = useState<Filter>("All");

	const trips = tripsQuery.data ?? [];
	const [hero, ...rest] = trips.filter((trip) => matchesFilter(trip, filter));

	const itemsQuery = useQuery({
		...trpc.itinerary.getAll.queryOptions({ id: hero?.id ?? "" }),
		enabled: !!hero,
	});
	const nextStop = (itemsQuery.data ?? []).find((item) => !item.done);

	if (sessionPending || (session && tripsQuery.isPending))
		return (
			<Container isScrollable={false} className="justify-center">
				<ActivityIndicator />
			</Container>
		);

	function openTrip(id: string) {
		router.push({ pathname: "/trip/[id]", params: { id } });
	}

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

	const header = (
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
	);

	const emptyState = !session ? (
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
	) : null;

	if (emptyState) {
		return (
			<Container isScrollable={false}>
				<View className="flex-1 p-5">
					{header}
					{emptyState}
				</View>
			</Container>
		);
	}

	const listHeader = (
		<View className="mb-3 gap-4">
			{header}

			<View className="flex-row flex-wrap gap-1">
				{FILTERS.map((item) => (
					<Chip
						key={item}
						label={item}
						selected={filter === item}
						onPress={() => setFilter(item)}
					/>
				))}
			</View>

			<TripStats
				trips={trips.length}
				stops={trips.reduce((sum, trip) => sum + trip.stops, 0)}
				comingUp={trips.filter((t) => statusOf(t) === "upcoming").length}
			/>

			{hero ? (
				<View>
					<SectionHeader title="Recently updated" />
					<TripHero
						name={hero.name}
						startDate={hero.startDate}
						endDate={hero.endDate}
						stops={hero.stops}
						done={hero.done}
						nextStopTitle={nextStop?.title}
						canDelete={hero.role === "owner"}
						onPress={() => openTrip(hero.id)}
						onDelete={() => confirmDelete(hero)}
					/>
				</View>
			) : (
				<Text className="py-6 text-center text-muted text-sm">
					No {filter.toLowerCase()} trips.
				</Text>
			)}

			{rest.length > 0 && <SectionHeader title="More trips" className="mb-0" />}
		</View>
	);

	return (
		<Container isScrollable={false}>
			<FlatList
				data={rest}
				keyExtractor={(trip) => trip.id}
				ListHeaderComponent={listHeader}
				ItemSeparatorComponent={Separator}
				showsVerticalScrollIndicator={false}
				contentContainerClassName="px-5"
				contentContainerStyle={{
					paddingTop: insets.top,
					paddingBottom: bottomSpace,
				}}
				renderItem={({ item }) => (
					<TripRow
						name={item.name}
						startDate={item.startDate}
						endDate={item.endDate}
						stops={item.stops}
						done={item.done}
						shared={item.role !== "owner"}
						canDelete={item.role === "owner"}
						onPress={() => openTrip(item.id)}
						onDelete={() => confirmDelete(item)}
					/>
				)}
			/>
		</Container>
	);
}

function Separator() {
	return <View className="h-3" />;
}
