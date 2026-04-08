"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Settings,
  Cpu,
  Zap,
  Globe,
  Users,
  ShieldCheck,
  Wrench,
  Lightbulb,
  Trophy,
  Microchip,
  LayoutDashboard,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Bricolage_Grotesque } from "next/font/google";
import Footer from "@/sections/Footer";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: "easeOut" } 
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

export default function CoEPage() {
  const domains = [
    { 
      image: "/services/coe-robotics2.jfif", 
      title: "Robotics", 
      desc: "Hands-on learning in robot design, control systems, and real-world applications including autonomous and semi-autonomous systems." 
    },
    { 
      image: "/services/coe-embedded.jfif", 
      title: "Embedded Systems & IoT", 
      desc: "Comprehensive training on microcontrollers, sensor interfacing, communication protocols and IoT-based smart systems." 
    },
    { 
      image: "/services/coe-plc.jfif", 
      title: "Industrial Automation", 
      desc: "Exposure to automation technologies used in industries, including PLCs, control systems and smart manufacturing concepts." 
    },
    { 
      image: "/services/coe-drone.jpg", 
      title: "Drone Technology", 
      desc: "Learning drone design, assembly, flight control and applications in fields like surveillance, mapping, and agriculture." 
    },
  ];

  const supportServices = [
    { title: "Infrastructure Setup", desc: "Complete lab design and setup with industry-grade equipment and tools.", icon: <LayoutDashboard size={24} /> },
    { title: "Procurement Assistance", desc: "Guidance and support in selecting and sourcing the right components and systems.", icon: <ShieldCheck size={24} /> },
    { title: "Installation & Configuration", desc: "Professional setup and testing of all hardware and software systems.", icon: <Settings size={24} /> },
    { title: "Faculty Training", desc: "Comprehensive training programs for faculty to effectively utilize the CoE.", icon: <Users size={24} /> },
    { title: "Student Training & Mentorship", desc: "Continuous hands-on training, guidance, and mentorship for students.", icon: <Lightbulb size={24} /> },
    { title: "Project & Innovation Support", desc: "Assistance in building real-world projects and competition preparation.", icon: <Trophy size={24} /> },
  ];

  const highlights = [
    { title: "Industry-grade lab infrastructure", icon: <Microchip size={24} /> },
    { title: "Hands-on, experiential learning environment", icon: <Wrench size={24} /> },
    { title: "Aligned with latest technology trends", icon: <Zap size={24} /> },
    { title: "Encourages innovation and research culture", icon: <Globe size={24} /> },
    { title: "Supports academic and competitive projects", icon: <Trophy size={24} /> },
    { title: "Long-term institutional value creation", icon: <ShieldCheck size={24} /> },
  ];

  return (
    <div className={`${bricolage.className} bg-white text-black overflow-x-hidden`}>
      
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-12 px-6 overflow-hidden bg-white">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}
          className="relative z-10 max-w-7xl mx-auto"
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full">
            <div className="flex flex-col items-start text-left w-full md:w-1/2 md:max-w-2xl">
              <motion.h1 custom={0} variants={fadeUp} className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 leading-tight">
                Center of <span className="text-purple-600">Excellence (CoE)</span>
              </motion.h1>

              <motion.span custom={1} variants={fadeUp} className="text-black font-bold tracking-widest uppercase text-xs mb-4">
                Building Future-Ready Innovation Ecosystems
              </motion.span>

              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "80px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-1 bg-purple-600 mb-6 rounded-full"
              />

              <motion.p custom={2} variants={fadeUp} className="text-gray-800 text-lg font-medium mb-4 text-justify leading-relaxed">
                Adroiit Technovations partners with institutions to establish state-of-the-art Centers of Excellence (CoE) that empower students with industry-relevant skills and advanced laboratory infrastructure.
              </motion.p>
              
              <motion.p custom={3} variants={fadeUp} className="text-gray-600 text-base mb-6 text-justify leading-relaxed">
                Our model transforms traditional learning environments into innovation-driven ecosystems where students gain real-world exposure, work on impactful projects and develop strong technical competencies.
              </motion.p>

              <motion.div custom={4} variants={fadeUp}>
                <Link href="/contact" className="w-fit bg-purple-600 text-white px-6 py-3 rounded-full font-bold hover:bg-purple-700 transition-all flex items-center gap-2 shadow-md shadow-purple-500/20 text-base">
                  Partner With Us <ArrowRight size={18} />
                </Link>
              </motion.div>
            </div>

            <motion.div custom={5} variants={fadeUp} className="flex justify-center w-full md:w-1/2 mt-10 md:mt-0">
              <div className="relative w-full max-w-[520px]">
                <Image 
                  src="/services/coe2.png" 
                  alt="Center of Excellence" 
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

      {/* DOMAINS WE OFFER - Dark Theme */}
      <section className="py-8 px-6 bg-neutral-950 text-white">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-purple-500 mb-2">Domains We Offer</h2>
            <p className="text-gray-300 text-base max-w-xl mx-auto">
              Specialized technology centers tailored to your institution&apos;s goals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {domains.map((domain, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} 
                viewport={{ once: true }}
                className="p-4 rounded-[2rem] bg-neutral-900/40 border border-white/10 hover:border-purple-500/50 transition-all duration-300 flex flex-col items-center"
              >
                <div className="relative w-full h-36 mb-4 overflow-hidden rounded-2xl">
                  <Image 
                    src={domain.image} 
                    alt={domain.title} 
                    fill 
                    className="object-cover"
                  />
                </div>
                <h3 className="text-base font-bold mb-2 text-purple-500 text-center leading-tight">{domain.title}</h3>
                <p className="text-white text-[11px] leading-relaxed text-center opacity-80">
                  {domain.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* OUR SUPPORT SECTION - Light Theme */}
      <section className="py-8 px-6 bg-white">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-purple-600 mb-2">End-to-End Implementation Support</h2>
            <p className="text-gray-700 text-base max-w-xl mx-auto">
              We handle the complexity of setting up and maintaining your innovation hub.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {supportServices.map((service, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 15 }} 
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }} 
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-gray-50 border border-gray-100 shadow-sm flex flex-col items-start"
              >
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-4">
                  {service.icon}
                </div>
                <h3 className="text-base font-bold mb-2 text-purple-600">{service.title}</h3>
                <p className="text-black text-xs leading-relaxed">
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CoE HIGHLIGHTS - Dark Theme */}
      <section className="py-8 px-6 bg-neutral-950">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}
          className="max-w-[1400px] mx-auto"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-purple-500 mb-2">CoE Highlights</h2>
            <p className="text-gray-300 text-base max-w-xl mx-auto">
              Delivering long-term institutional value through excellence.
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
                className="p-6 rounded-2xl bg-neutral-900 border border-white/10 flex flex-col items-center text-center justify-center min-h-[160px]"
              >
                <div className="w-12 h-12 bg-purple-600/10 rounded-xl flex items-center justify-center text-purple-500 mb-4">
                  {item.icon}
                </div>
                <h3 className="text-[13px] font-bold text-white leading-snug">{item.title}</h3>
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
          <h2 className="text-2xl md:text-2xl font-bold mb-4 text-purple-600">Build Your Institution’s Innovation Hub</h2>
          <p className="text-gray-600 text-sm mb-8 max-w-2xl mx-auto">
            Collaborate with Adroiit Technovations to establish a Center of Excellence and provide your students with the tools, knowledge and mentorship to lead in emerging technologies.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-purple-600 text-white px-8 py-3 rounded-full font-bold hover:bg-purple-700 transition-all text-base shadow-lg shadow-purple-500/20">
            <CalendarDays size={18} /> Book a Consultation
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}