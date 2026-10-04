export default function PromotionBanner() {
  return (
    <div className="flex justify-center items-center text-center h-[40vh]">
      <div className="flex flex-col w-1/2  relative gap-4 bg-[url('/nature.jpg')] h-full bg-center bg-cover justify-center items-center text-center">
        <div className="inset-0 bg-black/45 absolute" />
        <div className="flex flex-col -gap-2">
          <div className="text-white z-50 text-sm font-bold">Promotion</div>

          <div className={`text-white z-50 font-volkhov text-4xl`}>
            Explore Nature
          </div>
        </div>
        <div className="text-white z-50 border-2 rounded-lg font-bold border-white px-4 py-2">
          View Packages
        </div>
      </div>

      <div className="flex relative flex-col w-1/2 gap-4 text-white  bg-[url('/cities.jpg')] h-full bg-cover bg-center justify-center items-center text-center">
        <div className="inset-0 bg-black/45 absolute" />
        <div className="flex flex-col -gap-2">
          <div className="text-white z-50 text-sm font-bold">Promotion</div>
          <div className={`text-white z-50 text-4xl font-volkhov`}>
            Explore Cities
          </div>
        </div>
        <div className="text-white z-50 border-2 rounded-lg font-bold border-white px-4 py-2">
          View Packages
        </div>
      </div>
    </div>
  );
}
