import { useGSAP } from "@gsap/react";
import { Link, useLocation } from "@tanstack/react-router";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(useGSAP);
export default function Navbar() {
	const navbarRef = useRef<HTMLElement>(null);
	useGSAP(
		() => {
			const tl = gsap.timeline({
				defaults: { ease: "power3.out" },
			});

			tl.from(".navbar-logo", {
				y: -18,
				scale : 0.9,
				opacity: 0,
				duration: 0.65,
			})
				.from(
					".navbar-link",
					{
						y: -12,
						opacity: 0,
						duration: 0.45,
						stagger: 0.1,
					},
					"-=0.25",
				)
				.from(
					".navbar-login",
					{
						y: -15,
						opacity: 0,
						duration: 0.5,
					},
					"-=0.2",
				);
		},
		{ scope: navbarRef },
	);
	const [scrolled, setScrolled] = useState(false);
	const location = useLocation();

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 50);
		};
		window.addEventListener("scroll", handleScroll);
		handleScroll();
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);
	return (
		<nav
			ref={navbarRef}
			className={`fixed z-150 flex items-center justify-around py-2 text-center text-white transition-all duration-300 ${scrolled ? "inset-x-4 mx-4 mt-4 rounded-lg bg-black/50" : "w-full bg-white/10"}`}
		>
			<Link to="/">
				<img
					src="/navbar-logo.png"
					alt="logo"
					width="92px"
					className="navbar-logo"
				/>
			</Link>
			<div className="hidden gap-12 font-medium text-md sm:flex">
				<Link
					to="/"
					className={`navbar-link ${
						location.pathname === "/" ? "border-[#DF6951] border-b-3" : ""
					}`}
				>
					Home
				</Link>
				<Link
					to="/about"
					className={`navbar-link ${
						location.pathname === "/about" ? "border-[#DF6951] border-b-3" : ""
					}`}
				>
					About
				</Link>
				<Link
					to="/"
					className={`navbar-link ${
						location.pathname === "/services"
							? "border-[#DF6951] border-b-3"
							: ""
					}`}
				>
					Services
				</Link>
				<Link
					to="/"
					className={`navbar-link ${
						location.pathname === "/upcomming-packages"
							? "border-[#DF6951] border-b-3"
							: ""
					}`}
				>
					Upcoming Packages
				</Link>
			</div>
			<a
				href="/login"
				className="navbar-login hidden rounded-lg bg-[#DF6951] px-4 py-1 font-medium sm:block"
			>
				Login
			</a>
		</nav>
	);
}
