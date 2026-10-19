import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);
export default function Girl_Banner() {
	const bannerRef = useRef<HTMLDivElement>(null);
	useGSAP(
		() => {
			const tl = gsap.timeline({
				defaults: {
					ease: "power3.out",
				},
				scrollTrigger: {
					trigger: bannerRef.current,
					start: "top 75%",
					once: true,
				},
			});
			tl.from(".girl-banner-bg", {
				scale: 1.12,
				duration: 1.5,
			}).from(
				".girl-banner-title",
				{
					y: 40,
					opacity: 0,
					duration: 0.9,
				},
				"-=0.7",
			);
		},
		{ scope: bannerRef },
	);
	return (
		<div
			ref={bannerRef}
			className="great-vibes relative flex h-[60vh] items-center justify-center text-center font-bold text-9xl text-white"
		>
			<div
				aria-hidden="true"
				className="girl-banner-bg absolute inset-0 bg-[url('/girl-pic.jpg')] bg-center bg-cover"
			/>
			<div className="girl-banner-title great-vibes relative z-10 text-center font-bold text-9xl text-white">
				Wanderlust
			</div>
		</div>
	);
}
