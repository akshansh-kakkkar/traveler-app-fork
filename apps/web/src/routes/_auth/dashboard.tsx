import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import DashboardSideBar from "@/components/Dashboard/DashboardSideBar";
import { trpc } from "@/utils/trpc";

export const Route = createFileRoute("/_auth/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	const { session } = Route.useRouteContext();

	const privateData = useQuery(trpc.privateData.queryOptions());
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
						Welcome Back {session.data?.user.name},
					</div>
					<div className="font-medium text-[#6C776D] text-sm">
						Plan your Trip today with TourNet
					</div>
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
