"use client";

import { motion } from "framer-motion";
import { Cpu, PenTool, Microscope, Briefcase, Megaphone, ArrowRight, Zap, ShieldCheck, Globe, PlaneTakeoff } from "lucide-react";
import Image from "next/image";
import { Bricolage_Grotesque } from "next/font/google";
import { useState } from "react";
import InternshipApplication from "@/components/internship-application";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

export default function InternshipPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDomain, setActiveDomain] = useState("Embedded Systems & IoT");

  const domains = [
    { title: "Embedded Systems & IoT", status: "Open", desc: "Architect smart solutions using ESP32 & Arduino.", icon: <Cpu size={18} />, image: "/internship/embedded.jpg" },
    { title: "Mechanical CAD", status: "Open", desc: "Design high-precision hardware & 3D workflows.", icon: <PenTool size={18} />, image: "/internship/mech.jpg" },
    { title: "Drone Technology", status: "Open", desc: "Build and calibrate advanced flight systems.", icon: <PlaneTakeoff size={18} />, image: "/internship/drone.jpg" },
    { title: "Research & Development", status: "Open", desc: "Explore experimental STEM technologies.", icon: <Microscope size={18} />, image: "/internship/rd.jpg" },
    { title: "Founders' Office", status: "Open", desc: "Work on scaling & operational strategy.", icon: <Briefcase size={18} />, image: "/internship/founder.jpg" },
    { title: "Digital Marketing", status: "Open", desc: "Growth marketing and content strategy.", icon: <Megaphone size={18} />, image: "/internship/marketing.jpg" },
  ];

  const handleApply = (title: string) => {
    setActiveDomain(title);
    setIsModalOpen(true);
  };

  return (
    <div className={`${bricolage.className} bg-white min-h-screen`}>
      {/* Hero */}
      <section className="pt-32 pb-20 px-8 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl md:text-7xl font-black text-purple-600 mb-2">Building the <span className="text-black">Next Gen</span></h1>
          <p className="text-black text-3xl font-bold italic mb-6">Of Innovators.</p>
          <div className="h-2 w-32 bg-purple-600 rounded-full mb-8" />
          <p className="text-gray-600 text-lg max-w-md font-medium">Join Adroiit Technovations for a hands-on experience. Solve industrial problems and grow with experts.</p>
        </div>
        <div className="relative aspect-video rounded-[40px] overflow-hidden shadow-2xl border-8 border-gray-50">
          <Image src="/internship/internship-hero1.png" alt="Hero" fill className="object-cover" />
        </div>
      </section>

      {/* Domains */}
      <section className="py-24 bg-[#0A0A0A] rounded-t-[50px] md:rounded-t-[100px] px-8 text-white">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-black text-purple-500 uppercase">Specialized Domains</h2>
          <p className="text-gray-400 mt-4">Applications now open for 2026 batches.</p>
        </div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {domains.map((d, i) => (
            <div key={i} className="bg-[#141414] border border-white/5 rounded-[32px] overflow-hidden group hover:border-purple-500/30 transition-all">
              <div className="h-40 relative">
                <Image src={d.image} alt={d.title} fill className="object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-purple-500">{d.icon}</span>
                  <h3 className="text-lg font-black">{d.title}</h3>
                </div>
                <p className="text-gray-400 text-sm mb-6 font-medium">{d.desc}</p>
                <button onClick={() => handleApply(d.title)} className="w-full bg-purple-600 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-purple-700 transition-all">Apply Now</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Us */}
      <section className="py-24 bg-white px-8 max-w-7xl mx-auto">
        <h2 className="text-4xl font-black text-black text-center mb-16 uppercase">Why Intern With Us?</h2>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            { t: "Live Projects", d: "Work on actual hardware deployed in industries.", icon: <Zap className="text-orange-500" /> },
            { t: "Certification", d: "Gain industry-recognized valid certificates.", icon: <ShieldCheck className="text-green-500" /> },
            { t: "Career Path", d: "Direct recruitment paths for top performers.", icon: <Globe className="text-blue-500" /> }
          ].map((c, i) => (
            <div key={i} className="bg-neutral-50 p-10 rounded-[40px] border border-neutral-100">
              <div className="mb-4 bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-md">{c.icon}</div>
              <h4 className="text-xl font-black mb-2">{c.t}</h4>
              <p className="text-gray-600 font-medium">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials + Footer */}
      <section className="bg-[#050505] pt-20">
         <div className="max-w-7xl mx-auto px-8 mb-20 text-center">
            <h2 className="text-2xl font-black text-white uppercase mb-12">Intern Stories</h2>
            <div className="grid md:grid-cols-2 gap-8 text-left">
               <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/5 italic text-gray-400 font-medium">"The hands-on learning at Adroiit was unlike anything else."</div>
               <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/5 italic text-gray-400 font-medium">"Working in the Founders' Office gave me real-world insights."</div>
            </div>
         </div>
      </section>

      <InternshipApplication isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} selectedDomain={activeDomain} />
    </div>
  );
}