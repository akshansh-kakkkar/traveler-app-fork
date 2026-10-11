import "@/global.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { HeroUINativeProvider } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { AppThemeProvider } from "@/contexts/app-theme-context";
import { queryClient } from "@/utils/trpc";

export const unstable_settings = {
	initialRouteName: "(tabs)",
};

function StackLayout() {
	return (
		<Stack screenOptions={{}}>
			<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
			<Stack.Screen
				name="modal"
				options={{ title: "Modal", presentation: "modal" }}
			/>
			<Stack.Screen
				name="(auth)"
				options={{ headerShown: false, presentation: "modal" }}
			/>
		</Stack>
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
