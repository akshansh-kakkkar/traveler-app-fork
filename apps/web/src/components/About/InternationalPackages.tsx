import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
gsap.registerPlugin(useGSAP, ScrollTrigger);

const cards = [
  {
    id: 1,
    name: "Barcelona",
    price: 940,
    img: "img1.png",
  },
  {
    id: 2,
    name: "Switzerland",
    price: 640,
    img: "img2.png",
  },
  {
    id: 3,
    name: "Rio de Jenero",
    price: 740,
    img: "img3.jpg",
  },
  {
    id: 4,
    name: "Barcelona",
    price: 840,
    img: "img4.png",
  },
  {
    id: 5,
    name: "Tommorow land",
    price: 520,
    img: "img5.png",
  },
  {
    id: 6,
    name: "Los Angelas",
    price: 600,
    img: "img6.png",
  },
  {
    id: 7,
    name: "India",
    price: 670,
    img: "img8.jpg",
  },
  {
    id: 8,
    name: "Barcelona",
    price: 580,
    img: "img8.jpg",
  },
  {
    id: 9,
    name: "Maldives",
    price: 520,
    img: "img9.jpg",
  },
  {
    id: 10,
    name: "Barcelona",
    price: 610,
    img: "img10.png",
  },
  {
    id: 11,
    name: "Pakistan",
    price: 580,
    img: "img12.jpg",
  },

];
export default function InternationalPage() {
	const sectionRef = useRef<HTMLElement>(null);
	useGSAP(
		()=>{
			const tl = gsap.timeline({
				defaults : {ease : "power3.out"},
				scrollTrigger : {
					trigger : sectionRef.current,
					start : "top 75%",
					once : true,
				},
			});
			tl.from(".international-eyebrow", {
				y : 15,
				opacity : 0,
				duration : 0.45,
			}).from(
				".international-title",
				{
					y : 30,
					opacity : 0,
					duration : 0.7,
				},
				"-=0.2",
			).from(
				".international-subtitle",
				{
					y : 15,
					opacity : 0,
					duration : 0.5,
				}
			).from(
				".destination-card",
				{
					y : 35,
					opacity : 0,
					duration : 0.65,
					stagger : 0.09,
				},
				"-=0.1"
			);
		},
		{scope : sectionRef}
	)
  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#FAF8F5] px-5 py-24 sm:px-10 lg:px-16 xl:px-24">
      <div className="pointer-events-none absolute -right-32 top-10 h-80 w-80 rounded-full bg-[#DF6951]/[0.4] blur-3xl" />
			<div className="flex justify-center items-center w-full flex-col gap-2">
        <p className="text-[#DF6951] font-bold international-eyebrow">Explore More</p>
        <h1 className="text-[#181E4B] international-title text-4xl font-volkhov uppercase font-bold">
          Our International Packages
        </h1>
      </div>
      <div className="grid grid-cols-4 gap-7 my-12 mx-32">
        {cards.map((img, i) => (
          <div
            key={i}
            className={`relative overflow-hidden destination-card ${
              i === 2 ? "row-span-2" : "h-[240px]"
            }`}
          >
            <img src={`/internation-package/${img.img}`} alt={img.name} className="h-full w-full object-cover" />
            <div className="absolute bottom-0 flex w-full justify-between p-4 text-white">
              <span>{img.name}</span>
              <span>${img.price}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
