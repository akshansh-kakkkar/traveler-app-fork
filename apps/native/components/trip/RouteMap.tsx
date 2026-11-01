import { useThemeColor } from "heroui-native";
import { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import MapView, { Polyline } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { RoutePin } from "@/lib/itinerary-days";

const TOP_CHROME = 72; // the back btn
const SIDE_PADDING = 48;
const ROUTE_WIDTH = 4;

type Props = {
	pins: readonly RoutePin[];
	bottomInset: number;
	isInteractive?: boolean;
};

const KL_REGION = {
	latitude: 3.1478,
	longitude: 101.6953,
	latitudeDelta: 0.08,
	longitudeDelta: 0.08,
};

export default function RouteMap({ pins, bottomInset, isInteractive }: Props) {
	const [isReady, setIsReady] = useState(false);
	const insets = useSafeAreaInsets();
	const mapRef = useRef<MapView>(null);
	const routeColor = useThemeColor("foreground");

	useEffect(() => {
		if (!isReady || pins.length === 0) return;

		mapRef.current?.fitToCoordinates(
			pins.map(({ latitude, longitude }) => ({ latitude, longitude })),
			{
				edgePadding: {
					top: insets.top + TOP_CHROME,
					right: SIDE_PADDING,
					bottom: bottomInset + SIDE_PADDING,
					left: SIDE_PADDING,
				},
				animated: true,
			},
		);
	}, [isReady, pins, bottomInset, insets.top]);

	return (
		<MapView
			ref={mapRef}
			style={{ flex: 1 }}
			initialRegion={KL_REGION}
			onMapReady={() => setIsReady(true)}
			showsPointsOfInterests={false}
			toolbarEnabled={false}
			scrollEnabled={isInteractive}
			zoomEnabled={isInteractive}
			rotateEnabled={isInteractive}
			pitchEnabled={isInteractive}
			userInterfaceStyle="light"
		>
			{pins.length > 1 && (
				<Polyline
					coordinates={pins.map(({ latitude, longitude }) => ({
						latitude,
						longitude,
					}))}
					strokeColor={routeColor}
					strokeWidth={ROUTE_WIDTH}
				/>
			)}
		</MapView>
	);
}
