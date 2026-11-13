
"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/sections/Footer";
import { Bricolage_Grotesque } from "next/font/google";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Target,
  Rocket,
  Accessibility,
  Handshake,
  Award,
  Zap,
  Lightbulb,
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

const domains = [
  {
    number: "01",
    title: "Embedded Systems",
    description:
      "Designing intelligent electronic systems by integrating microcontrollers, hardware and software to bring products and devices to life.",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=85",
    category: "Electronics & Engineering",
  },
  {
    number: "02",
    title: "Internet of Things",
    description:
      "Connecting devices, sensors and systems to enable smart monitoring, automation, data exchange and connected experiences.",
    image: "/domains/iot.jpg",
    category: "Connected Technologies",
  },
  {
    number: "03",
    title: "PLC & Industrial Automation",
    description:
      "Exploring programmable logic controllers, industrial control systems and automation concepts for modern manufacturing.",
    image:
      "https://images.unsplash.com/photo-1567789884554-0b844b597180?auto=format&fit=crop&w=900&q=85",
    category: "Industrial Technologies",
  },
  {
    number: "04",
    title: "Drone Technology",
    description:
      "Working with unmanned aerial systems, flight fundamentals, electronics and practical applications of drone technology.",
    image:
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=900&q=85",
    category: "Aerial Technologies",
  },
  {
    number: "05",
    title: "3D Printing",
    description:
      "Turning digital designs into physical objects through 3D modelling, prototyping and additive manufacturing.",
    image: "/3d-printing/3d-printing-hero.jpg",
    category: "Digital Manufacturing",
  },
  {
    number: "06",
    title: "Artificial Intelligence",
    description:
      "Exploring intelligent systems, machine learning concepts and AI-driven applications that enable smarter solutions.",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=85",
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
      className={`${bricolage.className} min-h-screen overflow-hidden bg-[#f5f3fa] text-[#171024]`}
    >
      <Navbar />

      <main>
        {/* ==================================================
            SECTION 01 — LIGHT HERO
        ================================================== */}
        <section className="relative overflow-hidden border-b border-[#171024]/[0.08] bg-[#f5f3fa] px-5 pb-24 pt-35 sm:px-8 sm:pb-21 sm:pt-38 lg:px-16">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-40 top-0 h-[600px] w-[600px] rounded-full bg-[#5921c7]/25 blur-[150px]" />
            <div className="absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full bg-[#30106f]/30 blur-[130px]" />

            <div
              className="absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(48,16,111,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(48,16,111,0.5) 1px, transparent 1px)",
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
                  <span className="text-[13px] font-bold uppercase tracking-[0.3em] text-gray-700">
                    About Adroiit Technovations
                  </span>
                </div>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="mb-3 max-w-[950px] text-[28px] font-extrabold text-[#30106f] leading-[0.98] tracking-[-0.075em] sm:text-[68px] lg:text-[35px]"
              >
                We ignite{" "}
                <span className="bg-gradient-to-r from-[#5921c7] to-[#8c52ff] bg-clip-text text-transparent">
                  curiosity
                </span>{" "}
                in young minds.
              </motion.h1>

              <motion.h2
                variants={fadeUp}
                className="max-w-[950px] text-[28px] font-extrabold text-[#30106f] leading-[0.98] tracking-[-0.075em] sm:text-[68px] lg:text-[35px]"
              >
                We bring{" "}
                <span className="bg-gradient-to-r from-[#5921c7] to-[#8c52ff] bg-clip-text text-transparent">
                  technology
                </span>{" "}
                to life.
              </motion.h2>

              <motion.div
                variants={fadeUp}
                className="mt-5 max-w-[1000px] space-y-4 text-[15px] leading-8 text-gray-900 text-[18px] sm:leading-9"
              >
                <p>
                  Founded in 2024 by a team of Mechatronics Engineers driven by
                  a shared passion for education, technology and innovation,
                  Adroiit Technovations is a STEAM Education and Product
                  Development firm based in Puducherry, India.
                  <br></br>
                  Adroiit Technovations is also an incubatee at Atal
                  Incubation Center - PEC Foundation (AIC-PECF).
                  <br></br>
                  Our expertise across multiple domains helps us blend
                  education and innovation to transform learning, engineer
                  solutions and shape the future.
                  
                  Over the span of two years, we have empowered 700+ students
                  across diverse educational levels and undertaken multiple
                  industrial projects for established companies and emerging
                  startups.
                </p>

                <p className="font-semibold italic text-[#30106f]">
                  We don't just teach technology. We build it.
                </p>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="mt-9 flex flex-wrap items-center justify-center gap-5"
              >
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-3 rounded-full bg-[#5921c7] px-7 py-4 text-sm font-bold text-white transition-all duration-300 hover:bg-[#713be0] hover:shadow-[0_0_35px_rgba(140,82,255,0.3)]"
                >
                  Get in Touch
                  <ArrowUpRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ==================================================
            SECTION 02 — DARK MISSION & VISION
        ================================================== */}
        <section className="relative overflow-hidden bg-[#30106f] px-5 py-10 text-white sm:px-8 lg:px-16 lg:py-10">
          <div className="pointer-events-none absolute -left-40 top-1/4 h-[400px] w-[400px] rounded-full bg-[#8c52ff]/15 blur-[130px]" />
          <div className="pointer-events-none absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-[#30106f]/25 blur-[130px]" />

          <div className="relative mx-auto max-w-[1150px]">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              className="mx-auto mb-6 max-w-[750px] text-center"
            >
              <p className="text-[13px] font-bold uppercase tracking-[0.3em] text-gray-200">
                Our direction
              </p>

              <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.06em] sm:text-3xl">
                <span className="bg-gradient-to-r from-[#8c52ff] via-[#b18aff] to-[#8c52ff] bg-clip-text text-transparent">
                  Purpose meets Possibilities.
                </span>
              </h2>

              <p className="mx-auto mt-3 max-w-[680px] text-[15px] leading-8 text-gray-200 sm:text-base">
                Our mission and vision guide the way we approach education,
                engineering and innovation. They reflect what we strive to
                create today and the future we aim to shape.
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7 }}
                className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#3e1b86] p-8 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-[#8c52ff]/40 hover:bg-white/[0.06] sm:p-12"
              >
                <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#8c52ff]/[0.10] blur-[70px]" />

                <div className="relative">
                  <div className="flex items-center gap-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#5921c7]/20 text-[#b99aff]">
                      <Target size={27} strokeWidth={1.5} />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#b99aff]">
                        Our mission
                      </p>

                      <h3 className="mt-2 text-xl font-extrabold leading-tight tracking-tight text-white">
                        Elevating Education. Enabling Innovation.
                      </h3>
                    </div>
                  </div>

                  <p className="mt-3 max-w-[480px] text-[16px] leading-7 text-gray-300">
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
                className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#3e1b86] p-8 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-[#8c52ff]/40 hover:bg-white/[0.06] sm:p-12"
              >
                <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#5921c7]/[0.12] blur-[70px]" />

                <div className="relative">
                  <div className="flex items-center gap-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#5921c7]/20 text-[#b99aff]">
                      <Rocket size={27} strokeWidth={1.5} />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#b99aff]">
                        Our vision
                      </p>

                      <h3 className="mt-2 text-xl font-extrabold leading-tight tracking-tight text-white">
                        Inspire today. Build tomorrow.
                      </h3>
                    </div>
                  </div>

                  <p className="mt-3 max-w-[480px] text-[16px] leading-7 text-gray-300">
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
            SECTION 03 — LIGHT CORE VALUES
        ================================================== */}
        <section className="relative overflow-hidden bg-[#f5f3fa] px-5 py-10 text-[#171024] sm:px-8 lg:px-16 lg:py-10">
          <div className="pointer-events-none absolute -right-40 top-10 h-[400px] w-[400px] rounded-full bg-[#8c52ff]/10 blur-[130px]" />

          <div className="relative mx-auto max-w-[1300px]">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              className="mx-auto mb-3 max-w-[900px] text-center"
            >
              <p className="text-[13px] font-bold uppercase tracking-[0.3em] text-gray-600">
                What defines us
              </p>

              <h2 className="mt-3 text-3xl font-extrabold leading-[1.05] tracking-[-0.06em] sm:text-3xl">
                <span className="bg-gradient-to-r from-[#5921c7] via-[#8c52ff] to-[#5921c7] bg-clip-text text-transparent">
                  Values that move us forward.
                </span>
              </h2>

              <p className="mx-auto mt-3 max-w-[900px] text-[16px] leading-8 text-gray-800">
                Our values are more than principles. They shape how we think,
                how we work and how we create meaningful experiences. They
                guide every learning experience, engineering project and
                relationship we build.
              </p>
            </motion.div>

            {/* CORE VALUES — 3 CARDS FIRST ROW, 2 CENTERED SECOND ROW */}
            <div className="flex flex-wrap justify-center gap-5">
              {coreValues.map((value, index) => {
                const Icon = value.icon;

                return (
                  <motion.div
                    key={value.number}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.55, delay: index * 0.08 }}
                    className="group relative flex min-h-[180px] w-full flex-col overflow-hidden rounded-[1.5rem] border border-[#171024]/[0.08] bg-white p-6 shadow-[0_12px_35px_rgba(48,16,111,0.045)] transition-all duration-500 hover:-translate-y-1 hover:border-[#8c52ff]/40 hover:shadow-[0_20px_45px_rgba(48,16,111,0.10)] sm:w-[calc((100%-1.25rem)/2)] sm:p-7 lg:w-[calc((100%-2.5rem)/3)]"
                  >
                    <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#8c52ff]/[0.05] blur-2xl transition-all duration-500 group-hover:bg-[#8c52ff]/15" />

                    {/* ICON LEFT, TITLE BESIDE IT */}
                    <div className="relative flex items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#5921c7]/10 text-[#713be0] transition-all duration-300 group-hover:bg-[#5921c7] group-hover:text-white">
                        <Icon size={22} strokeWidth={1.7} />
                      </div>

                      <div>
                        <h3 className="font-bold tracking-tight text-[#5921c7] text-[17px]">
                          {value.title}
                        </h3>
                      </div>
                    </div>

                    {/* DESCRIPTION BELOW ICON AND TITLE */}
                    <p className="relative mt-2 text-sm leading-7 text-gray-800">
                      {value.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==================================================
            SECTION 04 — DARK TECHNOLOGY DOMAINS
        ================================================== */}
        <section
          id="technology-domains"
          className="relative overflow-hidden bg-[#30106f] px-5 py-10 text-white sm:px-8 lg:px-16 lg:py-10"
        >
          <div className="pointer-events-none absolute -left-40 top-20 h-[450px] w-[450px] rounded-full bg-[#5921c7]/20 blur-[150px]" />
          <div className="pointer-events-none absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full bg-[#30106f]/25 blur-[150px]" />

          <div className="relative mx-auto max-w-[1100px]">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              className="mx-auto mb-6 max-w-[900px] text-center"
            >
              <p className="text-[13px] font-semibold uppercase tracking-[0.3em] text-gray-200">
                Our expertise
              </p>

              <h2 className="mt-3 text-3xl font-extrabold leading-[1.05] tracking-[-0.06em] sm:text-6xl lg:text-3xl">
                <span className="bg-gradient-to-r from-[#8c52ff] via-[#b18aff] to-[#8c52ff] bg-clip-text text-transparent">
                  The technologies shaping tomorrow.
                </span>{" "}
              </h2>

              <p className="mx-auto mt-3 max-w-[900px] text-[15px] leading-8 text-gray-200 text-[17px]">
                Our multidisciplinary expertise spans connected systems,
                intelligent automation and digital manufacturing. By
                combining engineering knowledge with practical
                experimentation, we create meaningful learning experiences
                and develop technology solutions for real-world needs.
              </p>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {domains.map((domain, index) => (
                <motion.div
                  key={domain.number}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.55,
                    delay: (index % 3) * 0.1,
                  }}
                  className="group relative flex min-h-[390px] flex-col overflow-hidden rounded-[1.5rem] border border-white/[0.09] bg-[#3e1b86] p-5 transition-all duration-500 hover:-translate-y-1 hover:border-[#8c52ff]/50 hover:bg-[#5921c7]/[0.10] sm:p-6"
                >
                  <div className="relative mb-6 h-44 w-full overflow-hidden rounded-[1.1rem] border border-white/10 bg-[#171024]">
                    <div
                      className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{
                        backgroundImage: `url("${domain.image}")`,
                      }}
                      role="img"
                      aria-label={`${domain.title} technology`}
                    />
                  </div>

                  <div className="relative mt-1">
                    <h3 className="text-xl font-bold leading-snug tracking-tight text-[#b18aff] text-[18px]">
                      {domain.title}
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-gray-200">
                      {domain.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================================================
            SECTION 05 — LIGHT CLOSING CTA
        ================================================== */}
        <section className="relative overflow-hidden bg-[#f5f3fa] px-5 py-10 text-[#171024] sm:px-8 lg:px-16 lg:py-10">
          <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#8c52ff]/10 blur-[130px]" />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="relative mx-auto max-w-[1300px] text-center"
          >
            <p className="text-[13px] font-bold uppercase tracking-[0.35em] text-gray-600">
              Partner with Us
            </p>

            <h2 className="mx-auto mt-4 max-w-[950px] text-3xl font-extrabold leading-[1.02] tracking-[-0.065em] sm:text-6xl lg:text-3xl">
              <span className="bg-gradient-to-r from-[#5921c7] via-[#8c52ff] to-[#5921c7] bg-clip-text text-transparent">
                Let's collaborate and build the future!
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-[700px] text-[16px] leading-8 text-gray-900 sm:text-lg">
              Whether you are a learner, educator, institution or innovator,
              we would love to explore what we can create together. Let's
              collaborate to turn ideas into meaningful experiences and
              impactful solutions.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 rounded-full bg-[#5921c7] px-8 py-4 text-sm font-extrabold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#713be0] hover:shadow-[0_15px_35px_rgba(89,33,199,0.25)]"
              >
                Let's connect
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
