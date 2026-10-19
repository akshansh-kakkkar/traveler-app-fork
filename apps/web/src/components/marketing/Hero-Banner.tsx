import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MicSignal, Plane, SquareDashed } from "lucide-react";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const keyPoints = [
	{
		id: 1,
		name: "Choose Destination",
		icon: <SquareDashed />,
		description: "Choose a destination you would love to visit",
		bg: "#F0BB1F",
	},
	{
		id: 2,
		name: "Check Availability",
		icon: <MicSignal />,
		description:
			"Check Availability of your prefferable mode of transportation and book your tickets.",
		bg: "#F15A2B",
	},
	{
		id: 3,
		name: "Let's Go",
		icon: <Plane />,
		bg: "#006380",
		description: "Yay! Lets go you are all set Happy journey!",
	},
];
export default function HeroBanner() {
	const sectionRef = useRef<HTMLElement>(null);
	useGSAP(() => {
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: sectionRef.current,
				start: "top 75%",
				once: true,
			},
			defaults: {
				ease: "power3.out",
			},
		});
		tl.from(".banner-heading", {
			x: -40,
			opacity: 0,
			duration: 0.7,
		})
			.from(
				".banner-point",
				{
					y: 25,
					opacity: 0,
					duration: 0.55,
					stagger: 0.18,
				},
				"-=0.2",
			)
			.from(
				".banner-image",
				{
					x: 60,
					opacity: 0,
					scale: 0.95,
					duration: 1,
				},
				"-=0.5",
			);
		scope: sectionRef;
	});
	return (
		<section
			ref={sectionRef}
			className="my-12 flex flex-col items-center justify-center gap-12 text-center lg:my-0 lg:h-[70vh] lg:flex-row"
		>
			<div>
				<div className="ml-12 flex flex-col text-start">
					<div className="font-bold text-[#DF6951]">Fast & Easy</div>
					<div className="w-100 font-bold font-volkhov text-5xl text-[#181E4B]">
						Get Your Favourite Resort Bookings
					</div>
				</div>
				{keyPoints.map((key) => (
					<div className="banner-point my-12 ml-12 flex w-160 items-center gap-6 text-start">
						<div
							style={{ backgroundColor: key.bg }}
							className="flex h-14 w-16 items-center justify-center rounded-lg text-xl"
						>
							{key.icon}
						</div>
						<div>
							<div className="font-bold text-[#5E6282] text-lg">{key.name}</div>
							<div className="text-[#5E6282] text-sm">{key.description}</div>
						</div>
					</div>
				))}
			</div>
			<div>
				<img
					src="/airplane-banner.png"
					alt="air-plane"
					className="banner-image"
				/>
			</div>
		</section>
	);
}
