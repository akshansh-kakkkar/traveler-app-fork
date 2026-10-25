import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EmptyState } from "@/components/ui/EmptyState";
import { authClient } from "@/lib/auth-client";
import { useTabBarSpace } from "@/lib/tab-bar";
import { trpc } from "@/utils/trpc";

export default function Discover() {
	const { data: session, isPending: sessionPending } = authClient.useSession();
	const tripsQuery = useQuery({
		...trpc.trips.getAll.queryOptions(),
		enabled: !!session,
	});

	const insets = useSafeAreaInsets();
	const tabBarSpace = useTabBarSpace();

	if (sessionPending || (session && tripsQuery.isPending)) {
		return (
			<View className="flex-1 items-center justify-center bg-background">
				<ActivityIndicator />
			</View>
		);
	}

	const emptyState = !session ? (
		<EmptyState
			icon="person-circle-outline"
			title="Sign in to see your route"
			message="Your trip is day by day route shows up here"
			actionLabel="Sign up"
			onAction={() => router.push("/(auth)/sign-in")}
		/>
	) : tripsQuery.isError ? (
		<EmptyState
			icon="cloud-offline-outline"
			tone="error"
			title="Couldn't load your trips"
			message="Check your connection, then try again"
			actionLabel="Try again"
			onAction={() => tripsQuery.refetch()}
		/>
	) : (
		<EmptyState
			icon="map-outline"
			title="No trip coming up"
			message="Plan one and its route will show up here."
			actionLabel="Plan a trip"
			onAction={() => router.push("/plan")}
		/>
	);

	return (
		<View
			className="flex-1 bg-background px-5"
			style={{ paddingTop: insets.top, paddingBottom: tabBarSpace }}
		>
			{emptyState}
		</View>
	);
}
