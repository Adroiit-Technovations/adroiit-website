"use client";

import { motion, Variants, AnimatePresence } from "framer-motion";
import {
  Zap,
  ShieldCheck,
  Globe,
  Award,
  Rocket,
  Briefcase,
  Lightbulb,
  Cpu,
  Target,
  Users,
  Trophy,
  Plus,
  Minus,
} from "lucide-react";
import Image from "next/image";
import { Bricolage_Grotesque } from "next/font/google";
import { useState, useEffect, useMemo } from "react";
import InternshipApplication from "@/components/internship-application";
import Footer from "@/sections/Footer";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

// --- Animation Variants ---
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: "easeOut" } 
  }
};

const fadeUp: Variants = {
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

// --- Data ---
const testimonials = [
  { name: "Sri Sanjana", role: "Research & Development Intern", text: "Working as an intern has been a valuable and exciting experience. I had the opportunity to learn practical skills, work on real-time projects, and gain hands-on exposure." },
  { name: "Hariharan", role: "Parent - Robotics Class", text: "Good place to go on with STEM Education and Robotics Courses." },
  { name: "Shanmugapriya M", role: "Research & Development Intern", text: "I built my first Arduino project here. Learning is fun and practical!" },
  { name: "Rahul Sharma", role: "Parent", text: "My child developed real interest in robotics. The hands-on projects are amazing!" },
  { name: "Ananya Verma", role: "Student", text: "I built my first Arduino project here. Learning is fun and practical!" },
  { name: "School Coordinator", role: "Partner School", text: "Adroiit Technovations transformed our STEM education approach completely." },
];

const faqs = [
  {
    question: "Who can apply for the internship?",
    answer: "Our program is open to students currently pursuing graduation (B.E/B.Tech/B.Sc) or recent graduates passionate about robotics, IoT, and STEM education. We look for curiosity and a 'maker' mindset."
  },
  {
    question: "What is the duration of the internship?",
    answer: "Typically, our internships range from 4 to 12 weeks, depending on the domain and project requirements. Flexible schedules are available for ongoing students."
  },
  {
    question: "Will I receive a certificate upon completion?",
    answer: "Yes, every intern receives an industry-recognized certification from Adroiit Technovations, along with a detailed performance report and letter of recommendation for top performers."
  },
  {
    question: "Is this a paid internship?",
    answer: "We offer both stipend-based and learning-based internships depending on the project complexity and candidate's experience level. Details are shared during the interview process."
  },
  {
    question: "Can I work remotely?",
    answer: "While some domains like Digital Marketing and Founders' Office allow hybrid models, technical roles like Drone Tech and Embedded Systems generally require physical presence at our R&D labs for hardware access."
  }
];

const chunkArray = (arr: any[], size: number) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

// --- Sub-Components ---
const FAQItem = ({ question, answer, isOpen, onClick }: any) => {
  return (
    <div className="border-b border-white/10">
      <button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between text-left group transition-all"
      >
        <span className={`text-lg font-medium transition-colors duration-300 ${isOpen ? 'text-[#8c52ff]' : 'text-white group-hover:text-white/80'}`}>
          {question}
        </span>
        <div className="flex-shrink-0 ml-4">
          {isOpen ? (
            <Minus size={20} className="text-[#8c52ff]" />
          ) : (
            <Plus size={20} className="text-gray-500 group-hover:text-gray-300" />
          )}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-gray-400 text-sm md:text-base leading-relaxed max-w-3xl">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function InternshipPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDomain, setActiveDomain] = useState("Embedded Systems & IoT");
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const slides = chunkArray(testimonials, 3);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [paused, slides.length]);

  const domains = [
    { title: "Embedded Systems & IoT", status: "Open", desc: "Architect smart solutions using ESP32 & Arduino.", image: "/internship/embedded.jpg" },
    { title: "Mechanical CAD", status: "Open", desc: "Design high-precision hardware & 3D workflows.", image: "/internship/mechanical-cad.jpg" },
    { title: "Drone Technology", status: "Closed", desc: "Build and calibrate advanced flight systems.", image: "/internship/drones.jpg" },
    { title: "Research & Development", status: "Open", desc: "Explore experimental STEM technologies.", image: "/internship/rnd.jpg" },
    { title: "Founders' Office", status: "Open", desc: "Work on scaling & operational strategy.", image: "/internship/fo.jpg" },
    { title: "Digital Marketing", status: "Open", desc: "Growth marketing and content strategy.", image: "/internship/digital-marketing.jpg" },
  ];

  const sortedDomains = useMemo(() => {
    return [...domains].sort((a, b) => {
      if (a.status === "Open" && b.status === "Closed") return -1;
      if (a.status === "Closed" && b.status === "Open") return 1;
      return 0;
    });
  }, [domains]);

  const handleApply = (title: string) => {
    setActiveDomain(title);
    setIsModalOpen(true);
  };

  const scrollToDomains = () => {
    const element = document.getElementById("specialized-domains");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={`${bricolage.className} bg-white text-black overflow-x-hidden`}>
      
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-12 px-6 overflow-hidden bg-white">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}
          className="relative z-10 max-w-7xl mx-auto"
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 w-full">
            <div className="flex flex-col items-start text-left w-full md:w-1/2 md:max-w-2xl md:pr-2">
              <motion.h1 custom={0} variants={fadeUp} className="text-3xl md:text-3xl font-extrabold text-[#8c52ff] tracking-tight mb-4 leading-tight">
                Build. <span className="text-gray-950">Innovate.</span> Lead the Future.
              </motion.h1>

              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "80px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-1 bg-[#8c52ff] mb-6 rounded-full"
              />

              <motion.p custom={1} variants={fadeUp} className="text-gray-950 text-lg md:text-lg font-medium mb-4 text-justify leading-relaxed">
                Join Adroiit Technovations to gain hands-on experience in cutting-edge technologies, real-world projects and industry-driven innovation.
              </motion.p>
              
              <motion.p custom={2} variants={fadeUp} className="text-gray-600 text-base md:text-lg mb-6 text-justify leading-relaxed">
                At Adroiit Technovations, our internship program is designed to bridge the gap between academic learning and real-world application. 
              </motion.p>

              <motion.p custom={2} variants={fadeUp} className="text-gray-950 text-base md:text-lg mb-6 text-justify leading-relaxed">
                Whether you're passionate about engineering, innovation or business strategy, we provide a platform to learn, build and grow.
              </motion.p>
            </div>

            <motion.div custom={4} variants={fadeUp} className="flex justify-center w-full md:w-1/2 mt-10 md:mt-0">
              <div className="relative w-full max-w-[520px]">
                <Image 
                  src="/internship/internship-hero1.png" 
                  alt="Internship at Adroiit" 
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

      {/* DOMAINS SECTION */}
      <section id="specialized-domains" className="py-12 px-6 bg-neutral-950 text-white scroll-mt-20">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#8c52ff] mb-2 uppercase text-center">Specialized Domains</h2>
            <p className="text-gray-300 text-base max-w-xl mx-auto">
              Applications now open for 2026 batches. Specialized technical tracks designed for innovators.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            {sortedDomains.map((d, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} 
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="w-full sm:w-[calc(45%-1.5rem)] lg:w-[calc(28%-1.5rem)] max-w-[340px] p-5 rounded-[2rem] bg-neutral-900/40 border border-white/10 hover:border-purple-500/50 transition-all duration-300 group flex flex-col"
              >
                <div className="relative w-full h-36 mb-5 overflow-hidden rounded-2xl">
                  <Image 
                    src={d.image} 
                    alt={d.title} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${d.status === 'Open' ? 'bg-green-600' : 'bg-red-600'}`}>
                    {d.status}
                  </div>
                </div>
                <h3 className="text-base font-bold mb-2 text-[#8c52ff]">{d.title}</h3>
                <p className="text-white text-xs leading-relaxed mb-6 line-clamp-2">
                  {d.desc}
                </p>
                <button 
                  disabled={d.status === 'Closed'}
                  onClick={() => handleApply(d.title)}
                  className={`mt-auto w-full py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${d.status === 'Open' ? 'bg-[#8c52ff] hover:bg-purple-700 text-white' : 'bg-neutral-800 text-gray-500 cursor-not-allowed'}`}
                >
                  {d.status === 'Open' ? 'Apply Now' : 'Closed'}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* BOOTCAMP HIGHLIGHTS SECTION */}
      <section className="py-20 px-6 bg-[#f9fafb]">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#8c52ff] mb-3">Bootcamp Highlights</h2>
            <p className="text-gray-600 text-lg">Our unique approach to long-term technical excellence.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {[
              { t: "Maker Mindset", d: "Builds a strong maker mindset early.", icon: <Lightbulb size={24} /> },
              { t: "STEM Concept", d: "Enhances conceptual understanding in STEM.", icon: <Zap size={24} /> },
              { t: "Structured Path", d: "Structured, progressive learning approach.", icon: <Target size={24} /> },
              { t: "Mentor Guided", d: "Mentor-guided small batch learning.", icon: <Users size={24} /> },
              { t: "Project Ready", d: "Prepares students for competitions and projects.", icon: <Trophy size={24} /> },
              { t: "Consistent Engagement", d: "Designed for consistent engagement.", icon: <Cpu size={24} /> }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} 
                viewport={{ once: true }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mb-5 text-[#8c52ff]">
                  {item.icon}
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-3 leading-tight">{item.t}</h3>
                <p className="text-[11px] text-gray-500 leading-relaxed">{item.d}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-12 bg-black text-white overflow-hidden">
        <div className="text-center mb-10 px-4">
          <h2 className="text-2xl text-[#8c52ff] font-bold uppercase">What People Say</h2>
        </div>

        <div 
          className="relative w-full overflow-hidden" 
          onMouseEnter={() => setPaused(true)} 
          onMouseLeave={() => setPaused(false)}
        >
          <motion.div 
            className="flex" 
            animate={{ x: `-${index * 100}%` }} 
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            {slides.map((group, i) => (
              <div key={i} className="w-full flex-shrink-0 px-4 md:px-5">
                <div className="max-w-6xl mx-auto">
                  <div className="grid md:grid-cols-3 gap-6">
                    {group.map((t, j) => (
                      <div key={j} className="p-6 rounded-2xl bg-gradient-to-br from-[#5921c7]/10 to-black border border-[#8c52ff]/20 shadow-lg max-w-[380px] mx-auto">
                        <p className="text-gray-300 italic text-xs md:text-sm">“{t.text}”</p>
                        <div className="mt-4">
                          <h3 className="font-semibold text-[#8c52ff] text-sm">{t.name}</h3>
                          <p className="text-[10px] text-gray-400">{t.role}</p>
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
            <button 
              key={i} 
              onClick={() => setIndex(i)} 
              className={`h-2 w-2 rounded-full transition ${index === i ? "bg-[#8c52ff]" : "bg-gray-600"}`} 
            />
          ))}
        </div>
      </section>

      {/* FAQ SECTION (Premium Dark Style) */}
      <section className="py-24 px-6 bg-neutral-950 text-white">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}
          className="max-w-4xl mx-auto"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="max-w-xl text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Common <span className="text-[#8c52ff]">Questions</span>
              </h2>
              <p className="text-gray-400">
                Everything you need to know about our internship process and culture. 
              </p>
            </div>
            <div className="hidden md:block">
              <div className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-gray-400">
                FAQ 2026
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <FAQItem 
                key={i}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFaqIndex === i}
                onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA SECTION */}
      <section className="py-12 px-6 bg-[#F4F4F4]">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={sectionVariants}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-2xl font-bold mb-4 text-[#8c52ff]">Ready to Transform Your Career?</h2>
          <button 
            onClick={scrollToDomains}
            className="inline-flex items-center gap-2 bg-[#8c52ff] text-white px-8 py-3 rounded-full font-bold hover:bg-purple-700 transition-all text-sm shadow-lg shadow-purple-500/20"
          >
            <Briefcase size={18} /> View Openings
          </button>
        </motion.div>
      </section>

      <Footer />

      <InternshipApplication 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        selectedDomain={activeDomain} 
      />
    </div>
  );
}