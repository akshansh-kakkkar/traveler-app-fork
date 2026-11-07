import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import DashboardSideBar from "@/components/Dashboard/DashboardSideBar";
import AccountSettings from "@/components/Profile/AccountSettings";
import EditProfile from "@/components/Profile/EditProfile";
import MonthlTripChart from "@/components/Profile/MonthlyTripsChart";
import ProfileDetails from "@/components/Profile/ProfileDetails";
import ProfileHeader from "@/components/Profile/ProfileHeader";
import ProfileTrips from "@/components/Profile/ProfileTrips";
import TravelStats from "@/components/Profile/TravelStats";
import { useCurrentUser } from "@/hooks/use-current-user";
import { trpc } from "@/utils/trpc";
import TripStatusCart from "@/components/Profile/TripStatusChart"
export const Route = createFileRoute("/_auth/profile")({
	component: RouteComponent,
});

function RouteComponent() {
	const { user, isPending } = useCurrentUser();
	const tripsQuery = useQuery(trpc.trips.getAll.queryOptions());
	const trips = tripsQuery.data ?? [];

	const now = new Date();
	const [isSideBarExpanded, setIsSideBarExpanded] = useState(false);
	const completedTrips = trips.filter(
		(trip) => trip.endDate && new Date(trip.endDate) < now,
	).length;
	const upcomingTrips = trips.filter(
		(trip) => trip.startDate && new Date(trip.startDate) > now,
	).length;

	const totalStops = trips.reduce((total, trip) => total + trip.stops, 0);
	if (isPending) {
		return <div className="p-10">Loading profile...</div>;
	}

	if (!user) {
		return <div className="p-10">Unable to Load Profile</div>;
	}

	const monthlyTrips = Array.from({ length: 6 }, (_, index) => {
		const date = new Date();
		date.setDate(1);
		date.setMonth(date.getMonth() - (5 - index));
		const month = date.toLocaleDateString("en-US", {
			month: "short",
		});
		const tripsCount = trips.filter((trip) => {
			const createdAt = new Date(trip.createdAt);
			return (
				createdAt.getMonth() === date.getMonth() &&
				createdAt.getFullYear() === date.getFullYear()
			);
		}).length;

		return {
			month,
			trips: tripsCount,
		};
	});

	const ongoingTrips = trips.filter(
		(trip) => trip.startDate && trip.endDate && new Date(trip.startDate) <= now && 
		new Date(trip.endDate) >= now
	).length

	return (
		<div className="relative flex h-screen bg-[#E4EFE2]">
			<DashboardSideBar onExpandedChange={setIsSideBarExpanded} />
			<div
				className={`${isSideBarExpanded ? "ml-80" : "ml-30"} my-12 flex min-h-0 w-full min-w-0 flex-col gap-4 overflow-y-auto pr-8 transition-all duration-300 ease-in-out`}
			>
				<div className="relative flex flex-col gap-2 bg-[#E4EFE2] text-[#12271A]">
					<h1 className="mb-2 font-bold text-3xl">Profile</h1>
					<p className="mb-8 text-[#6C776D]">Manage Traveler account.</p>
				</div>
				<ProfileHeader name={user.name} email={user.email} image={user.image} />
				<MonthlTripChart data={monthlyTrips} />
			  <TripStatusCart
				completed={completedTrips}
				upcoming={upcomingTrips}
				onGoing={ongoingTrips} />
				{!tripsQuery.isPending && !tripsQuery.isError && (
					<TravelStats
						totalTrips={trips.length}
						completedTrips={completedTrips}
						upcomingTrips={upcomingTrips}
						totalStops={totalStops}
					/>
				)}
				<ProfileDetails email={user.email} name={user.name} />
				<ProfileTrips />
				<EditProfile name={user.name} />

				<AccountSettings />
			</div>
		</div>
	);
}
