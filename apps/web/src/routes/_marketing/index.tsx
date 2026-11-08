import { createFileRoute, redirect } from "@tanstack/react-router";
import AboutUs from "@/components/marketing/AboutUs";
import BannerPromo from "@/components/marketing/Banner-promo";
import CategorySection from "@/components/marketing/CategorySection";
import Footer from "@/components/marketing/Footer";
import HeroBanner from "@/components/marketing/Hero-Banner";
import HeroSeciton from "@/components/marketing/HeroSection";
import LibertyBanner from "@/components/marketing/Liberty-banner";
import Navbar from "@/components/marketing/Navbar";
import OurPackages from "@/components/marketing/Our-Packages";
import Promotion from "@/components/marketing/Promotion";
import PromotionBanner from "@/components/marketing/Promotion-Banner";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/_marketing/")({
	beforeLoad: async () => {
		const { data: session } = await authClient.getSession();
		if (session) {
			throw redirect({
				to: "/dashboard",
			});
		}
	},
	component: LandingPage,
});

function LandingPage() {
	return (
		<>
			<Navbar />
			<HeroSeciton />
			<CategorySection />
			<AboutUs />
			<HeroBanner />
			<LibertyBanner />
			<Promotion />
			<PromotionBanner />
			<OurPackages />
			<Footer />
		</>
	);
}
