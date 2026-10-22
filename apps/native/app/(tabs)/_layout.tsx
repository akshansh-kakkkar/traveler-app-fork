import { Ionicons } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import { cn, useThemeColor } from "heroui-native";
import { Pressable, View } from "react-native";
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

	// const { data: session, isPending } = authClient.useSession();
	// if (isPending) return <ActivityIndicator />;
	// if (!session) return <Redirect href="/(auth)/sign-in" />;

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
				name="create"
				options={{ tabBarButton: () => <CreateButton /> }}
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
			<Tabs.Screen
				name="profile"
				options={{
					title: "My profile",
					tabBarIcon: ({ focused }) => (
						<TabIcon
							name="person-outline"
							focusedName="person"
							focused={focused}
						/>
					),
				}}
			/>
		</Tabs>
	);
}

function CreateButton() {
	const { data: session } = authClient.useSession();
	const inkColor = useThemeColor("accent-foreground");

	return (
		<View className="flex-1 items-center">
			<Pressable
				onPress={() => router.push(session ? "/plan" : "/(auth)/sign-in")}
				className="-mt-4.5 h-18 w-18 items-center justify-center rounded-full bg-accent shadow-lg active:opacity-80"
			>
				<Ionicons name="add-outline" size={34} color={inkColor} />
			</Pressable>
		</View>
	);
}
