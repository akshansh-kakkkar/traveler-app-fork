import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
	ArrowUpRight,
	CalendarDays,
	Compass,
	MapPin,
	Plus,
	RefreshCw,
	Search,
} from "lucide-react";
import { useState } from "react";
import DashboardSideBar from "@/components/Dashboard/DashboardSideBar";
import { trpc } from "@/utils/trpc";
export const Route = createFileRoute("/_auth/trips/")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const [search, setSearch] = useState("");
	const [sideBarPinned, setSideBarPinned] = useState(false);
	const tripsQuery = useQuery(trpc.trips.getAll.queryOptions());
	const trips = tripsQuery.data ?? [];
	const filteredTrips = trips.filter((trip) =>
		trip.name.toLowerCase().includes(search.trim().toLowerCase()),
	);

	return (
		<div className="relative flex h-screen bg-[#E4EFE2]">
			<DashboardSideBar onExpandedChange={setSideBarPinned} />
			<div
				className={`${sideBarPinned ? "ml-80" : "ml-30"} my-12 w-full text-[#12271A] transition-all duration-300 ease-in-out`}
			>
				<div className="mx-auto max-w-7xl">
					<header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
						<div>
							<p className="flex-row items-end justify-between gap-5 font-semibold text-[#738076] text-xs">
								Your Collection
							</p>
							<h1 className="mt-2 font-semibold text-4xl text-[#12271A] tracking-tight">
								My Trips<span className="text-[#7A9B70]">.</span>
							</h1>
							<p className="mt-3 max-w-lg text-[#738076] text-sm leading-6">
								Every journey starts. somewhere. Keep your plans organized in
								one place.
							</p>
						</div>
						<button
							type="button"
							onClick={() => navigate({ to: "/create-trip" })}
							className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#CFE84A] px-5 py-3 font-semibold text-[#17291E] transition hover:bg-[#BFE02F] focus-visible:outline-2 focus-visible:outline-[#69816D] focus-visible:outline-offset-2"
						>
							<Plus size={19} />
							Create Trip
						</button>
					</header>

					<div className="mt-10">
						<div className="flex flex-row items-center justify-between gap-4 border-[#DDE4D9] pb-5">
							<div>
								<h2 className="font-semibold text-[#12271A] text-lg">
									All Journeys
								</h2>
								<p className="mt-1 text-[#738076] text-sm">
									{trips.length} {trips.length === 1 ? "trip" : "trips"} in your
									collection
								</p>
							</div>
						</div>
						<label className="flex w-full max-w-xs items-center gap-3 rounded-xl border border-[#DDE4D9] bg-white px-4 py-3">
							<Search size={18} className="shrink-0 text-[#829084]" />
							<input
								value={search}
								onChange={(event) => setSearch(event.target.value)}
								placeholder="Search your trips..."
								aria-label="Search trips"
								className="min-w-0 flex-1 bg-transparent text-[#12271A] text-sm outline-none placeholder:text-[#9AA69B]"
							/>
						</label>
					</div>
					{tripsQuery.isPending && (
						<div className="grid grid-cols-3 gap-5 py-8">
							{[1, 2, 3].map((item) => (
								<div
									key={item}
									className="h-56 animate-pulse rounded-2xl border border-[#E1E7DE] bg-white"
								/>
							))}
						</div>
					)}
					{tripsQuery.isError && (
						<div className="b order mt-8 rounded-2xl border-red-200 bg-white p-8 text-center">
							<h3 className="font-semibold">Couldn't load your trips</h3>
							<p className="mt-2 text-[#738076] text-sm">
								Something went wrong while fetching your trips.
							</p>
							<button
								type="button"
								onClick={() => void tripsQuery.refetch()}
								className="hover:bg-[#F6F7F1] mt-5 inline-flex items-center gap-2 rounded-lg border border-[#DDE4D9] px-4 py-2 font-medium text-sm"
							>
								<RefreshCw size={15} />
							</button>
						</div>
					)}

					{!tripsQuery.isPending &&
						!tripsQuery.isError &&
						filteredTrips.length === 0 && (
							<div className="mt-8 flex min-h-72 flex-col items-center justify-center rounded-2xl border border-[#CAD7C8] border-dashed bg-white/60 px-6 py-12 text-center">
								<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E7EEDF]">
									{search ? (
										<Search size={24} className="text-[#55735A]" />
									) : (
										<Compass size={24} className="text-[#55735A]" />
									)}
								</div>
								<h3 className="mt-5 font-semibold text-lg">
									{search
										? "No matching trips"
										: "Your next chapter starts here"}
								</h3>
								<p className="mt-2 max-w-sm text-[#738076] text-sm leading-6">
									{search
										? "Try another search term to find your trip"
										: "Create your first trip and bring your travel plans together in one place."}
								</p>
								{!search && (
									<button
										type="button"
										onClick={() => navigate({ to: "/create-trip" })}
										className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#17291E] px-5 py-3 font-semibold text-sm text-white transition hover:bg-[#294735]"
									>
										<Plus />
										Create your first trip
									</button>
								)}
							</div>
						)}
				</div>
				{!tripsQuery.isPending &&
					!tripsQuery.isError &&
					filteredTrips.length > 0 && (
						<div className="mt-6 grid grid-cols-3 gap-5">
							{filteredTrips.map((trip) => (
								<Link
									to="/trips/$tripId"
									params={{ tripId: trip.id }}
									key={trip.id}
									className="group hover:border-[#B8CDB5] flex min-h-56 flex-col rounded-2xl border border-[#E0E6DD] bg-white p-6 transition duration-200 hover:-translate-y-1 hover::shadow-lg hover:shadow-[#203B2810]"
								>
									<div className="flex items-start justify-between gap-3">
										<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8EFE3] text-[#426449]">
											<MapPin size={20} />
										</div>
										<ArrowUpRight
											size={19}
											className="text-[#9AA60B] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#426449]"
										/>
									</div>
									<h3 className="mt-6 break-words font-semibold text-xl tracking-tight">
										{trip.name}
									</h3>
									<p className="mt-2 line-clamp-2 flex-1 text-[#748076] text-sm leading-6">
										{trip.description || "No description added yet."}
									</p>
									{(trip.startDate || trip.endDate) && (
										<div className="mt-5 flex items-center gap-2 border-[#EDF0E9] border-t pt-4 text-[#66786A] text-xs">
											<CalendarDays size={15} />
											<span>
												{trip.startDate
													? new Date(trip.startDate).toLocaleDateString(
															undefined,
															{
																day: "numeric",
																month: "short",
																year: "numeric",
																timeZone: "UTC",
															},
														)
													: "Date not set"}

												{trip.endDate
													? new Date(trip.endDate).toLocaleDateString(
															undefined,
															{
																day: "numeric",
																month: "short",
																year: "numeric",
																timeZone: "UTC",
															},
														)
													: "Ongoing"}
											</span>
										</div>
									)}
								</Link>
							))}
						</div>
					)}
			</div>
		</div>
	);
}
