import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function LibertyBanner() {
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
			tl.from(".liberty-heading", {
				y: 40,
				opacity: 0,
				duration: 0.8,
			}).from(
				".liberty-line",
				{
					x: 40,
					opacity: 0,
					duration: 0.6,
				},
				"-=0.3",
			);
		},
		{ scope: sectionRef },
	);
	return (
		<section
			ref={sectionRef}
			className="flex h-64 h-[30vh] w-full scale-120 scale-x-[-1] justify-center bg-[position:center_30%] bg-[url('/liberty.jpg')] bg-center bg-cover bg-inver text-center"
		>
			<div className="relative flex h-full scale-x-[-1] items-center justify-center p-8 text-center">
				<div
					className={
						"liberty-heading h-full w-full translate-y-12 items-center justify-center text-center text-center font-bold font-volkhov text-4xl text-white"
					}
				>
					Let's Make Your Next Holiday Amazing
				</div>
				<div className="liberty-line absolute top-32 right-0">
					<img src="/lin.png" alt="line" />
				</div>
			</div>
		</section>
	);
}
