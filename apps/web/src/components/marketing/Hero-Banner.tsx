import { m } from "@vite-pwa/assets-generator/dist/shared/assets-generator.Cjk4AKv_.mjs"
import { icons, MicSignal, Plane, SquareDashed } from "lucide-react"

const keyPoints = [
	{
		id : 1,
		name : "Choose Destination",
		icon : <SquareDashed />,
		description : "Choose a destination you would love to visit",
		bg : "#F0BB1F",
	},
	{
		id : 2,
		name : "Check Availability",
		icon : <MicSignal />,
		description : "Check Availability of your prefferable mode of transportation and book your tickets.",
		bg : "#F15A2B"
	},
	{
		id : 3,
		name : "Let's Go",
		icon : <Plane />,
		bg : "#006380",
		description : "Yay! Lets go you are all set Happy journey!"
	}
]
export default function HeroBanner(){
	return(
		<div className="h-[70vh] flex justify-center items-center text-center gap-12">
			<div>
				<div className="flex flex-col  text-start  ml-12">
					<div className="text-[#DF6951] font-bold">Fast & Easy</div>
					<div className="font-volkhov w-100 text-[#181E4B] text-5xl font-bold">Get Your Favourite Resort Bookings</div>
				</div>
				{keyPoints.map((key)=>(
					<div className="flex gap-6 text-start ml-12 my-12  items-center w-160">
						<div style={{backgroundColor : key.bg}} className="text-xl w-16 h-14 flex justify-center items-center rounded-lg ">
							 {key.icon}
						</div>
						<div>
							<div className="text-[#5E6282] text-lg font-bold">{key.name}</div>
							<div className="text-[#5E6282] text-sm">{key.description}</div>
						</div>
					</div>
				))}
			</div>
			<div>
				<img src="/airplane-banner.png" alt="air-plane" />
			</div>
		</div>
	)
}