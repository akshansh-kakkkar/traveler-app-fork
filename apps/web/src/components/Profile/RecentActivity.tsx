import { CalendarPlus, CheckCircle2, MapPin } from "lucide-react";

interface RecentActivityProps {
	activities: {
		id: string;
		title: string;
		description: string;
		date: string;
		type: "created" | "completed" | "stops";
	}[];
}
export default function RecentActivity({ activities }: RecentActivityProps) {
	const icons = {
		created: CalendarPlus,
		completed: CheckCircle2,
		stops: MapPin,
	};

	return (
		<section className="rounded-2xl border border-[#D1DCCF] bg-white p-6">
			<h2 className="font-bold text-[#12271A] text-lg">Recent Activity</h2>
			<p className="mt-1 text-[#6C776D] text-sm">Your latest travel activity</p>
			{activities.length === 0 ? (
				<p className="py-8 text-center text-[#6C776D] text-sm">
					No recent activity yet.
				</p>
			) : (
				<div className="mt-6 space-y-5">
					{activities.map((activity) => {
						const Icon = icons[activity.type];

						return (
							<div key={activity.id} className="flex gap-4">
								<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF3E9] text-[#426449]">
									<Icon size={18} />
								</div>
								<div className="min-w-0 flex-1">
									<p className="text-[#6C776D] text-sm">{activity.title}</p>
									<p className="text-[#6C776D] text-sm">
										{activity.description}
									</p>
									<p>{new Date(activity.date).toLocaleDateString()}</p>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</section>
	);
}
