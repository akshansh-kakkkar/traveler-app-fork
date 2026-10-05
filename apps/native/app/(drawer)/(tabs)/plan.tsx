import { useMutation } from "@tanstack/react-query";
import { PlaceCategory } from "@traveler-app/db/enums";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { Container } from "@/components/container";
import { authClient } from "@/lib/auth-client";
import { queryClient, trpc } from "@/utils/trpc";

export default function Plan() {
	const [interests, setInterests] = useState<PlaceCategory[]>([
		"food",
		"culture",
	]);
	const [days, setDays] = useState(3);
	const [pace, setPace] = useState<"relaxed" | "normal" | "packed">("normal");
	const [activeDay, setActiveDay] = useState(0);
	const [notes, setNotes] = useState("");
	const [messageIndex, setMessageIndex] = useState(0);

	const generateMutation = useMutation(
		trpc.itinerary.generate.mutationOptions({
			onSuccess: (trip) => {
				queryClient.invalidateQueries(trpc.trips.getAll.queryFilter());
				router.push(`../trip/${trip.id}`);
			},
		}),
	);

	const isPending = generateMutation.isPending;
	const canGenerate = interests.length > 0 && !isPending;

	const MESSAGES = [
		"Finding places in Kuala Lumpur…",
		"Checking opening hours…",
		"Planning your days…",
		"Ordering stops to cut travel…",
		"Almost there…",
	];

	const allCategories = Object.values(PlaceCategory);

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

	useEffect(() => {
		if (!generateMutation.isPending) {
			setMessageIndex(0);
			return;
		}
		const timer = setInterval(() => {
			setMessageIndex((i) => Math.min(i + 1, MESSAGES.length - 1));
		}, 2000);

		return () => clearInterval(timer);
	}, [generateMutation.isPending]);

	function toggleInterest(category: PlaceCategory) {
		setInterests((prev) =>
			prev.includes(category)
				? prev.filter((c) => c !== category)
				: [...prev, category],
		);
	}

	return (
		<Container className="p-6">
			<Text className="mb-4 text-center text-lg">
				{days} days in Kuala Lumpur ·{" "}
				{interests.join(", ") || "pick an interest"}
			</Text>

			<Text className="mb-2 text-gray-500 text-sm">Interests</Text>
			<View className="mb-4 flex-row flex-wrap gap-2">
				{allCategories.map((item) => (
					<InterestChip
						key={item}
						category={item}
						isSelected={interests.includes(item)}
						disabled={isPending}
						onPress={() => toggleInterest(item)}
					/>
				))}
			</View>

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

			<Text className="mb-2 text-gray-500 text-sm">Pace</Text>
			<View className="mb-4 flex-row justify-center gap-2">
				{(["relaxed", "normal", "packed"] as const).map((p) => (
					<DayChip
						key={p}
						label={p}
						isSelected={pace === p}
						disabled={isPending}
						onPress={() => setPace(p)}
					/>
				))}
			</View>

			<TextInput
				className="mb-4 rounded-xl border border-gray-300 p-4"
				placeholder="Anything specific? e.g. mostly food, no temples"
				value={notes}
				onChangeText={setNotes}
				editable={!isPending}
				multiline
				maxLength={500}
			/>

			<TouchableOpacity
				className={`mb-4 items-center rounded-xl p-4 ${
					canGenerate ? "bg-amber-400" : "bg-gray-300"
				}`}
				disabled={!canGenerate}
				onPress={() =>
					generateMutation.mutate({
						cityId: "kl",
						interests,
						days,
						pace,
						startDate: new Date().toISOString(),
						notes: notes.trim() || undefined,
					})
				}
			>
				<Text className="font-semibold text-lg">
					{isPending ? "Generating…" : "Generate"}
				</Text>
			</TouchableOpacity>

			{generateMutation.isPending && (
				<View className="items-center py-8">
					<ActivityIndicator />
					<Text className="mt-3 text-gray-600">{MESSAGES[messageIndex]}</Text>
				</View>
			)}

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
	disabled,
	onPress,
}: {
	label: string;
	isSelected: boolean;
	disabled?: boolean;
	onPress: () => void;
}) {
	return (
		<TouchableOpacity
			className={`self-start rounded-full border px-4 py-2 ${isSelected ? "border-amber-400 bg-amber-100" : "border-gray-300"}`}
			disabled={disabled}
			onPress={onPress}
		>
			<Text className="font-medium">{label}</Text>
		</TouchableOpacity>
	);
}

function InterestChip({
	category,
	isSelected,
	disabled,
	onPress,
}: {
	category: PlaceCategory;
	isSelected: boolean;
	disabled?: boolean;
	onPress: () => void;
}) {
	return (
		<TouchableOpacity
			disabled={disabled}
			className={`self-start rounded-full border px-4 py-2 ${
				isSelected ? "border-amber-400 bg-amber-100" : "border-gray-300"
			} ${disabled ? "opacity-40" : ""}`}
			onPress={onPress}
		>
			<Text className="font-medium capitalize">{category}</Text>
		</TouchableOpacity>
	);
}
