import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
	ArrowUpRight,
	CalendarDays,
	Compass,
	LayoutGrid,
	List,
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

type TripStatus = "upcoming" | "ongoing" | "completed";

function getTripStatus(
	startDate: Date | string | null,
	endDate: Date | string | null,
): TripStatus {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	if (startDate && new Date(startDate) > today) {
		return "upcoming";
	}

	if (endDate && new Date(endDate) < today) {
		return "completed";
	}
	return "ongoing";
}

function RouteComponent() {
	const navigate = useNavigate();
	const [statusFilter, setStatusFilter] = useState<
		"all" | "upcoming" | "ongoing" | "completed"
	>("all");
	const [sortBy, setSortBy] = useState<"recent" | "departure" | "name">("recent");
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [search, setSearch] = useState("");
	const [sideBarPinned, setSideBarPinned] = useState(false);
	const tripsQuery = useQuery(trpc.trips.getAll.queryOptions());
	const trips = tripsQuery.data ?? [];
	const filteredTrips = trips.filter((trip) => {
		const matchesSearch = trip.name
			.toLowerCase()
			.includes(search.trim().toLowerCase());
		const status = getTripStatus(trip.startDate, trip.endDate);
		const matchesStatus = statusFilter === "all" || status === statusFilter;

		return matchesSearch && matchesStatus;
	});
	const sortedTrip = [...filteredTrips].sort((a, b) => {
		switch (sortBy) {
			case "departure":
				return (
					new Date(a.startDate ?? "9999-12-31").getTime() - new Date(b.startDate ?? "9999-12-31").getTime()
				);

			case "name":
				return a.name.localeCompare(b.name);
			case "recent":
			default:
				return (
					new Date(b.updatedAt).getTime() -
					new Date(a.updatedAt).getTime()
				)
		}
	})

	const tripStats = {
		total: trips.length,
		upcoming: trips.filter(
			(trip) => getTripStatus(trip.startDate, trip.endDate) === "upcoming",
		).length,
		ongoing: trips.filter(
			(trip) => getTripStatus(trip.startDate, trip.endDate) === "ongoing",
		).length,
		completed: trips.filter(
			(trip) => getTripStatus(trip.startDate, trip.endDate) === "completed"
		).length
	}

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
						<div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
							{[
								{
									label: "All trips",
									value: tripStats.total,
									icon: Compass,
									color: "bg-[#E8EFE3]"
								},
								{
									label: "Upcoming",
									value: tripStats.upcoming,
									icon: CalendarDays,
									color: "bg-blue-50",
								},
								{
									label: "Ongoing",
									value: tripStats.ongoing,
									icon: MapPin,
									color: "bg-green-50",
								},
								{
									label: "Completed",
									value: tripStats.completed,
									icon: CalendarDays,
									color: "bg-gray-100",
								},
							].map((stat) => {
								const Icon = stat.icon;
								return(
								<div
									key={stat.label}
									className={`rounded-2xl border border-[#DDE4D9] bg-white p-5 transition hover:translate-y-1 hover:shadow-md`}
								>
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm font-medium text-[#738076]">
												{stat.label}
											</p>
											<h3 className="mt-2 text-3xl font-bold text-[#12271A]">
												{stat.value}
											</h3>
										</div>
										<div className={`rounded-xl p-3 ${stat.color}`}>
											<Icon size={22} className="text-[#426449]" />
										</div>
									</div>
								</div>)
})}
							<div className="flex items-center gap-1 rounded-xl border border-[#DDE4D9] bg-white p-1">
								<button
									type="button"
									onClick={() => setViewMode('grid')}
									aria-label="Grid view"
									className={`rounded-lg p-2 ${viewMode === "grid" ? "bg-[#17291E] text-white" : "text-[#738076] hover:bg-[#F1F5ED]"}`}
								>
									<LayoutGrid size={18} />
								</button>
								<button
									type="button"
									onClick={() => setViewMode("list")}
									aria-label="List view"
									className={`rounded-lg p-2 ${viewMode === "list" ? "bg-[#17291E] text-white" : "text-[#738076] hover:bg-[#F1F5ED]"}`}>
									<List size={18} />
								</button>
							</div>
						</div>
						<div className="mt-5 flex items-center justify-end gap-3">
							<label htmlFor="trip-sort" className="text-sm text-[#738076]">
								Sort by
							</label>
							<select
								id="trip-sort"
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
								className="rounded-xl border border-[#DDE4D9] bg-white px-4 py-2 text-sm text-[#12271A] outline-none focus:border-green-600">
								<option value="recent">Recently updated</option>
								<option value="departure">Departure date</option>
								<option value="name">Name (A-Z)</option>
							</select>
						</div>
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
								className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[#DDE4D9] px-4 py-2 font-medium text-sm hover:bg-[#F6F7F1]"
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
						<div className={`mx-16 mt-6 grid gap-5 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
							}`}>
							{sortedTrip.map((trip) => (
								<Link
									to="/trips/$tripId"
									params={{ tripId: trip.id }}
									key={trip.id}
									className="group flex min-h-56 flex-col rounded-2xl border border-[#E0E6DD] bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-[#B8CDB5] hover:shadow-lg hover:shadow-[#203B2810]"
								>
									<div className="flex items-center gap-2">
										<span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getTripStatus(trip.startDate, trip.endDate) === "upcoming" ? "bg-blue-100 text-blue-700" : getTripStatus(trip.startDate, trip.endDate) === "ongoing" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
											{getTripStatus(trip.startDate, trip.endDate)}
										</span>
										<ArrowUpRight
											size={19}
											className="text-[#9AA60B]transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
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
												&nbsp;&nbsp;
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
