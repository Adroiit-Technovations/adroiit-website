"use client";

import { motion, Variants } from "framer-motion";
import {
  Cpu,
  PenTool,
  Microscope,
  Briefcase,
  Megaphone,
  ArrowRight,
  Zap,
  ShieldCheck,
  Globe,
} from "lucide-react";
import Image from "next/image";
import { Bricolage_Grotesque } from "next/font/google";
import Footer from "@/sections/Footer";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

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

export default function InternshipPage() {
  const googleFormLink = "https://forms.gle/your-form-id"; 

  const domains = [
    { title: "Embedded & IoT", status: "Open", desc: "Architect smart solutions using ESP32 & Arduino.", skills: ["Arduino", "PCB", "IoT"], image: "/internship/embedded.jpg", icon: <Cpu size={18} /> },
    { title: "Mechanical Design", status: "Open", desc: "Design high-precision hardware & 3D workflows.", skills: ["SolidWorks", "CAD", "3DP"], image: "/internship/mechanical.jpg", icon: <PenTool size={18} /> },
    { title: "R&D Innovation", status: "Open", desc: "Explore experimental STEM technologies.", skills: ["Research", "Testing", "Kits"], image: "/internship/rd.jpg", icon: <Microscope size={18} /> },
    { title: "Founder's Office", status: "Open", desc: "Work on scaling & operational strategy.", skills: ["Strategy", "Ops", "Comm"], image: "/internship/founder.jpg", icon: <Briefcase size={18} /> },
    { title: "Digital Marketing", status: "Closed", desc: "Technical SEO & growth marketing.", skills: ["SEO", "Content", "Ads"], image: "/internship/marketing.jpg", icon: <Megaphone size={18} /> },
  ];

  return (
    <div className={`${bricolage.className} bg-white min-h-screen`}>
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <h1 className="text-4xl md:text-6xl font-black text-black tracking-tight mb-4">
              Building the <span className="text-purple-600">Next Gen</span> of Innovators.
            </h1>
            <motion.div initial={{ width: 0 }} animate={{ width: "120px" }} transition={{ duration: 0.8 }} className="h-1.5 bg-purple-600 rounded-full mb-6" />
            <p className="text-gray-600 text-lg font-medium leading-relaxed mb-8">
              Join Adroiit Technovations for a hands-on internship experience. Solve industrial problems and grow with a team of expert engineers.
            </p>
          </motion.div>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2} className="relative aspect-video rounded-[32px] overflow-hidden shadow-2xl">
            <Image src="/hero-internship.jpg" alt="Internship at Adroiit" fill className="object-cover" />
          </motion.div>
        </div>
      </section>

      {/* --- DOMAINS SECTION (DARK - 3+2 Layout) --- */}
      <section className="py-24 bg-[#0A0A0A] rounded-t-[40px] md:rounded-t-[60px] px-6 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-black mb-4 uppercase tracking-tight">Specialized Domains</h2>
            <p className="text-gray-400 max-w-2xl font-medium mx-auto">Explore our current openings and choose the path that aligns with your goals.</p>
          </div>

          <div className="flex flex-col gap-6">
            {/* Top Row: 3 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {domains.slice(0, 3).map((domain, i) => (
                <DomainCard key={i} domain={domain} link={googleFormLink} />
              ))}
            </div>

            {/* Bottom Row: 2 Cards Centered */}
            <div className="flex flex-col md:flex-row justify-center gap-6">
              {domains.slice(3, 5).map((domain, i) => (
                <div key={i} className="w-full md:w-[calc(33.333%-16px)]">
                  <DomainCard domain={domain} link={googleFormLink} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- WHY JOIN US --- */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-black text-black mb-16 uppercase">Why Join Adroiit?</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              { t: "Live Projects", d: "Work on actual hardware products deployed in industries.", icon: <Zap className="text-orange-500" /> },
              { t: "Certification", d: "Receive industry-recognized certificates for your career.", icon: <ShieldCheck className="text-green-500" /> },
              { t: "Career Path", d: "High-performing interns stand a chance for Pre-Placement Offers.", icon: <Globe className="text-blue-500" /> }
            ].map((card, i) => (
              <div key={i} className="bg-neutral-50 p-8 rounded-[32px] border border-neutral-100 group">
                <div className="mb-4 bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm">{card.icon}</div>
                <h4 className="text-lg font-black text-black mb-2">{card.t}</h4>
                <p className="text-gray-600 text-sm leading-relaxed font-medium">{card.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-16 bg-purple-600 mx-6 mb-10 rounded-[32px] text-white text-center px-6 shadow-xl">
        <h2 className="text-3xl font-black mb-4">Ready to Innovate?</h2>
        <p className="text-purple-100 text-base mb-8 font-medium">Limited slots available. Start your application now.</p>
        <a href={googleFormLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-white text-purple-600 px-8 py-3.5 rounded-full font-black text-base hover:scale-105 transition-all shadow-lg">
          Start Application <ArrowRight size={20}/>
        </a>
      </section>

      <Footer />
    </div>
  );
}

// Sub-component for clean code
function DomainCard({ domain, link }: { domain: any, link: string }) {
  return (
    <motion.div whileHover={{ y: -8 }} className="bg-[#141414] border border-white/5 rounded-[24px] overflow-hidden flex flex-col h-full group">
      <div className="relative h-40 w-full">
        <Image src={domain.image} alt={domain.title} fill className="object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-3 right-3">
          <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${domain.status === 'Open' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
            {domain.status}
          </span>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-3">
          <div className="text-purple-500">{domain.icon}</div>
          <h3 className="text-base font-black leading-tight">{domain.title}</h3>
        </div>
        <p className="text-gray-400 text-xs leading-relaxed mb-4 font-medium">{domain.desc}</p>
        <div className="mb-6 flex flex-wrap gap-1.5">
          {domain.skills.map((s: string, idx: number) => (
            <span key={idx} className="text-[9px] font-bold text-white/60 bg-white/5 px-2 py-0.5 rounded border border-white/5">{s}</span>
          ))}
        </div>
        <a href={link} target="_blank" className={`mt-auto flex items-center justify-center gap-2 w-full py-3 rounded-xl font-black text-[10px] transition-all uppercase tracking-wider ${domain.status === 'Open' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'}`}>
          {domain.status === 'Open' ? 'Apply Now' : 'Closed'} <ArrowRight size={12} />
        </a>
      </div>
    </motion.div>
  );
}