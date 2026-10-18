import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import gsap  from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


const cards = [
  {
    id: 1,
    image: "/guided-tours.png",
    title: "Guided Tours",
    description:
      "A guided tour is an organized travel experience led by a professional expert who navigates a route, shares local history, and provides cultural commentary for a group or individual.",
  },
  {
    id: 2,
    image: "/flight-options.png",
    title: "Best Flights Options",
    description:
      "Best Flight Options available at cheaper prizes and  Flights departing on Tuesdays and Wednesdays are consistently cheaper than weekend flights.",
  },
  {
    id: 3,
    image: "/religious-tours.png",
    title: "Religious Tours",
    description:
      "You can book religious and spiritual tours across India through trusted national operators like IRCTC Tourism or specialized providers like Kesari Tours Marigold and Thomas Cook.",
  },
  {
    id: 4,
    image: "/medical-insurance.png",
    title: "Medical Insurance",
    description:
      "Medical insurance is a financial contract where an insurance company pays for your medical and hospital expenses in exchange for regular payments called premiums.",
  },
];
export default function CategorySection() {
	const sectionRef = useRef<HTMLElement>(null);
	useGSAP(
		()=>{
			gsap.from(".category-heading", {
				y : 30,
				opacity : 0,
				duration : 0.8,
				stagger : 0.15,
				ease : "power3.out",
				scrollTrigger : {
					trigger : ".category-heading",
					start : "top 85%",
					once : true,
				}
			});
			gsap.from(".category-card", {
				 y : 50,
				 opacity : 0,
				 scale : 0.96,
				 duration : 0.8,
				 stagger : 0.18,
				 ease : "power3.out",
				 scrollTrigger : {
					trigger : ".category-grid",
					start : "top 85%",
					once : true,
				 },
			});

			gsap.from(".category-image", {
				y :12,
				opacity : 0.7,
				staggger : 0.15,
				ease : "power2.out",
				scrollTrigger : {
					trigger : ".category-grid",
					start : "top 80%",
					once : true,
				},
			});
		},
		{scope : sectionRef }
	)
  return (
		<section ref={sectionRef} className="lg:h-[60vh] mt-12">
			<div className="flex flex-col justify-center items-center w-full py-4	 ">
				<p className="text-[#DF6951] font-black text-sm categor-heading">CATEGORY</p>
				<h1 className="text-4xl category-heading font-volkhov font-bold text-[#181E4B]">We Offer Best Services</h1>
			</div>
    <div className="sm:grid-cols-2 category-grid gap-4 grid lg:grid-cols-4 place-items-center">
			{cards.map((card) => (
        <div
          key={card.id}
          className="group category-card relative w-80 h-100 flex flex-col items-center p-6"
        >
          <div className="absolute left-[5px] bottom-[30px] w-16 h-16 rounded-2xl bg-[#DF6951] opacity-0 transition-all duration-300 group-hover:translate-x-2 group-hover:translate-y-2 group-hover:opacity-100 -z-10" />
          <div className="relative z-10 w-full h-full rounded-2xl bg-white hover:border hover:scale-90 border-gray-200 flex flex-col items-center p-6 transition-all duration-300 group-hover:-translate-y-1 text-black">
            <div className="h-[100px] flex items-center justify-center">
              <img src={card.image} alt={card.title} />
            </div>
            <div className="h-[20px] flex items-center justify-center font-bold text-lg text-center">
              {card.title}
            </div>
            <div className=" mt-4 text-center text-sm">{card.description}</div>
          </div>
        </div>
      ))}
    </div>
    </section>
  );
}
