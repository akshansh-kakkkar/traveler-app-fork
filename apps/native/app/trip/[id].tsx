import { router, Stack, useLocalSearchParams } from "expo-router";
import { TripMapScreen } from "@/components/trip/TripMapScreen";

function parseDay(value: string | undefined): number | undefined {
	const day = Number(value);
	return value !== undefined && Number.isInteger(day) && day >= 0
		? day
		: undefined;
}

export default function TripDetail() {
	const { id, day } = useLocalSearchParams<{ id: string; day?: string }>();

	return (
		<>
			<Stack.Screen options={{ headerShown: false }} />
			<TripMapScreen
				tripId={id}
				initialDay={parseDay(day)}
				onBack={() => router.back()}
				onDeleted={() => router.back()}
			/>
		</>
	);
}
