"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  BookOpen, 
  GraduationCap, 
  Settings, 
  ArrowRight, 
  Cpu, 
  Layers, 
  Microscope 
} from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";
import Footer from "@/sections/Footer";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

const serviceCategories = [
  {
    title: "For Schools",
    icon: <BookOpen className="text-[#8c52ff]" />,
    description: "Nurturing young minds through hands-on STEM exploration and innovation labs.",
    links: [
      { name: "STEM Tinkering Labs", href: "/services/stem-labs" },
      { name: "STEM Workshops", href: "/services/workshops" },
      { name: "STEM Bootcamps", href: "/services/bootcamps" },
    ]
  },
  {
    title: "For Colleges",
    icon: <GraduationCap className="text-[#8c52ff]" />,
    description: "Advanced technical training and Center of Excellence (CoE) setups for higher education.",
    links: [
      { name: "Center of Excellence", href: "/services/coe" },
      { name: "Advanced Robotics Labs", href: "/services/advanced-labs" },
      { name: "Technical Workshops", href: "/services/college-workshops" },
    ]
  },
  {
    title: "Engineering Services",
    icon: <Settings className="text-[#8c52ff]" />,
    description: "Professional grade fabrication, 3D printing, and mechanical design solutions.",
    links: [
      { name: "3D Printing & Analysis", href: "/services/3d-printing", highlight: true },
      { name: "Custom Fabrication", href: "/services/fabrication" },
      { name: "Mechanical CAD", href: "/services/consultation" },
    ]
  }
];

export default function ServicesPage() {
  return (
    <div className={`${bricolage.className} bg-[#050505] text-white min-h-screen`}>
      <main className="pt-32 pb-20 px-6">
        
        {/* Header */}
        <section className="max-w-7xl mx-auto text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-6"
          >
            Our <span className="text-[#8c52ff]">Solutions</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            From classroom inspiration to industrial fabrication, we provide the tools and expertise to build the future.
          </motion.p>
        </section>

        {/* Services Grid */}
        <section className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {serviceCategories.map((category, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 hover:border-[#8c52ff]/50 transition-colors flex flex-col"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#8c52ff]/10 flex items-center justify-center mb-6">
                {category.icon}
              </div>
              <h2 className="text-2xl font-bold mb-4">{category.title}</h2>
              <p className="text-gray-500 text-sm mb-8 flex-grow">
                {category.description}
              </p>
              
              <ul className="space-y-4">
                {category.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link 
                      href={link.href}
                      className={`flex items-center justify-between group p-4 rounded-xl transition-all ${
                        link.highlight ? 'bg-[#8c52ff]/20 text-[#8c52ff]' : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-sm font-bold">{link.name}</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </section>

        {/* Feature Highlight Strip */}
        <section className="max-w-7xl mx-auto mt-32 border-t border-white/5 pt-20">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <Cpu className="mx-auto mb-4 text-[#8c52ff]" size={32} />
              <h3 className="font-bold mb-2">Modern Hardware</h3>
              <p className="text-sm text-gray-500">Access to industrial-grade 3D printers and CNC machinery.</p>
            </div>
            <div>
              <Layers className="mx-auto mb-4 text-[#8c52ff]" size={32} />
              <h3 className="font-bold mb-2">Expert Guidance</h3>
              <p className="text-sm text-gray-500">Mentorship from experienced mechanical and robotics engineers.</p>
            </div>
            <div>
              <Microscope className="mx-auto mb-4 text-[#8c52ff]" size={32} />
              <h3 className="font-bold mb-2">Future-Ready Skills</h3>
              <p className="text-sm text-gray-500">Curriculum designed to bridge the gap between theory and industry.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}