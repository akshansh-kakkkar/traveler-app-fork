import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import gsap from "gsap";
import { Flip } from "gsap/dist/Flip";
import {
	ArrowDown,
	ArrowLeft,
	ArrowUp,
	CalendarDays,
	LoaderCircle,
	MapPinIcon,
	Plus,
} from "lucide-react";
import type React from "react";
import { useLayoutEffect, useRef, useState } from "react";
import { trpc } from "@/utils/trpc";

gsap.registerPlugin(Flip);

export const Route = createFileRoute("/_auth/trips/$tripId")({
	component: RouteComponent,
});

function toLocaleDateString(value: Date | string | null | undefined) {
	if (!value) return "";
	const date = new Date(value);
	const offset = date.getTimezoneOffset() * 60000;
	return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

function RouteComponent() {
	const itinerartContainerRef = useRef<HTMLDivElement>(null);
	const flipStateRef = useRef<Flip.FlipState | null>(null);
	const [isReordering, setIsReordering] = useState(false);
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
	const [editingIdActivity, setEditingIdActivity] = useState<string | null>(
		null,
	);
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
	);

	const updateActivity = useMutation(
		trpc.itinerary.update.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: trpc.itinerary.getAll.queryKey({
						id: tripId,
					}),
				});

				setEditingIdActivity(null);
				setTitle("");
				setNotes("");
				setStartAt("");
				setEndAt("");
				setShowActivityForm(false);
			},
		}),
	);
	const toggleActivity = useMutation(
		trpc.itinerary.update.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: trpc.itinerary.getAll.queryKey({
						id: tripId,
					}),
				});
			},
		}),
	);

	const deleteActivity = useMutation(
		trpc.itinerary.delete.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries({
					queryKey: trpc.itinerary.getAll.queryKey({
						id: tripId,
					}),
				});
			},
		}),
	);

	const reorderActivities = useMutation(
		trpc.itinerary.reorder.mutationOptions({
			onSuccess: async (data) => {
				if (typeof data === "object" && data !== null && data.conflict) {
					setIsReordering(false);
					await queryClient.invalidateQueries({
						queryKey: trpc.itinerary.getAll.queryKey({ id: tripId }),
					});
					return;
				}
				await queryClient.invalidateQueries({
					queryKey: trpc.itinerary.getAll.queryKey({ id: tripId }),
				});
			},
			onError: async () => {
				flipStateRef.current = null;
				await queryClient.invalidateQueries({
					queryKey: trpc.itinerary.getAll.queryKey({ id: tripId }),
				});
				setIsReordering(false);
			},
			onSettled: () => {
				setIsReordering(false);
			},
		}),
	);
	useLayoutEffect(() => {
		if (!itineraryQuery.data || !itinerartContainerRef.current) return;

		if (flipStateRef.current) {
			Flip.from(flipStateRef.current, {
				duration: 0.55,
				ease: "power2.inOut",
				onComplete: () => {
					setIsReordering(false);
				},
				absolute: false,
				stagger: 0.04,
			});

			flipStateRef.current = null;
		}
	}, [itineraryQuery.data?.map((item) => item.id).join(",")]);

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

		const payload = {
			title: title.trim(),
			notes: notes.trim() || undefined,
			startAt: startAt ? new Date(startAt) : undefined,
			endAt: endAt ? new Date(endAt) : undefined,
		}
		if (editingIdActivity) {
			const item = itineraryQuery.data?.find(
				(activity) => activity.id === editingIdActivity,
			);

			if (!item) return;

			updateActivity.mutate({
				id: editingIdActivity,
				...payload,
				version: item.version,
			});

		}
		else {
			createActivity.mutate({
				tripId,
				...payload,
			})

		}
	}
	function handleToggleActivity(
		item: NonNullable<typeof itineraryQuery.data>[number],
	) {
		toggleActivity.mutate({
			id: item.id,
			done: !item.done,
			version: item.version,
		});
	}

	function handleEditActivity(
		item: NonNullable<typeof itineraryQuery.data>[number],
	) {
		setEditingIdActivity(item.id);
		setShowActivityForm(true);
		setTitle(item.title);
		setNotes(item.notes ?? "");
		setStartAt(toLocaleDateString(item.startAt));
		setEndAt(toLocaleDateString(item.endAt));
	}

	function handleReorderActivity(index: number, direction: "up" | "down") {
		const items = itineraryQuery.data;
		if (!items || reorderActivities.isPending) return;

		const newItems = [...items];
		const targetIndex = direction === "up" ? index - 1 : index + 1;

		if (targetIndex < 0 || targetIndex >= newItems.length) return;

		if (itinerartContainerRef.current) {
			flipStateRef.current = Flip.getState(
				itinerartContainerRef.current.querySelectorAll(".itinerary-card"),
			);
		}

		[newItems[index], newItems[targetIndex]] = [
			newItems[targetIndex],
			newItems[index],
		];

		setIsReordering(true);

		queryClient.setQueryData(
			trpc.itinerary.getAll.queryKey({ id: tripId }),
			newItems,
		);
		reorderActivities.mutate({
			tripId,
			itemIds: newItems.map((item) => item.id),
			version: trip.version,
		});
	}

	if (tripsQuery.isError || !tripsQuery.data) {
		return (
			<main className="flex items-center justify-center bg-[#E4EFE2] p-6 text-[#12271A]">
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
					<div className="rounded-2xl border border-[#D7E1D4] bg-white p-6">
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
							className="mt-5 w-full rounded-xl bg-[#12271A] px-4 py-3 font-medium text-sm text-white transition hover:bg-[#294b35]"
						>
							{showActivityForm ? (
								"Cancel"
							) : (
								<>
									<Plus size={16} className="mr-2 inline" />
									Add activity
								</>
							)}
						</button>
						{showActivityForm && (
							<form
								onSubmit={handleCreateActivity}
								className="mt-2 flex flex-col gap-2"
							>
								<input
									type="text"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									placeholder="Activity title"
									required
									className="w-full rounded-xl border border-[#D7E1D4] p-3 text-sm outline-none focus:border-[#7A9B70]"
								/>
								<textarea
									value={notes}
									onChange={(e) => setNotes(e.target.value)}
									placeholder="Notes (optional)"
									rows={3}
									className="w-full rounded-xl border border-[#D7E1D4] p-3 text-sm outline-none focus:border-[#7A9B70]"
								/>
								<div className="grid grid-cols-2 gap-3">
									<input
										type="datetime-local"
										value={startAt}
										onChange={(e) => setStartAt(e.target.value)}
										className="w-full min-w-0 rounded-xl border border-[#D7E1D4] p-3 text-sm"
									/>
									<input
										type="datetime-local"
										value={endAt}
										onChange={(e) => setEndAt(e.target.value)}
										className="w-full min-w-0 rounded-xl border border-[#D7E1D4] p-3 text-sm"
									/>
								</div>

								{(createActivity.isError || updateActivity.isError) && (
									<p className="text-red-600 text-sm">
										Failed to create activity. Please try again.
									</p>
								)}
								<button
									type="submit"
									disabled={createActivity.isPending || updateActivity.isPending || !title.trim()}
									className="w-full rounded-xl bg-[#12271A] px-4 py-3 font-medium text-sm text-white transition hover:bg-[#66875D] disabled:opacity-50"
								>
									{createActivity.isPending || updateActivity.isPending ? "Saving..." : editingIdActivity ? "Update activity" : "Save activity"}
								</button>
							</form>
						)}
						{(isReordering || reorderActivities.isPending) && (
							<div className="mt-2 mb-4 flex items-center justify-center gap-3 rounded-xl border border-[#D7E1D4] bg-[#F5F8F2] p-4">
								<LoaderCircle
									className="animate-spin text-[#66875D]"
									size={20}
								/>
								<span className="font-medium text-[#426449] text-sm">
									Reordering your itinerary...
								</span>
							</div>
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
							<div className="mt-5 space-y-3" ref={itinerartContainerRef}>
								{(itineraryQuery.data ?? []).map((item, index) => (
									<div
										key={item.id}
										className="itinerary-card rounded-xl border border-[#E0E6DD] p-4"
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
												<span>
													Starts:{" "}
													{new Date(String(item.startAt)).toLocaleString()}
												</span>
												{item.startAt && item.endAt && " . "}
												{item.endAt && (
													<span>
														Ends: {new Date(item.endAt).toLocaleString()}
													</span>
												)}
											</p>
										)}

										<span
											className={`mt-3 inline-flex rounded-full px-3 py-1 font-medium text-xs ${item.done ? "bg-[#E1EFE1] text-[#426449]" : "bg-[#F1F0E7] text-[#82713D]"}`}
										>
											{item.done ? "Completed" : "Planned"}
										</span>
										<button
											type="button"
											onClick={() => handleToggleActivity(item)}
											disabled={toggleActivity.isPending}
											className="ml-3 font-medium text-[#66875D] text-xs hover:underline disabled:opacity-50"
										>
											{item.done ? "Mark as planned" : "Mark as completed"}
										</button>
										<button
											type="button"
											onClick={() => handleEditActivity(item)}
											className="ml-3 font-medium text-[#66875D] text-xs hover:underline"
										>
											Edit
										</button>

										<button
											className="ml-3 font-medium text-red-600 text-xs hover:underline disabled:opacity-50"
											disabled={deleteActivity.isPending}
											type="button"
											onClick={() => {
												if (
													confirm(
														"Are you sure you want to delete this activity?",
													)
												) {
													deleteActivity.mutate({
														id: item.id,
													});
												}
											}}
										>
											Delete
										</button>

										<div className="mt-3 flex gap-3">
											<button
												type="button"
												onClick={() => handleReorderActivity(index, "up")}
												disabled={reorderActivities.isPending || index === 0}
												className="flex gap-1 text-[#66875D] text-xs hover:underline disabled:opacity-40"
											>
												Move up <ArrowUp size={18} />
											</button>
											<button
												type="button"
												onClick={() => handleReorderActivity(index, "down")}
												className="flex items-center gap-1 text-center text-[#66875D] text-xs hover:underline disabled:opacity-40"
												disabled={
													reorderActivities.isPending ||
													index === (itineraryQuery.data?.length ?? 0) - 1
												}
											>
												Move down <ArrowDown size={18} />
											</button>
										</div>
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
