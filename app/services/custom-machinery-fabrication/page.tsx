"use client";

import { motion, Variants } from "framer-motion"; // Added Variants to import
import {
  Maximize,
  ShieldCheck,
  TrendingUp,
  Zap,
  ArrowRight,
  ClipboardCheck,
  PackageSearch,
  Wrench,
  Cpu,
  Star,
  Banknote,
  Boxes,
  Infinity,
  Truck,
  Lock,
  Lightbulb,
  Construction,
  LifeBuoy,
} from "lucide-react";
import Image from "next/image";
import { Bricolage_Grotesque } from "next/font/google";
import Footer from "@/sections/Footer";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

// Fixed: Explicitly typed as Variants to resolve the 'ease' property error
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

export default function CustomMachineryPage() {
  const specializedAreas = [
    { title: "Conceptual Design", subtitle: "CAD & PROTOTYPING", desc: "IDEATION TO BLUEPRINT", icon: <Lightbulb size={20} /> },
    { title: "Precision Sourcing", subtitle: "BOM OPTIMIZATION", desc: "INDUSTRIAL GRADE PARTS", icon: <PackageSearch size={20} /> },
    { title: "Fabrication", subtitle: "ASSEMBLY & QA", desc: "END-TO-END PRODUCTION", icon: <Construction size={20} /> },
    { title: "Installation", subtitle: "ON-SITE DEPLOYMENT", desc: "SEAMLESS INTEGRATION", icon: <Truck size={20} /> },
    { title: "Support & AMC", subtitle: "MAINTENANCE", desc: "LONG-TERM RELIABILITY", icon: <LifeBuoy size={20} /> },
  ];

  const steps = [
    {
      title: "Requirement Analysis",
      desc: "We analyze your specific industrial needs, performance metrics, and operational constraints.",
      icon: <ClipboardCheck size={28} />,
    },
    {
      title: "Design & Sourcing",
      desc: "Engineering high-precision CAD models while sourcing high-quality materials and components.",
      icon: <Wrench size={28} />,
    },
    {
      title: "Production & Assembly",
      desc: "Our technicians bring the design to life with rigorous fabrication and integration standards.",
      icon: <Construction size={28} />,
    },
    {
      title: "Installation & Maintenance",
      desc: "Seamless deployment at your facility followed by dedicated post-production support.",
      icon: <ShieldCheck size={28} />,
    },
  ];

  const whyChooseItems = [
    {
      icon: <Star size={22} />,
      title: "Bespoke Solutions",
      description: "Every machine is purpose-built to solve your unique technical and operational challenges.",
    },
    {
      icon: <TrendingUp size={22} />,
      title: "Scalable Output",
      description: "Our designs are engineered for efficiency, helping you scale production with ease.",
    },
    {
      icon: <Boxes size={22} />,
      title: "End-to-End Execution",
      description: "We handle everything from the initial sketch to final component sourcing and assembly.",
    },
    {
      icon: <Lock size={22} />,
      title: "IP Protection",
      description: "Your custom machinery designs and proprietary processes are kept strictly confidential.",
    },
    {
      icon: <Zap size={22} />,
      title: "Rapid Prototyping",
      description: "Quick turnaround for proof-of-concepts before moving into full-scale fabrication.",
    },
    {
      icon: <Truck size={22} />,
      title: "On-Site Support",
      description: "Dedicated maintenance and technical support team available for on-ground assistance.",
    },
  ];

  const whatsappLink = `https://wa.me/918870002908?text=Hi%20Adroiit%20Technovations%2C%20I%20am%20interested%20in%20Custom%20Machinery%20Fabrication...`;

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
                <span className="text-white">Custom</span> <span className="text-purple-500">Machinery & Product Fabrication</span>
                </h1>

                <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "80px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-1.5 bg-white mb-8 rounded-full"
                />

                <div className="border-l-4 border-purple-500 pl-4 mb-6">
                <p className="italic text-gray-400 text-base md:text-lg font-medium">"From concept to commissioning—tailored for your growth."</p>
                </div>

                <motion.p custom={2} variants={fadeUp} className="text-gray-100 text-lg font-medium mb-4 text-justify leading-relaxed max-w-3xl">
                We design and develop custom machinery upon client requirements, bridging the gap between complex engineering and functional reality. Our team manages every phase: conceptual design, precision sourcing, high-standard production, and long-term maintenance.
                </motion.p>
                
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 bg-purple-600 text-white px-7 py-3 rounded-full font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20 text-sm">
                Discuss Your Project <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </a>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2} className="relative rounded-3xl overflow-hidden border-2 border-white/10 aspect-video w-full max-w-[550px] mx-auto lg:ml-auto">
                <Image src="/cpf/cpf-hero.jpg" alt="Machinery Fabrication" fill className="object-cover opacity-80" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </motion.div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-3 text-center lg:text-left">
                <p className="text-purple-400 font-bold tracking-widest uppercase text-[9px] mb-1">Explore</p>
                <h2 className="text-2xl font-black text-white mb-2 leading-tight">Our Expertise</h2>
            </div>
            <div className="lg:col-span-9 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {specializedAreas.map((area, i) => (
                <motion.div key={i} initial="hidden" animate="visible" variants={fadeUp} custom={i + 4} className="bg-neutral-900/80 border border-white/5 rounded-2xl p-5 hover:border-purple-500/50 transition-colors group">
                    <div className="text-purple-500 mb-2 group-hover:scale-110 transition-transform">{area.icon}</div>
                    <h3 className="text-sm font-black text-white mb-0.5">{area.title}</h3>
                    <p className="text-white/80 font-bold text-[10px] uppercase mb-1">{area.subtitle}</p>
                    <p className="text-gray-500 text-[8px] font-bold tracking-tighter uppercase leading-none">{area.desc}</p>
                </motion.div>
                ))}
            </div>
            </div>
        </div>
      </section>

      {/* --- WORKFLOW SECTION --- */}
      <section className="relative z-10 py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-2xl font-black text-purple-600 tracking-tight mb-4">Our Development Lifecycle</h2>
            <p className="text-gray-700 italic text-base max-w-2xl mx-auto">
              We follow a rigorous engineering workflow to ensure your custom machinery is delivered with peak performance and reliability.
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
                  <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shadow-sm border border-purple-100">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 bg-purple-600 text-white w-7 h-7 rounded-full flex items-center justify-center font-black text-xs border-2 border-white shadow-md">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-purple-600 mb-3">{step.title}</h3>
                <p className="text-black text-sm leading-relaxed max-w-[200px]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- WHY CHOOSE US SECTION --- */}
      <section className="relative z-10 py-8 bg-[#050505]">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-2xl font-black text-purple-600 tracking-tight mb-3">
              Why Choose Our Fabrication Service
            </h2>
            <p className="text-gray-200 text-sm md:text-base max-w-2xl italic mx-auto font-medium">
                We combine mechatronics expertise with industrial production capabilities to deliver results that exceed expectations.
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
                <div className="w-10 h-10 rounded-xl bg-purple-600/10 flex items-center justify-center text-purple-500 mb-3 group-hover:scale-110 transition-transform flex-shrink-0">
                  {item.icon}
                </div>
                
                <h3 className="text-purple-500 font-bold text-[13px] mb-2 leading-tight uppercase tracking-wide">
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
            className="text-3xl md:text-2xl font-extrabold text-purple-600 tracking-tight leading-tight mb-2"
          >
            Ready to Build Your Custom Product?
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-700 text-base md:text-lg font-medium max-w-3xl mx-auto leading-relaxed mb-6"
          >
            Connect with our engineering team today to transform your technical requirement into a fully functional product.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center"
          >
            <a 
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-purple-600 text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-purple-500/20 hover:bg-purple-700 hover:scale-105 transition-all text-base"
            >
              <span>Consult with Us</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
