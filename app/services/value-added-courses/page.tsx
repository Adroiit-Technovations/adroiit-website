"use client";

import { motion, Variants } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Award,
  BarChart,
  FileText,
  Zap,
  CalendarCheck,
  CheckCircle2,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Bricolage_Grotesque } from "next/font/google";
import Footer from "@/sections/Footer";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

/**
 * FIXED: Added 'as any' to transitions.
 * This resolves the Easing union type error consistently across Vercel builds.
 */
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: "easeOut" } as any
  }
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: "easeOut",
    } as any,
  }),
};

export default function ValueAddedCoursesPage() {
  const courseList = [
    { 
      image: "/vac/3d-cad.jfif", 
      title: "3D design & modelling", 
      desc: "Develop skills in creating precise digital models using industry-standard design tools." 
    },
    { 
      image: "/vac/3d-printing.jfif", 
      title: "Additive manufacturing & 3D printing", 
      desc: "Learn modern manufacturing techniques to transform digital designs into functional prototypes." 
    },
    { 
      image: "/vac/embedded.jfif", 
      title: "Embedded systems & IoT", 
      desc: "Understand the integration of hardware and software to develop smart, connected systems." 
    },
    { 
      image: "/vac/pcb.jfif", 
      title: "PCB design & prototyping", 
      desc: "Learn to design, develop and prototype professional Printed Circuit Boards (PCBs) for electronic applications." 
    },
    { 
      image: "/vac/drone.jfif", 
      title: "Drone technology", 
      desc: "Gain practical knowledge of UAV systems, including design, flight control and real-world applications." 
    },
    { 
      image: "/vac/ai.jfif", 
      title: "Artificial intelligence", 
      desc: "Explore machine learning and data-driven technologies to build intelligent applications." 
    },
  ];

  const highlights = [
    { title: "Curriculum-integrated learning", icon: <BookOpen size={24} /> },
    { title: "Standardized certification", icon: <Award size={24} /> },
    { title: "Project-based assessments", icon: <BarChart size={24} /> },
    { title: "Industry mentorship program", icon: <GraduationCap size={24} /> },
    { title: "Placement assistance modules", icon: <CheckCircle2 size={24} /> },
    { title: "Comprehensive course material", icon: <FileText size={24} /> },
  ];

  return (
    <div className={`${bricolage.className} bg-white text-black overflow-x-hidden`}>
      
      {/* Hero section */}
      <section className="relative pt-32 pb-12 px-6 overflow-hidden bg-white">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}
          className="relative z-10 max-w-7xl mx-auto"
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 w-full">
            <div className="flex flex-col items-start text-left w-full md:w-1/2 md:max-w-2xl md:pr-2">
              <motion.h1 custom={0} variants={fadeUp} className="text-3xl md:text-3xl font-extrabold tracking-tight mb-4 leading-tight">
                Academic excellence via <span className="text-purple-600">value added courses</span>
              </motion.h1>

              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "80px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-1 bg-purple-600 mb-6 rounded-full"
              />

              <motion.p custom={1} variants={fadeUp} className="text-gray-800 text-lg md:text-lg font-medium mb-4 text-justify leading-relaxed">
                We partner with educational institutions to provide credit-based value added courses that enhance student employability.
              </motion.p>
              
              <motion.p custom={2} variants={fadeUp} className="text-gray-600 text-base md:text-lg mb-6 text-justify leading-relaxed">
                Our programs are designed to complement the university syllabus with intensive practical training.
              </motion.p>

              <motion.div custom={3} variants={fadeUp}>
                <Link href="/contact" className="w-fit bg-purple-600 text-white px-6 py-3 rounded-full font-bold hover:bg-purple-700 transition-all flex items-center gap-2 shadow-md shadow-purple-500/20 text-base">
                   Partner with us <ArrowRight size={18} />
                </Link>
              </motion.div>
            </div>

            <motion.div custom={4} variants={fadeUp} className="flex justify-center w-full md:w-1/2 mt-10 md:mt-0">
              <div className="relative w-full max-w-[520px]">
                <Image 
                  src="/vac.png" 
                  alt="Value Added Courses" 
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

      {/* Featured courses */}
      <section id="courses" className="py-8 px-6 bg-neutral-950 text-white">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-purple-500 mb-2">Featured courses</h2>
            <p className="text-gray-300 text-lg max-w-xl mx-auto">
              In-depth certification programs for future-ready engineers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseList.map((course, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} 
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="p-4 rounded-3xl bg-neutral-900/60 border border-white/10 hover:border-purple-500/50 transition-all duration-300 flex flex-col items-center"
              >
                <div className="relative w-full h-32 mb-4 overflow-hidden rounded-2xl">
                  <Image 
                    src={course.image} 
                    alt={course.title} 
                    fill 
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <h3 className="text-base font-bold mb-2 text-purple-500 text-center leading-tight">{course.title}</h3>
                <p className="text-white text-sm leading-relaxed text-center px-1">
                  {course.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Course highlights */}
      <section className="py-8 px-6 bg-gray-50/50">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-purple-600 mb-2">Why choose our VAC?</h2>
            <p className="text-gray-700 text-base max-w-xl mx-auto">
              Bridging the gap between university degrees and professional careers.
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

      {/* CTA section */}
      <section className="py-8 px-6 bg-[#F4F4F4]">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-2xl md:text-2xl font-bold mb-4 text-purple-600">Elevate your institutional standards</h2>
          <p className="text-black text-sm mb-4 max-w-3xl mx-auto">
            Contact Adroiit Technovations to integrate industry-aligned value added courses into your academic calendar.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-purple-600 text-white px-8 py-3 rounded-full font-bold hover:bg-purple-700 transition-all text-base shadow-lg shadow-purple-500/20">
            <CalendarCheck size={18} /> Request course details
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}