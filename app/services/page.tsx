"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  GraduationCap, 
  Settings, 
  ArrowRight 
} from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";
import Footer from "@/sections/Footer";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

<<<<<<< HEAD
// Animation variants
=======
/**
 * FIXED: Explicitly casting transition to 'any'.
 * This prevents the Vercel TypeScript runner from failing on 'string' vs 'Easing' types.
 */
>>>>>>> e2baf1dba26938901f368103a341818a42460a55
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: "easeOut" } as any 
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
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

const serviceCategories = [
  {
    title: "For schools",
    icon: <BookOpen className="text-[#8c52ff]" />,
    description: "Nurturing young minds through hands-on STEM exploration and innovation labs.",
    links: [
<<<<<<< HEAD
      { name: "STEM Tinkering & Innovation Lab (TIL)", href: "/services/stem-til" },
      { name: "STEM Workshops", href: "/services/stem-workshop" },
      { name: "STEM Bootcamps", href: "/services/stem-bootcamp" },
=======
      { name: "STEM tinkering labs", href: "/services/stem-labs" },
      { name: "STEM workshops", href: "/services/workshops" },
      { name: "STEM bootcamps", href: "/services/bootcamps" },
>>>>>>> e2baf1dba26938901f368103a341818a42460a55
    ]
  },
  {
    title: "For colleges",
    icon: <GraduationCap className="text-[#8c52ff]" />,
    description: "Advanced technical training and Center of Excellence (CoE) setups for higher education.",
    links: [
<<<<<<< HEAD
      { name: "Center of Excellence (CoE)", href: "/services/coe" },
      { name: "Value Added Courses", href: "/services/value-added-courses" },
      { name: "Technical Workshops", href: "/services/technical-workshop" },
=======
      { name: "Center of Excellence", href: "/services/coe" },
      { name: "Advanced robotics labs", href: "/services/advanced-labs" },
      { name: "Technical workshops", href: "/services/college-workshops" },
>>>>>>> e2baf1dba26938901f368103a341818a42460a55
    ]
  },
  {
    title: "Engineering services",
    icon: <Settings className="text-[#8c52ff]" />,
    description: "Professional grade fabrication, 3D printing, and mechanical design solutions.",
    links: [
<<<<<<< HEAD
      { name: "Custom Product Fabrication", href: "/services/custom-machinery-fabrication"},
      { name: "3D Printing", href: "/services/3d-printing" },
      { name: "Mechanical CAD", href: "/services/mechanical-cad" },
=======
      { name: "3D printing & analysis", href: "/services/3d-printing", highlight: true },
      { name: "Custom fabrication", href: "/services/fabrication" },
      { name: "Mechanical CAD", href: "/services/consultation" },
>>>>>>> e2baf1dba26938901f368103a341818a42460a55
    ]
  }
];

export default function ServicesPage() {
  // ✅ OVERRIDE BROWSER DEFAULTS
  // This forces the background to be dark at the body level, 
  // preventing white space if the content is short.
  useEffect(() => {
    document.body.style.backgroundColor = "#050505";
    return () => {
      document.body.style.backgroundColor = ""; 
    };
  }, []);

  return (
    <div className={`${bricolage.className} bg-[#050505] text-white min-h-screen flex flex-col`}>
      {/* Main Content Area */}
      <main className="pt-25 pb-10 px-6 flex-grow bg-[#050505]">
        
        {/* Header section */}
<<<<<<< HEAD
        <section className="max-w-7xl mx-auto text-center mb-8">
=======
        <section className="max-w-7xl mx-auto text-center mb-20">
>>>>>>> e2baf1dba26938901f368103a341818a42460a55
          <motion.h1 
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
<<<<<<< HEAD
            className="text-5xl md:text-2xl font-bold tracking-tighter mb-6"
          >
            <span className="text-purple-600">Our Solutions</span>
=======
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-6"
          >
            Our <span className="text-[#8c52ff]">solutions</span>
>>>>>>> e2baf1dba26938901f368103a341818a42460a55
          </motion.h1>
          <motion.p 
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
<<<<<<< HEAD
            className="text-gray-300 text-lg max-w-2xl mx-auto"
=======
            className="text-gray-400 text-lg max-w-2xl mx-auto"
>>>>>>> e2baf1dba26938901f368103a341818a42460a55
          >
            From classroom inspiration to industrial fabrication, we provide the tools and expertise to build the future.
          </motion.p>
        </section>

        {/* Services grid */}
        <section className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {serviceCategories.map((category, idx) => (
            <motion.div
              key={idx}
              custom={idx + 2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 hover:border-[#8c52ff]/50 transition-colors flex flex-col"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#8c52ff]/10 flex items-center justify-center mb-6">
                {category.icon}
              </div>
              <h2 className="text-2xl text-purple-500 font-bold mb-4">{category.title}</h2>
              <p className="text-gray-200 text-sm mb-8 flex-grow">
                {category.description}
              </p>
              
              <ul className="space-y-4">
                {category.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link 
                      href={link.href}
                      className={`flex items-center justify-between group p-4 rounded-xl transition-all ${
                        link.highlight ? 'bg-[#8c52ff]/20 text-[#8c52ff]' : 'bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-sm font-bold">{link.name}</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </section>
<<<<<<< HEAD
=======

        {/* Feature highlight strip */}
        <section className="max-w-7xl mx-auto mt-32 border-t border-white/5 pt-20">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}>
              <Cpu className="mx-auto mb-4 text-[#8c52ff]" size={32} />
              <h3 className="font-bold mb-2">Modern hardware</h3>
              <p className="text-sm text-gray-500">Access to industrial-grade 3D printers and CNC machinery.</p>
            </motion.div>
            <motion.div custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <Layers className="mx-auto mb-4 text-[#8c52ff]" size={32} />
              <h3 className="font-bold mb-2">Expert guidance</h3>
              <p className="text-sm text-gray-500">Mentorship from experienced mechanical and robotics engineers.</p>
            </motion.div>
            <motion.div custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <Microscope className="mx-auto mb-4 text-[#8c52ff]" size={32} />
              <h3 className="font-bold mb-2">Future-ready skills</h3>
              <p className="text-sm text-gray-500">Curriculum designed to bridge the gap between theory and industry.</p>
            </motion.div>
          </div>
        </section>
>>>>>>> e2baf1dba26938901f368103a341818a42460a55
      </main>

      {/* Double-check that @/sections/Footer root element doesn't 
          have a 'bg-white' or 'bg-slate-50' class.
      */}
      <div className="bg-[#050505] w-full">
        <Footer />
      </div>
    </div>
  );
}
