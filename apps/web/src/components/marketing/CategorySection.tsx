import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

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
		() => {
			gsap.from(".category-heading", {
				y: 30,
				opacity: 0,
				duration: 0.8,
				stagger: 0.15,
				ease: "power3.out",
				scrollTrigger: {
					trigger: ".category-heading",
					start: "top 85%",
					once: true,
				},
			});
			gsap.from(".category-card", {
				y: 50,
				opacity: 0,
				scale: 0.96,
				duration: 0.8,
				stagger: 0.18,
				ease: "power3.out",
				scrollTrigger: {
					trigger: ".category-grid",
					start: "top 85%",
					once: true,
				},
			});

			gsap.from(".category-image", {
				y: 12,
				opacity: 0.7,
				staggger: 0.15,
				ease: "power2.out",
				scrollTrigger: {
					trigger: ".category-grid",
					start: "top 80%",
					once: true,
				},
			});
		},
		{ scope: sectionRef },
	);
	return (
		<section ref={sectionRef} className="mt-12 lg:h-[60vh]">
			<div className="flex w-full flex-col items-center justify-center py-4">
				<p className="categor-heading font-black text-[#DF6951] text-sm">
					CATEGORY
				</p>
				<h1 className="category-heading font-bold font-volkhov text-4xl text-[#181E4B]">
					We Offer Best Services
				</h1>
			</div>
			<div className="category-grid grid place-items-center gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{cards.map((card) => (
					<div
						key={card.id}
						className="group category-card relative flex h-100 w-80 flex-col items-center p-6"
					>
						<div className="absolute bottom-[30px] left-[5px] -z-10 h-16 w-16 rounded-2xl bg-[#DF6951] opacity-0 transition-all duration-300 group-hover:translate-x-2 group-hover:translate-y-2 group-hover:opacity-100" />
						<div className="relative z-10 flex h-full w-full flex-col items-center rounded-2xl border-gray-200 bg-white p-6 text-black transition-all duration-300 hover:scale-90 hover:border group-hover:-translate-y-1">
							<div className="flex h-[100px] items-center justify-center">
								<img src={card.image} alt={card.title} />
							</div>
							<div className="flex h-[20px] items-center justify-center text-center font-bold text-lg">
								{card.title}
							</div>
							<div className="mt-4 text-center text-sm">{card.description}</div>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
