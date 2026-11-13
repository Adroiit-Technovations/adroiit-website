
"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  Wrench,
  FlaskConical,
} from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
});

// ============================================================
// KEY PILLARS DATA
// ============================================================

const pillars = [
  {
    number: "01",
    title: "Education",
    subtitle: "Learn by doing.",
    description:
      "Making STEAM and technology education meaningful through experiential learning approach.",
    icon: GraduationCap,
  },
  {
    number: "02",
    title: "Technology",
    subtitle: "Build with purpose.",
    description:
      "Transforming ideas into reality through engineering products and innovative solutions.",
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

// ============================================================
// ANIMATIONS
// ============================================================

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: "easeOut" as const,
    },
  },
};

// ============================================================
// OUR KEY PILLARS COMPONENT
// ============================================================

export default function KeyPillars() {
  return (
    <section
      id="who-we-are"
      className={`${bricolage.className} relative isolate scroll-mt-24 overflow-hidden px-5 py-10 text-white sm:px-8 lg:px-16 lg:py-10`}
      style={{
        backgroundImage:
          "linear-gradient(110deg, #30106f 0%, #30106f 100%)",
        backgroundColor: "#30106f",
      }}
    >
      {/* BACKGROUND GRADIENT EFFECTS */}

      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-[#8c52ff]/12 blur-[130px]" />

        <div className="absolute -bottom-48 -right-32 h-[480px] w-[480px] rounded-full bg-[#18063e]/30 blur-[140px]" />

        <div className="absolute left-1/2 top-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8c52ff]/10 blur-[140px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage:
              "radial-gradient(ellipse at center, black 20%, transparent 85%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 20%, transparent 85%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-[1250px]">

        {/* SECTION INTRODUCTION */}

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="grid gap-12 md:grid-cols-[0.7fr_1.3fr] md:items-center"
        >
          <div>
            <p className="text-[13px] font-bold uppercase tracking-[0.3em] text-white/75">
              OUR KEY PILLARS
            </p>

            <h2 className="mt-4 text-3xl font-extrabold leading-[1.02] tracking-[-0.065em] sm:text-3xl">
              <span className="bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
                We always thrive to be the extraordinary.
              </span>
            </h2>
          </div>

          <div className="border-l-2 border-white/40 pl-7 sm:pl-13">
            <p className="text-xl leading-relaxed text-white/90 sm:text-[17px] sm:leading-relaxed">
              At Adroiit Technovations, we believe education should be
              experiential. We inculcate hands-on, technology-driven
              learning with traditional learning to nurture curiosity
              and empower young minds.
              Driven by the passion for technology and innovation, we strive
              to transform ideas into innovative solutions to shape a smarter and
              better tomorrow.
            </p>
          </div>
        </motion.div>

        {/* THREE PILLARS */}

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
                    transition: {
                      duration: 0.6,
                      ease: "easeOut" as const,
                    },
                  },
                }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  transition: { duration: 0.3 },
                }}
                className="group relative flex min-h-[215px] flex-col items-center overflow-hidden rounded-[1.5rem] border border-[#b99aff]/40 bg-[#3e1b86] px-5 py-7 text-center transition-all duration-500 hover:border-[#d9c8ff]/75 sm:min-h-[225px] sm:px-5 sm:py-8"
              >
                {/* SOFT INNER BORDER */}

                <div className="pointer-events-none absolute inset-[1px] rounded-[1.45rem] border border-white/[0.07]" />

                {/* PILLAR NUMBER */}

                <span className="absolute right-5 top-4 text-[11px] font-bold tracking-[0.2em] text-white/35 transition-colors duration-300 group-hover:text-white/60">
                  {pillar.number}
                </span>

                {/* ICON */}

                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-[#d9c8ff]/45 bg-[#8c52ff]/35 text-white shadow-[0_5px_25px_rgba(20,4,55,0.25),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:border-white/80 group-hover:bg-white group-hover:text-[#5921c7] group-hover:shadow-[0_0_25px_rgba(255,255,255,0.22)]">
                  <Icon size={23} strokeWidth={1.7} />
                </div>

                {/* SUBTITLE */}

                <p className="relative mt-4 text-[12px] font-bold uppercase tracking-[0.2em] text-[#d9c8ff] transition-colors duration-300 group-hover:text-white">
                  {pillar.subtitle}
                </p>

                {/* TITLE */}

                <h3 className="relative mt-1 text-lg font-extrabold tracking-tight text-white sm:text-xl">
                  {pillar.title}
                </h3>

                {/* DESCRIPTION */}

                <p className="relative mt-2 max-w-[300px] text-[14px] leading-5 text-purple-100/85 transition-colors duration-300 group-hover:text-white">
                  {pillar.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
