"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Cpu,
  Bot,
  MessageCircle,
  Layers,
  BrainCircuit,
  FileBadge,
  Trophy,
  Star,
  Users,
  Terminal,
  Zap
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Bricolage_Grotesque } from "next/font/google";
import Footer from "@/sections/Footer";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
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

export default function InternshipPage() {
  const internshipTracks = [
    {
      title: "Embedded Systems & IoT",
      icon: <Cpu size={28} />,
      skills: ["STM32/Arduino", "Sensors Integration", "MQTT Protocols", "PCB Design"],
      color: "border-purple-500/20 bg-purple-500/5"
    },
    {
      title: "Robotics & Automation",
      icon: <Bot size={28} />,
      skills: ["ROS (Robot OS)", "Kinematics", "Motor Control", "Computer Vision"],
      color: "border-blue-500/20 bg-blue-500/5"
    },
    {
      title: "Mechanical CAD Design",
      icon: <Layers size={28} />,
      skills: ["SolidWorks/Fusion 360", "GD&T", "DFM Principles", "3D Printing"],
      color: "border-orange-500/20 bg-orange-500/5"
    },
    {
      title: "AI & Machine Learning",
      icon: <BrainCircuit size={28} />,
      skills: ["Python", "TensorFlow", "Edge AI", "Data Analysis"],
      color: "border-green-500/20 bg-green-500/5"
    }
  ];

  const whatsappLink = "https://wa.me/918870002908?text=Hi%20Adroiit%20Technovations%2C%20I'm%20interested%20in%20the%20Internship%20Program.";

  return (
    <div className={`${bricolage.className} bg-[#050505] text-white min-h-screen`}>
      
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-bold mb-8">
                <Star size={16} fill="currentColor" />
                <span>2026 Cohort Now Open</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight">
                Empower Your <span className="text-purple-500">Career</span> Through Innovation
              </h1>
              <p className="mt-8 text-gray-400 text-lg md:text-xl leading-relaxed max-w-xl">
                Join Adroiit Technovations for a hands-on journey. Bridge the gap between classroom theory and professional industrial expertise.
              </p>
              
              <div className="mt-12 flex flex-col sm:flex-row gap-5">
                <a href={whatsappLink} target="_blank" className="bg-white text-black px-10 py-4 rounded-full font-bold flex items-center justify-center gap-3 hover:bg-purple-500 hover:text-white transition-all">
                  Apply for Internship <ArrowRight size={20} />
                </a>
                <div className="flex items-center gap-4 px-2">
                  <div className="flex -space-x-3">
                    {[11, 12, 13, 14].map((id) => (
                      <div key={id} className="w-12 h-12 rounded-full border-2 border-[#050505] bg-neutral-800 overflow-hidden relative">
                        <Image 
                          src={``} 
                          alt="Student" 
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <p className="font-bold">500+</p>
                    <p className="text-gray-500 text-xs uppercase tracking-wider">Students Empowered</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2} className="relative group">
               <div className="absolute inset-0 bg-purple-600/20 blur-3xl rounded-full scale-75 group-hover:scale-90 transition-transform duration-700"></div>
               <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 bg-neutral-900 aspect-square lg:aspect-[4/5]">
                  <Image 
                    src="/internship-hero.jpg" 
                    alt="Hands-on Learning" 
                    fill 
                    className="object-cover opacity-80"
                    priority 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
                  <div className="absolute bottom-8 left-8 p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 max-w-xs">
                    <div className="flex items-center gap-3 mb-2 text-green-400">
                      <CheckCircle size={20} />
                      <span className="text-sm font-bold uppercase tracking-widest">Industry Ready</span>
                    </div>
                    <p className="text-sm text-gray-300">ISO Certified Certification provided upon successful completion.</p>
                  </div>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TRACKS SECTION */}
      <section className="py-24 px-6 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-center">Internship <span className="text-purple-500">Tracks</span></h2>
            <p className="text-gray-500 text-center max-w-2xl mx-auto">Specialized domains focusing on high-demand technical skills.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {internshipTracks.map((track, i) => (
              <motion.div key={i} whileHover={{ y: -10 }} className={`p-8 rounded-[2rem] border ${track.color} transition-all duration-300`}>
                <div className="mb-8 p-4 w-fit rounded-2xl bg-white/5 text-purple-500">{track.icon}</div>
                <h3 className="text-xl font-bold mb-6">{track.title}</h3>
                <ul className="space-y-4">
                  {track.skills.map((skill, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-gray-400">
                      <Zap size={14} className="text-purple-500" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS / FOOTER AREA */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto bg-neutral-900/50 rounded-[3rem] border border-white/5 p-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-12 opacity-5">
            <Terminal size={200} />
          </div>
          <div className="grid lg:grid-cols-2 gap-12 relative z-10">
            <div>
              <h2 className="text-4xl font-bold mb-6">Start Your <span className="text-purple-500">Journey</span></h2>
              <p className="text-gray-400 mb-8">Follow our simple 4-step process to get started with your professional internship.</p>
              <div className="space-y-6">
                {["Application Review", "Technical Counseling", "Track Onboarding", "Live Project Development"].map((step, idx) => (
                  <div key={idx} className="flex items-center gap-5">
                    <span className="text-2xl font-black text-purple-500/30">0{idx + 1}</span>
                    <span className="font-bold text-lg">{step}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-center items-center lg:items-end">
              <div className="text-center lg:text-right">
                <h3 className="text-2xl font-bold mb-4">Questions?</h3>
                <p className="text-gray-400 mb-8">Chat with our mentors directly via WhatsApp for quick clarification.</p>
                <a href={whatsappLink} className="inline-flex items-center gap-3 bg-green-500 text-black px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform">
                  <MessageCircle size={20} /> Chat with Mentor
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}