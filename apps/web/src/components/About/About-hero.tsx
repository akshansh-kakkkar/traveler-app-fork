import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
gsap.registerPlugin(useGSAP, ScrollTrigger)
export default function About_Hero(){
	const aboutHeroRef = useRef<HTMLDivElement>(null);
	useGSAP(
		()=> {
			const tl = gsap.timeline({
				defaults : { ease : "power3.out"},
				scrollTrigger : {
					trigger : aboutHeroRef.current,
					start : "top 75%",
					once : true,
				}
			});
			tl.from(".about-hero-bg", {
				scale : 1.12,
				duration : 1.4,
			}).from(".about-hero-label", {
				y : 15,
				opacity : 0,
				duration : 0.5,
			},
		"-=0.9").from(
			".about-hero-title", {
				y : 35,
				opacity : 0,
				duration : 0.8,
			},
			"-=0.25",
		);
		},
		{ scope : aboutHeroRef }
	)
	return(
		<div ref={aboutHeroRef} className="relative flex h-[60vh] flex-col gap-2 items-center text-center justify-center overflow-hidden">
			<div className="bg-[url('./about-hero.jpg')] bg-cover bg-center about-hero-bg absolute inset-0" aria-hidden="true" />
			<div className="font-bold about-hero-label relative z-10 font-poppins text-[#FFEFEC]">READ</div>
			<div className="text-8xl great-vibes about-hero-title relative z-10">About Us</div>
		</div>
	)
}