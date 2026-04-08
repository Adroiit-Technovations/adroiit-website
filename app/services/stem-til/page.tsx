"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Lightbulb,
  Zap,
  Users,
  Cpu,
  Bot,
  MessageCircle,
  IndianRupee,
  CircuitBoard,
  BoxSelect,
  Layers,
  BrainCircuit,
  BookOpen,
  FileText,
  BookmarkCheck,
  GraduationCap,
  Library,
  Wifi,
  Microscope,
  Puzzle,
  Workflow,
  ShieldCheck,
  Wrench,
  Headphones,
  TrendingUp,
  Briefcase,
  Globe,
  MonitorSmartphone,
  School,
  Rocket
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Bricolage_Grotesque } from "next/font/google";
import Footer from "@/sections/Footer";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

// Animation Variants
const titleVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const descVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.2, ease: "easeOut" }
  }
};

const fadeUp = {
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

const slideInRight = {
  hidden: { opacity: 0, x: 100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

export default function STEMLabPage() {
  const stats = [
    { icon: <Globe size={20} />, number: "2x", text: "Nations investing in STEM education see significantly higher innovation output and startup growth." },
    { icon: <Briefcase size={20} />, number: "60%", text: "Of employers report difficulty finding candidates with strong technical and problem-solving skills." },
    { icon: <TrendingUp size={20} />, number: "70%", text: "Of the fastest-growing industries globally are driven by STEM fields." },
    { icon: <MonitorSmartphone size={20} />, number: "85%", text: "Of the future job roles require at least basic digital and technical literacy." },
    { icon: <School size={20} />, number: "65%", text: "Of children entering primary school today will work in careers that don't yet exist." },
    { icon: <Rocket size={20} />, number: "3x", text: "STEM occupations are growing up to 3x times faster than non-STEM careers worldwide." }
  ];

  const domains = [
    { image: "/domains/electronics.jpg", title: "Electronics & Circuits", desc: "Builds a strong foundation in understanding electrical components, circuit design and real-world electronic systems." },
    { image: "/domains/3d-modelling.jfif", title: "3D Design & Modelling", desc: "Encourages creativity and design thinking through the creation of precise digital 3D models using modern tools." },
    { image: "/domains/3d-printing.jpg", title: "3D Printing", desc: "Facilitates rapid prototyping, allowing ideas to be transformed into tangible models and functional parts." },
    { image: "/domains/embedded-systems.jpg", title: "Embedded Systems", desc: "Focuses on integrating hardware and software to develop smart, intelligent devices usign microcontrollers." },
    { image: "/domains/robotics.jpg", title: "Robotics", desc: "Promotes engineering and problem-solving through the design, construction and programming of interactive robotic systems." },
    { image: "/domains/iot.jpg", title: "Internet of Things", desc: "Encourages innovation by enabling the development of connected systems with real-world applications." },
    { image: "/domains/drones.jfif", title: "Drone Technology", desc: "Introduces aerial systems, covering design, functionality and real-world industry applications." },
    { image: "/domains/ai.jfif", title: "Artificial Intelligence", desc: "Introduces future-ready concepts in intelligent systems, automation and data-driven decison making." },
  ];

  const objectives = [
    { text: "Bridge the gap between theory and hands-on learning", icon: <Workflow size={22} /> },
    { text: "Promote experiential & interdisciplinary learning", icon: <Microscope size={22} /> },
    { text: "Foster creativity, innovation, teamwork & collaboration skills", icon: <Users size={22} /> },
    { text: "Support cognitive & practical skill development", icon: <BrainCircuit size={22} /> },
    { text: "Enhance critical thinking & problem-solving skills", icon: <Puzzle size={22} /> }
  ];

  const whyChooseItems = [
    { icon: <Library />, title: "Structured Curriculum & Course Materials", description: "Well designed, grade-appropriate curriculum aligned with practical, hands-on learning outcomes." },
    { icon: <IndianRupee />, title: "Customizable & Cost Effective Solutions", description: "Premium lab setups tailored to institutional needs while ensuring optimal cost efficiency." },
    { icon: <ShieldCheck />, title: "High Quality & Standardized Procurement", description: "Reliable sourcing of industry-grade equipment with consistent quality standards." },
    { icon: <Lightbulb />, title: "Interactive & Innovative DIY Kits", description: "Engaging, hands-on kits that encourage experiential learning and creativity." },
    { icon: <Zap />, title: "Progressive & Future-focused Learning", description: "Curriculum designed to keep pace with emerging technologies and industry trends." },
    { icon: <Wrench />, title: "Regular Maintenance & Upgrades", description: "Continuous support with timely maintenance and technology updates." },
    { icon: <GraduationCap />, title: "Efficient & Dedicated Instructor", description: "Trained instructors and expert mentors ensure effective learning and student engagement." },
    { icon: <Headphones />, title: "Friendly & Dedicated Support Team", description: "Responsive support system for smooth implementation and ongoing assistance." },
  ];

  return (
    <div className={`${bricolage.className} bg-white text-black overflow-x-hidden`}>

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-2 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">

            <div className="w-full lg:w-1/2 flex flex-col items-start">
              <motion.h1
                custom={0} variants={fadeUp} initial="hidden" animate="visible"
                className="text-4xl md:text-3xl font-extrabold tracking-tight text-black leading-[1.1] mb-2"
              >
                <span className="text-purple-600">STEM Tinkering and Innovation Lab (TIL)</span>
              </motion.h1>

              <motion.span
                custom={1} variants={fadeUp} initial="hidden" animate="visible"
                className="text-black font-bold tracking-[0.08em] uppercase text-sm mb-2"
              >
                A holistic space for experiential learning and innovation
              </motion.span>

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "80px" }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="h-[5px] bg-purple-600 mb-10 rounded-full"
              />

              <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible" className="space-y-6">
                <p className="text-gray-800 text-lg md:text-lg font-medium leading-relaxed text-justify">
                  STEM Tinkering and Innovation Lab (TIL) is a dynamic and collaborative learning environment designed to foster curiosity, hands-on experimentation and innovation in Science, Technology, Engineering and Mathematics (S.T.E.M).
                </p>
                <p className="text-gray-600 text-base md:text-lg leading-relaxed text-justify">
                  Adroiit Technovations partners with institutions to establish these state-of-the-art STEM Tinkering and Innovation Labs that empower students with 21st-century skills and advanced technical infrastructure.
                </p>
              </motion.div>

              <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className="mt-5">
                <Link href="/contact" className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-full font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/25 group text-base">
                  Book a Consultation
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full lg:w-1/2 flex justify-center lg:justify-end"
            >
              <div className="relative aspect-[16/10] w-full max-w-[620px]">
                <div className="absolute -inset-4 bg-purple-100/40 rounded-[2.5rem] blur-2xl z-0" />
                <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-2xl z-10 bg-white">
                  <Image src="/stem-til2.png" alt="STEM Innovation Lab" fill className="object-cover" priority />
                </div>
              </div>
            </motion.div>
          </div>

          {/* GLOBAL STANDARDS */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideInRight}
            className="w-full pt-0 mt-0 border-t border-gray-100"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-10">
              <div className="shrink-0 text-center md:text-left">
                <p className="text-[11px] uppercase tracking-[0.1em] text-purple-600 font-black">Our Curriculum Aligns with</p>
                <h2 className="text-xl font-bold text-black mt-1">Educational Standards</h2>
                <p className="text-xs text-gray-700 mt-2 max-w-xs leading-relaxed">We ensure our curriculum and methodology aligns with various educational frameworks and requirements.</p>
              </div>

              <div className="flex flex-wrap md:flex-nowrap justify-center items-stretch gap-4 w-full">
                {[
                  { name: "NEP 2020", full: "National Education Policy 2020", icon: <BookOpen size={24} /> },
                  { name: "NCF 2023", full: "National Curriculum Framework 2023", icon: <FileText size={24} /> },
                  { name: "NCERT", full: "Council for Educational Research & Training", icon: <Library size={24} /> },
                  { name: "CBSE", full: "Central Board for Secondary Education", icon: <BookmarkCheck size={24} /> },
                  { name: "ICSE", full: "Indian Certificate of Secondary Education", icon: <GraduationCap size={24} /> }
                ].map((std, idx) => (
                  <div key={idx} className="flex-1 min-w-[170px] p-5 rounded-2xl bg-gray-50 border border-gray-200 hover:border-purple-500/50 hover:bg-white transition-all group">
                    <div className="text-purple-600 mb-3 group-hover:scale-110 transition-transform">{std.icon}</div>
                    <div className="flex flex-col">
                      <span className="text-base font-black text-purple-600 leading-tight mb-1">{std.name}</span>
                      <span className="text-[10px] text-black font-semibold uppercase tracking-tighter leading-tight">{std.full}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. WHY STEM TIL */}
      <section className="py-8 px-6 bg-black text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={titleVariants} className="text-2xl font-bold text-purple-500">
              Why STEM Tinkering and Innovation Lab?
            </motion.h2>
            <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={descVariants} className="text-gray-300 mt-2 text-base max-w-4xl mx-auto">
              These insights highlight why hands-on STEM education is essential for preparing future-ready learners.
            </motion.p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-4 rounded-2xl bg-neutral-900 border border-white/5 hover:border-purple-500/30 transition-all flex flex-col items-center text-center group">
                <div className="p-2 rounded-lg bg-purple-600/10 text-purple-500 mb-3 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{item.number}</h3>
                <p className="text-gray-400 font-medium leading-tight text-[10px] md:text-xs text-center">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. OBJECTIVES - SINGLE ROW CONFIGURATION */}
      <section className="py-8 px-6 bg-white text-black">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-6">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={titleVariants} className="text-2xl font-bold text-purple-600">
              Objectives of STEM Tinkering and Innovation Lab (TIL)
            </motion.h2>
            <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={descVariants} className="text-gray-700 mt-2 text-base max-w-3xl mx-auto">
              The objectives highlight its role in implementing experiential learning and foster an innovation-driven environment within the institution.
            </motion.p>
          </div>
          
          {/* Single Row Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {objectives.map((obj, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center justify-center text-center gap-4 p-6 bg-gray-50 border border-gray-200 rounded-[1.5rem] hover:shadow-md transition-all min-h-[160px] group"
              >
                <div className="text-purple-600 group-hover:scale-110 transition-transform mb-1">{obj.icon}</div>
                <span className="font-bold text-black text-[13px] lg:text-sm leading-snug">
                  {obj.text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. DOMAINS FOCUS - UPDATED CARD STYLE */}
      <section className="py-8 px-6 bg-neutral-950 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={titleVariants} className="text-2xl font-bold text-purple-500">
              Domains Students Will Explore
            </motion.h2>
            <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={descVariants} className="text-gray-300 mt-3 text-base max-w-3xl mx-auto">
              Students will explore a diverse range of future-focused STEM fields designed for progressive learning thereby building stronger foundations and fostering innovation. 
            </motion.p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            {domains.map((domain, i) => (
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
                    src={domain.image} 
                    alt={domain.title} 
                    fill 
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <h3 className="text-lg font-bold mb-2 text-purple-500 text-center">{domain.title}</h3>
                <p className="text-white text-xs leading-relaxed text-center">
                  {domain.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE US */}
      <section className="py-8 px-6 bg-white text-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={titleVariants} className="text-2xl font-bold text-purple-600">
              Why Choose Adroiit Technovations?
            </motion.h2>
            <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={descVariants} className="text-gray-700 mt-3 text-base max-w-4xl mx-auto">
              Adroiit Technovations stands as your trusted partner in delivering future-ready STEM learning solutions for your institution. The key reasons that set us apart are highlighted as follows
            </motion.p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseItems.map((item, i) => (
              <motion.div key={i} whileHover={{ y: -8 }} className="p-8 rounded-3xl bg-gray-50 border border-gray-200 hover:border-purple-600 transition-all group flex flex-col items-center text-center">
                <div className="text-purple-600 mb-5 group-hover:scale-110 transition-transform">{item.icon}</div>
                <h3 className="font-bold text-purple-600 text-base mb-3">{item.title}</h3>
                <p className="text-black text-[13px] leading-relaxed opacity-90">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA */}
      <section className="py-8 px-6 bg-neutral-100 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={titleVariants} className="text-2xl font-extrabold text-purple-600 mb-4">
            Transform Your School into a Future-Ready Innovation Hub
          </motion.h2>
          <p className="text-gray-600 mb-8 text-sm">Let's join to empower your institution with a STEM Tinkering and Innovation Lab designed to foster creativity, hands-on learning and future-ready skills. Partner with us to build a world-class lab that prepares learners for tomorrow's technology-driven world.</p>
          <Link href="/contact" className="inline-flex items-center gap-3 bg-purple-600 text-white px-8 py-4 rounded-full font-black hover:scale-105 transition-all shadow-xl shadow-purple-500/20">
            <MessageCircle size={20} /> Book a Consultation
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}