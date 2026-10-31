import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, MapPinIcon } from "lucide-react";
import { trpc } from "@/utils/trpc";

export const Route = createFileRoute("/_auth/trips/$tripId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { tripId } = Route.useParams();
	const tripsQuery = useQuery(
		trpc.trips.getOne.queryOptions({
			id: tripId,
		}),
	);
	if (tripsQuery.isPending) {
		return (
			<main className="min-h-screen bg-[#E4EFE2] p-8">
				<div className="mx-auto max-w-4xl animate-pulse space-y-4">
					<div className="h-5 w-28 rounded bg-[#cad7C8]" />
					<div className="h-12 w-2/3 rounded bg-[#CAD7C8]" />
					<div className="h-40 rounded-2xl bg-[#CAD7C8]" />
				</div>
			</main>
		);
	}

	if (tripsQuery.isError || !tripsQuery.data) {
		return (
			<main className="flex min-h-screen items-center justify-center bg-[#E4EFE2] p-6 text-[#12271A]">
				<div className="max-w-md text-center">
					<h1 className="font-semibold text-2xl">Trip not found</h1>
					<p className="mt-22 text-[#738076] text-sm">
						This trip may not exist or you may not have access to it.
					</p>
					<Link
						to="/trips"
						className="mt-5 inline-flex items-center gap-px rounded-xl bg-[#12271A] px-5 py-3 text-white"
					>
						<ArrowLeft size={17} />
					</Link>
				</div>
			</main>
		);
	}

	const trip = tripsQuery.data;

	return (
		<div className="min-h-screen bg-[#E4EfE2] px-10 py-10 text-[#12271A]">
			<div className="mx-auto max-w-5xl">
				<Link
					to="/trips"
					className="flex items-center gap-2 text-[#607565] text-sm transition hover:text-[#12271A]"
				>
					<ArrowLeft size={17} />
					All trips
				</Link>
				<div className="mt-10 border-[#CAD7C8] border-b pb-8">
					<p className="font-semibold text-[#748076] text-xs uppercase tracking-tight">
						Your journey
					</p>
					<h1>
						{trip.name}
						<span className="text-[#7A9B70]">.</span>
					</h1>
					<p className="mt-4 max-w-2xl whitespace-pre-wrap text-[#607565] text-sm leading-7">
						{trip.description || "No description added yet."}
					</p>
				</div>
				<div className="mt-8 grid grid-cols-2 gap-4">
					<div className="borrder borrder-[#D7E1D4] rounded-2xl bg-white p-6">
						<div className="flex items-center gap-2 text-[#738076] text-sm">
							<CalendarDays size={18} />
							Travel dates
						</div>
						<p className="mt-4 font-medium">
							{trip.startDate
								? new Date(trip.startDate).toLocaleDateString()
								: "Start date not set"}
						</p>
						<p>
							{trip.endDate
								? `Until ${new Date(trip.endDate).toLocaleDateString()}`
								: "End Date not set"}
						</p>
					</div>
					<div className="rounded-2xl border border-[#D7E1D4] bg-white p-6">
						<div className="flex items-center gap-2 text-[#738076] text-sm">
							<MapPinIcon size={18} />
							Itinerary
						</div>
						<p className="mt-4 font-medium">Ready to start planning?</p>
						<p className="mt-1 text-[#738076] text-sm">
							Your actvities and places can be organized here next.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
