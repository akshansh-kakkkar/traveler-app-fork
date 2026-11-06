import { waitForDebugger } from "node:inspector";
import { useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function AccountSettings() {
	const navigate = useNavigate();
	const handleSignOut = async () => {
		const { error } = await authClient.signOut();

		if (error) {
			toast.error("Failed to sign out.");
			return;
		}

		toast.success("Signed out successfully.");
		await navigate({ to: "/login" });
	};
	return (
		<section className="rounded-2xl border border-[#D1Dccf] bg-white p-6">
			<h2 className="mb-4 font-bold text-[#12271A] text-lg">
				Account Settings
			</h2>
			<button
				onClick={handleSignOut}
				type="button"
				className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 font-medium text-red-600 transition hover:bg-red-50"
			>
				<LogOut size={18} />
				SignOut
			</button>
		</section>
	);
}
