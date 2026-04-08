"use client";

import { motion, Variants } from "framer-motion";
import {
  ArrowRight,
  CheckCircle,
  Cpu,
  Bot,
  MessageCircle,
  Layers,
  BrainCircuit,
  Star,
  Terminal,
  Zap
} from "lucide-react";
import Image from "next/image";
import { Bricolage_Grotesque } from "next/font/google";
import Footer from "@/sections/Footer";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
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

  const whatsappLink =
    "https://wa.me/918870002908?text=Hi%20Adroiit%20Technovations%2C%20I'm%20interested%20in%20the%20Internship%20Program.";

  return (
    <div className={`${bricolage.className} bg-[#050505] text-white min-h-screen`}>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* LEFT */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
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
                <a
                  href={whatsappLink}
                  target="_blank"
                  className="bg-white text-black px-10 py-4 rounded-full font-bold flex items-center justify-center gap-3 hover:bg-purple-500 hover:text-white transition-all"
                >
                  Apply for Internship <ArrowRight size={20} />
                </a>
              </div>
            </motion.div>

            {/* RIGHT */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="relative">
              <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 bg-neutral-900 aspect-square lg:aspect-[4/5]">
                <Image
                  src="/internship-hero.jpg"
                  alt="Hands-on Learning"
                  fill
                  className="object-cover opacity-80"
                  priority
                />
                <div className="absolute bottom-8 left-8 p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 max-w-xs">
                  <div className="flex items-center gap-3 mb-2 text-green-400">
                    <CheckCircle size={20} />
                    <span className="text-sm font-bold uppercase">Industry Ready</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    ISO Certified Certification provided upon successful completion.
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* TRACKS */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">

          <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">
            Internship <span className="text-purple-500">Tracks</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {internshipTracks.map((track, i) => (
              <motion.div key={i} whileHover={{ y: -10 }} className={`p-8 rounded-[2rem] border ${track.color}`}>
                <div className="mb-6 text-purple-500">{track.icon}</div>
                <h3 className="text-xl font-bold mb-4">{track.title}</h3>

                <ul className="space-y-3">
                  {track.skills.map((skill, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-400">
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

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
