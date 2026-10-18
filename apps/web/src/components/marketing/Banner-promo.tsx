import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function BannerPromo() {
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

			tl.from(".testimonial-label", {
				y: 20,
				opacity: 0,
				duration: 0.5,
			})
				.from(".testimonial-heading", {
					y: 30,
					opacity: 0,
					duration: 0.7,
				})
				.from(
					".testimonial-card",
					{
						y: 45,
						opacity: 0,
						scale: 0.96,
						duration: 0.8,
					},
					"-=0.2",
				)
				.from(
					".testimonial-quote",
					{
						y: 45,
						opacity: 0,
						duration: 0.8,
					},
					"-=0.4",
				)
				.from(
					".testimonial-indicator",
					{
						scale: 0.7,
						opacity: 0,
						duration: 0.4,
					},
					"-=0.3",
				)
				.from(
					".testimonial-description",
					{
						y: 50,
						opacity: 0,
						duration: 0.8,
					},
					"-=0.3",
				);
		},
		{ scope: sectionRef },
	);
	return (
		<section ref={sectionRef} className="relative h-[100vh] bg-[#F8F8F8]">
			<div className="flex h-[100vh] scale-100 flex-col items-center justify-center gap-4 bg-[url('banner-promo.jpg')] bg-cover text-center">
				<div className="testimonial-quote absolute top-80 left-130 z-10">
					<img src="/double-quotes.png" alt="" />
				</div>
				<div className="testimonial-label font-bold text-[#DF6951] text-sm">
					Promotion
				</div>
				<div className="testimonial-heading w-120 font-bold font-volkhov text-4xl text-[#181E4B]">
					See What Our Clients Say About Us
				</div>
				<div className="testimonial-card relative mt-12 flex h-65 w-120 flex-col items-center justify-center gap-4 rounded-2xl bg-white text-black shadow-xl">
					<img
						src="/alex-rivera.jpg"
						alt="Alex Rivera"
						className="absolute -top-8 h-24 w-24 rounded-full border-4 border-[#Df6851] object-cover shadow-lg"
					/>
					<div className="px-4 font-extralight font-poppins text-sm">
						Alex Rivera is a digital marketer with over five years of experience
						helping small businesses grow their online presence. She specializes
						in content strategy and has managed campaigns that increased client
						web traffic by 40%.
					</div>
					<div className="font-bold font-poppins">Alex Rivera - Designer</div>
				</div>
				<div className="testimonial-indicator h-1 w-12 rounded-full bg-[#Df6851]" />
				<div />
			</div>
			<img
				className="absolute bottom-0 rotate-x-180"
				src="/traven-concepts.png"
				alt="traven concepts"
				width={"400px"}
			/>
		</section>
	);
}
