import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);
export default function About_Hero() {
	const aboutHeroRef = useRef<HTMLDivElement>(null);
	useGSAP(
		() => {
			const tl = gsap.timeline({
				defaults: { ease: "power3.out" },
				scrollTrigger: {
					trigger: aboutHeroRef.current,
					start: "top 75%",
					once: true,
				},
			});
			tl.from(".about-hero-bg", {
				scale: 1.12,
				duration: 1.4,
			})
				.from(
					".about-hero-label",
					{
						y: 15,
						opacity: 0,
						duration: 0.5,
					},
					"-=0.9",
				)
				.from(
					".about-hero-title",
					{
						y: 35,
						opacity: 0,
						duration: 0.8,
					},
					"-=0.25",
				);
		},
		{ scope: aboutHeroRef },
	);
	return (
		<div
			ref={aboutHeroRef}
			className="relative flex h-[60vh] flex-col items-center justify-center gap-2 overflow-hidden text-center"
		>
			<div
				className="about-hero-bg absolute inset-0 bg-[url('./about-hero.jpg')] bg-center bg-cover"
				aria-hidden="true"
			/>
			<div className="about-hero-label relative z-10 font-bold font-poppins text-[#FFEFEC]">
				READ
			</div>
			<div className="great-vibes about-hero-title relative z-10 text-8xl">
				About Us
			</div>
		</div>
	);
}
