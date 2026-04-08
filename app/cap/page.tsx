"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  Trophy, 
  Rocket, 
  Cpu, 
  Share2, 
  Zap, 
  Network,
  ArrowRight,
  ShieldCheck,
  Star
} from "lucide-react";
import Image from "next/image";
import { Bricolage_Grotesque } from "next/font/google";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

export default function CampusAmbassadorPage() {
  const perks = [
    { title: "Exclusive Access", desc: "Early beta-testing of Adroiit's upcoming AMR kits and ROS2 nodes.", icon: Cpu },
    { title: "Mentorship", desc: "1-on-1 sessions with our lead robotics and AI engineers.", icon: Users },
    { title: "Global Network", desc: "Connect with a community of 500+ student innovators across India.", icon: Network },
    { title: "Job Referrals", desc: "Direct fast-track to internships and full-time roles at Adroiit.", icon: Star },
  ];

  return (
    <div className={`${bricolage.className} bg-black text-white min-h-screen selection:bg-blue-500/30`}>
      
      {/* --- HERO: THE "LEAD THE PACK" HEADER --- */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Animated Background: Digital Network Pulse */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full h-[400px] bg-blue-600/10 blur-[120px] rounded-full" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center space-y-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/5 text-blue-400 text-[10px] font-bold uppercase tracking-[0.4em]"
            >
              The 2026 Cohort is Open
            </motion.div>

            <h1 className="text-6xl md:text-9xl font-bold tracking-tighter leading-none">
              Be the Face <br />
              <span className="italic font-light text-gray-500">of Innovation.</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed font-light">
              Adroiit Technovations is looking for 100 student leaders to bridge the gap between their campus and the future of robotics.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-[0_10px_40px_rgba(37,99,235,0.2)]">
                Apply to Program
              </button>
              <button className="bg-white/5 border border-white/10 hover:bg-white/10 px-10 py-4 rounded-xl font-bold transition-all">
                Refer a Friend
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- REWARDS GRID: THE "LEVEL UP" DESIGN --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {perks.map((perk, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="bg-neutral-900/30 border border-white/5 p-8 rounded-3xl group hover:border-blue-500/40 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-12 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                <perk.icon size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">{perk.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{perk.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- RESPONSIBILITIES: THE COMMANDER SECTION --- */}
      <section className="py-24 px-6 bg-neutral-950/80">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Your Role as an <br /><span className="text-blue-500 underline underline-offset-8">Ambassador.</span></h2>
            <div className="space-y-6">
              {[
                { title: "Community Building", text: "Organize tech-talks and mini-workshops with our support.", icon: Zap },
                { title: "Brand Advocacy", text: "Be the first to share Adroiit's breakthroughs on social platforms.", icon: Share2 },
                { title: "Student Liaison", text: "Help students at your college find the right STEM career path.", icon: ShieldCheck },
              ].map((role, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="pt-1">
                    <role.icon className="text-blue-500" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg group-hover:text-blue-400 transition-colors">{role.title}</h4>
                    <p className="text-sm text-gray-500">{role.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative aspect-square rounded-[3rem] border border-white/10 overflow-hidden bg-neutral-900 group">
             <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent" />
             <div className="absolute inset-0 flex items-center justify-center p-12">
                <div className="text-center space-y-4">
                   <div className="text-6xl font-black text-white/10 group-hover:text-white/20 transition-all tracking-tighter">ELITE_STATUS</div>
                   <Rocket size={100} strokeWidth={0.5} className="text-blue-500 mx-auto group-hover:animate-bounce" />
                </div>
             </div>
             <div className="absolute bottom-6 left-6 right-6 p-6 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl">
                <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
                   <span className="text-gray-400">Badge Tier</span>
                   <span className="text-blue-400 font-bold">Platinum Member</span>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- CALL TO ACTION: THE "RECRUITMENT" BOX --- */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto border-2 border-white/10 p-12 md:p-20 rounded-[4rem] text-center space-y-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] -z-10 group-hover:bg-blue-500/20 transition-all" />
          
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">Are you the next <br /> Adroiit Leader?</h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Applications close in 14 days. We select one lead ambassador per institution. Make sure your college is represented.
          </p>
          
          <div className="pt-6">
            <button className="bg-white text-black px-16 py-5 rounded-full font-black text-xs uppercase tracking-[0.4em] hover:bg-blue-600 hover:text-white transition-all shadow-xl">
              Initiate Application
            </button>
          </div>
          
          <div className="pt-12 flex justify-center gap-8 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
             {/* Logo placeholders for partner colleges */}
             <div className="text-[10px] font-bold uppercase tracking-widest text-gray-600">Join 50+ Institutions</div>
          </div>
        </div>
      </section>

    </div>
  );
}