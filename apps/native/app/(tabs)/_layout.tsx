import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { cn, useThemeColor } from "heroui-native";
import { ActivityIndicator, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { authClient } from "@/lib/auth-client";
import { TAB_BAR_GAP, TAB_BAR_HEIGHT } from "@/lib/tab-bar";

type IconName = keyof typeof Ionicons.glyphMap;

function TabIcon({
	name,
	focusedName,
	focused,
}: {
	name: IconName;
	focusedName: IconName;
	focused: boolean;
}) {
	const inkColor = useThemeColor("accent-foreground"); // dark ink on lime
	const inactiveColor = useThemeColor("background"); // sage on the dark bar

	return (
		<View
			className={cn(
				"h-12 w-12 items-center justify-center rounded-full",
				focused && "bg-accent",
			)}
		>
			<Ionicons
				name={focused ? focusedName : name}
				size={22}
				color={focused ? inkColor : inactiveColor}
			/>
		</View>
	);
}

export default function TabLayout() {
	const themeColorForeground = useThemeColor("foreground");
	const themeColorBackground = useThemeColor("background");

	const insets = useSafeAreaInsets();

	const { data: session, isPending } = authClient.useSession();
	if (isPending) return <ActivityIndicator />;
	if (!session) return <Redirect href="/(auth)/sign-in" />;

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarShowLabel: false,
				sceneStyle: {
					backgroundColor: themeColorBackground,
				},
				tabBarStyle: {
					position: "absolute",
					marginHorizontal: 20,
					bottom: insets.bottom + TAB_BAR_GAP,
					height: TAB_BAR_HEIGHT,
					borderRadius: TAB_BAR_HEIGHT / 2,
					backgroundColor: themeColorForeground,
					borderTopWidth: 0,
					paddingTop: 13,
					paddingBottom: 0,
					elevation: 8,
				},
				tabBarItemStyle: { height: TAB_BAR_HEIGHT },
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ focused }) => (
						<TabIcon name="home-outline" focusedName="home" focused={focused} />
					),
				}}
			/>
			<Tabs.Screen
				name="discover"
				options={{
					title: "Discover",
					tabBarIcon: ({ focused }) => (
						<TabIcon
							name="compass-outline"
							focusedName="compass"
							focused={focused}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="plan"
				options={{
					title: "Itinerary",
					tabBarIcon: ({ focused }) => (
						<TabIcon
							name="calendar-outline"
							focusedName="calendar"
							focused={focused}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="trips"
				options={{
					title: "My trips",
					tabBarIcon: ({ focused }) => (
						<TabIcon name="list-outline" focusedName="list" focused={focused} />
					),
				}}
			/>
		</Tabs>
	);
}
