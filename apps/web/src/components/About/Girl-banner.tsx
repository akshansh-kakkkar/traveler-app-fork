import { useGSAP } from "@gsap/react"
import { useRef } from "react"
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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
					}
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
		{ scope: bannerRef }
	)
	return (
		<div ref={bannerRef} className="relative h-[60vh] great-vibes font-bold text-white text-center flex justify-center items-center text-9xl">
			<div aria-hidden="true" className="girl-banner-bg absolute inset-0  bg-[url('/girl-pic.jpg')] bg-cover bg-center" />
			<div className="girl-banner-title relative z-10 great-vibes font-bold text-white text-center text-9xl">
Wanderlust
			</div>
		</div>
	)
}