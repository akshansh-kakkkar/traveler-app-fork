import { createFileRoute } from "@tanstack/react-router";
import Navbar from "@/components/marketing/Navbar";
import HeroSeciton from "@/components/marketing/HeroSection";
import CategorySection from "@/components/marketing/CategorySection";
import AboutUs from "@/components/marketing/AboutUs";
import HeroBanner from "@/components/marketing/Hero-Banner";
import LibertyBanner from "@/components/marketing/Liberty-banner";
import Promotion from "@/components/marketing/Promotion";
import PromotionBanner from "@/components/marketing/Promotion-Banner";
import OurPackages from "@/components/marketing/Our-Packages";
import BannerPromo from "@/components/marketing/Banner-promo";
import Footer from "@/components/marketing/Footer";

export const Route = createFileRoute("/_marketing/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <>
      <div className="relative">
        <Navbar />
        <HeroSeciton />
      </div>
      <CategorySection />
      <AboutUs />
      <HeroBanner />
      <LibertyBanner />
      <Promotion />
      <PromotionBanner />
      <OurPackages />
      <BannerPromo />
      <Footer />
    </>
  );
}
