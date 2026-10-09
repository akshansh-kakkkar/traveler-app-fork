import { Link } from "@tanstack/react-router";
import { Bird, Ribbon, SwitchCamera, Vote } from "lucide-react";
export default function Footer() {
  return (
    <div className="relative flex bg-[url('/mountains.jpg')] items-center w-full justify-around my-4 bg-white h-[35vh]">
      <div className="flex z-20 h-35 flex-col items-start text-start gap-2">
        <Link to="/">
          <img src="/footer-logo.png" alt="logo" width="92px" />
        </Link>
        <div className="w-50 text-sm text-[#757095] font-light">
          Travel helps companies manage payments easily.
        </div>
        <div className="text-white flex gap-4">
          <div className="bg-[#DF6951] p-2 rounded-full">
            <SwitchCamera size={24} />
          </div>
          <div className="bg-[#DF6951] p-2 rounded-full">
            <Ribbon size={24} />
          </div>
          <div className="bg-[#DF6951] p-2 rounded-full">
            <Bird size={24} />
          </div>
          <div className="bg-[#DF6951] p-2 rounded-full">
            <Vote size={24} />
          </div>
        </div>
      </div>
      <div className="flex-col h-35 z-20 gap-2">
        <div className="font-bold text-lg text-[#181433]">Company</div>
        <div className="flex flex-col gap-1 text-start text-sm text-[#181433]">
          <div>About Us</div>
          <div>Careers</div>
          <div>Blog</div>
          <div>Pricing</div>
        </div>
      </div>
      <div className="z-20 h-35 flex flex-col gap-2">
        <div className="font-bold text-lg text-[#181433]">Destinations</div>
        <div className="flex flex-col gap-1 text-start text-sm text-[#181433]">
          <div>Maldives</div>
          <div>Los Angelas</div>
          <div>Las Vegas</div>
          <div>Torronto</div>
        </div>
      </div>
      <div className="h-35 flex flex-col z-20 items-start gap-4 ">
        <div className="font-bold text-lg text-[#181433]">
          Join Our NewsLetter
        </div>
        <div className="bg-[#EEEEFF] z-20 w-[338px] pl-4 text-md rounded-lg outline-none">
          <input
            type="text"
            placeholder="Your email address"
            className="outline-non text-[#181433] outline-none"
          />
          <button className="text-white bg-[#DF6951] outline-none py-3 px-4 rounded-r-lg font-bold">
            Subscribe
          </button>
        </div>
        <div className="text-sm w-75 text-[#757095]">* Will send you weekly updates for your better &nbsp;&nbsp;tour packages.</div>
      </div>
			<img src="/mountain.jpg" alt="mountain" className="absolute w-180 opacity-20 h-50 right-0 -bottom-5 z-10" />
			<div className="absolute bg-[#E5E5EA]/40 w-[70vw] h-1 rounded-full bottom-0" />
		</div>
  );
}