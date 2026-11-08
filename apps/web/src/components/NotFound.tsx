import { Link } from "@tanstack/react-router";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { Compass, Home } from "lucide-react";
export default function NotFound() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-[#E4EFE2] px-6 py-12">
			<div className="w-full max-w-xl text-center">
				<h1 className="mt-3 font-extrabold text-8xl text-[#12271A]">404</h1>
				<h2 className="mt-4 font-semibold text-2xl text-[#12271A]">
					Looks like you've lost your way!
				</h2>
				<p className="mx-auto mt-3 max-w-md text-[#6C776D]">
					The page you're looking for doesn't exist or may have been moved.
					Let's get you back on track.
				</p>
				<div className="mt-8 flex flex-wrap justify-center gap-4">
					<Link
						to={"/dashboard"}
						className="b flex items-center gap-2 rounded-lg bg-[#12271A] px-6 py-3 font-semibold text-2xl text-white transition hover:bg-[#12271a64]"
					>
						<span>
							<Home />
						</span>
						<span>Go Back Home</span>
					</Link>
				</div>
			</div>
		</main>
	);
}
