import { Text, View } from "react-native";

type Props = {
	trips: number;
	stops: number;
	comingUp: number;
};

export default function TripStats({ trips, stops, comingUp }: Props) {
	return (
		<View className="flex-row rounded-3xl bg-foreground py-4">
			<Stat value={trips} label={trips === 1 ? "Trip" : "Trips"} />
			<Divider />
			<Stat
				value={stops}
				label={stops === 1 ? "Stop planned" : "Stops planned"}
			/>
			<Divider />
			<Stat value={comingUp} label="Coming up" />
		</View>
	);
}

function Stat({ value, label }: { value: number; label: string }) {
	return (
		<View className="flex-1 items-center">
			<Text className="font-bold text-2xl text-background">{value}</Text>
			<Text className="text-background/70 text-xs">{label}</Text>
		</View>
	);
}

function Divider() {
	return <View className="w-px bg-background/20" />;
}
