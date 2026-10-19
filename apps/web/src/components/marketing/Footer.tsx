import { useGSAP } from "@gsap/react";
import { Link } from "@tanstack/react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Bird, Ribbon, SwitchCamera, Vote } from "lucide-react";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Footer() {
	const footerRef = useRef<HTMLElement>(null);

	useGSAP(
		() => {
			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: footerRef.current,
					start: "top 90%",
					once: true,
				},
				defaults: {
					ease: "power3.out",
				},
			});
			tl.from(".footer-column", {
				y: 30,
				opacity: 0,
				duration: 0.7,
				stagger: 0.15,
			})
				.from(
					".footer-social",
					{
						y: 15,
						opacity: 0,
						duration: 0.4,
						stagger: 0.1,
					},
					"-=0.3",
				)
				.from(
					".footer-newsletter",
					{
						x: 25,
						opacity: 0,
						duration: 0.7,
					},
					"-=0.5",
				)
				.from(
					".footer-decoration",
					{
						y: 20,
						opacity: 0,
						duration: 0.8,
					},
					"-=0.4",
				);
		},
		{ scope: footerRef },
	);
	return (
		<footer
			ref={footerRef}
			className="relative my-4 flex w-full flex-col items-center justify-center gap-12 bg-[url('/mountains.jpg')] bg-white text-center md:h-[35vh] md:flex-row md:items-center md:justify-around"
		>
			<div className="footer-column z-20 flex h-35 flex-col items-start gap-2 text-start">
				<Link to="/">
					<img src="/footer-logo.png" alt="logo" width="92px" />
				</Link>
				<div className="w-50 font-light text-[#757095] text-sm">
					Travel helps companies manage payments easily.
				</div>
				<div className="flex gap-4 text-white">
					<div className="footer-social rounded-full bg-[#DF6951] p-2">
						<SwitchCamera size={24} />
					</div>
					<div className="footer-social rounded-full bg-[#DF6951] p-2">
						<Ribbon size={24} />
					</div>
					<div className="footer-social rounded-full bg-[#DF6951] p-2">
						<Bird size={24} />
					</div>
					<div className="footer-social rounded-full bg-[#DF6951] p-2">
						<Vote size={24} />
					</div>
				</div>
			</div>
			<div className="footer-column z-20 h-35 flex-col gap-2">
				<div className="font-bold text-[#181433] text-lg">Company</div>
				<div className="flex flex-col gap-1 text-start text-[#181433] text-sm">
					<div>About Us</div>
					<div>Careers</div>
					<div>Blog</div>
					<div>Pricing</div>
				</div>
			</div>
			<div className="footer-column z-20 flex h-35 flex-col gap-2">
				<div className="font-bold text-[#181433] text-lg">Destinations</div>
				<div className="flex flex-col gap-1 text-start text-[#181433] text-sm">
					<div>Maldives</div>
					<div>Los Angelas</div>
					<div>Las Vegas</div>
					<div>Torronto</div>
				</div>
			</div>
			<div className="footer-column z-20 flex h-35 flex-col items-start gap-4">
				<div className="font-bold text-[#181433] text-lg">
					Join Our NewsLetter
				</div>
				<div className="z-20 w-[338px] rounded-lg bg-[#EEEEFF] pl-4 text-md outline-none">
					<input
						type="text"
						placeholder="Your email address"
						className="text-[#181433] outline-none outline-none"
					/>
					<button className="rounded-r-lg bg-[#DF6951] px-4 py-3 font-bold text-white outline-none">
						Subscribe
					</button>
				</div>
				<div className="w-75 text-[#757095] text-sm">
					* Will send you weekly updates for your better &nbsp;&nbsp;tour
					packages.
				</div>
			</div>
			<img
				src="/mountain.jpg"
				alt="mountain"
				className="footer-decoration absolute right-0 -bottom-5 z-10 h-50 w-180 opacity-20"
			/>
			<div className="footer-decoration absolute bottom-0 h-1 w-[70vw] rounded-full bg-[#E5E5EA]/40" />
		</footer>
	);
}
