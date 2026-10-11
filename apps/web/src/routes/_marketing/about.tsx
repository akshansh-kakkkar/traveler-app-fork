import About_Hero from "@/components/About/About-hero";
import About_Tour_Plan from "@/components/About/About-tour-plan";
import Girl_Banner from "@/components/About/Girl-banner";
import InternationalPage from "@/components/About/InternationalPackages";
import WaterBody from "@/components/About/Water-body-section";
import BannerPromo from "@/components/marketing/Banner-promo";
import Footer from "@/components/marketing/Footer";
import Navbar from "@/components/marketing/Navbar";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_marketing/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <Navbar />
			<About_Hero />
			<WaterBody />
			<Girl_Banner />
			<About_Tour_Plan />
			<InternationalPage />
			<BannerPromo />
      <Footer />
    </>
  );
}
