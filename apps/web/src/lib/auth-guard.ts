import { authClient } from "./auth-client";
import { redirect } from "@tanstack/react-router";

export async function requireAuth() {
	const { data: session, error } = await authClient.getSession();

	if (error || !session?.user) {
		throw redirect({
			to: "/login",
		});
	}

	return { user: session.user }

}