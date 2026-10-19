import { useMutation } from "@tanstack/react-query";
import { PlaceCategory } from "@traveler-app/db/enums";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
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

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

function formatDate(date: Date) {
	return `${WEEKDAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

export default function Plan() {
	const [interests, setInterests] = useState<PlaceCategory[]>([
		"food",
		"culture",
	]);
	const [days, setDays] = useState(3);
	const [notes, setNotes] = useState("");
	const [startDate] = useState(() => new Date());

	const generateMutation = useMutation(
		trpc.itinerary.generate.mutationOptions({
			onSuccess: (trip) => {
				queryClient.invalidateQueries(trpc.trips.getAll.queryFilter());
				router.push(`/trip/${trip.id}`);
			},
		}),
	);

	const isPending = generateMutation.isPending;
	const canGenerate = interests.length > 0 && !isPending;

	const allCategories = Object.values(PlaceCategory);

	const { data: session } = authClient.useSession();
	const userId = session?.user?.id;
	useEffect(() => {
		generateMutation.reset();
	}, [userId]);

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
					value={formatDate(startDate)}
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
						startDate: startDate,
						notes: notes.trim() || undefined,
					})
				}
				disabled={!canGenerate}
				className="-mt-8 mb-4"
			/>

			{generateMutation.error && (
				<Text className="text-danger">{generateMutation.error.message}</Text>
			)}
		</Container>
	);
}
