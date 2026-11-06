import { authClient } from "@/lib/auth-client";

export function useCurrentUser() {
	const session = authClient.useSession();
	return {
		user : session.data?.user ?? null,
		isPending : session.isPending,
		isAuthenticated : !!session.data?.user,
	}
}