import ReactECharts from "echarts-for-react";

interface MonthlyTripsChart {
	data: {
		month: string;
		trips: number;
	}[];
}

export default function MonthlTripChart({ data }: MonthlyTripsChart) {
	const option = {
		tooltip: {
			trigger: "axis",
			backgroundColor: "#17281E",
			borderWidth: 0,
			textStyle: {
				color: "#FFFFFF",
			},
		},
		grid: {
			left: 10,
			rigth: 20,
			top: 30,
			bottom: 10,
			containLabel: true,
		},
		xAxis: {
			type: "category",
			boundaryGap: false,
			data: data.map((item) => item.month),
			axisLine: {
				show: false,
			},
			axisTick: {
				show: false,
			},
			axisLabel: {
				color: "#829084",
			},
		},
		yAxis: {
			type: "value",
			minInterval: 1,
			splitLine: {
				lineStyle: {
					color: "#E8EEE6",
				},
			},
			axisLabel: {
				color: "#829084",
			},
		},
		series: [
			{
				name: "Trips",
				type: "line",
				smooth: true,
				data: data.map((item) => item.trips),
				symbol: "circle",
				symbolSize: 8,
				lineStyle: {
					width: 3,
					color: "#426449",
				},
				itemStyle: {
					color: "#426449",
				},
				areaStyle: {
					color: {
						type: "linear",
						x: 0,
						y: 0,
						x2: 0,
						y2: 1,
						colorStops: [
							{
								offset: 0,
								color: "rgba(66,100,73,0.3)",
							},
							{
								offset: 0,
								color: "rgba(66,100,73,0.02)",
							},
						],
					},
				},
			},
		],
	};

	return (
		<section className="rounded-2xl border border-[#D1DCCF] bg-white p-6">
			<div className="mb-4">
				<h2 className="font-bold text-[#12271A] text-lg">Monthly Trips</h2>
				<p className="mt-1 text-[#6C776D] text-sm">
					Your travel actvity over time
				</p>
			</div>
			<ReactECharts
				option={option}
				style={{ height: "300px", width: "100%" }}
				notMerge
				lazyUpdate
			/>
		</section>
	);
}
