"use client";

import { motion, Variants } from "framer-motion"; // Added Variants to import
import {
  ArrowRight,
  Zap,
  Cpu,
  Trophy,
  Wrench,
  Compass,
  Smile,
  CalendarCheck,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Bricolage_Grotesque } from "next/font/google";
import Footer from "@/sections/Footer";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

// Fixed: Explicitly typed as Variants
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

export default function STEMWorkshopPage() {
  const workshopModules = [
    { image: "/services/science.jfif", title: "Experimenting Science", desc: "Encourages hands-on exploration of scientific concepts through fun and interactive experiments." },
    { image: "/services/electronics.jpg", title: "Electronics and Circuits", desc: "Builds understanding of electronic components and circuit design through practical learning." },
    { image: "/services/3d-printing.png", title: "3D Modelling & Printing", desc: "Introduces digital design and rapid prototyping usinng 3D modelling and 3D printing technologies." },
    { image: "/services/embedded-systems.jpg", title: "Embedded Systems", desc: "Focuses on creating smart devices by combining programming with electronic hardware." },
    { image: "/services/robotics.jfif", title: "Robotics", desc: "Enables the design and programming of robots to perform real-world tasks." },
    { image: "/services/drone.jfif", title: "Drone Technology", desc: "Provides exposure to drone design, operations and real-world applications." },
    { image: "/services/ai.jfif", title: "Artificial Intelligence", desc: "Introduces intelligent systems and basic AI concepts for building smart applications." },
  ];

  const highlights = [
    { title: "Hands-on, activity-driven and outcome-based approach", icon: <Wrench size={20} /> },
    { title: "Students build with real components and tools", icon: <Cpu size={20} /> },
    { title: "Fun-filled and Highly engaging learning experience", icon: <Smile size={20} /> },
    { title: "High-impact live demos that spark curiosity", icon: <Zap size={20} /> },
    { title: "Integrated career awareness and guidance at every step", icon: <Compass size={20} /> },
    { title: "Boosts students confidence and creativity", icon: <Trophy size={20} /> },
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
                Interactive <span className="text-purple-600">STEM Workshops</span>
              </motion.h1>

              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "80px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-1 bg-purple-600 mb-6 rounded-full"
              />

              <motion.p custom={1} variants={fadeUp} className="text-gray-800 text-lg md:text-lg font-medium mb-4 text-justify leading-relaxed">
                Adroiit Technovations delivers hands-on, interactive, future-ready STEM workshops designed to ignite curiosity by practically implementing STEM concepts.
              </motion.p>
              
              <motion.p custom={2} variants={fadeUp} className="text-gray-600 text-base md:text-lg mb-6 text-justify leading-relaxed">
                We focus on building real-world skills and preparing students for future careers. Our workshops go beyond theory—students learn by exploring, experimenting, and building.
              </motion.p>

              <motion.div custom={3} variants={fadeUp}>
                <Link href="/contact" className="w-fit bg-purple-600 text-white px-6 py-3 rounded-full font-bold hover:bg-purple-700 transition-all flex items-center gap-2 shadow-md shadow-purple-500/20 text-base">
                  Host a Workshop <ArrowRight size={18} />
                </Link>
              </motion.div>
            </div>

            <motion.div custom={4} variants={fadeUp} className="flex justify-center w-full md:w-1/2 mt-10 md:mt-0">
              <div className="relative w-full max-w-[520px]">
                <Image 
                  src="/stem-workshop2.png" 
                  alt="STEM Workshop" 
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
      <section className="py-8 px-6 bg-neutral-950 text-white">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-purple-500 mb-2">Our Workshops</h2>
            <p className="text-gray-300 text-base max-w-xl mx-auto">
              Specialized technical tracks designed to transform students into innovators.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            {workshopModules.map((module, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} 
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(25%-1.5rem)] min-w-[280px] p-5 rounded-[2rem] bg-neutral-900/40 border border-white/10 hover:border-purple-500/50 transition-all duration-300 group flex flex-col items-center"
              >
                <div className="relative w-full h-40 mb-5 overflow-hidden rounded-2xl">
                  <Image 
                    src={module.image} 
                    alt={module.title} 
                    fill 
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <h3 className="text-lg font-bold mb-2 text-purple-500 text-center">{module.title}</h3>
                <p className="text-white text-sm leading-relaxed text-center">
                  {module.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* WORKSHOP HIGHLIGHTS - 6 IN A ROW CONFIGURATION */}
      <section className="py-8 px-6 bg-gray-50/50">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}
          className="max-w-[1400px] mx-auto"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-purple-600 mb-2">Workshop Highlights</h2>
            <p className="text-gray-700 text-base max-w-3xl mx-auto">
              Why our workshops stand out in creating a lasting impact on student learning.
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
                className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-purple-500 transition-all duration-300 flex flex-col items-center justify-center text-center min-h-[140px] group"
              >
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600 mb-3 group-hover:bg-purple-100 transition-colors">
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
          <h2 className="text-2xl md:text-2xl font-bold mb-4 text-purple-600">Ready to Transform Your School?</h2>
          <p className="text-gray-700 text-base mb-8 max-w-2xl mx-auto">
            Bring industry-standard technology and hands-on learning to your campus. Join hundreds of schools in empowering the next generation of innovators.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-purple-600 text-white px-8 py-3 rounded-full font-bold hover:bg-purple-700 transition-all text-base shadow-lg shadow-purple-500/20">
            <CalendarCheck size={20} /> Book a Workshop
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}