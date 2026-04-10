"use client";

import { motion, Variants } from "framer-motion"; // Added Variants type import
import {
  Maximize,
  Target,
  Layers,
  PieChart,
  Zap,
  ArrowRight,
  PenTool,
  ClipboardList,
  PackageCheck,
  UserCog,
  Star,
  Banknote,
  Boxes,
  Infinity,
  Truck,
  Lock,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Bricolage_Grotesque } from "next/font/google";
import Footer from "@/sections/Footer";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

// Fixed: Explicitly typed as Variants to resolve the 'ease' string type mismatch
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

export default function ThreeDPrintingPage() {
  const capabilities = [
    { title: "Build Volume", subtitle: "225 x 225 x 250 MM", desc: "INDUSTRIAL CAPACITY", icon: <Maximize size={20} /> },
    { title: "Precision", subtitle: "± 0.3 MM", desc: "ENG. TOLERANCE", icon: <Target size={20} /> },
    { title: "Resolution", subtitle: "100 - 300 MICRONS", desc: "LAYER HEIGHT", icon: <Layers size={20} /> },
    { title: "Infill", subtitle: "30% - 100%", desc: "STRUCTURAL DENSITY", icon: <PieChart size={20} /> },
    { title: "Materials", subtitle: "PLA / ABS / PETG / PC", desc: "VERSATILE FILAMENTS", icon: <Zap size={20} /> },
  ];

  const steps = [
    {
      title: "Consultation with our Engineer",
      desc: "Connect with our expert to discuss your idea, application and specific requirements in detail.",
      icon: <UserCog size={28} />,
    },
    {
      title: "File Review & Validation",
      desc: "The design is checked for print readiness and optimized to ensure the best print quality.",
      icon: <ClipboardList size={28} />,
    },
    {
      title: "3D Printing & Finishing",
      desc: "The model is printed with precision and undergoes necessary post-processing for a refined finish.",
      icon: <Layers size={28} />,
    },
    {
      title: "Delivery & Support",
      desc: "The final product is securely packaged and delivered with support for any further assistance.",
      icon: <PackageCheck size={28} />,
    },
  ];

  const whyChooseItems = [
    {
      icon: <Star size={22} />,
      title: "Premium Quality",
      description: "We ensure high-precision prints with excellent surface finish and reliable performance.",
    },
    {
      icon: <Banknote size={22} />,
      title: "Affordable Pricing",
      description: "We provide cost-effective solutions tailored to meet different budgets without compromising quality.",
    },
    {
      icon: <Boxes size={22} />,
      title: "Bulk Production",
      description: "We support both single prototypes and large-scale production with complete flexibility.",
    },
    {
      icon: <Infinity size={22} />,
      title: "No MOQ",
      description: "Order exactly what you need, whether it's a single prototype or multiple units.",
    },
    {
      icon: <Lock size={22} />,
      title: "Secure File Handling",
      description: "Design files are handled with complete confidentiality and data protection.",
    },
    {
      icon: <Truck size={22} />,
      title: "Pan-India Delivery",
      description: "Reliable and timely delivery services across India for a seamless experience.",
    },
  ];

  const whatsappLink = `https://wa.me/918870002908?text=Hi%20Adroiit%20Technovations%2C%20I%20have%20an%20STL%20file%20for%203D%20Printing...`;

  return (
    <div className={`${bricolage.className} bg-white text-white min-h-screen relative overflow-x-hidden`}>
      
      {/* --- HERO SECTION --- */}
      <section className="relative w-full bg-[#050505] rounded-b-[24px] md:rounded-b-[40px] z-20 overflow-hidden pb-10">
        <div className="absolute inset-0 opacity-[0.15] pointer-events-none z-0" 
              style={{ 
                backgroundImage: 'linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)', 
                backgroundSize: '40px 40px' 
              }} />

        <div className="max-w-7xl mx-auto px-6 pt-32 z-10 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="flex flex-col items-start text-left">
                <h1 className="text-3xl md:text-3xl lg:text-3xl font-black tracking-tight mb-6">
                <span className="text-white">Industrial</span> <span className="text-[#8c52ff]">FDM 3D Printing Service</span>
                </h1>

                <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "80px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-1.5 bg-white mb-8 rounded-full"
                />

                <div className="border-l-4 border-[#8c52ff] pl-4 mb-6">
                <p className="italic text-gray-400 text-base md:text-lg font-medium">"Precision fabrication for functional prototypes."</p>
                </div>

                <motion.p custom={2} variants={fadeUp} className="text-gray-100 text-lg font-medium mb-4 text-justify leading-relaxed max-w-3xl">
                Transform your ideas into tangible reality through our Fused Deposition Modeling (FDM) 3D printing service. Whether you are a student, hobbyist, educator or an organization, our 3D printing services empower you to bring your ideas to life with quality and precision.
                </motion.p>
                
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 bg-[#8c52ff] text-white px-7 py-3 rounded-full font-bold hover:bg-purple-600 transition-all shadow-lg shadow-purple-500/20 text-sm">
                Request a Quote <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </a>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2} className="relative rounded-3xl overflow-hidden border-2 border-white/10 aspect-video w-full max-w-[550px] mx-auto lg:ml-auto">
                <Image src="/3d-printing/3d-printing-hero.jpg" alt="3D Printing Lab" fill className="object-cover opacity-80" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </motion.div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-3 text-center lg:text-left">
                <p className="text-[#8c52ff] font-bold tracking-widest uppercase text-[9px] mb-1">Look at</p>
                <h2 className="text-2xl font-black text-white mb-2 leading-tight">Our Capabilities</h2>
            </div>
            <div className="lg:col-span-9 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {capabilities.map((cap, i) => (
                <motion.div key={i} initial="hidden" animate="visible" variants={fadeUp} custom={i + 4} className="bg-neutral-900/80 border border-white/5 rounded-2xl p-5 hover:border-purple-500/50 transition-colors group">
                    <div className="text-[#8c52ff] mb-2 group-hover:scale-110 transition-transform">{cap.icon}</div>
                    <h3 className="text-sm font-black text-white mb-0.5">{cap.title}</h3>
                    <p className="text-white/80 font-bold text-[10px] uppercase mb-1">{cap.subtitle}</p>
                    <p className="text-gray-500 text-[8px] font-bold tracking-tighter uppercase leading-none">{cap.desc}</p>
                </motion.div>
                ))}
            </div>
            </div>
        </div>
      </section>

      {/* --- HOW IT WORKS SECTION --- */}
      <section className="relative z-10 py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-2xl font-black text-[#8c52ff] tracking-tight mb-4">How It Works</h2>
            <p className="text-gray-700 italic text-base max-w-2xl mx-auto">
              Our streamlined workflow is designed to take your digital designs to physical parts with zero hassle. Follow these four simple steps to get started.
            </p>
          </div>

          <div className="relative grid md:grid-cols-4 gap-8">
            <div className="hidden md:block absolute top-1/4 left-0 w-full h-0.5 bg-gray-100 z-0" />
            
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="relative z-10 flex flex-col items-center text-center group"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-purple-50 text-[#8c52ff] flex items-center justify-center mb-6 group-hover:bg-[#8c52ff] group-hover:text-white transition-all duration-300 shadow-sm border border-purple-100">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 bg-[#8c52ff] text-white w-7 h-7 rounded-full flex items-center justify-center font-black text-xs border-2 border-white shadow-md">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-[#8c52ff] mb-3">{step.title}</h3>
                <p className="text-black text-sm leading-relaxed max-w-[200px]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- WHY PRINT WITH US SECTION --- */}
      <section className="relative z-10 py-8 bg-[#050505]">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-2xl font-black text-[#8c52ff] tracking-tight mb-3">
              Why Print With Us
            </h2>
            <p className="text-gray-200 text-sm md:text-base max-w-2xl italic mx-auto font-medium">
                Our 3D printing service is focused on delivering consistent quality, flexibility and dependable results for every requirement.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {whyChooseItems.map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }} 
                viewport={{ once: true }}
                className="bg-[#111111] border border-white/5 rounded-[24px] p-6 flex flex-col items-center justify-center text-center transition-all hover:bg-[#161616] hover:border-purple-500/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] group min-h-[180px]"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-600/10 flex items-center justify-center text-[#8c52ff] mb-3 group-hover:scale-110 transition-transform flex-shrink-0">
                  {item.icon}
                </div>
                
                <h3 className="text-[#8c52ff] font-bold text-[13px] mb-2 leading-tight uppercase tracking-wide">
                  {item.title}
                </h3>
                
                <p className="text-white text-[12px] leading-snug opacity-80 font-normal">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="relative z-10 py-8 bg-[#f3f4f6]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-2xl font-extrabold text-[#8c52ff] tracking-tight leading-tight mb-2"
          >
            Turn Your Design into Reality!
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-700 text-base md:text-lg font-medium max-w-3xl mx-auto leading-relaxed mb-6"
          >
            Experience high-quality 3D printing with precision, speed and reliability - tailored to meet your prototyping and production needs.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a 
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#8c52ff] text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-purple-500/20 hover:bg-[#8c52ff] hover:scale-105 transition-all text-base"
            >
              <span>Request a Quote</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>

            <Link 
              href="/services/mechanical-cad"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border-2 border-[#8c52ff] text-[#8c52ff] px-8 py-3.5 rounded-full font-bold shadow-md hover:bg-purple-50 hover:scale-105 transition-all text-base"
            >
              <PenTool size={18} />
              <span>Consult a Designer</span>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
