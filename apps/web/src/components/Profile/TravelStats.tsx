import { ArrowUpRight, CalendarCheck, MapPin, Plane } from "lucide-react";

interface TravelStatsProps {
	totalTrips: number;
	completedTrips: number;
	upcomingTrips: number;
	totalStops: number;
}

export default function TravelStats({
	totalTrips,
	completedTrips,
	upcomingTrips,
	totalStops,
}: TravelStatsProps) {
	const stats = [
		{
			label: "Total Trips",
			value: totalTrips,
			icon: Plane,
			color: "bg-[#E4EFE2] text-[#426449]",
		},
		{
			label: "completed",
			value: completedTrips,
			icon: CalendarCheck,
			color: "bg-[#E8F0E9] text-[#426449]",
		},
		{
			label: "Upcoming",
			value: upcomingTrips,
			icon: ArrowUpRight,
			color: "bg-[#FDF0D5] text-[#9A6B20]",
		},
		{
			label: "Total Stops",
			value: totalStops,
			icon: MapPin,
			color: "bg-[#E8E9F8] text-[#555A9A]",
		},
	];

	return (
		<section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
			{stats.map((stat) => {
				const Icon = stat.icon;
				return (
					<div
						key={stat.label}
						className="rounded-2xl border border-[#D1DCCF] bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
					>
						<div className="flex items-center justify-between">
							<div
								className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}
							>
								<Icon size={21} />
							</div>
						</div>
						<p className="mt-5 font-bold text-3xl text-[#12271A]">
							{stat.value}
						</p>
						<p className="mt-1 font-medium text-[#6C776D] text-sm">
							{stat.label}
						</p>
					</div>
				);
			})}
		</section>
	);
}
