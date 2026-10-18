import { Link } from "@tanstack/react-router";
import { Bird, Ribbon, SwitchCamera, Vote } from "lucide-react";
import gsap from "gsap";	
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Footer() {
	const footerRef = useRef<HTMLElement>(null);

	useGSAP(
		()=>{
			const tl = gsap.timeline({
				scrollTrigger : {
					trigger : footerRef.current,
					start : "top 90%",
					once : true,
				},
				defaults : {
					ease : "power3.out"
				},
			});
			tl.from(".footer-column", {
				y : 30,
				opacity : 0,
				duration : 0.7,
				stagger : 0.15
		}).from(
			".footer-social",
			{
				y : 15,
				opacity : 0,
				duration : 0.4,
				stagger : 0.1
			},
			"-=0.3",
		).from(
			".footer-newsletter", {
				x : 25,
				opacity : 0,
				duration : 0.7,
			},
			"-=0.5",
		).from(
			".footer-decoration",
			{
				y : 20,
				opacity : 0,
				duration : 0.8,
			},
			"-=0.4",
		);
		},
		{ scope : footerRef }
	)
  return (
    <footer ref={footerRef} className="relative md:flex-row flex-col items-center gap-12 text-center justify-center flex bg-[url('/mountains.jpg')] md:items-center w-full md:justify-around my-4 bg-white md:h-[35vh]">
      <div className=" footer-column flex z-20 h-35 flex-col items-start text-start gap-2">
        <Link to="/">
          <img src="/footer-logo.png" alt="logo" width="92px" />
        </Link>
        <div className="w-50 text-sm text-[#757095] font-light">
          Travel helps companies manage payments easily.
        </div>
        <div className="text-white flex gap-4">
          <div className="bg-[#DF6951] footer-social p-2 rounded-full">
            <SwitchCamera size={24} />
          </div>
          <div className="bg-[#DF6951] footer-social p-2 rounded-full">
            <Ribbon size={24} />
          </div>
          <div className="bg-[#DF6951] footer-social p-2 rounded-full">
            <Bird size={24} />
          </div>
          <div className="bg-[#DF6951] footer-social p-2 rounded-full">
            <Vote size={24} />
          </div>
        </div>
      </div>
      <div className="footer-column flex-col h-35 z-20 gap-2">
        <div className="font-bold text-lg text-[#181433]">Company</div>
        <div className="flex flex-col gap-1 text-start text-sm text-[#181433]">
          <div>About Us</div>
          <div>Careers</div>
          <div>Blog</div>
          <div>Pricing</div>
        </div>
      </div>
      <div className="footer-column z-20 h-35 flex flex-col gap-2">
        <div className="font-bold text-lg text-[#181433]">Destinations</div>
        <div className="flex flex-col gap-1 text-start text-sm text-[#181433]">
          <div>Maldives</div>
          <div>Los Angelas</div>
          <div>Las Vegas</div>
          <div>Torronto</div>
        </div>
      </div>
      <div className="footer-column h-35 flex flex-col z-20 items-start gap-4 ">
        <div className="font-bold text-lg text-[#181433]">
          Join Our NewsLetter
        </div>
        <div className="bg-[#EEEEFF] z-20 w-[338px] pl-4 text-md rounded-lg outline-none">
          <input
            type="text"
            placeholder="Your email address"
            className="outline-none text-[#181433] outline-none"
          />
          <button className="text-white bg-[#DF6951] outline-none py-3 px-4 rounded-r-lg font-bold">
            Subscribe
          </button>
        </div>
        <div className="text-sm w-75 text-[#757095]">* Will send you weekly updates for your better &nbsp;&nbsp;tour packages.</div>
      </div>
			<img src="/mountain.jpg" alt="mountain" className="absolute footer-decoration w-180 opacity-20 h-50 right-0 -bottom-5 z-10" />
			<div className="absolute bg-[#E5E5EA]/40 footer-decoration w-[70vw] h-1 rounded-full bottom-0" />
		</footer>
  );
}