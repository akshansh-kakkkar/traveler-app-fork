import "@/global.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { HeroUINativeProvider, useThemeColor } from "heroui-native";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { AppThemeProvider } from "@/contexts/app-theme-context";
import { queryClient } from "@/utils/trpc";

export const unstable_settings = {
	initialRouteName: "(tabs)",
};

function StackLayout() {
	const backgroundColor = useThemeColor("background");

	return (
		<View style={{ flex: 1, backgroundColor }}>
			<StatusBar style="light" />
			<Stack
				screenOptions={{
					contentStyle: { backgroundColor },
					statusBarStyle: "dark",
				}}
			>
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
				<Stack.Screen
					name="modal"
					options={{ title: "Modal", presentation: "modal" }}
				/>
				<Stack.Screen
					name="(auth)"
					options={{ headerShown: false, presentation: "modal" }}
				/>
				<Stack.Screen
					name="plan"
					options={{
						headerShown: false,
						presentation: "modal",
						animation: "slide_from_bottom",
					}}
				/>
			</Stack>
		</View>
	);
}

export default function Layout() {
	return (
		<QueryClientProvider client={queryClient}>
			<GestureHandlerRootView style={{ flex: 1 }}>
				<KeyboardProvider>
					<AppThemeProvider>
						<HeroUINativeProvider>
							<StackLayout />
						</HeroUINativeProvider>
					</AppThemeProvider>
				</KeyboardProvider>
			</GestureHandlerRootView>
		</QueryClientProvider>
	);
}
