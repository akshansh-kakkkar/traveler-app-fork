import { useInfiniteQuery } from "@tanstack/react-query";
import type { AppRouter } from "@traveler-app/api/routers/index";
import { PlaceCategory } from "@traveler-app/db/enums";
import type { inferRouterOutputs } from "@trpc/server";
import { useMemo, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Container } from "@/components/container";
import { trpc } from "@/utils/trpc";

type Place = inferRouterOutputs<AppRouter>["place"]["list"]["places"][number];

export default function Discover() {
	const [category, setCategory] = useState<PlaceCategory | undefined>(
		undefined,
	);

	const categories = Object.values(PlaceCategory);

	const placesQuery = useInfiniteQuery(
		trpc.place.list.infiniteQueryOptions(
			{
				cityId: "kl",
				includeUnverified: true,
				category,
			},
			{ getNextPageParam: (lastPage) => lastPage.nextCursor },
		),
	);

	const allPlaces = useMemo(
		() => placesQuery.data?.pages.flatMap((page) => page.places) ?? [],
		[placesQuery.data],
	);

	return (
		<Container className="p-6" isScrollable={false}>
			<Text className="mb-4 text-center text-lg">
				{allPlaces.length} places in Kuala Lumpur
			</Text>

			<FlatList
				data={categories}
				keyExtractor={(item) => item}
				horizontal={true}
				className="flex-1"
				renderItem={({ item }) => (
					<CategoryCard
						category={item}
						isSelected={category === item}
						onPress={() => setCategory(category === item ? undefined : item)}
					/>
				)}
			/>

			{placesQuery.isPending && <ActivityIndicator />}

			{placesQuery.error && (
				<Text className="text-red-500">{placesQuery.error.message}</Text>
			)}

			<FlatList
				data={allPlaces}
				keyExtractor={(place) => place.id}
				renderItem={({ item }) => <PlaceCard place={item} />}
				className="flex-1"
				onEndReached={() => {
					if (placesQuery.hasNextPage && !placesQuery.isFetchingNextPage)
						placesQuery.fetchNextPage();
				}}
				ListFooterComponent={
					placesQuery.isFetchingNextPage ? <ActivityIndicator /> : null
				}
			/>
		</Container>
	);
}

function PlaceCard({ place }: { place: Place }) {
	// const indoorLabel =
	// 	place.indoor === null ? "Unknown" : place.indoor ? "Indoor" : "Outdoor";

	return (
		<View className="mb-4 w-full rounded-lg border border-gray-300 p-4">
			<View className="flex-row items-center justify-between">
				<Text className="flex-1 font-semibold text-lg">{place.name}</Text>
				{!place.verified && (
					<Text className="rounded bg-red-100 px-2 py-1 text-red-700 text-xs">
						UNVERIFIED
					</Text>
				)}
			</View>

			<Text className="text-gray-600">{place.category}</Text>
			<Text className="text-gray-600">
				{place.indoor ? "Indoor" : "Outdoor"}
			</Text>
			<Text className="text-gray-600">
				Labels: {place.labels.join(", ") || "None"}
			</Text>
		</View>
	);
}

function CategoryCard({
	category,
	isSelected,
	onPress,
}: {
	category: PlaceCategory;
	isSelected: boolean;
	onPress: () => void;
}) {
	return (
		<TouchableOpacity
			className={`mr-2 mb-4 rounded-xl border p-4 ${isSelected ? "border-amber-400" : "border-gray-300"}`}
			onPress={onPress}
		>
			<Text className="font-semibold text-lg">{category}</Text>
		</TouchableOpacity>
	);
}
