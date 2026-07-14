import Hero from "@/sections/Hero";
import Services from "@/sections/Services";
import Gallery from "@/sections/Gallery";
import Footer from "@/sections/Footer";
import Clients from "@/sections/Clients";
import Testimonials from "@/sections/Testimonials";
import PartnerWithUs from "@/sections/PartnerWithUs";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-[#050505]">
      {/* 1. Main page sections */}
      <div className="w-full">
        <Hero />
        <Services />
        <Gallery />
        <Clients />
        <Testimonials />
        <PartnerWithUs />
      </div>

      {/* 2. FIXED: Keeps the light background so the black curves stand out, 
          but completely removes the top padding so it snaps flush against the section above it */}
      <div className="w-full bg-[#f5f5f5]">
        <Footer />
      </div>
    </div>
  );
}