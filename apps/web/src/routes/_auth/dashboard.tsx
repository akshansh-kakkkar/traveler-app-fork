import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { trpc } from "@/utils/trpc";
import { useState } from "react";
import DashboardSideBar from "@/components/Dashboard/DashboardSideBar";

export const Route = createFileRoute("/_auth/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	const { session } = Route.useRouteContext();

	const privateData = useQuery(trpc.privateData.queryOptions());
	const [isSideBarExpanded, setIsSideBarExpanded] = useState(false);
	return (
		<div className="bg-[#E4EFE2] relative flex h-screen">
			<>
				<DashboardSideBar onExpandedChange={setIsSideBarExpanded} />
			</>
			<div className={`${isSideBarExpanded ? "ml-80" : "ml-30"} my-12 w-full transition-all duration-300 ease-in-out`}>
				<div className="flex flex-col gap-1">
					<div className="text-2xl text-[#12271A] font-bold">Welcome Back {session.data?.user.name},</div>
					<div className="text-sm font-medium text-[#6C776D]">Plan your Trip today with TourNet</div>
				</div>
				<div className="flex w-full justify-center text-center ">
				<Link to={"/create-trip"} className="bg-[#12271A] cursor-pointer duration-300 transition-all hover:scale-95 w-full mx-12 my-4 text-4xl uppercase font-bold py-24 rounded-2xl"> 
					Plan a Trip
				</Link>
				</div>
			</div>
		</div>
	);
}