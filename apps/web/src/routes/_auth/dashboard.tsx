import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { trpc } from "@/utils/trpc";
import DashboardSideBar from "@/components/Dashboard/DashboardSideBar";

export const Route = createFileRoute("/_auth/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	const { session } = Route.useRouteContext();

	const privateData = useQuery(trpc.privateData.queryOptions());

	return (
		<div className="bg-[#E4EFE2] relative flex h-screen">
<>
			<DashboardSideBar />
			</>
			<h1 className="ml-70">Dashboard</h1>
		</div>
	);
}
