import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);
export default function PromotionBanner() {
	const sectionRef = useRef<HTMLElement>(null);

	useGSAP(
		() => {
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: sectionRef.current,
					start: "top 80%",
					once: true,
				},
				defaults: {
					ease: "power3.out",
				},
			});
			tl.from(".nature-panel", {
				x: -60,
				opacity: 0,
				duration: 0.8,
			})
				.from(
					".cities-panel",
					{
						x: 60,
						opacity: 0,
						duration: 0.8,
					},
					"<",
				)
				.from(
					".promotion-content",
					{
						y: 25,
						opacity: 0,
						duration: 0.6,
						stagger: 0.15,
					},
					"-=0.3",
				);
		},
		{ scope: sectionRef },
	);
	return (
		<section
			ref={sectionRef}
			className="flex h-[40vh] items-center justify-center text-center"
		>
			<div className="nature-panel relative flex h-full w-1/2 flex-col items-center justify-center gap-4 bg-[url('/nature.jpg')] bg-center bg-cover text-center">
				<div className="absolute inset-0 bg-black/45" />
				<div className="flex flex-col -gap-2">
					<div className="promotion-content z-50 font-bold text-sm text-white">
						Promotion
					</div>

					<div className={"z-50 font-volkhov text-4xl text-white"}>
						Explore Nature
					</div>
				</div>
				<div className="promotion-content z-50 rounded-lg border-2 border-white px-4 py-2 font-bold text-white">
					View Packages
				</div>
			</div>

			<div className="cities-panel relative flex h-full w-1/2 flex-col items-center justify-center gap-4 bg-[url('/cities.jpg')] bg-center bg-cover text-center text-white">
				<div className="absolute inset-0 bg-black/45" />
				<div className="flex flex-col -gap-2">
					<div className="z-50 font-bold text-sm text-white">Promotion</div>
					<div className={"z-50 font-volkhov text-4xl text-white"}>
						Explore Cities
					</div>
				</div>
				<div className="promotion-content z-50 rounded-lg border-2 border-white px-4 py-2 font-bold text-white">
					View Packages
				</div>
			</div>
		</section>
	);
}
