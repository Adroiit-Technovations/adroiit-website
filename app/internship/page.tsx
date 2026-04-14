"use client";

import { motion } from "framer-motion";
import { Zap, ShieldCheck, Globe, Award, Rocket } from "lucide-react";
import Image from "next/image";
import { Bricolage_Grotesque } from "next/font/google";
import { useState, useEffect } from "react";
import InternshipApplication from "@/components/internship-application";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

const testimonials = [
  {
    name: "Priya R",
    role: "Parent - 3D Printing Class",
    text: "I am very satisfied with the teaching. The individual care and attention given to my daughter made a big difference.",
  },
  {
    name: "Hariharan",
    role: "Parent - Robotics Class",
    text: "Good place to go on with STEM Education and Robotics Courses.",
  },
  {
    name: "Shanmugapriya M",
    role: "Research & Development Intern",
    text: "I built my first Arduino project here. Learning is fun and practical!",
  },
  {
    name: "Rahul Sharma",
    role: "Parent",
    text: "My child developed real interest in robotics. The hands-on projects are amazing!",
  },
  {
    name: "Ananya Verma",
    role: "Student",
    text: "I built my first Arduino project here. Learning is fun and practical!",
  },
  {
    name: "School Coordinator",
    role: "Partner School",
    text: "Adroiit Technovations transformed our STEM education approach completely.",
  },
  {
    name: "Rahul Sharma",
    role: "Parent",
    text: "My child developed real interest in robotics. The hands-on projects are amazing!",
  },
  {
    name: "Ananya Verma",
    role: "Student",
    text: "I built my first Arduino project here. Learning is fun and practical!",
  },
  {
    name: "School Coordinator",
    role: "Partner School",
    text: "Adroiit Technovations transformed our STEM education approach completely.",
  },
];

const chunkArray = (arr: any[], size: number) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

export default function InternshipPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDomain, setActiveDomain] = useState("Embedded Systems & IoT");
  
  // Testimonial State
  const slides = chunkArray(testimonials, 3);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [paused, slides.length]);

  const domains = [
    { title: "Embedded Systems & IoT", status: "Open", desc: "Architect smart solutions using ESP32 & Arduino.", image: "/internship/embedded.jpg" },
    { title: "Mechanical CAD", status: "Open", desc: "Design high-precision hardware & 3D workflows.", image: "/internship/mech.jpg" },
    { title: "Drone Technology", status: "Open", desc: "Build and calibrate advanced flight systems.", image: "/internship/drone.jpg" },
    { title: "Research & Development", status: "Open", desc: "Explore experimental STEM technologies.", image: "/internship/rd.jpg" },
    { title: "Founders' Office", status: "Open", desc: "Work on scaling & operational strategy.", image: "/internship/founder.jpg" },
    { title: "Digital Marketing", status: "Closed", desc: "Growth marketing and content strategy.", image: "/internship/marketing.jpg" },
  ];

  const handleApply = (title: string) => {
    setActiveDomain(title);
    setIsModalOpen(true);
  };

  return (
    <div className={`${bricolage.className} bg-white min-h-screen`}>
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-8 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl md:text-7xl font-black text-purple-600 mb-2">Building the <span className="text-black">Next Gen</span></h1>
          <p className="text-black text-3xl font-bold italic mb-6">Of Innovators.</p>
          <div className="h-2 w-32 bg-purple-600 rounded-full mb-8" />
          <p className="text-gray-600 text-lg max-w-md font-medium text-justify">Join Adroiit Technovations for a hands-on experience. Solve industrial problems and grow with experts.</p>
        </div>
        <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-8 border-gray-50">
          <Image src="/internship/internship-hero1.png" alt="Hero" fill className="object-cover" />
        </div>
      </section>

      {/* Domains Section */}
      <section className="py-24 bg-[#0A0A0A] rounded-t-[40px] md:rounded-t-[80px] px-8 text-white">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-black text-purple-500 uppercase">Specialized Domains</h2>
          <p className="text-gray-400 mt-4">Applications now open for 2026 batches.</p>
        </div>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {domains.map((d, i) => (
            <div key={i} className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden group hover:border-purple-500/30 transition-all scale-95 hover:scale-100">
              <div className="h-36 relative">
                <Image src={d.image} alt={d.title} fill className="object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${d.status === 'Open' ? 'bg-green-600' : 'bg-red-600'}`}>
                  {d.status}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-md font-black mb-2">{d.title}</h3>
                <p className="text-gray-400 text-xs mb-6 font-medium leading-relaxed">{d.desc}</p>
                <button 
                  onClick={() => handleApply(d.title)} 
                  className="w-full bg-purple-600 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-purple-700 transition-all"
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Intern Section */}
      <section className="py-24 bg-white px-8 max-w-7xl mx-auto">
        <h2 className="text-4xl font-black text-black text-center mb-16 uppercase">Why Intern With Us?</h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { t: "Live Projects", d: "Work on actual hardware deployed in industries.", icon: <Zap className="text-orange-500" /> },
            { t: "Certification", d: "Gain industry-recognized valid certificates.", icon: <ShieldCheck className="text-green-500" /> },
            { t: "Career Path", d: "Direct recruitment paths for top performers.", icon: <Globe className="text-blue-500" /> },
            { t: "Mentorship", d: "Learn directly from industry experts and founders.", icon: <Award className="text-purple-500" /> },
            { t: "Innovation", d: "Access to high-end R&D labs and tools.", icon: <Rocket className="text-red-500" /> }
          ].map((c, i) => (
            <div key={i} className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100 flex flex-col items-center text-center">
              <div className="mb-4 bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-md">{c.icon}</div>
              <h4 className="text-sm font-black mb-2">{c.t}</h4>
              <p className="text-gray-600 text-[10px] font-medium leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section (Slider) */}
      <section className="py-12 bg-black text-white overflow-hidden">
        {/* Heading */}
        <div className="text-center mb-10 px-4">
          <h2 className="text-3xl md:text-2xl text-[#8c52ff] font-bold">What People Say</h2>
          <p className="text-gray-200 italic mt-2 text-sm md:text-base">Real feedback from students, parents and schools</p>
        </div>

        {/* Slider Container */}
        <div 
          className="relative w-full overflow-hidden" 
          onMouseEnter={() => setPaused(true)} 
          onMouseLeave={() => setPaused(false)}
        >
          <motion.div 
            className="flex" 
            animate={{ x: `-${index * 100}%` }} 
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            {slides.map((group, i) => (
              <div key={i} className="w-full flex-shrink-0 px-4 md:px-5">
                <div className="max-w-7xl mx-auto">
                  <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                    {group.map((t, j) => (
                      <div key={j} className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-[#5921c7]/20 to-black border border-[#8c52ff]/30 shadow-lg">
                        <p className="text-gray-300 italic text-sm md:text-base">“{t.text}”</p>
                        <div className="mt-6">
                          <h3 className="font-semibold text-[#8c52ff]">{t.name}</h3>
                          <p className="text-sm text-gray-400">{t.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Dots */}
        <div className="flex justify-center mt-8 gap-3">
          {slides.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setIndex(i)} 
              className={`h-3 w-3 rounded-full transition ${index === i ? "bg-[#8c52ff]" : "bg-gray-600"}`} 
            />
          ))}
        </div>
      </section>

      <InternshipApplication isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} selectedDomain={activeDomain} />
    </div>
  );
}