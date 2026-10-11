import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { authClient } from "@/lib/auth-client";

export default function Home() {
	const { data: session } = authClient.useSession();
	return (
		<View>
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
		</View>
	);
}
