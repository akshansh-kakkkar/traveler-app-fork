import { Calendar, MapPin, Star, UserRound } from "lucide-react";

const cards = [
  {
    id: 1,
    days: 8,
    people: 25,
    title: "Switzerland",
    stars: 5,
    region: "Europe",
    fees: 1000,
    flag: "./swiss-flag.png",
    image: "./swiss-view.png",
    description:
      "Switzerland is a wealthy, landlocked European nation famous for its stunning Alps, global neutrality, and system of direct democracy. Divided into 26 cantons, it has four official languages. The country boasts a high quality of life and is a hub for banking, luxury watches, chocolate, and innovation.",
  },
  {
    id: 2,
    days: 8,
    people: 30,
    title: "Amazon",
    stars: 4,
    region: "Brazil",
    fees: 1223,
    flag: "./brazil-flag.png",
    image: "./brazil-view.png",
    description:
      "Brazil is the largest country in South America, famous for its vibrant Amazon rainforest and diverse wildlife. Celebrated for its rich cultural fusion, it is globally renowned for the energetic Rio Carnival, rhythmic Samba music, and football passion. Its capital is Brasília, while its official language is Portuguese.",
  },
  {
    id: 3,
    days: 8,
    people: 155,
    title: "Giza",
    region: "Egypt",
    stars: 5,
    fees: 1200,
    flag: "./giza-flag.png",
    image: "./giza-view.png",
    description:
      "Giza is an Egyptian city on the west bank of the Nile. It is globally famous for the Giza Plateau, a vast ancient necropolis. This historic site features the iconic Great Sphinx and the three massive pyramids built as monumental pharaoh tombs over 4,500 years ago.",
  },
];
export default function OurPackages() {
  return (
    <div className="flex flex-col gap-4 h-screen">
      <div className="flex flex-col my-12 justify-center items-center text-center">
        <div className="uppercase font-bold text-[#DF6951]">Trendy</div>
        <div className="font-volkhov text-6xl leading-14 w-125 font-semibold text-[#181E4B]">
          Our Trending Tour Packages
        </div>
      </div>
      <div className="grid grid-cols-3 place-items-center justify-center text-card items-center">
        {cards.map((card) => (
          <div key={card.id} className="w-[450px] h-[510px] rounded-2xl shadow">
            <div className="relative">
              <img
                src={card.image}
                alt={card.title}
                className="w-[450px] h-[250px] rounded-2xl object-cover"
              />
              <img
                src={card.flag}
                alt={card.title}
                width={"40px"}
                height={"80px"}
                className="object-cover w-12 h-12 top-55 border-4 shadow-lg border-white rounded-full absolute right-4"
              />
            </div>
            <div className="flex my-2 gap-8 text-[#7D7D7D] text-sm items-center  text-center">
              <div className="flex gap-2 items-center mx-4">
                <span>
                  <Calendar />
                </span>
                <span>{card.days} days</span>
              </div>
              <div className="flex items-center gap-2 mx-4">
                <span>
                  <UserRound />
                </span>
                <span>{card.people} people going</span>
              </div>
            </div>
            <div className="flex my-2 justify-between mx-4">
              <div className="text-2xl text-[#2F2F2F] font-bold">
                {card.title}
              </div>
              <div className="flex gap-1">
                {Array.from({ length: card.stars }).map((_, index) => (
                  <Star
                    key={index}
                    size={18}
                    className="fill-[#FFB800] text-[#ffb800]"
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-between text-[#7D7D7D] text-sm items-center">
              <div className="flex gap-2 text-center justify-center items-center mx-4">
                <span>
                  <MapPin size={16} />
                </span>
                <span>{card.region}</span>
              </div>
              <div className="mx-4 text-[#DF6951] font-bold text-2xl">
                $ {card.fees}
              </div>
            </div>
            <div className="text-xs my-2 mx-4 h-[80px] leading-5">
              {card.description}
            </div>
            <div className="mx-4 bg-[#DF6951] w-fit px-4 py-2 rounded-xl text-white font-bold  shadow-[#DF695126]">
              Explore Now
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
