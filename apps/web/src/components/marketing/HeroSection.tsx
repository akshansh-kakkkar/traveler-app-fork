import { ChevronDown } from "lucide-react";

export default function HeroSeciton() {
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

  return (
    <div className="h-screen overflow-hidden">
      <div className="relative bg-[url('./hero-image.jpg')] flex justify-start items-center text-center bg-cover bg-center h-[93vh]">
        <div className="absolute inset-0  bg-black/45" />
        <div className="flex gap-6 flex-col ml-120">
          <div className="z-50 translate-y-4">
            <img src="./hero-vector.png" alt="hero-vector" />
          </div>
          <div className="text-white z-50 text-6xl w-160 text-start font-extrabold">
            No matter where you're going to, we'll take you there
          </div>
          <div className="bg-[#F3F3F3]/60 inset-0 backdrop-blur-xs border-[#DF6951] border-1 text-xl  z-10 flex gap-4 py-8 px-4 items-center text-center justify-between rounded-sm">
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
            <div className="flex text-xs ">
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  style={{ backgroundColor: profile.bg }}
                  className={`border-2 first:ml-0 -ml-1 border-white py-1 px-2 rounded-full`}
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
			<div className="w-full px-12 h-[7vh] bg-[#F7F7F7] flex justify-between items-center">
					<img src="/swiss.png" alt="swiss" width="64px"  />
					<img src="/trivago.png" alt="trivago" width="64px"  />
					<img src="/air-bnb.png" alt="airbnb" width="64px"  />
					<img src="/turkish-airlines.png" alt="airbnb" width="64px"  />
					<img src="/swiss.png" alt="airbnb" width="64px"  />
			</div>
    </div>
  );
}
