
"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/sections/Footer";
import { Bricolage_Grotesque } from "next/font/google";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Target,
  Rocket,
  Accessibility,
  Handshake,
  Award,
  Zap,
  Lightbulb,
  GraduationCap,
  Cpu,
  Wrench,
  FlaskConical,
  MoveUpRight,
} from "lucide-react";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
});

const coreValues = [
  {
    number: "01",
    title: "Practical Education",
    description:
      "We believe true learning happens through action. Our learners explore, experiment, build and innovate real solutions — not just study concepts.",
    icon: Zap,
  },
  {
    number: "02",
    title: "Excellence Built on Quality",
    description:
      "Quality is the foundation of everything we create and deliver. Every experience, solution and product is held to the highest standards.",
    icon: Award,
  },
  {
    number: "03",
    title: "Advancement Driven by Innovation",
    description:
      "We constantly evolve by embracing new technologies and creative thinking, empowering learners to stay ahead in a rapidly changing world.",
    icon: Lightbulb,
  },
  {
    number: "04",
    title: "Reach Empowered by Inclusivity",
    description:
      "We believe transformative education and innovation should be accessible to all, expanding opportunities and amplifying impact.",
    icon: Accessibility,
  },
  {
    number: "05",
    title: "Learning Fueled by Collaboration",
    description:
      "We believe the best ideas emerge when dynamic minds work together through teamwork, shared knowledge and open communication.",
    icon: Handshake,
  },
];

const pillars = [
  {
    number: "01",
    title: "Education",
    subtitle: "Learn by doing.",
    description:
      "Making technology education meaningful through hands-on STEM learning, experimentation and real-world projects.",
    icon: GraduationCap,
  },
  {
    number: "02",
    title: "Technology",
    subtitle: "Build with purpose.",
    description:
      "Transforming ideas into practical solutions through engineering, product development and emerging technologies.",
    icon: Wrench,
  },
  {
    number: "03",
    title: "Research & Innovation",
    subtitle: "Explore what is possible.",
    description:
      "Encouraging curiosity, experimentation and continuous innovation to solve challenges and create new possibilities.",
    icon: FlaskConical,
  },
];

const domains = [
  {
    number: "01",
    title: "Embedded Systems",
    description:
      "Designing intelligent electronic systems by integrating microcontrollers, hardware and software to bring products and devices to life.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=85",
    category: "Electronics & Engineering",
  },
  {
    number: "02",
    title: "Internet of Things",
    description:
      "Connecting devices, sensors and systems to enable smart monitoring, automation, data exchange and connected experiences.",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=85",
    category: "Connected Technologies",
  },
  {
    number: "03",
    title: "PLC & Industrial Automation",
    description:
      "Exploring programmable logic controllers, industrial control systems and automation concepts for modern manufacturing.",
    image: "https://images.unsplash.com/photo-1567789884554-0b844b597180?auto=format&fit=crop&w=900&q=85",
    category: "Industrial Technologies",
  },
  {
    number: "04",
    title: "Drone Technology",
    description:
      "Working with unmanned aerial systems, flight fundamentals, electronics and practical applications of drone technology.",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=900&q=85",
    category: "Aerial Technologies",
  },
  {
    number: "05",
    title: "3D Printing",
    description:
      "Turning digital designs into physical objects through 3D modelling, prototyping and additive manufacturing.",
    image: "https://images.unsplash.com/photo-1631558556549-6f3a9e5d7f4a?auto=format&fit=crop&w=900&q=85",
    category: "Digital Manufacturing",
  },
  {
    number: "06",
    title: "Artificial Intelligence",
    description:
      "Exploring intelligent systems, machine learning concepts and AI-driven applications that enable smarter solutions.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=85",
    category: "Intelligent Technologies",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" as const },
  },
};

export default function About() {
  return (
    <div
      className={`${bricolage.className} min-h-screen overflow-hidden bg-[#080611] text-white`}
    >
      <Navbar />

      <main>
        {/* ==================================================
            SECTION 01 — DARK HERO
        ================================================== */}
        <section className="relative overflow-hidden border-b border-white/[0.08] bg-[#080611] px-5 pb-24 pt-35 sm:px-8 sm:pb-28 sm:pt-32 lg:px-16">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-40 top-0 h-[600px] w-[600px] rounded-full bg-[#5921c7]/25 blur-[150px]" />
            <div className="absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full bg-[#30106f]/30 blur-[130px]" />

            <div
              className="absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                backgroundSize: "70px 70px",
              }}
            />
          </div>

          <div className="relative mx-auto flex w-full max-w-[1100px] flex-col items-center text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.14 } },
              }}
              className="relative z-10 flex w-full flex-col items-center"
            >
              <motion.div variants={fadeUp}>
                <div className="mb-5 flex items-center justify-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#b99aff]">
                    About Adroiit Technovations
                  </span>
                </div>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="max-w-[950px] text-[28px] font-extrabold leading-[0.98] tracking-[-0.075em] sm:text-[68px] lg:text-[50px]"
              >
                We ignite  {""}
                <span className="bg-gradient-to-r from-[#b18aff] via-[#8c52ff] to-[#5921c7] bg-clip-text text-transparent">
                  curiosity {" "} 
                </span>
                in young minds.
              </motion.h1>
              
              <motion.h1
                variants={fadeUp}
                className="max-w-[950px] text-[28px] font-extrabold leading-[0.98] tracking-[-0.075em] sm:text-[68px] lg:text-[50px]"
              >
                We bring {""}
                <span className="bg-gradient-to-r from-[#b18aff] via-[#8c52ff] to-[#5921c7] bg-clip-text text-transparent">
                 technology {" "}
                </span>
                to life.
              </motion.h1>


              <motion.p
                variants={fadeUp}
                className="mt-5 max-w-[1100px] text-[15px] leading-8 text-gray-200 sm:text-lg sm:leading-9"
              >
                Founded in 2024 by a group of Mechatronics Engineers driven by a shared
                passion for education, technology and innovation. Adroiit Technovations is a 
                STEAM Education and Product Development firm based in Puducherry, India. 
                <br></br>Adroiit Technovations 
                is also an incubatee at Atal Incubation Center - PEC Foundation (AIC-PECF).
               <br></br>
                  Our expertize across various domains helps us
                  to blend education and innovation together
                  to inspire possibilities, engineer solutions and shape the future.
               
                
                  Over the span of two years, we have empowered 700+ students across
                  diverse educational levels and undertaken multiple industrial projects
                  for established companies and emerging startups.
              
                
                <p> ----------------- </p>
                <p>We don't just teach technology. We create it.</p>
                
                
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="mt-9 flex flex-wrap items-center justify-center gap-5"
              >
                <Link
                  href="#our-story"
                  className="group inline-flex items-center gap-3 rounded-full bg-[#5921c7] px-7 py-4 text-sm font-bold transition-all duration-300 hover:bg-[#713be0] hover:shadow-[0_0_35px_rgba(140,82,255,0.3)]"
                >
                  Discover our story
                  <ArrowRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition-colors hover:text-white"
                >
                  Get in touch
                  <ArrowUpRight
                    size={17}
                    className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                  />
                </Link>
              </motion.div>
            </motion.div>


          </div>
        </section>

        {/* ==================================================
            SECTION 02 — LIGHT INTRODUCTION
        ================================================== */}
        <section className="relative bg-[#f5f3fa] px-5 py-24 text-[#171024] sm:px-8 lg:px-16 lg:py-10">
          <div className="mx-auto max-w-[1300px]">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              className="grid gap-12 md:grid-cols-[0.7fr_1.3fr] md:items-center"
            >
              <div>
                <div className="flex items-center gap-3">
                  <p className="text-[13px] font-bold uppercase tracking-[0.3em] text-[#713be0]">
                    Who we are
                  </p>
                </div>

                <h2 className="mt-4 text-5xl font-extrabold leading-[1.02] tracking-[-0.065em] sm:text-4xl">
                  We always thrive to be the 
                  <br />
                  <span className="text-[#713be0]">extraordinary.</span>
                </h2>
              </div>

              <div className="border-l-2 border-[#8c52ff]/30 pl-7 sm:pl-12">
                <p className="text-xl leading-relaxed text-gray-900 sm:text-[18px] sm:leading-relaxed">
                  At Adroiit Technovations, we believe education should be experiential. 
                  We combine hands-on, technology-driven learning with engineering, product development
                  and research to nurture curiosity, empower young minds
                  and transform ideas into innovative solutions. 
                  Driven by a passion for exploration and creation, we strive to shape a smarter, better tomorrow.{" "}
                  <span className="font-bold text-[#5921c7]">
                    
                  </span>
                </p>
                
              </div>
            </motion.div>

            {/* THREE PILLARS — WITHIN THE WHO WE ARE SECTION */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.12,
                    delayChildren: 0.1,
                  },
                },
              }}
              className="relative mt-16 grid w-full grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5 lg:mt-8"
            >
              <div className="pointer-events-none absolute -inset-8 rounded-[2rem] bg-gradient-to-r from-[#8c52ff]/10 via-transparent to-[#5921c7]/10 blur-3xl" />

              {pillars.map((pillar) => {
                const Icon = pillar.icon;

                return (
                  <motion.div
                    key={pillar.number}
                    variants={{
                      hidden: { opacity: 0, y: 22 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.6, ease: "easeOut" },
                      },
                    }}
                    whileHover={{ y: -5 }}
                    className="group relative flex min-h-[205px] flex-col items-center rounded-[1.4rem] border border-[#5921c7]/10 bg-white px-5 py-6 text-center shadow-[0_12px_35px_rgba(48,16,111,0.06)] transition-all duration-300 hover:border-[#8c52ff]/50 hover:bg-white sm:min-h-[220px] sm:px-5 sm:py-7"
                  >
                    <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#8c52ff]/[0.07] blur-2xl transition-all duration-500 group-hover:bg-[#8c52ff]/20" />

                    <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-[#5921c7]/10 text-[#713be0] transition-colors duration-300 group-hover:bg-[#5921c7] group-hover:text-white">
                      <Icon size={22} strokeWidth={1.7} />
                    </div>

                    <p className="relative mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#713be0]">
                      {pillar.subtitle}
                    </p>

                    <h3 className="relative mt-1 text-lg font-bold tracking-tight text-[#171024] sm:text-xl">
                      {pillar.title}
                    </h3>

                    <p className="relative mt-2 max-w-[300px] text-xs leading-5 text-[#171024]/60 sm:text-[13px]">
                      {pillar.description}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ==================================================
            SECTION 03 — DARK STORY
        ================================================== */}
        <section
          id="our-story"
          className="relative scroll-mt-24 overflow-hidden bg-[#0b0813] px-5 py-28 sm:px-8 lg:px-16 lg:py-10"
        >
          <div className="pointer-events-none absolute right-0 top-20 h-96 w-96 rounded-full bg-[#5921c7]/15 blur-[140px]" />

          <div className="relative mx-auto max-w-[1300px]">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              className="mb-1"
            >
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#a77bff]">
                Our journey - The Adroiit Journey
              </p>

              <h2 className="mt-5 max-w-[700px] text-5xl font-extrabold leading-[1.05] tracking-[-0.06em] sm:text-6xl lg:text-4xl">
                A struggle that grew into a{" "}
                <span className="text-[#8c52ff]">purpose.</span>
              </h2>
            </motion.div>

            <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-20">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.75 }}
                className="space-y-12"
              >
                <p className="text-[17px] leading-9 text-gray-200">
                  Adroiit Technovations was born from a simple yet powerful
                  belief: the future belongs to those who dare to learn,
                  experiment and create.
                </p>

                <p className="text-[17px] leading-9 text-gray-200">
                  In a world where technology continues to transform the way
                  we live and work, we recognised the need to bridge the gap
                  between theoretical knowledge and practical application.
                  We envisioned an ecosystem where learners could move beyond
                  textbooks, engage with emerging technologies and develop the
                  confidence to turn ideas into reality.
                </p>

                <p className="text-[17px] leading-9 text-gray-200">
                  Today, that vision drives our commitment to education,
                  technology and innovation. Through hands-on experiences,
                  engineering initiatives and a culture of continuous
                  exploration, we strive to create opportunities that inspire
                  people to think differently and build boldly.
                </p>

                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-3 pt-3 text-[16px] font-bold text-[#b99aff] transition-colors hover:text-white"
                >
                  Be a part of our journey
                  <MoveUpRight
                    size={17}
                    className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                  />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.75 }}
                className="relative"
              >
                <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-[#5921c7]/30 to-transparent blur-xl" />

                <div className="relative aspect-[5/5.5] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#171024]">
                  <Image
                    src="/about-hero.jpg"
                    alt="Adroiit education and innovation"
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ==================================================
            SECTION 04 — LIGHT MISSION & VISION
        ================================================== */}
        <section className="relative overflow-hidden bg-[#f5f3fa] px-5 py-28 text-[#171024] sm:px-8 lg:px-16 lg:py-10">
          <div className="pointer-events-none absolute -left-40 top-1/4 h-[400px] w-[400px] rounded-full bg-[#8c52ff]/10 blur-[130px]" />

          <div className="relative mx-auto max-w-[1050px]">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              className="mb-8 text-center"
            >
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#713be0]">
                Our direction
              </p>

              <h2 className="mt-5 text-5xl font-extrabold tracking-[-0.06em] sm:text-4xl">
                Purpose meets
                <span className="text-[#713be0]"> possibility.</span>
              </h2>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7 }}
                className="group relative overflow-hidden rounded-[1.75rem] border border-[#171024]/10 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl sm:p-12"
              >
                <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#8c52ff]/[0.08] blur-[70px]" />

                <div className="relative">
                  <div className="flex items-center gap-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#5921c7]/10 text-[#5921c7]">
                      <Target size={27} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#713be0]">
                        Our mission
                      </p>
                      <h3 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight">
                        Empowering minds. Enabling creation.
                      </h3>
                    </div>
                  </div>

                  <p className="mt-8 max-w-[480px] text-[16px] leading-8 text-gray-900">
                    To empower individuals through practical education,
                    technological innovation and meaningful experiences,
                    enabling them to develop the knowledge, skills and
                    confidence to create impactful solutions for the future.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="group relative overflow-hidden rounded-[1.75rem] border border-[#171024]/10 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl sm:p-12"
              >
                <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#5921c7]/[0.08] blur-[70px]" />

                <div className="relative">
                  <div className="flex items-center gap-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#5921c7]/10 text-[#5921c7]">
                      <Rocket size={27} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#713be0]">
                        Our vision
                      </p>
                      <h3 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight">
                        Inspire today. Shape tomorrow.
                      </h3>
                    </div>
                  </div>

                  <p className="mt-8 max-w-[480px] text-[16px] leading-8 text-gray-900">
                    To build a future where education and innovation
                    complement each other, creating an empowered generation
                    of thinkers, creators and problem-solvers who contribute
                    meaningfully to society.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ==================================================
            SECTION 05 — DARK CORE VALUES
        ================================================== */}
        <section className="bg-[#0d0918] px-5 py-28 sm:px-8 lg:px-16 lg:py-10">
          <div className="mx-auto max-w-[1300px]">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              className="mb-8"
            >
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#a77bff]">
                What defines us
              </p>

              <div className="mt-5 grid gap-6 md:grid-cols-2 md:items-end">
                <h2 className="text-5xl font-extrabold leading-[1.05] tracking-[-0.06em] sm:text-4xl">
                  Values that
                  <br />
                  <span className="text-[#8c52ff]">move us forward.</span>
                </h2>

                <p className="max-w-[430px] text-[16px] leading-8 text-gray-200 md:justify-self-end">
                  Our values are more than principles. They shape how we
                  think, how we work and how we create meaningful experiences.
                </p>
              </div>
            </motion.div>

            <div className="grid gap-4 md:grid-cols-6">
              {coreValues.map((value, index) => {
                const Icon = value.icon;

                return (
                  <motion.div
                    key={value.number}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.55, delay: index * 0.08 }}
                    className={`group relative flex min-h-[285px] flex-col overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-white/[0.025] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-[#8c52ff]/40 hover:bg-[#5921c7]/[0.08] sm:p-7 ${
                      index < 3
                        ? "md:col-span-2"
                        : index === 3
                          ? "md:col-span-2 md:col-start-2"
                          : "md:col-span-2 md:col-start-4"
                    }`}
                  >
                    <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#8c52ff]/[0.04] blur-2xl transition-all duration-500 group-hover:bg-[#8c52ff]/15" />

                    <div className="relative flex items-center justify-end">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#5921c7]/20 text-[#b99aff] transition-all duration-300 group-hover:bg-[#5921c7] group-hover:text-white">
                        <Icon size={22} strokeWidth={1.7} />
                      </div>
                    </div>

                    <div className="relative mt-6">
                      <h3 className="max-w-[320px] text-xl font-bold leading-snug tracking-tight">
                        {value.title}
                      </h3>

                      <p className="mt-3 max-w-[450px] text-sm leading-6 text-white/45">
                        {value.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==================================================
            SECTION 06 — LIGHT PILLARS
        ================================================== */}
        <section className="bg-[#f5f3fa] px-5 py-28 text-[#171024] sm:px-8 lg:px-16 lg:py-10">
          <div className="mx-auto max-w-[1300px]">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              className="mb-8 flex flex-col justify-between gap-7 md:flex-row md:items-end"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#713be0]">
                  Our ecosystem
                </p>

                <h2 className="mt-5 text-5xl font-extrabold leading-[1.05] tracking-[-0.06em] sm:text-4xl">
                  Three pillars. {" "}
                  
                  <span className="text-[#713be0]">One purpose.</span>
                </h2>
              </div>

              
            </motion.div>

            <div className="grid gap-5 md:grid-cols-3">
              {pillars.map((pillar, index) => {
                const Icon = pillar.icon;

                return (
                  <motion.div
                    key={pillar.number}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, delay: index * 0.12 }}
                    className="group relative flex min-h-[320px] flex-col overflow-hidden rounded-[1.5rem] border border-[#171024]/10 bg-white p-7 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_rgba(48,16,111,0.12)] sm:p-8"
                  >
                    <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#8c52ff]/[0.06] transition-transform duration-500 group-hover:scale-150" />

                    <div className="relative flex items-center justify-between">
                      <span className="text-sm font-bold tracking-widest text-[#713be0]">
                        {pillar.number}
                      </span>

                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5921c7]/10 text-[#5921c7] transition-all duration-300 group-hover:bg-[#5921c7] group-hover:text-white">
                        <Icon size={25} strokeWidth={1.7} />
                      </div>
                    </div>

                    <div className="relative mt-auto pt-2">
                      <h3 className="text-2xl font-extrabold tracking-tight text-[20px]">
                        {pillar.title}
                      </h3>

                      <p className="mt-2 text-sm font-bold text-[#713be0]">
                        {pillar.subtitle}
                      </p>

                      <p className="mt-2 text-[14px] leading-7 text-gray-900">
                        {pillar.description}
                      </p>
                    </div>

                    <div className="absolute bottom-8 right-8 text-[#5921c7]/30 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[#5921c7]">
                      <ArrowUpRight size={22} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==================================================
            SECTION 07 — DARK TECHNOLOGY DOMAINS
        ================================================== */}
        <section
          id="technology-domains"
          className="relative overflow-hidden bg-[#080611] px-5 py-28 sm:px-8 lg:px-16 lg:py-10"
        >
          <div className="pointer-events-none absolute -left-40 top-20 h-[450px] w-[450px] rounded-full bg-[#5921c7]/20 blur-[150px]" />
          <div className="pointer-events-none absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full bg-[#30106f]/25 blur-[150px]" />

          <div className="relative mx-auto max-w-[1300px]">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              className="mb-8 grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-end"
            >
              <div>
                <div className="flex items-center gap-3">
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#b99aff]">
                    Our expertise
                  </p>
                </div>

                <h2 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-[-0.06em] sm:text-6xl lg:text-4xl">
                  Exploring the {" "}
                  
                  <span className="text-[#8c52ff]">technologies {" "}</span>
                 
                  shaping tomorrow.
                </h2>
              </div>

              
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {domains.map((domain, index) => {
                return (
                  <motion.div
                    key={domain.number}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{
                      duration: 0.55,
                      delay: (index % 3) * 0.1,
                    }}
                    className="group relative flex min-h-[390px] flex-col overflow-hidden rounded-[1.5rem] border border-white/[0.09] bg-white/[0.035] p-5 transition-all duration-500 hover:-translate-y-1 hover:border-[#8c52ff]/50 hover:bg-[#5921c7]/[0.10] sm:p-6"
                  >
                    <div className="relative mb-6 h-44 w-full overflow-hidden rounded-[1.1rem] border border-white/10 bg-[#171024]">
                      <div
                        className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: `url("${domain.image}")` }}
                        role="img"
                        aria-label={`${domain.title} technology`}
                      />
                    </div>

                    <div className="relative mt-auto">
                      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#a77bff]/80">
                        {domain.category}
                      </p>

                      <h3 className="text-xl font-bold leading-snug tracking-tight text-white sm:text-2xl">
                        {domain.title}
                      </h3>

                      <p className="mt-4 text-sm leading-7 text-white/50">
                        {domain.description}
                      </p>
                    </div>

                    <div className="absolute right-7 top-7 text-white/20 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#b99aff]">
                      <ArrowUpRight size={19} />
                    </div>
                  </motion.div>
                );
              })}
            </div>


          </div>
        </section>

        {/* ==================================================
            SECTION 08 — LIGHT CLOSING CTA
        ================================================== */}
        <section className="relative overflow-hidden bg-[#f5f3fa] px-5 py-24 text-[#171024] sm:px-8 lg:px-16 lg:py-10">
          <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#8c52ff]/10 blur-[130px]" />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="relative mx-auto max-w-[1300px] text-center"
          >
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#713be0]">
              Partner with Us
            </p>

            <h2 className="mx-auto mt-4 max-w-[950px] text-5xl font-extrabold leading-[1.02] tracking-[-0.065em] sm:text-6xl lg:text-4xl">
              Let's collaborate and 
              <span className="text-[#713be0]"> build the future!</span>
            </h2>

            <p className="mx-auto mt-3 max-w-[550px] text-[16px] leading-8 text-[#171024]/60 sm:text-lg">
              Whether you are a learner, educator, institution or innovator,
              we would love to explore what we can create together.
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 rounded-full bg-[#5921c7] px-8 py-4 text-sm font-extrabold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#713be0] hover:shadow-[0_15px_35px_rgba(89,33,199,0.25)]"
              >
                Let&apos;s connect
                <ArrowUpRight
                  size={18}
                  className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      {/* ==================================================
          FOOTER
      ================================================== */}
      <div className="w-full bg-white">
        <Footer />
      </div>
    </div>
  );
}
