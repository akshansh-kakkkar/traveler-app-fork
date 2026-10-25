import DashboardSideBar from '@/components/Dashboard/DashboardSideBar'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';

export const Route = createFileRoute('/_auth/create-trip')({
	component: RouteComponent,
})

function RouteComponent() {
	const [isSideBarExpanded, setIsSideBarExpanded] = useState(false);

	return (
		<div className="bg-[#E4EFE2] relative flex h-screen">
			<>
				<DashboardSideBar onExpandedChange={setIsSideBarExpanded} />
			</>
			<div className={`${isSideBarExpanded ? "ml-80" : "ml-30"} rounded-2xl p-6 mx-12 my-12 w-full transition-all duration-300 ease-in-out bg-[#CFE84A]/45`}>
d
			</div>
		</div>
	)
}
