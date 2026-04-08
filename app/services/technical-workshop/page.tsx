"use client";

import { motion, Variants } from "framer-motion"; // Added Variants to import
import {
  ArrowRight,
  Globe,
  Users,
  Briefcase,
  Lightbulb,
  Wrench,
  CalendarCheck,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Bricolage_Grotesque } from "next/font/google";
import Footer from "@/sections/Footer";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

// Fixed: Explicitly typed as Variants to resolve ease string error
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: "easeOut" } 
  }
};

// Fixed: Explicitly typed as Variants
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

export default function TechnicalWorkshopsPage() {
  const workshopList = [
    { 
      image: "/workshop/cad.jfif", 
      title: "3D Design & Modelling", 
      desc: "Develops industry-relevant design skills using advanced 3D modelling tools for product development and prototyping." 
    },
    { 
      image: "/workshop/3d-printing.jfif", 
      title: "3D Printing", 
      desc: "Covers additive manufacturing techniques to convert digital designs into functional prototypes." 
    },
    { 
      image: "/workshop/embedded.jfif", 
      title: "Embedded Systems", 
      desc: "Focuses on microcontroller-based system design, integrating hardware and software for real-world applications." 
    },
    { 
      image: "/workshop/iot.jfif", 
      title: "Internet of Things (IoT)", 
      desc: "Explores connected systems, enabling data-driven applications through sensors, cloud and communication technologies." 
    },
    { 
      image: "/workshop/robotics.jpeg", 
      title: "Robotics", 
      desc: "Builds expertise in designing and programming robotic systems for automation and intelligent control." 
    },
    { 
      image: "/workshop/drones.jpg", 
      title: "Drone Technology", 
      desc: "Provides in-depth knowledge of UAV systems, including design, flight control and practical applications." 
    },
    { 
      image: "/workshop/matlab.jfif", 
      title: "MATLAB", 
      desc: "Introduces simulation, data analysis and algorithm development using industry-standard MATLAB tools." 
    },
    { 
      image: "/workshop/plc.jfif", 
      title: "PLC Automation", 
      desc: "Covers industrial automation concepts using PLC programming for real-time control systems." 
    },
    { 
      image: "/workshop/pcb.jfif", 
      title: "PCB Designing", 
      desc: "Teaches schematic design and layout development for creating professional printed circuit boards." 
    },
    { 
      image: "/workshop/ai.jfif", 
      title: "Artificial Intelligence", 
      desc: "Focuses on machine learning concepts, data analysis and building intelligent, real-world applications." 
    },
  ];

  const highlights = [
    { title: "Industry-relevant hands-on training", icon: <Wrench size={24} /> },
    { title: "Expert trainers & mentorship", icon: <Users size={24} /> },
    { title: "Structured & outcome-based modules", icon: <Briefcase size={24} /> },
    { title: "Certification & skill validation", icon: <ShieldCheck size={24} /> },
    { title: "Engaging & interactive session", icon: <Zap size={24} /> },
    { title: "Latest tools & technologies exposure", icon: <Lightbulb size={24} /> },
  ];

  return (
    <div className={`${bricolage.className} bg-white text-black overflow-x-hidden`}>
      
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-12 px-6 overflow-hidden bg-white">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}
          className="relative z-10 max-w-7xl mx-auto"
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 w-full">
            <div className="flex flex-col items-start text-left w-full md:w-1/2 md:max-w-2xl md:pr-2">
              <motion.h1 custom={0} variants={fadeUp} className="text-3xl md:text-3xl font-extrabold tracking-tight mb-4 leading-tight">
                Industry-focused <span className="text-purple-600">technical workshops</span>
              </motion.h1>

              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "80px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-1 bg-purple-600 mb-6 rounded-full"
              />

              <motion.p custom={1} variants={fadeUp} className="text-gray-800 text-lg md:text-lg font-medium mb-4 text-justify leading-relaxed">
                Adroiit Technovations’ technical workshops are short-term, intensive, and hands-on learning experiences designed specifically for college students.
              </motion.p>
              
              <motion.p custom={2} variants={fadeUp} className="text-gray-600 text-base md:text-lg mb-6 text-justify leading-relaxed">
                These workshops bridge the gap between academic knowledge and industry requirements by providing practical exposure to cutting-edge technologies.
              </motion.p>

              <motion.div custom={3} variants={fadeUp}>
                <Link href="/contact" className="w-fit bg-purple-600 text-white px-6 py-3 rounded-full font-bold hover:bg-purple-700 transition-all flex items-center gap-2 shadow-md shadow-purple-500/20 text-base">
                   Host a workshop <ArrowRight size={18} />
                </Link>
              </motion.div>
            </div>

            <motion.div custom={4} variants={fadeUp} className="flex justify-center w-full md:w-1/2 mt-10 md:mt-0">
              <div className="relative w-full max-w-[520px]">
                <Image 
                  src="/services/technical-workshop2.png" 
                  alt="Technical Workshop" 
                  width={520} 
                  height={390} 
                  className="relative rounded-3xl border border-gray-100 shadow-xl" 
                  priority 
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* OUR WORKSHOPS */}
      <section id="workshops" className="py-8 px-6 bg-neutral-950 text-white">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}
          className="max-w-[1440px] mx-auto"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-purple-500 mb-2">Our workshops</h2>
            <p className="text-gray-200 text-base max-w-xl mx-auto">
              Specialized technical tracks designed for future engineers and innovators.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {workshopList.map((workshop, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} 
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="p-4 rounded-[2rem] bg-neutral-900/40 border border-white/10 hover:border-purple-500/50 transition-all duration-300 group flex flex-col items-center"
              >
                <div className="relative w-full h-36 mb-4 overflow-hidden rounded-2xl">
                  <Image 
                    src={workshop.image} 
                    alt={workshop.title} 
                    fill 
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <h3 className="text-sm font-bold mb-2 text-purple-500 text-center leading-tight">{workshop.title}</h3>
                <p className="text-white text-[13px] leading-relaxed text-center opacity-80">
                  {workshop.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* WORKSHOP HIGHLIGHTS */}
      <section className="py-8 px-6 bg-gray-50/50">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-purple-600 mb-2">Workshop highlights</h2>
            <p className="text-gray-700 text-base max-w-xl mx-auto">
              What sets our technical training apart.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {highlights.map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 15 }} 
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }} 
                viewport={{ once: true }}
                whileHover={{ borderColor: "#9333ea" }}
                className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center justify-center min-h-[140px]"
              >
                <div className="text-purple-600 mb-3">
                  {item.icon}
                </div>
                <h3 className="text-[13px] font-bold text-black leading-snug">
                  {item.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA SECTION */}
      <section className="py-8 px-6 bg-[#F4F4F4]">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-2xl md:text-2xl font-bold mb-4 text-purple-600">Empower your students with future-ready skills</h2>
          <p className="text-black text-sm mb-8 max-w-2xl mx-auto">
            Partner with Adroiit Technovations to conduct high-impact technical workshops at your institution.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-purple-600 text-white px-8 py-3 rounded-full font-bold hover:bg-purple-700 transition-all text-base shadow-lg shadow-purple-500/20">
            <CalendarCheck size={18} /> Host a workshop
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}