import ReactECharts from 'echarts-for-react';

interface TripStatusChartsProps {
	completed: number;
	upcoming: number;
	onGoing: number;
}

export default function TripStatusCharts({
	completed,
	upcoming,
	onGoing
} : TripStatusChartsProps){
	const option = {
		tooltip: {
			triger: "item",
		},
		legend: {
			bottom: 0,
		},
		series: [
			{
				name: "Trip Status",
				type: "pie",
				avoidLabelOverlap: true,
				data: [
					{
						value: completed,
						name: "Completed",
					},
					{
						value: upcoming,
						name: "Upcoming",
					},
					{
						value: onGoing,
						name: "Ongoing",
					},
				],
				label: {
					show: false,
				},
			},
		],
	};

	return(
		<section className="rounded-2xl border border-[#D1DCCF] bg-white p-6">
			<h2 className="text-lg font-bold text-[#12271a]">Trip Status</h2>
			<p className="mt-1 text-sm text-[#6C776D]">
				Breakdown of your trips
			</p>

			<ReactECharts
			option={option}
			style={{ height : "300px", width : "100%" }}
			notMerge
			lazyUpdate
			/>
		</section>
	)
}