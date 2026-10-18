import { MicSignal, Plane, SquareDashed } from "lucide-react"
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger  } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger, useGSAP);

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
	const sectionRef = useRef<HTMLElement>(null);
	useGSAP(
		() =>{
			const tl = gsap.timeline({
				scrollTrigger : {
					trigger :sectionRef.current,
					start : "top 75%",
					once : true,
				},
				defaults : {
					ease  : "power3.out",
				}
			});
			tl.from(".banner-heading", {
				x : -40,
				opacity : 0,
				duration : 0.7,
			})
			.from(
				".banner-point",
				{
					y : 25,
					opacity : 0,
					duration : 0.55,
					stagger : 0.18,
				},
				"-=0.2"
			).from(".banner-image",{
				x : 60,
				opacity : 0,
				scale : 0.95,
				duration : 1,
			},
		"-=0.5"
	);
	{
		scope : sectionRef
	}
		}
	)
	return(
		<section ref={sectionRef} className="lg:h-[70vh] lg:my-0 my-12 lg:flex-row flex-col flex justify-center items-center text-center gap-12">
			<div>
				<div className="flex flex-col  text-start  ml-12">
					<div className="text-[#DF6951] font-bold">Fast & Easy</div>
					<div className="font-volkhov w-100 text-[#181E4B] text-5xl font-bold">Get Your Favourite Resort Bookings</div>
				</div>
				{keyPoints.map((key)=>(
					<div className="banner-point flex gap-6 text-start ml-12 my-12  items-center w-160">
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
				<img src="/airplane-banner.png" alt="air-plane" className="banner-image" />
			</div>
		</section>
	)
}