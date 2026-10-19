import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Calendar, MapPin, Star, UserRound } from "lucide-react";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);
const cards = [
	{
		id: 1,
		days: 8,
		people: 25,
		title: "Switzerland",
		stars: 5,
		region: "Europe",
		fees: 1000,
		flag: "./swiss-flag.png",
		image: "./swiss-view.png",
		description:
			"Switzerland is a wealthy, landlocked European nation famous for its stunning Alps, global neutrality, and system of direct democracy. Divided into 26 cantons, it has four official languages. The country boasts a high quality of life and is a hub for banking, luxury watches, chocolate, and innovation.",
	},
	{
		id: 2,
		days: 8,
		people: 30,
		title: "Amazon",
		stars: 4,
		region: "Brazil",
		fees: 1223,
		flag: "./brazil-flag.png",
		image: "./brazil-view.png",
		description:
			"Brazil is the largest country in South America, famous for its vibrant Amazon rainforest and diverse wildlife. Celebrated for its rich cultural fusion, it is globally renowned for the energetic Rio Carnival, rhythmic Samba music, and football passion. Its capital is Brasília, while its official language is Portuguese.",
	},
	{
		id: 3,
		days: 8,
		people: 155,
		title: "Giza",
		region: "Egypt",
		stars: 5,
		fees: 1200,
		flag: "./giza-flag.png",
		image: "./giza-view.png",
		description:
			"Giza is an Egyptian city on the west bank of the Nile. It is globally famous for the Giza Plateau, a vast ancient necropolis. This historic site features the iconic Great Sphinx and the three massive pyramids built as monumental pharaoh tombs over 4,500 years ago.",
	},
];
export default function OurPackages() {
	const sectionRef = useRef<HTMLElement>(null);
	useGSAP(
		() => {
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: sectionRef.current,
					start: "top 75%",
					once: true,
				},
			});
			tl.from(".packages-heading", {
				y: 30,
				opacity: 0,
				duration: 0.7,
			}).from(
				".package-card",
				{
					y: 50,
					opacity: 0,
					duration: 0.7,
					stagger: 0.2,
				},
				"-=0.2",
			);
		},
		{ scope: sectionRef },
	);
	return (
		<section
			ref={sectionRef}
			className="flex flex-col gap-4 lg:my-5 xl:h-screen"
		>
			<div className="my-12 flex flex-col items-center justify-center text-center">
				<div className="font-bold text-[#DF6951] uppercase">Trendy</div>
				<div className="w-125 font-semibold font-volkhov text-6xl text-[#181E4B] leading-14">
					Our Trending Tour Packages
				</div>
			</div>
			<div className="flex flex-col place-items-center items-center justify-center gap-12 text-card md:grid md:grid-cols-3">
				{cards.map((card) => (
					<div
						key={card.id}
						className="package-card h-[550px] w-[400px] rounded-2xl shadow-sm md:w-[350px] xl:h-[510px] xl:w-[450px]"
					>
						<div className="relative">
							<img
								src={card.image}
								alt={card.title}
								className="package-image h-[250px] w-[450px] rounded-2xl object-cover"
							/>
							<img
								src={card.flag}
								alt={card.title}
								width={"40px"}
								height={"80px"}
								className="absolute top-55 right-4 h-12 w-12 rounded-full border-4 border-white object-cover shadow-lg"
							/>
						</div>
						<div className="my-2 flex items-center gap-8 text-center text-[#7D7D7D] text-sm">
							<div className="mx-4 flex items-center gap-2">
								<span>
									<Calendar />
								</span>
								<span>{card.days} days</span>
							</div>
							<div className="mx-4 flex items-center gap-2">
								<span>
									<UserRound />
								</span>
								<span>{card.people} people going</span>
							</div>
						</div>
						<div className="mx-4 my-2 flex justify-between">
							<div className="font-bold text-2xl text-[#2F2F2F]">
								{card.title}
							</div>
							<div className="flex gap-1">
								{Array.from({ length: card.stars }).map((_, index) => (
									<Star
										key={index}
										size={18}
										className="fill-[#FFB800] text-[#ffb800]"
									/>
								))}
							</div>
						</div>
						<div className="flex items-center justify-between text-[#7D7D7D] text-sm">
							<div className="mx-4 flex items-center justify-center gap-2 text-center">
								<span>
									<MapPin size={16} />
								</span>
								<span>{card.region}</span>
							</div>
							<div className="mx-4 font-bold text-2xl text-[#DF6951]">
								$ {card.fees}
							</div>
						</div>
						<div className="mx-4 my-2 text-xs leading-5 md:h-[120px] xl:h-[80px]">
							{card.description}
						</div>
						<div className="mx-4 w-fit rounded-xl bg-[#DF6951] px-4 py-2 font-bold text-white shadow-[#DF695126]">
							Explore Now
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
