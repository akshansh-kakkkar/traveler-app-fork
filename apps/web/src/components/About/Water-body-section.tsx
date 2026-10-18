import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);
export default function WaterBody() {
	const waterBodyRef = useRef<HTMLDivElement>(null);
	useGSAP(
		() => {
			const tl = gsap.timeline({
				defaults: { ease: "power3.out" },
				scrollTrigger: {
					trigger: waterBodyRef.current,
					start: "top 75%",
					once: true,
				},
			});
			tl.from(".water-heading", {
				x: -35,
				opacity: 0,
				duration: 0.7,
			})
				.from(
					".water-label",
					{
						y: 15,
						opacity: 0,
						duration: 0.45,
					},
					"-=0.35",
				)
				.from(
					".water-button",
					{
						y: 15,
						opacity: 0,
						duration: 0.45,
					},
					"-=0.2",
				)
				.from(
					".water-circle",
					{
						scale: 0.8,
						opacity: 0,
						durattion: 0.9,
					},
					"-=0.5",
				)
				.from(
					".water-decoration",
					{
						scaleX: 0,
						transformOrigin: "left center",
						opacity: 0,
						duration: 0.4,
						stagger: 0.08,
					},
					"-=0.5",
				);
		},
		{ scope: waterBodyRef },
	);
	return (
		<div
			ref={waterBodyRef}
			className="mx-24 flex h-[70vh] items-center justify-center gap-12"
		>
			<div className="flex w-[50vw] flex-col gap-4 text-black">
				<div className="font-bold text-lg">PROMOTION</div>
				<div className="water-heading w-[30vw] font-bold font-volkhov text-4xl text-[#181E4B]">
					We Provide You Best Europe Sightseeing Tours
				</div>
				<div className="water-description w-[40vw] font-poppins text-sm">
					Paris, known as the City of Love, offers an unmatched romantic escape
					with its iconic Eiffel Tower glowing against the evening sky and
					leisurely walks along the historic Seine River. Couples can wander
					through charming cobblestone streets, explore world-class art, and
					enjoy intimate candlelit dinners at sidewalk cafes that make every
					moment feel timeless.
				</div>
				<div className="watter-button w-fit rounded-lg bg-[#DF6951] px-4 py-2 font-bold text-lg text-white">
					View Packages
				</div>
			</div>
			<div className="relative mx-auto aspect-square w-[500px]">
				<div className="water-circle absolute inset-[8%] overflow-hidden rounded-full border-2 border-sky-500">
					<img
						src="/water-body.jpg"
						alt="water-body"
						className="h-full w-full object-cover"
					/>
				</div>
				{Array.from({ length: 8 }).map((_, i) => (
					<div
						key={i}
						className="absolute top-1/2 left-1/2 h-24 w-14"
						style={{
							transform: `translate(-50%, -50%) rotate(${
								i * 45
							}deg) translateY(-192px)`,
						}}
					>
						<div className="relative h-6 w-16">
							<div className="water-decoration absolute inset-x-0 top-1 h-[2px] rounded-full bg-[#DF6951]" />
							<div className="water-decoration absolute inset-x-0 top-3 h-[2px] rounded-full bg-[#DF6951]" />
						</div>
					</div>
				))}
				<div>
					<img src="/bg-hero.png" alt="bg-hero" />
				</div>
			</div>
		</div>
	);
}
