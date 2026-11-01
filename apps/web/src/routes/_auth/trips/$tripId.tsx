import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowLeft,
	CalendarDays,
	MapPinIcon,
	Plus
} from "lucide-react";
import { trpc } from "@/utils/trpc";
import React, { useState } from "react";

export const Route = createFileRoute("/_auth/trips/$tripId")({
	component: RouteComponent,
});

function RouteComponent() {

	const { tripId } = Route.useParams();

	const queryClient = useQueryClient();

	const tripsQuery = useQuery(
		trpc.trips.getOne.queryOptions({
			id: tripId,
		}),
	);

	const itineraryQuery = useQuery(
		trpc.itinerary.getAll.queryOptions({
			id: tripId,
		}),
	);

	const [showActivityForm, setShowActivityForm] = useState(false);
	const [title, setTitle] = useState("");
	const [notes, setNotes] = useState("");
	const [startAt, setStartAt] = useState("");
	const [endAt, setEndAt] = useState("");
	const createActivity = useMutation(
		trpc.itinerary.create.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: trpc.itinerary.getAll.queryKey({
						id: tripId,
					}),
				});
				setTitle("");
				setNotes("");
				setStartAt("");
				setEndAt("");
				setShowActivityForm(false);
			},
		}),
	)
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

	function handleCreateActivity(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!title.trim()) return;
		createActivity.mutate({
			tripId,
			title: title.trim(),
			notes: notes.trim() || undefined,
			startAt: startAt ? new Date(startAt) : undefined,
			endAt: endAt ? new Date(endAt) : undefined
		})
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
								? `Starts : ${new Date(trip.startDate).toLocaleDateString()}`
								: "Start date not set"}
						</p>
						<p>
							{trip.endDate
								? `Ends : ${new Date(trip.endDate).toLocaleDateString()}`
								: "End Date not set"}
						</p>
					</div>
					<div className="rounded-2xl border border-[#D7E1D4] bg-white p-6">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2 text-[#738076] text-sm">
								<MapPinIcon size={18} />
								Itinerary
							</div>
							<span className="rounded-full bg-[#E8EFE3] px-3 py-1 font-medium text-[#426449] text-xs">
								{itineraryQuery.data?.length ?? 0} activities
							</span>
						</div>
						<button
							type="button"
							onClick={() => setShowActivityForm(!showActivityForm)}
							className="mt-5 w-full rounded-xl bg-[#12271A] px-4 py-3 font-medium text-sm text-white transition hover:bg-[#294b35]">
							{showActivityForm ? "Cancel" : (
								<>
									<Plus size={16} className="inline mr-2" />
									Add activity
								</>
							)}
						</button>
						{showActivityForm && (
							<form onSubmit={handleCreateActivity} className="flex flex-col gap-2 mt-2">
								<input type="text"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									placeholder="Activity title"
									required
									className="w-full rounded-xl border border-[#D7E1D4] p-3 text-sm outline-none focus:border-[#7A9B70]" />
								<textarea
									value={notes}
									onChange={(e) => setNotes(e.target.value)}
									placeholder="Notes (optional)"
									rows={3}
									className="w-full rounded-xl border border-[#D7E1D4] p-3 text-sm outline-none focus:border-[#7A9B70]" />
								<div className="grid grid-cols-2 gap-3">
									<input type="datetime-local"
										value={startAt}
										onChange={(e) => setStartAt(e.target.value)}
										className="min-w-0 w-full rounded-xl border border-[#D7E1D4] p-3 text-sm" />
									<input type="datetime-local"
										value={endAt}
										onChange={(e) => setEndAt(e.target.value)}
										className="min-w-0 w-full rounded-xl border border-[#D7E1D4] p-3 text-sm" />
								</div>

								{createActivity.isError && (
									<p className="text-sm text-red-600">
										Failed to create activity. Please try again.
									</p>
								)}
								<button className="w-full rounded-xl bg-[#12271A] px-4 py-3 font-medium text-sm text-white transition hover:bg-[#66875D] disabled:opacity-50">{createActivity.isPending ? "Adding..." : "Save activity"}</button>
							</form>
						)}
						{itineraryQuery.isPending ? (
							<p className="mt-5 text-[#738076] text-sm">
								Loading activities...
							</p>
						) : itineraryQuery.isError || !itineraryQuery.data ? (
							<p className="mt-5 text-red-600 text-sm">
								Couldn't load itinerary activities.
							</p>
						) : itineraryQuery.data.length === 0 ? (
							<div className="mt-5">
								<p className="font-medium">Your itinerary is empty.</p>
								<p>Start adding activities to organize your journey.</p>
							</div>
						) : (
							<div className="mt-5 space-y-3">
								{itineraryQuery.data.map((item) => (
									<div
										key={item.id}
										className="rounded-xl border border-[#E0E6DD] p-4"
									>
										<div>
											<h3 className="font-semibold text-[#12271A]">
												{item.title}
											</h3>
										</div>
										{item.place && (
											<p className="mt-1 text-[#738076] text-xs">
												{item.place.name}
											</p>
										)}
										{item.notes && (
											<p className="mt-2 text-[#607565] text-sm">
												{item.notes}
											</p>
										)}
										{(item.startAt || item.endAt) && (
											<p>
												<span>Starts: {new Date(item.startAt).toLocaleString()}</span>
												{item.startAt && item.endAt && " . "}
												{item.endAt && (
													<span>
														Ends: {new Date(item.endAt).toLocaleString()}
													</span>
												)}
											</p>
										)}

										<span
										className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-medium ${item.done ? "bg-[#E1EFE1] text-[#426449]" : "bg-[#F1F0E7] text-[#82713D]"}`}>{item.done ? "Completed" : "Planned"}</span>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
