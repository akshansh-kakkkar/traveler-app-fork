import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);
export default function Promotion() {
	const sectionRef = useRef<HTMLElement>(null);
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
			tl.from(".promotion-label", {
				y: 20,
				opacity: 0,
				duration: 0.5,
			})
				.from(
					".promotion-title",
					{
						x: -40,
						opacity: 0,
						duration: 0.8,
					},
					"-=0.2",
				)
				.from(
					".promotion-description",
					{
						x: -40,
						opacity: 0,
						duration: 0.8,
					},
					"-=0.2",
				)
				.from(
					".promotion-description",
					{
						y: 25,
						opacity: 0,
						duration: 0.7,
					},
					"-==0.4",
				)
				.from(
					".promotion-button",
					{
						y: 15,
						opacity: 0,
						duration: 0.5,
					},
					"-=0.25",
				)
				.from(
					".promotion-image",
					{
						x: 60,
						opacity: 0,
						scale: 0.95,
						duration: 0.9,
					},
					"-=0.7",
				)
				.from(
					".promotion-caption",
					{
						x: 20,
						opacity: 0,
						duration: 0.6,
					},
					"-=0.7",
				)
				.from(
					".promotion-caption",
					{ x: 20, opacity: 0, duration: 0.6 },
					"-=0.3",
				);
		},
		{
			scope: sectionRef,
		},
	);
	return (
		<section
			ref={sectionRef}
			className="mx-12 my-12 flex flex-col items-center justify-center gap-12 text-center lg:h-screen lg:flex-row lg:gap-0"
		>
			<div className="flex flex-col items-center justify-center gap-8 text-start lg:w-1/2 lg:items-start lg:justify-start lg:gap-4">
				<p className="promotion-label font-bold text-[#DF6951]">PROMOTION</p>
				<p className="promotion-title w-150 font-bold font-volkhov text-7xl text-[#181E4B]">
					We Provide You Best Europe Sightseeing Tours
				</p>
				<p className="promotion-description w-150 font-light text-black text-sm">
					Ready to transform your daily routine? Discover the ultimate solution
					designed to save you time, boost your energy, and deliver unmatched
					quality right to your door. Don't settle for ordinary when you can
					experience the extraordinary today. Visit us online or stop by to
					claim your exclusive discount and see the difference for yourself!
				</p>
				<div className="promotion-button flex w-full items-center justify-center rounded-lg bg-[#DF6951] px-4 py-2 text-center font-bold text-2xl text-white lg:w-fit">
					View Packages
				</div>
			</div>
			<div className="promotion-image relative lg:w-1/4">
				<img
					src="/eiffel-tower.png"
					alt="eiffel tower"
					width={"380px"}
					className="rounded-t-full border-4 border-[#DF6951]"
				/>
				<div className="promotion-caption absolute top-1/2 -right-52 w-full rotate-90 font-bold text-[#000000]/30 text-xl">
					Breath Taking Viewes
				</div>
			</div>
		</section>
	);
}
