"use client";

import { motion, Variants } from "framer-motion"; // Added Variants to import
import {
  ArrowRight,
  Zap,
  Cpu,
  Trophy,
  Wrench,
  Lightbulb,
  Users,
  Target,
  Rocket,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Bricolage_Grotesque } from "next/font/google";
import Footer from "@/sections/Footer";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

// Fixed: Explicitly typed as Variants to resolve the 'ease' property error
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

export default function STEMBootcampPage() {
  const bootcampProgrammes = [
    { 
      image: "/services/junior-robochamp3.jpg", 
      title: "Junior RoboChamp", 
      desc: "A hands-on foundation programme where students explore electronics, microcontroller programming, sensor and actuator interfacing and robotics through exciting real-world projects." 
    },
    { 
      image: "/services/ultimate-tech-mastery6.png", 
      title: "Ultimate Tech-Mastery", 
      desc: "An advanced technology programme covering electronics, embedded systems, robotics, IoT and 3D printing to build real-world innovation skills." 
    },
  ];

  const highlights = [
    { title: "Builds a strong maker mindset early", icon: <Lightbulb size={24} /> },
    { title: "Enhances conceptual understanding in STEM", icon: <Zap size={24} /> },
    { title: "Structured, progressive learning approach", icon: <Target size={24} /> },
    { title: "Mentor-guided small batch learning", icon: <Users size={24} /> },
    { title: "Prepares students for competitions and projects", icon: <Trophy size={24} /> },
    { title: "Designed for consistent engagement", icon: <Cpu size={24} /> },
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
                Intensive <span className="text-purple-600">STEM Bootcamp</span>
              </motion.h1>

              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "80px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-1 bg-purple-600 mb-6 rounded-full"
              />

              <motion.p custom={1} variants={fadeUp} className="text-gray-800 text-lg md:text-lg font-medium mb-4 text-justify leading-relaxed">
                Adroiit Technovations' STEM bootcamp is a long-term, structured, expert-facilitated learning programme designed to provide in-depth exposure to new technologies.
              </motion.p>
              
              <motion.p custom={2} variants={fadeUp} className="text-gray-600 text-base md:text-lg mb-6 text-justify leading-relaxed">
                This extended programme allows students to progressively build strong foundational knowledge and advanced technical skills through continuous hands-on learning.
              </motion.p>

              <motion.div custom={3} variants={fadeUp}>
                <Link href="/contact" className="w-fit bg-purple-600 text-white px-6 py-3 rounded-full font-bold hover:bg-purple-700 transition-all flex items-center gap-2 shadow-md shadow-purple-500/20 text-base">
                  Organize a Bootcamp <ArrowRight size={18} />
                </Link>
              </motion.div>
            </div>

            <motion.div custom={4} variants={fadeUp} className="flex justify-center w-full md:w-1/2 mt-10 md:mt-0">
              <div className="relative w-full max-w-[520px]">
                <Image 
                  src="/services/stem-bootcamp2.png" 
                  alt="STEM Bootcamp" 
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

      {/* OUR PROGRAMMES */}
      <section className="py-8 px-6 bg-neutral-950 text-white">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-purple-500 mb-2">Our Programmes</h2>
            <p className="text-gray-300 text-base max-w-xl mx-auto">
              Comprehensive learning paths designed for different skill levels.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8">
            {bootcampProgrammes.map((prog, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} 
                viewport={{ once: true }}
                className="w-full md:w-[calc(50%-2rem)] max-w-[400px] p-5 rounded-[2rem] bg-neutral-900/40 border border-white/10 hover:border-purple-500/50 transition-all duration-300 group flex flex-col items-center"
              >
                <div className="relative w-full h-48 mb-5 overflow-hidden rounded-2xl">
                  <Image 
                    src={prog.image} 
                    alt={prog.title} 
                    fill 
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <h3 className="text-lg font-bold mb-3 text-purple-500 text-center">{prog.title}</h3>
                <p className="text-white text-sm leading-relaxed text-center">
                  {prog.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* BOOTCAMP HIGHLIGHTS - 6 IN A ROW */}
      <section className="py-8 px-6 bg-gray-50/50">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}
          className="max-w-[1400px] mx-auto"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-purple-600 mb-2">Bootcamp Highlights</h2>
            <p className="text-gray-700 text-base max-w-xl mx-auto">
              Our unique approach to long-term technical excellence.
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
                className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-500 transition-all duration-300 flex flex-col items-center justify-center text-center min-h-[140px]"
              >
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-4">
                  {item.icon}
                </div>
                <h3 className="text-[13px] font-bold text-black leading-tight">{item.title}</h3>
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
          <h2 className="text-2xl md:text-2xl font-bold mb-4 text-purple-600">Ready to Start Your Technical Journey Today?</h2>
          <p className="text-gray-700 text-base mb-8 max-w-2xl mx-auto">
            Give your students the edge they need with our structured, mentor-led bootcamps.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-purple-600 text-white px-8 py-3 rounded-full font-bold hover:bg-purple-700 transition-all text-base shadow-lg shadow-purple-500/20">
            <Rocket size={18} /> Organize a Bootcamp
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}