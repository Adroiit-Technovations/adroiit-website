import Navbar from "@/components/Navbar";
import Hero from "@/sections/Hero";
import Services from "@/sections/Services";
import Gallery from "@/sections/Gallery";
import Footer from "@/sections/Footer";
import Clients from "@/sections/Clients";
import Testimonials from "@/sections/Testimonials";
import WhatsappButton from "@/components/WhatsappButton";
import PartnerWithUs from "@/sections/PartnerWithUs"

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <Gallery />
      <Clients />
      <Testimonials />
      <PartnerWithUs />
      <Footer />

      {/* 🔥 Floating WhatsApp */}
      <WhatsappButton />
    </>
  );
}
