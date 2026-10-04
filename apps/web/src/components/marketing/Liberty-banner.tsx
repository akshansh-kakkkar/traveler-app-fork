export default function LibertyBanner(){
	return (
		<div className="h-[30vh] bg-center bg-inver bg-[url('/liberty.jpg')] scale-120 flex w-full text-center justify-center scale-x-[-1]  bg-[position:center_30%] h-64 bg-cover">
			<div className=" relative scale-x-[-1] p-8 h-full flex justify-center items-center text-center">
				<div className={`text-white text-4xl font-volkhov font-bold  text-center items-center text-center translate-y-12	 justify-center w-full h-full`}>
					Let's Make Your Next Holiday Amazing
				</div>
				<div className="absolute top-32 right-0"> 
					<img src="/lin.png" alt="line" />
				</div>
			</div>
		</div>
	)
}