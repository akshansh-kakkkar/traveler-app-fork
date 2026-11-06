import { createFileRoute } from "@tanstack/react-router";
import AccountSettings from "@/components/Profile/AccountSettings";
import ProfileDetails from "@/components/Profile/ProfileDetails";
import ProfileHeader from "@/components/Profile/ProfileHeader";
import ProfileTrips from "@/components/Profile/ProfileTrips";
import { useCurrentUser } from "@/hooks/use-current-user";

export const Route = createFileRoute("/_auth/profile")({
	component: RouteComponent,
});

function RouteComponent() {
	const { user, isPending } = useCurrentUser();

	if (isPending) {
		return <div className="p-10">Loading profile...</div>;
	}

	if (!user) {
		return <div className="p-10">Unable to Load Profile</div>;
	}
	return (
		<div className="flex min-h-screen flex-col gap-2 bg-[#E4EFE2] p-10 text-[#12271A]">
			<div>
				<h1 className="mb-2 font-bold text-3xl">Profile</h1>
				<p className="mb-8 text-[#6C776D]">Manage Traveler account.</p>
			</div>
			<ProfileHeader name={user.name} email={user.email} image={user.image} />
			<ProfileDetails email={user.email} name={user.name} />
			<ProfileTrips />
			<AccountSettings />
		</div>
	);
}
