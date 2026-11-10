"use client";

import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Globe,
  Users,
  Briefcase,
  Lightbulb,
  Wrench,
  ShieldCheck,
  Zap,
  Target,
  BookOpen,
  Cpu,
  Cog,
  Rocket,
  CheckCircle2,
  Layers3,
  Award,
  CircuitBoard,
  BrainCircuit,
  Presentation,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Bricolage_Grotesque } from "next/font/google";
import Footer from "@/sections/Footer";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

// ============================================================
// ANIMATIONS
// ============================================================

const titleVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const descVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.15, ease: "easeOut" },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.07,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const fadeIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

// ============================================================
// REUSABLE SECTION HEADING
// ============================================================

function SectionHeading({
  eyebrow,
  title,
  highlight,
  description,
  light = false,
}: {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  light?: boolean;
}) {
  return (
    <div className="mx-auto mb-7 max-w-3xl text-center">
      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={titleVariants}
        className={`mb-4 text-[10px] font-bold uppercase tracking-[0.25em] sm:text-[13px] ${light ? "text-[#5921c7]" : "text-[#a981ff]"}`}
      >
        {eyebrow}
      </motion.p>

      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={titleVariants}
        className={`text-[30px] font-black leading-tight tracking-tight sm:text-[36px] lg:text-[32px] ${
          light ? "text-[#17131f]" : "text-white"
        }`}
      >
        {title}{" "}
        <span className="bg-gradient-to-r from-[#8c52ff] via-[#b18aff] to-[#5921c7] bg-clip-text text-transparent">
          {highlight}
        </span>
      </motion.h2>

      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={descVariants}
        className={`mx-auto mt-2 max-w-2xl text-[14px] leading-8 sm:text-[16px] ${
          light ? "text-gray-900" : "text-gray-400"
        }`}
      >
        {description}
      </motion.p>
    </div>
  );
}

// ============================================================
// PAGE
// ============================================================

export default function TechnicalWorkshopsPage() {
  // ============================================================
  // WORKSHOP DOMAINS
  // ============================================================

  const workshopList = [
    {
      image: "/technical-workshop/cad.jpg",
      title: "3D Design & Modelling",
      desc: "Develops industry-relevant design skills using advanced 3D modelling tools for product development and prototyping.",
      category: "DESIGN & ENGINEERING",
      icon: <Layers3 size={20} />,
    },
    {
      image: "/technical-workshop/3d-printing.jpg",
      title: "3D Printing",
      desc: "Covers additive manufacturing techniques to convert digital designs into functional prototypes.",
      category: "DESIGN & ENGINEERING",
      icon: <Cog size={20} />,
    },
    {
      image: "/technical-workshop/embedded.jpg",
      title: "Embedded Systems",
      desc: "Focuses on microcontroller-based system design, integrating hardware and software for real-world applications.",
      category: "ELECTRONICS & COMPUTING",
      icon: <Cpu size={20} />,
    },
    {
      image: "/technical-workshop/iot.jpg",
      title: "Internet of Things (IoT)",
      desc: "Explores connected systems, enabling data-driven applications through sensors, cloud and communication technologies.",
      category: "ELECTRONICS & COMPUTING",
      icon: <Globe size={20} />,
    },
    {
      image: "/technical-workshop/robotics.jpeg",
      title: "Robotics",
      desc: "Builds expertise in designing and programming robotic systems for automation and intelligent control.",
      category: "EMERGING TECHNOLOGIES",
      icon: <Rocket size={20} />,
    },
    {
      image: "/technical-workshop/drones.jpg",
      title: "Drone Technology",
      desc: "Provides in-depth knowledge of UAV systems, including design, flight control and practical applications.",
      category: "EMERGING TECHNOLOGIES",
      icon: <Zap size={20} />,
    },
    {
      image: "/technical-workshop/pcb.jpg",
      title: "PCB Designing",
      desc: "Teaches schematic design and layout development for creating professional printed circuit boards.",
      category: "ELECTRONICS & COMPUTING",
      icon: <CircuitBoard size={20} />,
    },
    {
      image: "/technical-workshop/ai.jpg",
      title: "Artificial Intelligence",
      desc: "Focuses on machine learning concepts, data analysis and building intelligent, real-world applications.",
      category: "EMERGING TECHNOLOGIES",
      icon: <BrainCircuit size={20} />,
    },
  ];

  // ============================================================
  // WORKSHOP HIGHLIGHTS
  // ============================================================

  const highlights = [
    {
      title: "Industry-relevant Hands-on Training",
      icon: <Wrench size={24} />,
    },
    {
      title: "Expert Trainers & Mentorship",
      icon: <Users size={24} />,
    },
    {
      title: "Structured & Outcome-based Modules",
      icon: <Briefcase size={24} />,
    },
    {
      title: "Certification & Skill Validation",
      icon: <ShieldCheck size={24} />,
    },
    {
      title: "Engaging & Interactive Sessions",
      icon: <Zap size={24} />,
    },
    {
      title: "Latest Tools & Technologies Exposure",
      icon: <Lightbulb size={24} />,
    },
  ];

  // ============================================================
  // LEARNING APPROACH
  // ============================================================

  const learningApproach = [
    {
      number: "01",
      icon: <BookOpen size={25} />,
      title: "Conceptual Foundation",
      description:
        "Build an understanding of the fundamental principles, terminology and concepts behind the selected technology.",
    },
    {
      number: "02",
      icon: <Presentation size={25} />,
      title: "Guided Demonstration",
      description:
        "Explore tools, software, equipment and workflows through demonstrations led by trainers.",
    },
    {
      number: "03",
      icon: <Wrench size={25} />,
      title: "Hands-on Implementation",
      description:
        "Apply the concepts through practical exercises, guided activities and technology-based tasks.",
    },
    {
      number: "04",
      icon: <Rocket size={25} />,
      title: "Project & Application",
      description:
        "Connect the learning experience to practical applications through project-oriented activities.",
    },
  ];

  // ============================================================
  // STUDENT OUTCOMES
  // ============================================================

  const outcomes = [
    {
      icon: <Target size={23} />,
      title: "Practical Technical Skills",
      description:
        "Gain direct exposure to tools, technologies and practical engineering workflows.",
    },
    {
      icon: <BrainCircuit size={23} />,
      title: "Problem-solving Mindset",
      description:
        "Approach technical challenges through logical thinking, experimentation and analysis.",
    },
    {
      icon: <Users size={23} />,
      title: "Collaboration & Teamwork",
      description:
        "Work with peers, exchange ideas and contribute to shared technical activities.",
    },
    {
      icon: <Lightbulb size={23} />,
      title: "Innovation & Creativity",
      description:
        "Explore new ideas and use technology as a medium for creative problem-solving.",
    },
    {
      icon: <Briefcase size={23} />,
      title: "Industry Awareness",
      description:
        "Understand how emerging technologies and engineering tools are applied in professional settings.",
    },
    {
      icon: <Award size={23} />,
      title: "Learning Recognition",
      description:
        "Build evidence of learning through practical activities and applicable certification.",
    },
  ];

  // ============================================================
  // COLLABORATION BENEFITS
  // ============================================================

  const collaborationBenefits = [
    "Workshop topics selected around institutional requirements",
    "Structured sessions designed for college students",
    "Practical activities supported by guided instruction",
    "Exposure to tools and technologies across multiple domains",
    "Flexible discussions around workshop duration and delivery",
    "Coordination with the institution for effective execution",
  ];

  return (
    <div
      className={`${bricolage.className} relative min-h-screen overflow-hidden bg-[#050505] text-white`}
    >
      {/* ====================================================== */}
      {/* 1. HERO SECTION */}
      {/* ====================================================== */}

      <section className="relative z-10 overflow-hidden pb-20 pt-35 md:pb-28 md:pt-35">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-40 -top-32 h-[520px] w-[520px] rounded-full bg-[#5921c7]/20 blur-[150px]" />
          <div className="absolute -left-40 top-[400px] h-[420px] w-[420px] rounded-full bg-[#8c52ff]/10 blur-[150px]" />

          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
              backgroundSize: "55px 55px",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-[1280px] px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* LEFT CONTENT */}

            <div className="flex w-full flex-col items-start">
              <motion.p
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={0}
                className="mb-4 text-[10px] uppercase font-bold tracking-[0.18em] text-[#c4a9ff] text-[13px]"
              >
                Education and Innovation
              </motion.p>

              <motion.h1
                initial="hidden"
                animate="visible"
                variants={titleVariants}
                className="mb-6 text-[36px] font-black leading-[1.1] tracking-tight sm:text-[48px] lg:text-[32px]"
              >
                Industry & Skill Development focused
                <br />
               
                <span className="bg-gradient-to-r from-[#8c52ff] via-[#b18aff] to-[#5921c7] bg-clip-text text-transparent">
                  Technical Workshops
                </span>
              </motion.h1>

              {/* MOBILE IMAGE */}

              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="my-7 w-full lg:hidden"
              >
                <div className="relative aspect-[16/10] w-full">
                  <div className="absolute -inset-4 rounded-[35px] bg-[#8c52ff]/20 blur-2xl" />

                  <div className="relative h-full w-full overflow-hidden rounded-[28px] border border-white/10 bg-[#111111] shadow-2xl">
                    <Image
                      src="/services/technical-workshop2.png"
                      alt="Technical workshop conducted by Adroiit Technovations"
                      fill
                      priority
                      sizes="100vw"
                      className="object-cover"
                    />

                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "85px" }}
                transition={{
                  duration: 0.8,
                  delay: 0.3,
                  ease: "easeOut",
                }}
                className="mb-5 h-0.5 rounded-full bg-gradient-to-r from-[#5921c7] to-[#b18aff]"
              />

              <motion.div
                initial="hidden"
                animate="visible"
                variants={descVariants}
                className="space-y-5"
              >
                <p className="text-justify leading-7 text-white text-[18px]">
                  Adroiit Technovations aims to bridge the gap between academic
                  knowledge and industrial requirements by providing practical
                  exposure to cutting-edge technologies through workshops.
                </p>

                <p className="text-justify leading-7 text-white text-[18px]">
                  Designed specifically for college students, our technical
                  workshops provide opportunities to explore emerging
                  technological domains, develop practical skills and
                  strengthen their understanding through guided,
                  hands-on learning experiences.
                </p>
              </motion.div>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={3}
                className="mt-8 flex flex-wrap items-center gap-4"
              >
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#5921c7] to-[#8c52ff] px-8 py-4 text-[14px] font-bold text-white shadow-[0_8px_35px_rgba(140,82,255,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(140,82,255,0.4)]"
                >
                  Host a Workshop
                  <ArrowRight
                    size={19}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

              </motion.div>
            </div>

            {/* DESKTOP IMAGE */}

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="relative hidden w-full lg:block"
            >
              <div className="relative mx-auto aspect-[16/10] w-full max-w-[650px]">
                <div className="absolute -inset-5 rounded-[40px] bg-gradient-to-br from-[#5921c7]/30 to-[#8c52ff]/5 blur-2xl" />

                <div className="relative h-full w-full overflow-hidden rounded-[32px] border border-white/10 bg-[#111111] shadow-[0_25px_80px_rgba(0,0,0,0.5)]">
                  <Image
                    src="/services/technical-workshop2.png"
                    alt="Technical workshop conducted by Adroiit Technovations"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />

                </div>

              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* 3. WORKSHOP DOMAINS */}
      {/* ====================================================== */}

      <section
        id="workshops"
        className="relative z-10 overflow-hidden bg-white py-10 text-[#17131f] md:py-10"
      >
        <div className="pointer-events-none absolute -left-40 top-20 h-[450px] w-[450px] rounded-full bg-[#8c52ff]/10 blur-[150px]" />

        <div className="relative mx-auto max-w-[1300px] px-6">
          <SectionHeading
            eyebrow="EXPLORE OUR TECHNICAL TRACKS"
            title="Explore Our"
            highlight="Workshop Domains"
            description="Specialized technical tracks designed to introduce students to modern engineering tools, emerging technologies and practical applications."
            light
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
            {workshopList.map((workshop, i) => (
              <motion.div
                key={workshop.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                variants={fadeUp}
                viewport={{ once: true, amount: 0.15 }}
                whileHover={{ y: -7 }}
                className="group relative flex flex-col overflow-hidden rounded-[26px] border border-gray-200 bg-[#faf9fc] p-3 transition-all duration-300 hover:border-[#8c52ff]/50 hover:bg-white hover:shadow-[0_15px_40px_rgba(89,33,199,0.12)]"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[19px] bg-[#1a1a1a]">
                  <Image
                    src={workshop.image}
                    alt={workshop.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                <div className="flex flex-1 flex-col px-3 pb-4 pt-5">
                  <div className="mb-3 flex items-center gap-2 text-[#5921c7]">
                    {workshop.icon}
                    <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#5921c7]">
                      {workshop.category}
                    </span>
                  </div>

                  <h3 className="mb-3 text-[16px] font-bold leading-snug text-[#21182d] transition-colors group-hover:text-[#5921c7]">
                    {workshop.title}
                  </h3>

                  <p className="text-[12px] leading-7 text-gray-600">
                    {workshop.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* 4. LEARNING APPROACH */}
      {/* ====================================================== */}

      <section className="relative z-10 overflow-hidden bg-[#050505] py-10 text-white md:py-10">
        <div className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-[#8c52ff]/10 blur-[130px]" />

        <div className="relative mx-auto max-w-[1300px] px-6">
          <SectionHeading
            eyebrow="HOW WE APPROACH LEARNING"
            title="From Concepts to"
            highlight="Practical Application"
            description="Our workshop approach connects technical understanding with guided demonstrations and practical activities, helping students engage with the subject beyond theory."
          />

          <div className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="absolute left-[12%] right-[12%] top-9 hidden h-px bg-gradient-to-r from-[#5921c7]/10 via-[#8c52ff]/50 to-[#5921c7]/10 lg:block" />

            {learningApproach.map((step, i) => (
              <motion.div
                key={step.number}
                custom={i}
                initial="hidden"
                whileInView="visible"
                variants={fadeUp}
                viewport={{ once: true, amount: 0.2 }}
                className="relative rounded-[28px] border border-white/[0.07] bg-[#111111] p-7 shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-2 hover:border-[#8c52ff]/40 hover:bg-[#15121c] hover:shadow-[0_20px_55px_rgba(89,33,199,0.10)]"
              >
                <div className="relative z-10 mb-7 flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#8c52ff]/20 bg-[#5921c7]/15 text-[#b18aff]">
                    {step.icon}
                  </div>

                  <span className="text-[30px] font-black text-white/15">
                    {step.number}
                  </span>
                </div>

                <h3 className="mb-3 text-[18px] font-black text-[#d1bcff]">
                  {step.title}
                </h3>

                <p className="text-[14px] leading-7 text-gray-200">
                  {step.description}
                </p>

                <div className="mt-6 h-1 w-9 rounded-full bg-gradient-to-r from-[#5921c7] to-[#8c52ff]" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* 5. STUDENT OUTCOMES */}
      {/* ====================================================== */}

      <section className="relative z-10 overflow-hidden bg-white py-10 text-[#17131f] md:py-10">
        <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-[#5921c7]/15 blur-[140px]" />

        <div className="relative mx-auto max-w-[1300px] px-6">
          <SectionHeading
            eyebrow="THE VALUE OF PRACTICAL LEARNING"
            title="Skills Students Can"
            highlight="Build"
            description="Technical workshops provide opportunities to develop capabilities that support academic learning, technical exploration and professional growth."
            light
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {outcomes.map((item, i) => (
              <motion.div
                key={item.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                variants={fadeUp}
                viewport={{ once: true, amount: 0.2 }}
                className="group flex gap-5 rounded-[26px] border border-gray-200 bg-[#faf9fc] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#8c52ff]/40 hover:bg-white"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#8c52ff]/20 bg-[#5921c7]/[0.07] text-[#5921c7] transition-all group-hover:bg-[#5921c7] group-hover:text-white">
                  {item.icon}
                </div>

                <div>
                  <h3 className="mb-2 text-[16px] font-bold text-[#21182d] transition-colors group-hover:text-[#5921c7]">
                    {item.title}
                  </h3>

                  <p className="text-[12px] leading-7 text-gray-600 sm:text-[13px]">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* 7. INSTITUTIONAL COLLABORATION */}
      {/* ====================================================== */}

      <section className="relative z-10 overflow-hidden bg-[#050505] py-10 md:py-10">
        <div className="pointer-events-none absolute -right-40 top-0 h-[450px] w-[450px] rounded-full bg-[#5921c7]/15 blur-[150px]" />

        <div className="relative mx-auto max-w-[1300px] px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <motion.p
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={titleVariants}
                className="mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[#a981ff] sm:text-[13px]"
              >
                FOR COLLEGES & INSTITUTIONS
              </motion.p>

              <motion.h2
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={titleVariants}
                className="text-[30px] font-black leading-tight tracking-tight text-white sm:text-[36px] lg:text-[32px]"
              >
                Bring Practical
                <br />
                Technology Learning to{" "}
                <span className="bg-gradient-to-r from-[#8c52ff] to-[#b18aff] bg-clip-text text-transparent">
                  Your Campus
                </span>
              </motion.h2>

              <motion.p
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={descVariants}
                className="mt-6 text-[14px] leading-8 text-gray-200 sm:text-[16px]"
              >
                Every institution has different learning priorities, student
                groups and technical requirements. Adroiit Technovations works
                with colleges to discuss suitable workshop topics and plan
                practical learning experiences around their requirements.
              </motion.p>

              <div className="mt-8 space-y-4">
                {collaborationBenefits.map((benefit, i) => (
                  <motion.div
                    key={benefit}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    variants={fadeUp}
                    viewport={{ once: true }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2
                      size={19}
                      className="mt-1 shrink-0 text-[#a981ff]"
                    />
                    <p className="text-[14px] leading-7 text-gray-300">
                      {benefit}
                    </p>
                  </motion.div>
                ))}
              </div>

              <Link
                href="/contact"
                className="group mt-9 inline-flex items-center gap-3 rounded-full border border-[#8c52ff]/40 px-7 py-4 text-[14px] font-bold text-white transition-all hover:bg-[#5921c7]/20"
              >
                Discuss Your Requirements
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="relative"
            >
              <div className="absolute -inset-5 rounded-[35px] bg-gradient-to-br from-[#5921c7]/25 to-[#8c52ff]/5 blur-2xl" />

              <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#111111] p-7 sm:p-9">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#a981ff]">
                      REASON TO CHOOSE US
                    </p>

                    <h3 className="mt-2 text-[18px] font-black text-white">
                      Why Collaborate with Us?
                    </h3>
                  </div>
                </div>

                <div className="space-y-3">
                  {highlights.map((item, i) => (
                    <motion.div
                      key={item.title}
                      custom={i}
                      initial="hidden"
                      whileInView="visible"
                      variants={fadeUp}
                      viewport={{ once: true }}
                      className="flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 transition-all hover:border-[#8c52ff]/30 hover:bg-[#8c52ff]/[0.06]"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#5921c7]/20 text-[#b18aff]">
                        {item.icon}
                      </div>

                      <div>
                        <h4 className="text-[14px] font-bold text-white">
                          {item.title}
                        </h4>
                      </div>

                      <CheckCircle2
                        size={17}
                        className="ml-auto shrink-0 text-[#8c52ff]"
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* 8. FINAL CTA - LIGHT THEME, PLAIN SECTION */}
      {/* ====================================================== */}

      <section className="relative z-10 overflow-hidden bg-[#f7f6fa] px-6 py-20 text-[#17131f] md:py-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeUp}
          viewport={{ once: true }}
          className="relative mx-auto max-w-[1300px] text-center"
        >
          <div className="mx-auto max-w-3xl">
            <p className="mb-4 text-[13px] font-bold uppercase tracking-[0.25em] text-[#5921c7]">
              LET'S BUILD TECHNICAL EXCELLENCE
            </p>

            <h2 className="mb-2 text-[30px] font-black leading-tight tracking-tight text-[#17131f] sm:text-[36px] md:text-[32px]">
              Empower Your Students with
              <br></br>
              <span className="bg-gradient-to-r from-[#8c52ff] to-[#5921c7] bg-clip-text text-transparent">
                Future-ready Technical Skills
              </span>
            </h2>

            <p className="mx-auto mb-4 max-w-3xl text-[14px] leading-8 text-gray-900 sm:text-[16px]">
              Partner with Adroiit Technovations to bring engaging,
              industry-focused technical workshops to your institution.
              Let's create meaningful learning experiences for your students.
            </p>

            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#5921c7] to-[#8c52ff] px-9 py-4 text-[14px] font-bold text-white shadow-[0_8px_35px_rgba(140,82,255,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_45px_rgba(140,82,255,0.45)] sm:text-[16px]"
            >
              Host a Workshop
              <ArrowRight
                size={19}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ====================================================== */}
      {/* FOOTER */}
      {/* ====================================================== */}

      <Footer />
    </div>
  );
}