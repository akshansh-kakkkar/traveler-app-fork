import { Link, useLocation } from "@tanstack/react-router";

export default function Navbar(){
	const location = useLocation();
	return(
		<div className="text-white flex justify-around w-full absolute top-10 items-center text-center z-50">
			<Link to="/">
				<img src="/navbar-logo.png" alt="logo" width="92px" />
			</Link>
			<div className=" gap-12 font-medium text-xs hidden sm:flex">
				<Link to="/" className={`${location.pathname === "/" ? "border-b-3 border-[#DF6951]" : ""}`}>Home</Link>
				<Link to="/" className={`${location.pathname === "/about" ? "border-b-3 border-[#DF6951]" : ""}`}>About</Link>
				<Link to="/" className={`${location.pathname === "/services" ? "border-b-3 border-[#DF6951]" : ""}`}>Services</Link>
				<Link to="/" className={`${location.pathname === "/upcomming-packages" ? "border-b-3 border-[#DF6951]" : ""}`}>Upcomming Packages</Link>
			</div>
			<div className="bg-[#DF6951] hidden sm:block py-2 px-4 rounded-lg font-semibold">
				Login
			</div>
		</div>
	)
}