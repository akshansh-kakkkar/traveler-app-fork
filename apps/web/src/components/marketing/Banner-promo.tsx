import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function BannerPromo() {
	const sectionRef = useRef<HTMLElement>(null);

	useGSAP(
		()=>{
			const tl = gsap.timeline({
				scrollTrigger : {
					trigger : sectionRef.current,
					start : "top 75%",
					once : true,
				},
				defaults : {
					ease : "power3.out"
				},
			});

			tl.from(".testimonial-label", {
				y : 20, 
				opacity : 0,
				duration : 0.5,
			}).from(
				".testimonial-heading",
				{
					y : 30,
					opacity : 0,
					duration : 0.7
				},
			).from(
				".testimonial-card",
				{
					y : 45,
					opacity : 0,
					scale : 0.96,
					duration : 0.8,
				},
				"-=0.2"
			).from(
				'.testimonial-quote',
				{
					y : 45,
					opacity : 0,
					duration : 0.8,
				},
				"-=0.4",
			).from(
				".testimonial-indicator",
				{
					scale : 0.7,
					opacity : 0,
					duration : 0.4,
				},
				"-=0.3"
			).from(
				".testimonial-description",
				{
					y : 50,
					opacity : 0,
					duration : 0.8
				},
				"-=0.3",
			);
		},
		{scope : sectionRef }
	)
  return (
    <section ref={sectionRef} className="h-[100vh] bg-[#F8F8F8] relative">
      <div className="bg-[url('banner-promo.jpg')] h-[100vh] bg-cover scale-100 flex justify-center items-center text-center flex-col gap-4">
        <div className="absolute top-80 z-10 left-130 testimonial-quote">
					<img src="/double-quotes.png" alt="" />
				</div>
				<div className="text-[#DF6951] font-bold text-sm testimonial-label">Promotion</div>
        <div className="text-[#181E4B] testimonial-heading text-4xl font-volkhov font-bold w-120">
          See What Our Clients Say About Us
        </div>
        <div className="bg-white testimonial-card shadow-xl  relative flex justify-center items-center gap-4 flex-col rounded-2xl text-black w-120 h-65 mt-12">
          <img
            src="/alex-rivera.jpg"
            alt="Alex Rivera"
            className="w-24 h-24 border-4 border-[#Df6851] object-cover rounded-full absolute -top-8 shadow-lg"
          />
          <div className="font-extralight font-poppins text-sm px-4 ">
            Alex Rivera is a digital marketer with over five years of experience
            helping small businesses grow their online presence. She specializes
            in content strategy and has managed campaigns that increased client
            web traffic by 40%.
          </div>
          <div className="font-poppins font-bold ">Alex Rivera - Designer</div>
        </div>
        <div className="testimonial-indicator bg-[#Df6851] w-12 h-1 rounded-full" />
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
