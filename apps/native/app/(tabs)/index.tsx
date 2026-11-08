import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import {
	ActivityIndicator,
	Pressable,
	ScrollView,
	Text,
	View,
} from "react-native";
import { FocusedStatusBar } from "@/components/FocusedStatusBar";
import CurrentTripCard from "@/components/home/CurrentTripCard";
import HomeHeader from "@/components/home/HomeHeader";
import { MustSeeRail } from "@/components/home/MustSeeRail";
import QuickPlanCard from "@/components/home/QuickPlanCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { authClient } from "@/lib/auth-client";
import { useTabBarSpace } from "@/lib/tab-bar";
import { pickFeaturedTrip } from "@/lib/trip-dates";
import { trpc } from "@/utils/trpc";

const CITY_ID = "kl";
const MUST_SEE_COUNT = 8;
const PLACES_FETCH_LIMIT = 50;

export default function Home() {
	const { data: session } = authClient.useSession();

	const bottomSpace = useTabBarSpace();

	const tripQuery = useQuery({
		...trpc.trips.getAll.queryOptions(),
		enabled: !!session,
	});

	const featured = pickFeaturedTrip(tripQuery.data ?? []);

	const itemsQuery = useQuery({
		...trpc.itinerary.getAll.queryOptions({ id: featured?.id ?? "" }),
		enabled: !!featured,
	});

	const nextStop = (itemsQuery.data ?? []).find((item) => !item.done);

	const placeQuery = useQuery({
		...trpc.place.list.queryOptions({
			cityId: CITY_ID,
			limit: PLACES_FETCH_LIMIT,
		}),
		enabled: !!session,
	});

	const mustSee = [...(placeQuery.data?.places ?? [])]
		.sort((a, b) => b.score - a.score)
		.slice(0, MUST_SEE_COUNT);

	const goPlan = () => router.push(session ? "/plan" : "/(auth)/sign-in");
	const goDiscover = () => router.push("../discover");

	return (
		<View className="flex-1 bg-background">
			<FocusedStatusBar style="light" />
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: bottomSpace }}
			>
				<HomeHeader name={session?.user.name} />
				<QuickPlanCard onPlan={goPlan} />

				<View className="mt-8 px-5">
					<SectionHeader
						title="Your trip"
						actionLabel={session ? "All trips" : undefined}
						onAction={() => router.push("/trips")}
					/>

					{!session ? (
						<Nudge
							text="Sign in to see your trips here."
							action="Sign in"
							onPress={() => router.push("/(auth)/sign-in")}
						/>
					) : featured ? (
						<CurrentTripCard
							name={featured.name}
							startDate={featured.startDate}
							endDate={featured.endDate}
							stops={featured.stops}
							done={featured.done}
							nextStop={nextStop}
							onPress={() =>
								router.push({
									pathname: "/trip/[id]",
									params: { id: featured.id },
								})
							}
						/>
					) : tripQuery.isPending ? (
						<ActivityIndicator />
					) : tripQuery.isError ? (
						<Nudge
							text="Couldn't load your trips"
							action="Try again."
							onPress={() => tripQuery.refetch()}
						/>
					) : (
						<Nudge
							text="Nothing coming up yet."
							action="Plan a trip"
							onPress={goPlan}
						/>
					)}
				</View>

				<SectionHeader
					title="Categories"
					actionLabel="See all"
					onAction={goDiscover}
					className="mt-8 px-5"
				/>

				{mustSee.length > 0 && (
					<>
						<SectionHeader
							title="Must-see in KL"
							actionLabel="See all"
							onAction={goDiscover}
							className="mt-8 px-5"
						/>

						<MustSeeRail places={mustSee} />
					</>
				)}
			</ScrollView>
		</View>
	);
}

type NudgeProps = {
	text: string;
	action: string;
	onPress: () => void;
};

function Nudge({ text, action, onPress }: NudgeProps) {
	return (
		<View className="flex-row items-center justify-between gap-3 rounded-3xl bg-surface p-4">
			<Text className="flex-1 text-muted text-sm">{text}</Text>
			<Pressable
				onPress={onPress}
				className="rounded-full bg-border px-4 py-2 active:opacity-80"
			>
				<Text className="font-semibold text-foreground text-sm">{action}</Text>
			</Pressable>
		</View>
	);
}
