import { ChevronDown } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
gsap.registerPlugin(ScrollTrigger, useGSAP)
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
				defaults : { ease : "power3.out"},
			});

			intro.from(".hero-bg", {
				scale : 1.12,
				duration : 1.8,
				ease: "power2.out",
			})
			.from(
				".hero-vector",
				{
					y : 25,
					opacity : 0,
					duration : 0.7,
				},
				"-=1.1",
			).from(".hero-title",
				{
					y : 45,
					opacity : 0,
					duration : 0.9
				},
				"-=0.4",
			).from(
				".hero-search",
				{
					y : 30,
					opacity : 0,
					duration : 0.7,
				},
				"-=0.45"
			).from(
				".hero-social",
				{
					y : 15,
					opacity : 0,
					duration : 0.6,
				},
				"-=0.3"
			).from(
				".hero-circle",
				{
					x : -70,
					opacity : 0,
					duration : 1,
				},
				"-=0.8",
			);

			gsap.to(".profile-avatar", {
				y : -5,
				duration : 1.5,
				stagger : {
					each : 0.12,
					repeat : -1,
					yoyo : true,
				},
				ease : "sine.inOut",
			});

			if(logosRef.current){
				gsap.from(logosRef.current.children, {
					y : 25,
					opacity : 0,
					stagger : 0.12,
					duration : 0.65,
					ease : "power2.out",
					scrollTrigger : {
						trigger : logosRef.current,
						start : "top 90%",
						once : true,
					},
				});
			}
		},
					{ scope : heroRef }

	)

  return (
    <section ref={heroRef} className="md:h-screen h-[200vh] md:overflow-hidden">
      <div className="hero-bg relative bg-[url('./hero-image.jpg')] flex justify-start items-center text-center bg-cover bg-center h-full md:h-[93vh]">
        <div className="absolute inset-0  bg-black/45" />
        <div className="flex gap-6 flex-col justify-center lg:justify-start lg:items-start items-center w-full lg:ml-120">
          <div className="hero-vector z-50 translate-y-4">
            <img src="./hero-vector.png" alt="hero-vector" />
          </div>
          <div className="hero-title text-white z-50 text-center lg:text-start  text-6xl w-160  font-extrabold">
            No matter where you're going to, we'll take you there
          </div>
          <div className="bg-[#F3F3F3]/60 hero-search inset-0 backdrop-blur-xs border-[#DF6951] border-1 text-xl  z-10 flex gap-4 py-8 px-4 items-center text-center justify-between rounded-sm">
            <div>
              <p>Where to?</p>
            </div>
            <div className="flex gap-4  text-xl items-center text-center justify-center">
              <div className="w-[2.5px] h-8 rounded-full mr-6 bg-white" />
              <p>Travel Type</p>
              <>
                <ChevronDown />
              </>
              <div className="w-[2.5px] h-8 rounded-full bg-white ml-6" />
            </div>
            <div className="flex gap-4 items-center text-center justify-center">
              <p>Duration</p>
              <>
                <ChevronDown />
              </>
            </div>
            <button className="bg-[#DF6951] px-8 py-3 rounded-sm text-xs font-semibold">
              Submit
            </button>
          </div>
          <div className="flex text-xs z-50 items-center text-center gap-4">
            <div className="flex text-xs hero-social">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  style={{ backgroundColor: profile.bg }}
                  className={`border-2 profile-avatar first:ml-0 -ml-1 border-white py-1 px-2 rounded-full`}
                >
                  {profile.text}
                </div>
              ))}
            </div>
            2,500 people booked Tommorowland Event in last 24 hours
          </div>
        </div>
        <div className="absolute bottom-[-250px] overflow-hidden left-[30px] w-[500px] h-[500px] rounded-full border border-dashed border-white/80">
          <div className="absolute left-[85px] overflow-hidden top-[85px] w-[330px] h-[330px] rounded-full border border-dashed border-white/80">
            <div className="absolute inset-0 flex items-center overflow-hidden justify-center -top-32">
              <span className="text-white text-xl font-light">
								Scroll
							</span>
            </div>
          </div>
        </div>
      </div>
			<div ref={logosRef} className=" w-full  px-12 h-[7vh] bg-[#F7F7F7] flex justify-between items-center">
					<img src="/swiss.png" alt="swiss" width="64px"  />
					<img src="/trivago.png" alt="trivago" width="64px"  />
					<img src="/air-bnb.png" alt="airbnb" width="64px"  />
					<img src="/turkish-airlines.png" alt="airbnb" width="64px"  />
					<img src="/swiss.png" alt="airbnb" width="64px"  />
			</div>
    </section>
  );
}
