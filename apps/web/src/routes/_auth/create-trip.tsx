import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, FileText, MapPin } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import DashboardSideBar from "@/components/Dashboard/DashboardSideBar";
import { trpc } from "@/utils/trpc";

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
				toast.success("Trip Created Successfully!");
				await queryClient.invalidateQueries({
					queryKey: trpc.trips.getAll.queryKey(),
				});

				await navigate({ to: "/trips" });
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
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (form.startDate && form.endDate && form.endDate < form.startDate) {
			toast.error("End date must be on or after the start date.");
			return;
		}
		createTrip.mutate({
			name: form.name.trim(),
			description: form.description.trim() || undefined,
			startDate: form.startDate
				? new Date(`${form.startDate}T00:00:00`)
				: undefined,
			endDate: form.endDate ? new Date(`${form.endDate}T00:00:00`) : undefined,
		});
	};
	return (
		<div className="relative flex h-screen overflow-hidden">
			<>
				<DashboardSideBar onExpandedChange={setIsSideBarExpanded} />
			</>
			<div
				className={`${isSideBarExpanded ? "ml-80" : "ml-30"} mx-12 my-12 overflow-y-scroll w-full rounded-2xl bg-[#E4EFE2] p-6 shadow-md transition-all duration-300 ease-in-out`}
			>
				<div className="flex flex-col gap-[0.1px]">
					<div className="text-2xl font-extrabold uppercase text-[#12271A]">Create Trip</div>
					<div className="text-sm font-light text-[#6C776D]">
						Kuala Lumpur itineraries, built only from places local guides
						verified.
					</div>
				</div>
				<form onSubmit={handleSubmit} className="space-y-60">
					<div className="flex flex-col gap-2">
						<div className="flex my-4 flex-col">
							<h2 className="text-[#12271A] font-bold capitalize text-lg">Trip Details</h2>
							<p className="text-[#6C776D] text-sm">Start with the basics. You can update them later.</p>
						</div>


						<div className="mt-6 space-y-5">
							<div>
								<label htmlFor="name" className="mb-2 text-[#12271A] block font-medium">
									Trip Name
								</label>
								<input
									type="text"
									name="name"
									value={form.name}
									onChange={handleChange}
									placeholder="e.g. Weekend in the mountains"
									maxLength={100}
									required
									className="w-full rounded-xl border placeholder:text-[#6C776D] text-[#12271A] border-[#6C776D] bg-white outline-none focus:border-green-600 p-3" />
							</div>
						</div>

						<div>
							<label htmlFor="description" className="mb-2 text-[#12271A] flex items-center gap-2 font-medium">
								<FileText size={18} />
								Description
								<span className="text-sm text-[#6C776D]">(optional)</span>
							</label>
							<textarea
								name="description"
								id="description"
								value={form.description}
								onChange={handleChange}
								maxLength={1000}
								rows={4}
								className="w-full rounded-xl placeholder:text-[#6C776D] max-h-50 p-3 text-[#12271A] border border-[#6C776D] bg-white outline-none focus:border-green-600"
								placeholder="What are you planning for this trip?"
							/>
						</div>
						<div className="flex flex-col gap-2">
							<div className="flex flex-col ">
								<h2 className="text-[#12271A] font-bold text-lg">Travel Dates</h2>
								<p className="text-sm text-[#6C776D]">Dates are optional. You can plan them later.</p>
							</div>
							<div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
								<div>
									<label htmlFor="startDate" className="mb-2 text-[#12271A] flex items-center gap-2 font-medium">
										<CalendarDays size={18} />
										StartDate
									</label>
									<input
										id="startDate"
										value={form.startDate}
										onChange={handleChange}
										className="w-full rounded-xl placeholder:text-[#6C776D] max-h-50 p-3 text-[#12271A] border border-[#6C776D] bg-white outline-none focus:border-green-600"
										type="date"
										name="startDate" />
								</div>
								<div>
									<label htmlFor="endDate" className="mb-2 text-[#12271A] flex items-center gap-2 font-medium">
										<CalendarDays size={18} />
										End Date
									</label>
									<input
										id="endDate"
										value={form.endDate}
										onChange={handleChange}
										className="w-full rounded-xl placeholder:text-[#6C776D] max-h-50 p-3 text-[#12271A] border border-[#6C776D] bg-white outline-none focus:border-green-600"
										name="endDate"

										type="date" />
								</div>
							</div>

							<div className="flex flex-col text-[#6C776D]">
								<div className="flex items-center text-center text-sm gap-1">
									<div>
										<MapPin size={14} />
									</div>
									<p>Your itinerary starts here. Once your trip is created, you can build on these details as
										you plan your journey.</p>
								</div>

							</div>
						</div>
						<div className="flex justify-end gap-4">
							<button
								onClick={() => navigate({ to: "/trips" })}
								className="border-2 border-[#12271A] text-[#12271A] px-4 py-1 rounded-lg cursor-pointer">Cancel</button>

							<button
								disabled={createTrip.isPending}
								type="submit"
								className="bg-[#12271A] px-4 py-1 rounded-lg cursor-pointer hover:bg-[#12271A]/90 disabled:bg-[#12271A]/60 disabled:cursor-not-allowed transition-all duration-300">
								{createTrip.isPending ? "Creating..." : "Create Trip"}
							</button>
						</div>
					</div>

				</form>
			</div>
		</div>
	)
}