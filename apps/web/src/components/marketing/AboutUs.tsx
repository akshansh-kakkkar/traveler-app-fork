import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useReducer, useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function AboutUs() {
	const sectionRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
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
			tl.from(".about-image", {
				x: -60,
				opacity: 0,
				durration: 1,
			})
				.from(
					".about-label",
					{
						y: 20,
						opacity: 0,
						duration: 0.5,
					},
					"-=0.5",
				)
				.from(
					".about-title",
					{
						y: 35,
						opacity: 0,
						duration: 0.7,
					},
					"-=0.2",
				)
				.from(
					".about-description",
					{
						y: 25,
						opacity: 0,
						duration: 0.7,
					},
					"-=0.35",
				)
				.from(
					".about-button",
					{
						y: 15,
						opacity: 0,
						duration: 0.5,
					},
					"-=0.25",
				);
		},
		{ scope: sectionRef },
	);

	return (
		<section
			ref={sectionRef}
			className="mt-12 flex flex-col items-center justify-center gap-6 text-center lg:mx-32 lg:h-screen lg:flex-row lg:items-center lg:justify-center lg:text-start"
		>
			<div className="lg:w-1/2">
				<img
					src="/honeymoon.png"
					alt="honeymoon"
					height={"399px"}
					width={"399px"}
					className="about-image rounded-t-full border-4 border-[#DF6951]"
				/>
			</div>
			<div className="flex flex-col gap-4 text-black lg:w-1/2">
				<div className="about-level font-bold text-[#DF6951] text-md uppercase">
					Honeymoon specials
				</div>
				<div className="about-title w-150 font-semibold font-volkhov text-5xl">
					Our Romantic Tropical Destinations
				</div>
				<div className="about-description w-150 text-sm leading-8">
					Paris, known as the City of Love, offers an unmatched romantic escape
					with its iconic Eiffel Tower glowing against the evening sky and
					leisurely walks along the historic Seine River. Couples can wander
					through charming cobblestone streets, explore world-class art, and
					enjoy intimate candlelit dinners at sidewalk cafes that make every
					moment feel timeless.
				</div>
				<div className="about-button flex justify-center rounded-xl bg-[#DF6951] px-4 py-4 text-center text-lg text-white lg:w-40">
					View Packages
				</div>
			</div>
		</section>
	);
}
