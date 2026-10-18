import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
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
			}).from(
				".promotion-title",
				{
					x: -40,
					opacity: 0,
					duration: 0.8
				},
				"-=0.2",
			).from(
				".promotion-description",
				{
					x : -40,
					opacity : 0,
					duration : 0.8,
				},
				"-=0.2",
			).from(
				".promotion-description",
				{
					y : 25,
					opacity : 0,
					duration :0.7
				},
				"-==0.4"
			)
			.from(
				".promotion-button",
				{
					y : 15,
					opacity :0,
					duration :0.5,
				},
				"-=0.25",
			).from(
				".promotion-image",
				{
					x : 60,
					opacity : 0,
					scale : 0.95,
					duration : 0.9,
				},
				"-=0.7",
			).from(
				".promotion-caption",
				{
					x : 20,
					opacity : 0,
					duration : 0.6
				},
				"-=0.7"
			).from(
				".promotion-caption",
				{x : 20,
					opacity: 0,
					duration : 0.6
				},
				"-=0.3"
			);
		},
		{
			scope : sectionRef
		}
	)
	return (
		<section ref={sectionRef} className="lg:h-screen mx-12 gap-12 lg:gap-0 flex flex-col lg:flex-row my-12 justify-center items-center text-center">
			<div className="lg:w-1/2 text-start flex justify-center items-center lg:justify-start lg:items-start gap-8 flex-col lg:gap-4">
				<p className="text-[#DF6951] font-bold promotion-label">PROMOTION</p>
				<p className="promotion-title text-7xl text-[#181E4B] w-150 font-volkhov font-bold">
					We Provide You Best Europe Sightseeing Tours
				</p>
				<p className="promotion-description text-black w-150 text-sm font-light">
					Ready to transform your daily routine? Discover the ultimate solution
					designed to save you time, boost your energy, and deliver unmatched
					quality right to your door. Don't settle for ordinary when you can
					experience the extraordinary today. Visit us online or stop by to
					claim your exclusive discount and see the difference for yourself!
				</p>
				<div className="promotion-button bg-[#DF6951] text-white w-full lg:w-fit flex text-center justify-center items-center px-4 py-2 text-2xl rounded-lg font-bold">
					View Packages
				</div>
			</div>
			<div className="lg:w-1/4 promotion-image relative">
				<img
					src="/eiffel-tower.png"
					alt="eiffel tower"
					width={"380px"}
					className="border-4 border-[#DF6951] rounded-t-full"
				/>
				<div className="promotion-caption w-full rotate-90 absolute top-1/2 -right-52 font-bold text-xl text-[#000000]/30 ">
					Breath Taking  Viewes
				</div>
			</div>
		</section>
	);
}
