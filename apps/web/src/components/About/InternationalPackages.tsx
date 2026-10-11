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
  return (
    <div className="">
      <div className="flex justify-center items-center w-full flex-col gap-2">
        <p className="text-[#DF6951] font-bold">Explore More</p>
        <h1 className="text-[#181E4B] text-4xl font-volkhov uppercase font-bold">
          Our International Packages
        </h1>
      </div>
      <div className="grid grid-cols-4 gap-7 my-12 mx-32">
        {cards.map((img, i) => (
          <div
            key={i}
            className={`relative overflow-hidden ${
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
    </div>
  );
}
