import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Container } from "@/components/container";
import { Chip } from "@/components/ui/Chip";
import { Day } from "@/components/ui/Day";
import { FieldRow } from "@/components/ui/FieldRow";
import { ItemCard } from "@/components/ui/ItemCard";
import { MetaPill } from "@/components/ui/MetaPill";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { SegmentControl } from "@/components/ui/SegmentControl";
import { authClient } from "@/lib/auth-client";

export default function Home() {
	const { data: session } = authClient.useSession();

	const categories = [
		{ label: "Food", icon: "fast-food" },
		{ label: "Culture", icon: "color-palette" },
		{ label: "Nature", icon: "leaf" },
	] as const;
	const [selected, setSelected] = useState<string[]>([]);

	const toggle = (item: string) => {
		setSelected((current) =>
			current.includes(item)
				? current.filter((x) => x !== item)
				: [...current, item],
		);
	};

	const PACES = ["Relaxed", "Normal", "Packed"];
	const [pace, setPace] = useState<string>("Normal");

	const startDate = new Date("2026-10-18");
	const numDays = 3;

	const days = Array.from({ length: numDays }, (_, i) => {
		const d = new Date(startDate);
		d.setDate(d.getDate() + i);
		return {
			weekday: d.toLocaleDateString("en", { weekday: "narrow" }),
			date: d.getDate(),
		};
	});

	const [activeDay, setActiveDay] = useState(0);

	const [done, setDone] = useState(false);

	return (
		<Container
			contentClassName="p-5"
			scrollViewProps={{ showsVerticalScrollIndicator: false }}
		>
			<Text>Welcome back, {session?.user.name}</Text>
			<TouchableOpacity
				className="mx-5 mt-5 items-center rounded-xl bg-accent px-6 py-3 active:opacity-70"
				onPress={() => router.push("/sign-in")}
			>
				<Text className="font-semibold text-accent-foreground">Sign in</Text>
			</TouchableOpacity>
			<TouchableOpacity
				className="mx-5 mt-2 items-center rounded-xl bg-accent px-6 py-3 active:opacity-70"
				onPress={() => router.push("/sign-up")}
			>
				<Text className="font-semibold text-accent-foreground">Sign up</Text>
			</TouchableOpacity>

			<MetaPill
				icon="flame"
				label="hot"
				className="m-5 bg-danger/85 text-white"
			/>

			<View className="ml-5 flex-row flex-wrap gap-2">
				{categories.map((item) => (
					<Chip
						key={item.label}
						label={item.label}
						icon={item.icon}
						selected={selected.includes(item.label)}
						onPress={() => toggle(item.label)}
						className=""
					/>
				))}
			</View>

			<Text className="mb-2 text-foreground text-sm">Pace</Text>
			<SegmentControl options={PACES} value={pace} onChange={setPace} />

			<FieldRow
				icon="location-outline"
				label="City"
				value="Kuala Lumpur"
				locked
			/>

			<FieldRow
				icon="calendar-outline"
				label="Start date"
				value="Sun, 18 Oct"
			/>

			<FieldRow icon="time-outline" label="Days" value="1 to 7" />

			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerClassName="gap-2 px-4"
			>
				{days.map((d, i) => (
					<Day
						key={d.date}
						weekday={d.weekday}
						date={d.date}
						selected={i === activeDay}
						onPress={() => setActiveDay(i)}
					/>
				))}
			</ScrollView>

			<ItemCard
				startTime="11:30 am"
				category="food"
				description="Kaya toast and kopi at a kopitiam open since 1928."
				done={done}
				durationMin={60}
				onToggle={() => setDone(!done)}
				title="Feast"
				className="mt-2"
			/>

			<ItemCard
				startTime="11:30 am"
				category="food"
				description="Kaya toast and kopi at a kopitiam open since 1928."
				done={done}
				durationMin={60}
				onToggle={() => setDone(!done)}
				title="Feast"
				isNext
				className="mt-2"
			/>

			<PrimaryButton
				label="Build my trip"
				onPress={() => {}}
				className="mt-2"
			/>

			<ScreenHeader
				title="Plan a trip"
				eyebrow="Kuala Lumpur"
				onBack={() => {}}
				right
			/>
		</Container>
	);
}
