import type { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { PlaceCategory } from "@traveler-app/db/enums";
import { router } from "expo-router";
import { useThemeColor } from "heroui-native";
import { useEffect, useMemo, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	Pressable,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { Container } from "@/components/container";
import { GeneratingView } from "@/components/GeneratingView";
import { Chip } from "@/components/ui/Chip";
import { FieldRow } from "@/components/ui/FieldRow";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { SegmentControl } from "@/components/ui/SegmentControl";
import { Stepper } from "@/components/ui/Stepper";
import { TextArea } from "@/components/ui/TextArea";
import { authClient } from "@/lib/auth-client";
import { CATEGORY_ICONS } from "@/lib/category-icons";
import { queryClient, trpc } from "@/utils/trpc";

export default function Plan() {
	const [interests, setInterests] = useState<PlaceCategory[]>([
		"food",
		"culture",
	]);
	const [days, setDays] = useState(3);
	const [activeDay, setActiveDay] = useState(0);
	const [notes, setNotes] = useState("");
	const [messageIndex, setMessageIndex] = useState(0);
	const [startDate] = useState(() => new Date());

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

	const PACES = ["relaxed", "normal", "packed"] as const;
	type Pace = (typeof PACES)[number];
	const [pace, setPace] = useState<Pace>("normal");

	if (isPending) {
		return (
			<Container isScrollable={false}>
				<GeneratingView
					days={days}
					interests={interests}
					pace={pace}
					startDate={startDate}
				/>
			</Container>
		);
	}

	return (
		<Container
			contentClassName="p-6"
			isScrollable={true}
			scrollViewProps={{ showsVerticalScrollIndicator: false }}
		>
			<ScreenHeader title="Plan a trip" eyebrow={`${days} days in`} />

			<View className="mb-4 overflow-hidden rounded-3xl bg-surface px-4">
				<FieldRow
					icon="location-outline"
					label="City"
					value="Kuala Lumpur"
					locked
				/>
				<View className="h-px bg-border" />

				<FieldRow
					icon="calendar-outline"
					label="Start date"
					value="Sun, 18 Oct"
					onPress={() => {}} // date picker later; this is what shows the chevron
				/>
				<View className="h-px bg-border" />

				<FieldRow
					icon="time-outline"
					label="Days"
					value="1 to 7"
					right={<Stepper value={days} onChange={setDays} min={1} max={7} />}
				/>
			</View>

			<Text className="mt-3 mb-2 text-gray-500 text-sm">Interests</Text>
			<View className="mb-4 flex-row flex-wrap gap-2">
				{allCategories.map((item) => (
					<Chip
						key={item}
						label={item}
						icon={CATEGORY_ICONS[item]}
						selected={interests.includes(item)}
						onPress={() => toggleInterest(item)}
						className=""
					/>
				))}
			</View>

			<Text className="mb-2 text-gray-500 text-sm">Pace</Text>

			<SegmentControl options={PACES} value={pace} onChange={setPace} />

			<TextArea
				label="Note"
				onChangeText={setNotes}
				value={notes}
				editable={!isPending}
				optional
				maxLength={500}
				placeholder="Anything the planner should know, like dietary needs"
				className="m-2"
			/>

			<PrimaryButton
				label="Build my trip"
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
				disabled={!canGenerate}
				className={`-mt-8 ${!canGenerate ? "bg-gray-300" : ""} mb-4`}
			/>

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
