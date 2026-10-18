
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function About_Tour_Plan() {
	const tourPlaneRef = useRef<HTMLDivElement>(null);

  const stats = [
    {
      id: 1,
      percent: 78,
      name: "Vacations",
      color: "#10E7FF",
    },
    {
      id: 2,
      percent: 55,
      name: "HONEYMOON",
      color: "#FFB47D",
    },
    {
      id: 3,
      percent: 30,
      name: "MUSICAL EVENTS",
      color: "#7202FF",
    },
  ];

	useGSAP(
		()=>{
			const tl = gsap.timeline({
				defaults : {ease : "power3.out"},
				scrollTrigger : {
					trigger : tourPlaneRef.current,
					start : "top 75%",
					once : true,
				},
			});
			tl.from(".tour-plan-image", {
				x : -40,
				opacity : 0,
				duration : 0.8,
			}).from(
				".tour-plan-label",
				{
					y :15,
					opacity	 : 0,
					duration : 0.4,
				},
				"-=0.4",
			).from(
				".tour-plan-heading",
				{
					y : 25,
					opacity : 0,
					duration: 0.6
				},
				"-=0.2"
			).from(
				".tour-plan-description",
				{
					y : 20,
					opacity : 0,
					duration : 0.6,
				},
				"-=0.3",
			).from(
				".tour-plan-stat",
				{
					y : 20,
					opacity : 0,
					duration : 0.6,
				},
				"-=0.3",
			).from(
							".tour-plan-shell",
							{
								scale : 0.8,
								rotation : -15,
								opacity : 0,
								duration : 0.7,
							},
							"-=0.5"
						);
		},
		{scope : tourPlaneRef}
	)
  return (
    <div ref={tourPlaneRef} className="relative h-[70vh] flex gap-24 justify-center items-center">
      <div className="tour-plan-image">
        <img src="/tour-plan.png" alt="tour-plan" />
      </div>
      <div className="w-[40vw] flex flex-col gap-2">
        <div className="tour-plan-label text-sm font-bold text-[#DF6951]">TREND</div>
        <div className="text-3xl tour-plan-heading font-bold font-volkhov text-[#181E4B]">
          Our Popular Tour Plans
        </div>
        <div className="text-md tour-plan-description text-black">
          Giza is an Egyptian city on the west bank of the Nile. It is globally
          famous for the Giza Plateau, a vast ancient necropolis. This historic
          site features the iconic Great Sphinx and the three massive pyramids
          built as monumental pharaoh tombs over 4,500 years ago.
        </div>
        <div className="flex justify-around my-12">
          {stats.map((stat) => (
            <div                   
						key={stat.id}
						className="tour-plan-stat flex items-center justify-center gap-10">
              <div className="flex items-center justify-center gap-10">
                <div
                  className="flex flex-col items-center gap-4"
                >
                  <div
                    className="h-24 w-24 rounded-full p-[7px]"
                    style={{
                      background: `conic-gradient(${stat.color} ${stat.percent}%,
											#dedede ${stat.percent}% 100%
										)`,
                    }}
                  >
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-white shadow-inner">
                      <span className="text-2xl font-normal text-[#555]">
                        {stat.percent}%
                      </span>
                    </div>
                  </div>
									<div className="text-black uppercase">{stat.name}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
			<div className="tour-plan-shell absolute right-4 top-2">
				<img src="/tour-plan-shell.png" alt="tour-plan" width={200} />
			</div>
    </div>
  );
}
