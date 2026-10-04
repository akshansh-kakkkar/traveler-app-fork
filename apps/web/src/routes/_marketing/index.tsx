import { createFileRoute } from "@tanstack/react-router";
import Navbar from "@/components/marketing/Navbar";
import HeroSeciton from "@/components/marketing/HeroSection";

export const Route = createFileRoute("/_marketing/")({
	component: LandingPage
});

function LandingPage() {

	return (
		<div className="relative">
		<Navbar />
		<HeroSeciton />
		</div>
	);
}
