import { useMutation } from "@tanstack/react-query";
import type { AppRouter } from "@traveler-app/api/routers/index";
import { PlaceCategory } from "@traveler-app/db/enums";
import type { inferRouterOutputs } from "@trpc/server";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Container } from "@/components/container";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";

type GeneratedTrip = inferRouterOutputs<AppRouter>["itinerary"]["generate"];

export default function Plan() {
	const [interests, setInterests] = useState<PlaceCategory[]>([
		"food",
		"culture",
	]);
	const [days, setDays] = useState(3);
	const [pace, setPace] = useState<"relaxed" | "normal" | "packed">("normal");
	const [activeDay, setActiveDay] = useState(0);

	const allCategories = Object.values(PlaceCategory);

	const generateMutation = useMutation(
		trpc.itinerary.generate.mutationOptions(),
	);

	function toggleInterest(category: PlaceCategory) {
		setInterests((prev) =>
			prev.includes(category)
				? prev.filter((c) => c !== category)
				: [...prev, category],
		);
	}

	const sections = useMemo(() => {
		if (!generateMutation.data) return [];

		const groups = new Map<string, typeof generateMutation.data.items>();

		for (const item of generateMutation.data.items) {
			const key = item.startAt?.slice(0, 10) ?? "unscheduled";
			groups.set(key, [...(groups.get(key) ?? []), item]);
		}

		return [...groups.entries()].map(([title, data]) => ({ title, data }));
	}, [generateMutation.data]);

	// Jump back to day 1 whenever a fresh itinerary comes in
	useEffect(() => {
		setActiveDay(0);
	}, [generateMutation.data]);

	const { data: session } = authClient.useSession();
	const userId = session?.user?.id;
	useEffect(() => {
		generateMutation.reset();
	}, [userId]);

	// run this from a button press
	// generateMutation.mutate({ cityId: "kl", interests, days, pace });

	return (
		<Container className="p-6">
			<Text className="mb-4 text-center text-lg">
				Itinerary for {days} days in Kuala Lumpur
			</Text>

			<FlatList
				data={allCategories}
				keyExtractor={(item) => item}
				horizontal={true}
				showsHorizontalScrollIndicator={false}
				contentContainerClassName="gap-2 pb-2"
				renderItem={({ item }) => (
					<InterestChip
						category={item}
						isSelected={interests.includes(item)}
						onPress={() => toggleInterest(item)}
					/>
				)}
			/>

			<View className="mb-4 flex-row items-center justify-center gap-6">
				<TouchableOpacity
					className="h-10 w-10 items-center justify-center rounded-full border border-gray-300"
					onPress={() => setDays((d) => Math.max(1, d - 1))}
				>
					<Text className="font-semibold text-lg">−</Text>
				</TouchableOpacity>

				<Text className="w-8 text-center font-semibold text-lg">{days}</Text>

				<TouchableOpacity
					className="h-10 w-10 items-center justify-center rounded-full border border-gray-300"
					onPress={() => setDays((d) => Math.min(7, d + 1))}
				>
					<Text className="font-semibold text-lg">+</Text>
				</TouchableOpacity>
			</View>

			<TouchableOpacity
				className="mb-4 items-center rounded-xl bg-amber-400 p-4"
				disabled={interests.length === 0 || generateMutation.isPending}
				onPress={() =>
					generateMutation.mutate({
						cityId: "kl",
						interests,
						days,
						pace,
						startDate: new Date().toISOString(),
					})
				}
			>
				<Text className="font-semibold text-lg">Generate</Text>
			</TouchableOpacity>

			<View className="mb-4 flex-row justify-center gap-2">
				{(["relaxed", "normal", "packed"] as const).map((p) => (
					<DayChip
						key={p}
						label={p}
						isSelected={pace === p}
						onPress={() => setPace(p)}
					/>
				))}
			</View>

			{generateMutation.isPending && <ActivityIndicator />}

			{generateMutation.error && (
				<Text className="text-red-500">{generateMutation.error.message}</Text>
			)}

			{sections.length > 0 && (
				<FlatList
					data={sections}
					keyExtractor={(section) => section.title}
					horizontal={true}
					showsHorizontalScrollIndicator={false}
					contentContainerClassName="gap-2 pb-2"
					renderItem={({ index }) => (
						<DayChip
							label={`Day ${index + 1}`}
							isSelected={activeDay === index}
							onPress={() => setActiveDay(index)}
						/>
					)}
				/>
			)}

			<FlatList
				data={sections[activeDay]?.data ?? []}
				keyExtractor={(item) => item.id}
				className="flex-1"
				renderItem={({ item }) => (
					<View className="mb-4 w-full rounded-lg border border-gray-300 p-4">
						<Text className="font-semibold text-lg">{item.title}</Text>
						<Text className="text-gray-600">
							{item.startAt ? item.startAt.slice(11, 16) : "?"}
						</Text>
						{item.notes && <Text className="text-gray-600">{item.notes}</Text>}
					</View>
				)}
			/>
		</Container>
	);
}

function DayChip({
	label,
	isSelected,
	onPress,
}: {
	label: string;
	isSelected: boolean;
	onPress: () => void;
}) {
	return (
		<TouchableOpacity
			className={`self-start rounded-full border px-4 py-2 ${isSelected ? "border-amber-400 bg-amber-100" : "border-gray-300"}`}
			onPress={onPress}
		>
			<Text className="font-medium">{label}</Text>
		</TouchableOpacity>
	);
}

function InterestChip({
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
			className={`self-start rounded-full border px-4 py-2 ${isSelected ? "border-amber-400 bg-amber-100" : "border-gray-300"}`}
			onPress={onPress}
		>
			<Text className="font-medium capitalize">{category}</Text>
		</TouchableOpacity>
	);
}
