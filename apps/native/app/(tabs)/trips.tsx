import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, router } from "expo-router";
import { useThemeColor } from "heroui-native";
import {
	ActivityIndicator,
	FlatList,
	Pressable,
	Text,
	TouchableOpacity,
} from "react-native";
import { Container } from "@/components/container";
import { EmptyState } from "@/components/ui/EmptyState";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { authClient } from "@/lib/auth-client";
import { useTabBarSpace } from "@/lib/tab-bar";
import { trpc } from "@/utils/trpc";

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
					contentContainerStyle={{ paddingBottom: bottomSpace }}
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
			)}
		</Container>
	);
}
