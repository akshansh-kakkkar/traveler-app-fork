export default function WaterBody() {
  return (
    <div className="h-[70vh] flex gap-12 mx-24 justify-center items-center">
      <div className="w-[50vw] text-black flex flex-col gap-4">
        <div className="text-lg font-bold">PROMOTION</div>
        <div className="text-4xl w-[30vw] font-volkhov text-[#181E4B] font-bold">
          We Provide You Best Europe Sightseeing Tours
        </div>
        <div className="font-poppins text-sm w-[40vw]">
          Paris, known as the City of Love, offers an unmatched romantic escape
          with its iconic Eiffel Tower glowing against the evening sky and
          leisurely walks along the historic Seine River. Couples can wander
          through charming cobblestone streets, explore world-class art, and
          enjoy intimate candlelit dinners at sidewalk cafes that make every
          moment feel timeless.
        </div>
        <div className="bg-[#DF6951] w-fit px-4 py-2 rounded-lg text-white text-lg font-bold">
          View Packages
        </div>
      </div>
      <div className="relative mx-auto aspect-square w-[500px]">
        <div className="absolute inset-[8%] overflow-hidden rounded-full border-2 border-sky-500">
          <img
            src="/water-body.jpg"
            alt="water-body"
            className=" h-full w-full object-cover"
          />
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 h-24 w-14"
            style={{
              transform: `translate(-50%, -50%) rotate(${
                i * 45
              }deg) translateY(-192px)`,
            }}
          >
            <div className="relative h-6 w-16">
              <div className="absolute inset-x-0 top-1 h-[2px] rounded-full bg-[#DF6951]" />
              <div className="absolute inset-x-0 top-3 h-[2px] rounded-full bg-[#DF6951]" />
            </div>
          </div>
        ))}
				<div>
					<img src="/bg-hero.png" alt="bg-hero" />
				</div>
      </div>
    </div>
  );
}
