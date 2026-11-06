import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, CalendarDays, Compass } from "lucide-react";
import { trpc } from "@/utils/trpc";
export default function ProfileTrips() {
	const tripsQuery = useQuery(trpc.trips.getAll.queryOptions());
	const trips = tripsQuery.data ?? [];

	return (
		<section className="rounded-2xl border border-[#D1DCCF] bg-white p-6">
			<div className="mb-6 flex items-center justify-between">
				<div>
					<h2 className="font-bold text-[#12271A] text-lg">My Trips</h2>
					<p className="mt-1 text-[#6C776D] text-sm">Your saved travel plans</p>
				</div>

				<span className="rounded-full bg-[#E4EFE2] px-3 py-1 font-semibold text-[#42644] text-sm">
					{trips.length} {trips.length === 1 ? "Trip" : "Trips"}
				</span>
			</div>

			{tripsQuery.isPending && (
				<p className="text-[#6C776D] text-sm">Loading you trips...</p>
			)}
			{tripsQuery.isError && (
				<p className="text-red-600 text-sm">Unable to load your trips.</p>
			)}
			{!tripsQuery.isPending && !tripsQuery.isError && trips.length === 0 && (
				<div className="flex flex-col items-center py-8 text-center">
					<Compass size={32} className="text-[#829084]" />
					<p className="mt-3 font-medium text-[#12271A]">No trips yet</p>
					<p className="mt-1 text-[#6C776D] text-sm">
						Your travel plans will appear here.
					</p>
				</div>
			)}

			<div className="space-y-3">
				{trips.slice(0, 3).map((trip) => (
					<Link
						key={trip.id}
						to="/trips/$tripId"
						params={{ tripId: trip.id }}
						className="flex items-center justify-between rounded-xl border border-[#E1E8DE] p-4 transition hover:bg-[#F5F8F2]"
					>
						<div className="min-w-0">
							<h3 className="font-semibold text-[#12271A]">{trip.name}</h3>
							<div className="mt-2 flex items-center gap-2 text-[#6C776D] text-xs">
								<CalendarDays size={14} />
								<span>
									{trip.startDate
										? new Date(trip.startDate).toLocaleDateString()
										: "Date note set"}
								</span>
							</div>
						</div>
						<ArrowUpRight size={18} className="shrink-0 text-[#829084]" />
					</Link>
				))}
			</div>

			{trips.length > 3 && (
				<Link
					to={"/trips"}
					className="mt-5 block text-center font-semibold text-[#426449] text-sm"
				>
					View all trips
				</Link>
			)}
		</section>
	);
}
