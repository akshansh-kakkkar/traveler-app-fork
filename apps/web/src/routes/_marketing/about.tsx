import About_Hero from "@/components/About/About-hero";
import WaterBody from "@/components/About/Water-body-section";
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
      <Footer />
    </>
  );
}
