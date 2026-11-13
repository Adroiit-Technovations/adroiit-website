
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bricolage_Grotesque } from "next/font/google";

import {
  Lightbulb,
  Cpu,
  Code2,
  GraduationCap,
  Blocks,
  Microscope,
  Workflow,
  Wrench,
  Rocket,
  ArrowUpRight,
  CheckCircle2,
  CircuitBoard,
  Target,
} from "lucide-react";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
});

// ============================================================
// WHY CHOOSE ADROIIT - CONTENT
// ============================================================

const reasons = [
  {
    number: "01",
    icon: GraduationCap,
    title: "Learning Beyond Classrooms",
    description:
      "We believe learning becomes meaningful when students experience it. Our hands-on, activity-based approach transforms concepts into practical skills through real-world projects.",
    tag: "Experiential Education",
    featured: true,
  },
  {
    number: "02",
    icon: Cpu,
    title: "Built by Engineers",
    description:
      "Founded by mechatronics engineers, we bring engineering thinking, technical expertise and practical problem-solving into everything we create.",
    tag: "Engineering Expertise",
  },
  {
    number: "03",
    icon: CircuitBoard,
    title: "In-House Technology Kits",
    description:
      "We develop our own Arduino, ESP32 and electronics-based learning kits, giving learners access to practical technology and hands-on experimentation.",
    tag: "Our Own Products",
  },
  {
    number: "04",
    icon: Code2,
    title: "Real Programming Experience",
    description:
      "From electronics and embedded systems to IoT and robotics, learners work with actual programming environments and industry-relevant technologies.",
    tag: "Practical Technology",
  },
  {
    number: "05",
    icon: Blocks,
    title: "From Ideas to Prototypes",
    description:
      "We take innovation beyond theoretical concepts through 3D modelling, electronics, mechanical design, prototyping and functional product development.",
    tag: "Product Development",
  },
  {
    number: "06",
    icon: Microscope,
    title: "Research-Driven Innovation",
    description:
      "Our research and development approach encourages experimentation, continuous improvement and the creation of practical technology solutions.",
    tag: "Research & Development",
  },
  {
    number: "07",
    icon: Workflow,
    title: "Integrated Learning Ecosystem",
    description:
      "We connect science, technology, engineering, arts and mathematics through interdisciplinary learning experiences that develop complete problem-solvers.",
    tag: "STEAM Approach",
  },
  {
    number: "08",
    icon: Wrench,
    title: "Long-Term Technical Support",
    description:
      "Our commitment extends beyond implementation with technical assistance, kit maintenance, upgrades and continued support for our educational partners.",
    tag: "Continued Partnership",
  },
];

const highlights = [
  {
    value: "700+",
    label: "Students Reached",
  },
  {
    value: "2024",
    label: "Founded by Engineers",
  },
  {
    value: "3",
    label: "Core Business Divisions",
  },
];

// ============================================================
// ANIMATION VARIANTS
// ============================================================

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

// ============================================================
// MAIN SECTION
// ============================================================

export default function WhyChooseAdroiit() {
  return (
    <section
      className={`${bricolage.className} relative overflow-hidden bg-[#faf9ff] py-20 sm:py-24 lg:py-32`}
    >
      {/* Background Decorations */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-[400px] w-[400px] rounded-full bg-[#e8ddff]/40 blur-[110px]" />

        <div className="absolute -right-40 top-[35%] h-[450px] w-[450px] rounded-full bg-[#d9c8ff]/30 blur-[130px]" />

        <div className="absolute bottom-0 left-[40%] h-[300px] w-[300px] rounded-full bg-[#eee8ff]/60 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12">

        {/* SECTION HEADER */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-14 max-w-3xl text-center lg:mb-20"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d9caff] bg-white/80 px-4 py-2 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#8c52ff]" />

            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#5921c7]">
              The Adroiit Difference
            </span>
          </div>

          <h2 className="text-4xl font-bold leading-[1.1] tracking-tight text-[#21133f] sm:text-5xl lg:text-6xl">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-[#5921c7] via-[#8c52ff] to-[#b18aff] bg-clip-text text-transparent">
              Adroiit
            </span>
            <br className="hidden sm:block" />{" "}
            Technovations?
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#69617b] sm:text-lg">
            We bring education, engineering and innovation together to
            transform ideas into knowledge, skills and meaningful
            real-world solutions.
          </p>
        </motion.div>

        {/* HIGHLIGHT METRICS */}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto mb-14 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3 lg:mb-20"
        >
          {highlights.map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="rounded-2xl border border-[#e9e1fa] bg-white/80 px-5 py-6 text-center shadow-[0_8px_30px_rgba(65,35,120,0.04)]"
            >
              <h3 className="bg-gradient-to-r from-[#5921c7] to-[#9a6aff] bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                {item.value}
              </h3>

              <p className="mt-2 text-sm font-medium text-[#756d87]">
                {item.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* DIFFERENTIATORS GRID */}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {reasons.map((reason) => {
            const Icon = reason.icon;

            return (
              <motion.div
                key={reason.number}
                variants={cardVariants}
                whileHover={{
                  y: -7,
                  transition: { duration: 0.25 },
                }}
                className={`group relative flex flex-col overflow-hidden rounded-[24px] border p-6 transition-all duration-300 sm:p-7 ${
                  reason.featured
                    ? "border-[#d6c2ff] bg-gradient-to-br from-[#f0e9ff] via-white to-[#f8f4ff] shadow-[0_15px_45px_rgba(89,33,199,0.09)]"
                    : "border-[#eae5f2] bg-white shadow-[0_8px_35px_rgba(42,25,75,0.035)] hover:border-[#c9b2ff] hover:shadow-[0_18px_45px_rgba(89,33,199,0.09)]"
                }`}
              >
                {/* Top Row */}

                <div className="mb-8 flex items-center justify-between">
                  <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5921c7] to-[#9862ff] text-white shadow-[0_6px_18px_rgba(89,33,199,0.22)] transition-transform duration-300 group-hover:scale-110">
                    <Icon size={25} strokeWidth={1.8} />
                  </div>

                  <span className="text-sm font-bold tracking-widest text-[#c5bad8]">
                    {reason.number}
                  </span>
                </div>

                {/* Card Content */}

                <div className="flex flex-1 flex-col">
                  <div className="mb-3">
                    <span className="inline-flex rounded-full bg-[#f1ebff] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#7040cb]">
                      {reason.tag}
                    </span>
                  </div>

                  <h3 className="mb-3 text-xl font-bold leading-snug text-[#261641] sm:text-[21px]">
                    {reason.title}
                  </h3>

                  <p className="text-sm leading-[1.85] text-[#746c82]">
                    {reason.description}
                  </p>
                </div>

                {/* Bottom Accent */}

                <div className="mt-7 h-[3px] w-10 rounded-full bg-gradient-to-r from-[#5921c7] to-[#b18aff] transition-all duration-300 group-hover:w-full" />
              </motion.div>
            );
          })}
        </motion.div>

        {/* BOTTOM CTA */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="relative mt-16 overflow-hidden rounded-[28px] bg-gradient-to-r from-[#30106f] via-[#5921c7] to-[#8050dc] px-7 py-10 shadow-[0_20px_60px_rgba(67,28,139,0.18)] sm:px-12 sm:py-12 lg:mt-20 lg:flex lg:items-center lg:justify-between"
        >
          {/* CTA Background Effects */}

          <div className="pointer-events-none absolute -right-16 -top-32 h-72 w-72 rounded-full border border-white/10" />

          <div className="pointer-events-none absolute -right-5 -top-20 h-56 w-56 rounded-full border border-white/10" />

          <div className="pointer-events-none absolute bottom-0 right-[25%] h-40 w-40 rounded-full bg-[#b18aff]/20 blur-[70px]" />

          <div className="relative z-10 max-w-2xl">
            <div className="mb-4 flex items-center gap-2 text-[#e2d2ff]">
              <Lightbulb size={19} />

              <span className="text-xs font-bold uppercase tracking-[0.18em]">
                Let's Build What's Next
              </span>
            </div>

            <h3 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
              Have an idea? Let's turn it into reality.
            </h3>

            <p className="mt-4 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
              Whether you're looking to transform education, develop
              innovative products or explore new technologies, let's
              create something meaningful together.
            </p>
          </div>

          <div className="relative z-10 mt-8 lg:mt-0 lg:shrink-0">
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-bold text-[#5921c7] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#f4edff] hover:shadow-xl"
            >
              Let's Connect

              <ArrowUpRight
                size={19}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
