import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React, { useState } from "react";
import DashboardSideBar from "@/components/Dashboard/DashboardSideBar";
import { ArrowLeft, CalendarDays, FileText, MapPin } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";

export const Route = createFileRoute("/_auth/create-trip")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const [form, setForm] = useState({
		name: "",
		description: "",
		startDate: "",
		endDate: "",
	});

	const [isSideBarExpanded, setIsSideBarExpanded] = useState(false);
	const queryClient = useQueryClient();
	const createTrip = useMutation(
		trpc.trips.create.mutationOptions({
			onSuccess: async () => {
				toast.success("Trip Created Successfully!")
				await queryClient.invalidateQueries({
					queryKey: trpc.trips.getAll.queryKey(),
				});

				await navigate({ to: "/trips" })
			},
			onError: (error) => {
				toast.error(error.message || "Failed to create trip.");
			},
		}),
	);

	const handleChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		setForm((prev) => ({
			...prev,
			[event.target.name]: event.target.value,
		}));
	}

	const handleSubmit = (
		event: React.FormEvent<HTMLFormElement>,
	) => {
		event.preventDefault();
		if (
			form.startDate &&
			form.endDate &&
			form.endDate < form.startDate
		) {
			toast.error("End date must be on or after the start date.");
			return;
		}
		createTrip.mutate({
			name: form.name.trim(),
			description: form.description.trim() || undefined,
			startDate: form.startDate ? new Date(`${form.startDate}T00:00:00`) : undefined,
			endDate: form.endDate ? new Date(`${form.endDate}T00:00:00`) : undefined,
		});
	}
	return (
		<div className="relative flex h-screen text-black">
			<>
				<DashboardSideBar onExpandedChange={setIsSideBarExpanded} />
			</>
			<div
				className={`${isSideBarExpanded ? "ml-80" : "ml-30"} shadow-md mx-12 my-12 w-full rounded-2xl bg-[#E4EFE2] p-6 transition-all duration-300 ease-in-out`}
			>
				<div className="flex gap-2">
					<div>
						<button>
							<ArrowLeft size={14} />
						</button>
					</div>

					<div className="flex flex-col gap-[1px]">
						<div>Create Trip</div>
						<div>Kuala Lumpur itineraries, built only from places local guides verified.</div>
					</div>
				</div>
				<form onSubmit={handleSubmit} className="space-y-60">
					<div>
						<h2>Trip Details</h2>
						<p>Start with the basics. You can update them later.</p>

						<div className="mt-6 space-y-5">
							<div>
								<label htmlFor="name" className="mb-2 block font-medium">Trip Name</label>
								<input
									type="text"
									name="name"
									value={form.name}
									onChange={handleChange}
									placeholder="e.g. Weekend in the mountains"
									maxLength={100}
									required
									className="w-full rounded-xl border border-gray-300 bg-white p-3 outline-none focus:border-green-600"
								/>
							</div>
						</div>

						<div>
							<label htmlFor="">
								<FileText />
								Description
								<span>(optional)</span>
							</label>
							<textarea name="" id="" placeholder="What are you planning for this trip" />
						</div>
						<div>
							<h2>Travel Dates</h2>
							<p>Dates are optional. You can plan them later.</p>
							<div>
								<div>
									<label htmlFor="">
										<CalendarDays />
										StartDate
									</label>
									<input type="date" />
								</div>
								<div>
									<label htmlFor="">
										<CalendarDays />
										End Date
									</label>
									<input type="date" />
								</div>
							</div>

							<div>
								<div>
									<MapPin />
								</div>
								<p>
									Your itinerary starts here
								</p>
								<p>
									Once your trip is created, you can build on these details as you plan your journey.
								</p>
							</div>
						</div>
					</div>
					<div>
						<button>Cancel</button>
						<button>Create Trip</button>
					</div>
				</form>
			</div>
		</div>
	);
}
