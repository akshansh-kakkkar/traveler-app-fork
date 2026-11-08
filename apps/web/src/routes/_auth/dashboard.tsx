import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import DashboardSideBar from "@/components/Dashboard/DashboardSideBar";
import { trpc } from "@/utils/trpc";

export const Route = createFileRoute("/_auth/dashboard")({
	component: RouteComponent,
});

function getGreeting(){
	const hour = new Date().getHours();

	if(hour >= 5 && hour < 12) return "Good morning";
	if(hour >= 12 && hour < 17) return "Good afternoon";
	if(hour >= 17 && hour < 21) return "Good evening";

	return "Good night"
}

function getFormattedDate(){
	return new Intl.DateTimeFormat("en-IN", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
	}).format(new Date());
}

function RouteComponent() {
	const { session } = Route.useRouteContext();	
	const privateData = useQuery(trpc.privateData.queryOptions());
	const tripsQuery =  useQuery(trpc.trips.getAll.queryOptions());
	const totalTrips = tripsQuery.data?.length ?? 0;

	const [isSideBarExpanded, setIsSideBarExpanded] = useState(false);
	return (
		<div className="relative flex h-screen bg-[#E4EFE2]">
			<>
				<DashboardSideBar onExpandedChange={setIsSideBarExpanded} />
			</>
			<div
				className={`${isSideBarExpanded ? "ml-80" : "ml-30"} my-12 w-full transition-all duration-300 ease-in-out`}
			>
				<div className="flex flex-col gap-1">
					<div className="font-bold text-2xl text-[#12271A]">
						{getGreeting()} {session.data?.user.name},
					</div>
					<div className="font-medium text-[#6C776D] text-sm">
						Plan your Trip today with TourNet
						<span className="mx-2">.</span>
						{getFormattedDate()}
					</div>
				</div>
				<div className="mx-12 mt-8 rounded-2xl bg-white p-6 shadow-sm	">
					<p className="text-sm font-medium text-[#6C776D]">
						Your planned trips
					</p>
					<p className="mt-2 font-bold text-4xl text-[#12271A]">
						{tripsQuery.isPending ? "..." : totalTrips}
					</p>
				</div>
				<div className="flex w-full justify-center text-center">
					<Link
						to={"/create-trip"}
						className="inset-0 mx-12 my-4 flex w-full cursor-pointer items-center justify-center gap-8 rounded-2xl bg-[#12271A] py-24 text-center font-bold text-4xl uppercase transition-all duration-300 hover:-translate-y-1 hover:scale-99"
					>
						Plan a Trip
						<span>
							<Plus size={36} strokeWidth={4} />
						</span>
					</Link>
				</div>
			</div>
		</div>
	);
}
