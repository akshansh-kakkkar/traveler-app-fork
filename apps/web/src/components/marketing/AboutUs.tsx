export default function AboutUs() {
  return (
    <div className="flex lg:flex-row items-center justify-center text-center flex-col gap-6 lg:mx-32 mt-12 lg:h-screen lg:text-start lg:justify-center lg:items-center">
      <div className="lg:w-1/2">
				<img
          src="/honeymoon.png"
          alt="honeymoon"
          height={"399px"}
          width={"399px"}
					className="border-4 border-[#DF6951] rounded-t-full"
        />
      </div>
      <div className="text-black lg:w-1/2 flex flex-col gap-4">
        <div className="text-md uppercase text-[#DF6951] font-bold">
          Honeymoon specials
        </div>
        <div className="text-5xl w-150 font-volkhov font-semibold">
          Our Romantic Tropical Destinations
        </div>
        <div className="text-sm leading-8 w-150">
          Paris, known as the City of Love, offers an unmatched romantic escape
          with its iconic Eiffel Tower glowing against the evening sky and
          leisurely walks along the historic Seine River. Couples can wander
          through charming cobblestone streets, explore world-class art, and
          enjoy intimate candlelit dinners at sidewalk cafes that make every
          moment feel timeless.
        </div>
        <div className="bg-[#DF6951] text-white py-4 px-4 lg:w-40 text-center text-lg justify-center flex rounded-xl">
          View Packages
        </div>
      </div>
    </div>
  );
}
