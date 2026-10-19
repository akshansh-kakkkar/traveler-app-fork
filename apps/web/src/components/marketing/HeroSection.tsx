import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);
export default function HeroSeciton() {
	const heroRef = useRef<HTMLElement>(null);
	const logosRef = useRef<HTMLDivElement>(null);

	const profiles = [
		{
			id: 1,
			text: "A",
			bg: "#7C3AED",
		},
		{
			id: 2,
			text: "H",
			bg: "#2563EB",
		},
		{
			id: 3,
			text: "Y",
			bg: "#0891B2",
		},
		{
			id: 4,
			text: "C",
			bg: "#059669",
		},
		{
			id: 5,
			text: "U",
			bg: "#65A30D",
		},
		{
			id: 6,
			text: "+",
			bg: "#DF6951",
		},
	];

	useGSAP(
		() => {
			const intro = gsap.timeline({
				defaults: { ease: "power3.out" },
			});

			intro
				.from(".hero-bg", {
					scale: 1.12,
					duration: 1.8,
					ease: "power2.out",
				})
				.from(
					".hero-vector",
					{
						y: 25,
						opacity: 0,
						duration: 0.7,
					},
					"-=1.1",
				)
				.from(
					".hero-title",
					{
						y: 45,
						opacity: 0,
						duration: 0.9,
					},
					"-=0.4",
				)
				.from(
					".hero-search",
					{
						y: 30,
						opacity: 0,
						duration: 0.7,
					},
					"-=0.45",
				)
				.from(
					".hero-social",
					{
						y: 15,
						opacity: 0,
						duration: 0.6,
					},
					"-=0.3",
				)
				.from(
					".hero-circle",
					{
						x: -70,
						opacity: 0,
						duration: 1,
					},
					"-=0.8",
				);

			gsap.to(".profile-avatar", {
				y: -5,
				duration: 1.5,
				stagger: {
					each: 0.12,
					repeat: -1,
					yoyo: true,
				},
				ease: "sine.inOut",
			});

			if (logosRef.current) {
				gsap.from(logosRef.current.children, {
					y: 25,
					opacity: 0,
					stagger: 0.12,
					duration: 0.65,
					ease: "power2.out",
					scrollTrigger: {
						trigger: logosRef.current,
						start: "top 90%",
						once: true,
					},
				});
			}
		},
		{ scope: heroRef },
	);

	return (
		<section ref={heroRef} className="h-[200vh] md:h-screen md:overflow-hidden">
			<div className="hero-bg relative flex h-full items-center justify-start bg-[url('./hero-image.jpg')] bg-center bg-cover text-center md:h-[93vh]">
				<div className="absolute inset-0 bg-black/45" />
				<div className="flex w-full flex-col items-center justify-center gap-6 lg:ml-120 lg:items-start lg:justify-start">
					<div className="hero-vector z-50 translate-y-4">
						<img src="./hero-vector.png" alt="hero-vector" />
					</div>
					<div className="hero-title z-50 w-160 text-center font-extrabold text-6xl text-white lg:text-start">
						No matter where you're going to, we'll take you there
					</div>
					<div className="hero-search inset-0 z-10 flex items-center justify-between gap-4 rounded-sm border-1 border-[#DF6951] bg-[#F3F3F3]/60 px-4 py-8 text-center text-xl backdrop-blur-xs">
						<div>
							<p>Where to?</p>
						</div>
						<div className="flex items-center justify-center gap-4 text-center text-xl">
							<div className="mr-6 h-8 w-[2.5px] rounded-full bg-white" />
							<p>Travel Type</p>
							<>
								<ChevronDown />
							</>
							<div className="ml-6 h-8 w-[2.5px] rounded-full bg-white" />
						</div>
						<div className="flex items-center justify-center gap-4 text-center">
							<p>Duration</p>
							<>
								<ChevronDown />
							</>
						</div>
						<button className="rounded-sm bg-[#DF6951] px-8 py-3 font-semibold text-xs">
							Submit
						</button>
					</div>
					<div className="z-50 flex items-center gap-4 text-center text-xs">
						<div className="hero-social flex text-xs">
							{profiles.map((profile) => (
								<div
									key={profile.id}
									style={{ backgroundColor: profile.bg }}
									className={
										"profile-avatar -ml-1 rounded-full border-2 border-white px-2 py-1 first:ml-0"
									}
								>
									{profile.text}
								</div>
							))}
						</div>
						2,500 people booked Tommorowland Event in last 24 hours
					</div>
				</div>
				<div className="absolute bottom-[-250px] left-[30px] h-[500px] w-[500px] overflow-hidden rounded-full border border-white/80 border-dashed">
					<div className="absolute top-[85px] left-[85px] h-[330px] w-[330px] overflow-hidden rounded-full border border-white/80 border-dashed">
						<div className="absolute inset-0 -top-32 flex items-center justify-center overflow-hidden">
							<span className="font-light text-white text-xl">Scroll</span>
						</div>
					</div>
				</div>
			</div>
			<div
				ref={logosRef}
				className="flex h-[7vh] w-full items-center justify-between bg-[#F7F7F7] px-12"
			>
				<img src="/swiss.png" alt="swiss" width="64px" />
				<img src="/trivago.png" alt="trivago" width="64px" />
				<img src="/air-bnb.png" alt="airbnb" width="64px" />
				<img src="/turkish-airlines.png" alt="airbnb" width="64px" />
				<img src="/swiss.png" alt="airbnb" width="64px" />
			</div>
		</section>
	);
}
