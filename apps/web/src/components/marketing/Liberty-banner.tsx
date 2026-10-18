import  { useRef } from "react";
import gsap from "gsap"; 
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function LibertyBanner(){
	const sectionRef = useRef<HTMLElement>(null);
	useGSAP(
		()=>{
			const tl = gsap.timeline	({
				scrollTrigger : {
					trigger	: sectionRef.current,
					start : "top 80%",
					once : true,
				},
				defaults : {
					ease : "power3.out",
				},
			});
			tl.from(".liberty-heading", {
				y : 40,
				opacity : 0,
				duration : 0.8
			}).from(
				".liberty-line",
				{
					x : 40,
					opacity : 0,
					duration : 0.6,
				},
				"-=0.3"
			);
		},
		{scope : sectionRef}
	)
	return (
		<section ref={sectionRef} className="h-[30vh] bg-center bg-inver bg-[url('/liberty.jpg')] scale-120 flex w-full text-center justify-center scale-x-[-1]  bg-[position:center_30%] h-64 bg-cover">
			<div className=" relative scale-x-[-1] p-8 h-full flex justify-center items-center text-center">
				<div className={`liberty-heading text-white text-4xl font-volkhov font-bold  text-center items-center text-center translate-y-12	 justify-center w-full h-full`}>
					Let's Make Your Next Holiday Amazing
				</div>
				<div className="liberty-line absolute top-32 right-0"> 
					<img src="/lin.png" alt="line" />
				</div>
			</div>
		</section>
	)
}