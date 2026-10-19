import { router } from "expo-router";
import { Spinner } from "heroui-native";
import { View } from "react-native";
import { Container } from "@/components/container";
import { FieldRow } from "@/components/ui/FieldRow";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ScreenHeader } from "@/components/ui/ScreenHeader";
import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/utils/trpc";

type User = typeof authClient.$Infer.Session.user;

export default function Profile() {
	const { data: session, isPending } = authClient.useSession();
	if (isPending) return <Spinner />;

	return (
		<Container contentClassName="p-6">
			<ScreenHeader title="Profile" />
			{session ? <SignedIn user={session.user} /> : <SignedOut />}
		</Container>
	);
}

function SignedIn({ user }: { user: User }) {
	return (
		<View>
			<FieldRow icon="person" label="Welcome" value={user.name} />
			<PrimaryButton
				label="Sign out"
				onPress={async () => {
					await authClient.signOut();
					queryClient.clear();
				}}
			/>
		</View>
	);
}

function SignedOut() {
	return (
		<View>
			<PrimaryButton
				label="Sign in"
				onPress={() => router.push("/(auth)/sign-in")}
			/>
		</View>
	);
}
