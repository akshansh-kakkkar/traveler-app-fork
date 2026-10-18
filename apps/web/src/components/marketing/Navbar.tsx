import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
gsap.registerPlugin(useGSAP);
export default function Navbar() {
	const navbarRef = useRef<HTMLElement>(null);
	useGSAP(
		()=>{
			const tl = gsap.timeline({
				defaults : { ease : "power3.out" },
			});

			tl.from(".navbar-logo", {
				y : -20,
				opacity : 0,
				duration : 0.6,
			}).from(
				".navbar-link",
				{
					y : -15,
					opacity : 0,
					duration : 0.45,
					stagger : 0.1,
				},
				"-=0.25",
			).from(
				".navbar-login",
			{
				y : -15,
				opacity : 0,
				duration : 0.5,
			},
			"-=0.2",
			);
		},
		{ scope : navbarRef }
	)
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
    <nav ref={navbarRef} className={`text-white fixed  flex justify-around  py-2 items-center text-center z-150 transition-all duration-300 ${scrolled ? "bg-black/50 mx-4 mt-4 rounded-lg inset-x-4" : "bg-white/10 w-full" }`}>
      <Link to="/">
        <img src="/navbar-logo.png" alt="logo" width="92px" className="navbar-logo" />
      </Link>
      <div className=" gap-12 font-medium text-md hidden sm:flex">
        <Link
          to="/"
          className={`navbar-link ${
            location.pathname === "/" ? "border-b-3 border-[#DF6951]" : ""
          }`}
        >
          Home
        </Link>
        <Link
          to="/about"
          className={`navbar-link ${
            location.pathname === "/about" ? "border-b-3 border-[#DF6951]" : ""
          }`}
        >
          About
        </Link>
        <Link
          to="/"
          className={`navbar-link ${
            location.pathname === "/services"
              ? "border-b-3 border-[#DF6951]"
              : ""
          }`}
        >
          Services
        </Link>
        <Link
          to="/"
          className={`navbar-link ${
            location.pathname === "/upcomming-packages"
              ? "border-b-3 border-[#DF6951]"
              : ""
          }`}
        >
          Upcoming Packages
        </Link>
      </div>
      <a href="/login" className=" bg-[#DF6951] hidden sm:block py-1 px-4 rounded-lg font-medium">
        Login
      </a>
    </nav>
  );
}