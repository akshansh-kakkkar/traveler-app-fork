import { createFileRoute } from "@tanstack/react-router";
import AccountSettings from "@/components/Profile/AccountSettings";
import ProfileDetails from "@/components/Profile/ProfileDetails";
import ProfileHeader from "@/components/Profile/ProfileHeader";
import ProfileTrips from "@/components/Profile/ProfileTrips";
import { useCurrentUser } from "@/hooks/use-current-user";
import EditProfile from "@/components/Profile/EditProfile";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import TravelStats from "@/components/Profile/TravelStats";

export const Route = createFileRoute("/_auth/profile")({
	component: RouteComponent,
});

function RouteComponent() {
	const { user, isPending } = useCurrentUser();
	const tripsQuery = useQuery(trpc.trips.getAll.queryOptions());
	const trips = tripsQuery.data ?? [];
	const now = new Date();
	const completedTrips = trips.filter(
		(trip)=> trip.endDate && new Date(trip.endDate) < now, 
	).length;
	const upcomingTrips  = trips.filter(
		(trip) => trip.startDate && new Date(trip.startDate) > now 
	).length;

	const totalStops = trips.reduce((total, trip)=> total + trip.stops, 0)
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
			{!tripsQuery.isPending && !tripsQuery.isError && (
				<TravelStats 
				totalTrips={trips.length}
				completedTrips={completedTrips}
				upcomingTrips={upcomingTrips}
				totalStops={totalStops}/>
			)}
			<ProfileDetails email={user.email} name={user.name} />
			<ProfileTrips />
			<EditProfile name={user.name} />
		
			<AccountSettings />
		</div>
	);
}
