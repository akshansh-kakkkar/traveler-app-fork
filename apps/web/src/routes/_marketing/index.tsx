import { createFileRoute } from "@tanstack/react-router";
import Navbar from "@/components/marketing/Navbar";
import HeroSeciton from "@/components/marketing/HeroSection";
import CategorySection from "@/components/marketing/CategorySection";

export const Route = createFileRoute("/_marketing/")({
	component: LandingPage
});

function LandingPage() {

	return (
		<>
		<div className="relative">
		<Navbar />
		<HeroSeciton />
		</div>
		<CategorySection />
		</>
	);
}
