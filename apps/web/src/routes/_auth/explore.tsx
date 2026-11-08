import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Bug } from "lucide-react";

export const Route = createFileRoute("/_auth/explore")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex h-screen items-center justify-center bg-[#E4EFE2] text-center">
			<div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white p-8 text-center text-[#12271A] shadow-sm">
				<div className="flex w-fit rounded-xl bg-[#E4EFE2] p-2">
					<Bug size={32} />
				</div>
				<div className="font-medium text-xl">Work under Progress</div>
				<Link
					to="/dashboard"
					className="flex w-full items-center gap-2 rounded-xl bg-[#12271A] py-2 text-white transition-all duration-300 hover:scale-[90%]"
				>
					<div className="flex w-full items-center justify-center gap-4">
						<span>
							<ArrowLeft size={24} />
						</span>
						<span className="font-medium text-lg">Go Back</span>
					</div>
				</Link>
			</div>
		</div>
	);
}
