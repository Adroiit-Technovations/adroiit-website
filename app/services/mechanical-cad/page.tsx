"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Cog,
  Layers,
  Box,
  CheckCircle,
  ArrowRight,
  Wrench,
  Factory,
  Cpu,
  Search,
  Lightbulb,
  PackageCheck,
  Award,
  Clock,
  DollarSign,
  Users,
  Lock,
  HeartHandshake,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Bricolage_Grotesque } from "next/font/google";
import Footer from "@/sections/Footer";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

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

const testimonials = [
  {
    name: "Priya R",
    role: "Parent - 3D Printing Class",
    text: "I am very satisfied with the teaching. The individual care and attention given to my daughter made a big difference.",
  },
  {
    name: "Sri Sanjana",
    role: "Research and Development Intern",
    text: "I built my first Arduino project here. Learning is fun and practical!",
  },
  {
    name: "Shanmugapriya M",
    role: "Research & Development Intern",
    text: "Fadil senior is the joker of the Adroiit Technovations. He entertains everyone so much! May your soul rest in peace Senior!",
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

export default function MechanicalCADPage() {
  const workflowSteps = [
    {
      title: "Requirement Analysis",
      icon: <Search size={24} />,
      desc: "We dive deep into your project goals, technical specs, and material constraints to build a solid foundation.",
    },
    {
      title: "Concept Design",
      icon: <Lightbulb size={24} />,
      desc: "Our engineers brainstorm and create initial 2D/3D sketches, focusing on form, function, and feasibility.",
    },
    {
      title: "Detailed CAD Modeling",
      icon: <Layers size={24} />,
      desc: "Transforming concepts into high-precision parametric models with full assembly and tolerance details.",
    },
    {
      title: "Final Delivery",
      icon: <PackageCheck size={24} />,
      desc: "You receive industry-standard files (STEP, IGES, DXF) ready for manufacturing or simulation.",
    },
  ];

  const whyChooseItems = [
    { icon: <Award size={22} />, title: "Industry Standards", description: "Models following ISO, ASME & DIN standards." },
    { icon: <Clock size={22} />, title: "Fast Turnaround", description: "Projects delivered in 3–7 days with rush options." },
    { icon: <DollarSign size={22} />, title: "Cost-Effective", description: "Up to 60% savings compared to in-house teams." },
    { icon: <Users size={22} />, title: "Expert Engineers", description: "Team with 8+ years average design experience." },
    { icon: <Lock size={22} />, title: "Confidential", description: "NDA signed by default with secure transfers." },
    { icon: <HeartHandshake size={22} />, title: "Client-First", description: "Unlimited revisions until you are 100% satisfied." },
  ];

  const slides = chunkArray(testimonials, 3);
  const [testIndex, setTestIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setTestIndex((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [paused, slides.length]);

  const whatsappLink = `https://wa.me/918870002908?text=Hi%20Adroiit%20Technovations%2C%20I%20have%20a%20mechanical%20design%20idea...`;

  return (
    <div className={`${bricolage.className} bg-black text-white`}>
      
      {/* --- Hero Section Wrapper --- */}
      <div className="bg-white">
        <section className="relative w-full bg-black z-20 overflow-hidden pb-22 pt-24 md:pt-32 rounded-b-[24px] md:rounded-b-[48px]">
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-[0.15] pointer-events-none z-0" 
                style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
          
          <div className="max-w-7xl mx-auto px-6 md:px-12 z-10 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
                  <h1 className="text-4xl md:text-3xl font-black leading-tight tracking-tight">
                    Mastering precision in <span className="text-purple-600">Mechanical CAD</span>
                  </h1>
                  <div className="w-20 h-1.5 bg-white mt-6 rounded-full" />
                </motion.div>

                <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1} className="text-gray-200 text-base md:text-lg leading-relaxed max-w-xl text-justify">
                  At Adroiit Technovations, we specialize in delivering high-quality Mechanical CAD (Computer Aided Design) services for industries, startups and professionals. Whether you are designing for prototyping, production or innovaiton, our CAD solutions provide the precision and efficiency you need to bring your concepts to life.
                </motion.p>

                <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2} className="flex flex-col sm:flex-row items-center gap-4">
                  <Link href="/contact" className="group inline-flex items-center gap-3 bg-purple-600 text-white px-8 py-4 rounded-full font-bold hover:bg-purple-700 transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)]">
                    Consult with Us <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>

                {/* Stats Grid restored */}
                <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="mt-12 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
                  <div>
                    <h4 className="text-2xl md:text-3xl font-bold text-white">40+</h4>
                    <p className="text-gray-500 text-[10px] md:text-xs uppercase tracking-widest mt-1 font-semibold">Designs Delivered</p>
                  </div>
                  <div>
                    <h4 className="text-2xl md:text-3xl font-bold text-white">24h</h4>
                    <p className="text-gray-500 text-[10px] md:text-xs uppercase tracking-widest mt-1 font-semibold">Draft Delivery</p>
                  </div>
                  <div>
                    <h4 className="text-2xl md:text-3xl font-bold text-white">99%</h4>
                    <p className="text-gray-500 text-[10px] md:text-xs uppercase tracking-widest mt-1 font-semibold">Satisfactory Rate</p>
                  </div>
                </motion.div>
              </div>
              
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4} className="relative group flex justify-center lg:justify-end">
                <div className="relative w-full max-w-[480px]">
                  <div className="absolute -inset-1 bg-purple-600/20 rounded-3xl blur-xl transition duration-1000 group-hover:opacity-100 opacity-50"></div>
                  <div className="relative rounded-3xl overflow-hidden border border-white/10 aspect-[16/10] shadow-2xl bg-neutral-900">
                    <Image src="/services/cad-hero.jfif" alt="Mechanical CAD" fill className="object-cover" priority />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>

      {/* --- What we offer --- */}
      <section className="bg-white text-black py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-2xl font-black text-purple-600 tracking-tight mb-2">What we offer</h2>
            <p className="text-gray-800 text-base md:text-lg italic max-w-2xl mx-auto font-medium">Comprehensive engineering design services tailored to bridge the gap between initial concepts and final manufacturing.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Box className="text-purple-600" size={28} />, title: "3D Modeling", desc: "Accurate parametric and surface models for product design and development." },
              { icon: <Layers className="text-purple-600" size={28} />, title: "2D Drafting", desc: "Detailed engineering drawings with GD&T and manufacturing standards." },
              { icon: <Cog className="text-purple-600" size={28} />, title: "Assembly Design", desc: "Complex assemblies with motion, fit, and interference analysis." },
              { icon: <Wrench className="text-purple-600" size={28} />, title: "Reverse Engineering", desc: "Convert physical parts into precise digital CAD models." },
              { icon: <Factory className="text-purple-600" size={28} />, title: "Manufacturing Support", desc: "Designs optimized for CNC, injection molding, and fabrication." },
              { icon: <Cpu className="text-purple-600" size={28} />, title: "Simulation Ready Models", desc: "CAD prepared for FEA, CFD, and real-world testing workflows." },
            ].map((item, i) => (
              <motion.div key={i} whileHover={{ scale: 1.02 }} className="p-6 rounded-2xl border border-gray-200 bg-gray-50/50 hover:bg-white hover:shadow-xl hover:border-purple-500 transition-all duration-300 flex flex-col items-center text-center group">
                <div className="mb-4 bg-purple-50 p-3 rounded-full group-hover:bg-purple-100 transition-colors">{item.icon}</div>
                <h3 className="text-lg font-bold mb-2 text-purple-600">{item.title}</h3>
                <p className="text-gray-900 text-sm leading-relaxed font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Our workflow --- */}
      <section className="max-w-7xl mx-auto px-6 py-8 relative overflow-hidden">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-2xl font-bold text-purple-500">Our workflow</h2>
          <p className="text-gray-200 italic mt-2">A streamlined process from napkin sketch to production-ready files.</p>
        </div>
        <div className="relative">
          <div className="hidden md:block absolute top-12 left-[12.5%] w-[75%] h-0.5 bg-neutral-800" />
          <div className="grid md:grid-cols-4 gap-8 relative">
            {workflowSteps.map((step, i) => (
              <div key={i} className="flex flex-col items-center group">
                <div className="relative mb-4">
                  <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="w-20 h-20 rounded-2xl bg-neutral-900 border border-purple-500/30 flex items-center justify-center relative z-10 group-hover:border-purple-500 transition-all shadow-[0_0_30px_rgba(140,82,255,0.1)]">
                    <div className="text-purple-500 group-hover:text-white transition-colors">{step.icon}</div>
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center border-4 border-black">{i + 1}</div>
                  </motion.div>
                </div>
                <div className="text-center px-4">
                  <h3 className="text-xl font-bold text-purple-500 mb-3 group-hover:text-purple-400 transition-colors">{step.title}</h3>
                  <p className="text-gray-100 text-sm leading-relaxed min-h-[60px]">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Why choose Adroiit Technovations --- */}
      <section className="py-8 px-6 bg-gray-50 relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto relative z-10">
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-2xl font-black text-purple-600 mb-4">Why choose Adroiit Technovations</h2>
            <p className="text-gray-800 italic text-sm md:text-base max-w-2xl mx-auto font-medium">We combine deep technical expertise with industry-leading tools to deliver CAD solutions that are accurate, affordable, and fast.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
            {whyChooseItems.map((item, i) => (
              <div key={i} className="group p-5 rounded-2xl bg-white border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center justify-center min-h-[200px]">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                <h3 className="text-sm font-bold text-purple-600 mb-2 transition-colors tracking-wide">
                  {item.title}
                </h3>
                <p className="text-black text-[11px] leading-tight font-medium">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Testimonials --- */}
      <section className="py-8 bg-black text-purple-600 overflow-hidden">
        <div className="text-center mb-6 px-4">
          <h2 className="text-3xl md:text-2xl font-bold">What People Say</h2>
          <p className="text-gray-200 mt-2 italic text-sm md:text-base">Real feedback from students, parents and schools</p>
        </div>
        <div className="relative w-full overflow-hidden" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <motion.div className="flex" animate={{ x: `-${testIndex * 100}%` }} transition={{ duration: 0.7, ease: "easeInOut" }}>
            {slides.map((group, i) => (
              <div key={i} className="w-full flex-shrink-0 px-4 md:px-5">
                <div className="max-w-7xl mx-auto">
                  <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                    {group.map((t, j) => (
                      <div key={j} className="p-6 md:p-8 rounded-2xl bg-black border border-[#8c52ff]/30 shadow-lg">
                        <p className="text-gray-300 text-sm md:text-base">“{t.text}”</p>
                        <div className="mt-6">
                          <h3 className="font-semibold text-purple-500">{t.name}</h3>
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
        <div className="flex justify-center mt-8 gap-3">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setTestIndex(i)} className={`h-3 w-3 rounded-full transition ${testIndex === i ? "bg-[#8c52ff]" : "bg-gray-600"}`} />
          ))}
        </div>
      </section>

      {/* --- Final CTA --- */}
      <section className="relative py-8 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-2xl font-extrabold text-purple-600">Have a design idea? <span className="text-gray-900">Let's transform!</span></h2>
          <p className="mt-3 text-lg text-gray-700 mb-6 font-medium">Turn your mechanical design idea into a precise, manufacturable reality.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 px-8 py-3.5 bg-purple-600 text-white font-bold rounded-full transition-all shadow-lg hover:bg-purple-700 hover:scale-105 active:scale-95">
              <MessageCircle size={18} /><span>Discuss on WhatsApp</span><ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-gray-100 border border-gray-200">
              <CheckCircle className="text-purple-600" size={18} />
              <span className="text-gray-700 text-sm font-bold">Free consultation • No obligation</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}