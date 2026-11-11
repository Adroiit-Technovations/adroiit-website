"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Compass,
  Cpu,
  Lightbulb,
  Microscope,
  Rocket,
  School,
  Trophy,
  Wrench,
  Zap,
  BookOpen,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Bricolage_Grotesque } from "next/font/google";
import Footer from "@/sections/Footer";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

type IconType = LucideIcon;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const workshopDomains = [
  {
    image: "/stem-workshop/electronics.jpg",
    title: "Electronics & Circuits",
    description:
      "Builds understanding of electronic components and circuit design through practical learning.",
  },
  {
    image: "/stem-workshop/3d-printing.png",
    title: "3D Modelling & Printing",
    description:
      "Introduces digital design and rapid prototyping using 3D modelling and 3D printing technologies.",
  },
  {
    image: "/stem-workshop/embedded-systems.jpg",
    title: "Embedded Systems",
    description:
      "Focuses on creating smart devices by combining programming with electronic hardware.",
  },
  {
    image: "/stem-workshop/robotics.jpg",
    title: "Robotics",
    description:
      "Enables students to design and program robots to perform practical, real-world tasks.",
  },
  {
    image: "/stem-workshop/drone.jpg",
    title: "Drone Technology",
    description:
      "Provides exposure to drone technology, operations and its applications in the real world.",
  },
  {
    image: "/stem-workshop/ai.jpg",
    title: "Artificial Intelligence",
    description:
      "Introduces intelligent systems and fundamental AI concepts for building smart applications.",
  },
];

const bootcampProgrammes = [
  {
    image: "/services/junior-robochamp3.jpg",
    level: "Foundation to advanced learning",
    title: "Junior RoboChamp",
    description:
      "A hands-on foundation programme where students explore electronics, microcontroller programming, sensor and actuator interfacing, and robotics through exciting real-world projects.",
    topics: ["Electronics", "Arduino", "Sensors and actuators", "Robotics"],
    audience: "Young technology explorers",
  },
  {
    image: "/services/ultimate-tech-mastery6.png",
    level: "Multi-domain technology programme",
    title: "Ultimate Tech-Mastery",
    description:
      "An advanced technology programme covering electronics, embedded systems, robotics, IoT and 3D printing to build real-world innovation skills.",
    topics: ["Embedded systems", "Robotics", "IoT", "3D printing"],
    audience: "Aspiring innovators and makers",
  },
];

const learningStages = [
  {
    number: "01",
    title: "Discover & Understand",
    subtitle: "Build curiosity",
    description:
      "Students explore scientific principles, engineering concepts and the technology behind each topic.",
    icon: BookOpen,
  },
  {
    number: "02",
    title: "Experiment",
    subtitle: "Learn by doing",
    description:
      "They interact with tools, components and materials to test ideas, investigate outcomes and understand concepts.",
    icon: Microscope,
  },
  {
    number: "03",
    title: "Build & Create",
    subtitle: "Turn ideas into reality",
    description:
      "Students apply what they learn by programming, assembling and developing practical models and technology projects.",
    icon: Wrench,
  },
  {
    number: "04",
    title: "Innovate & Present",
    subtitle: "Share their innovation",
    description:
      "They improve projects, solve challenges and demonstrate working solutions while communicating their ideas.",
    icon: Rocket,
  },
];

const workshopHighlights = [
  {
    title: "Activity-driven Learning",
    description:
      "Students learn through practical activities, hands-on exercises and guided experimentation that encourage active participation.",
    icon: Wrench,
  },
  {
    title: "Real Components & Tools",
    description:
      "Gain hands-on exposure to electronic components, technology kits, tools and equipment used in real-world engineering projects.",
    icon: Cpu,
  },
  {
    title: "Engaging Live Demonstrations",
    description:
      "Explore exciting live demonstrations that transform abstract scientific and technical concepts into visible, interactive experiences.",
    icon: Zap,
  },
  {
    title: "Strengthens STEAM Understanding",
    description:
      "Connect science, technology, engineering, arts and mathematics with practical applications to develop a deeper understanding of concepts.",
    icon: Lightbulb,
  },
  {
    title: "Project & Competition Readiness",
    description:
      "Develop technical confidence, creative thinking and problem-solving abilities through practical projects and technology challenges.",
    icon: Trophy,
  },
  {
    title: "Career Awareness",
    description:
      "Discover emerging technologies, engineering disciplines and future career opportunities through meaningful technical exposure.",
    icon: Compass,
  },
];

const engagementModels = [
  {
    number: "01",
    title: "STEAM Workshops",
    subtitle: "Short-term learning experiences",
    description:
      "Introduce students to exciting STEAM concepts through interactive workshops, demonstrations and guided hands-on activities.",
    points: [
      "Thematic workshops",
      "Special STEAM events",
      "Technology demonstrations",
    ],
    icon: Microscope,
  },
  {
    number: "02",
    title: "STEAM Bootcamps",
    subtitle: "Structured skill-development programmes",
    description:
      "Provide students with progressive learning experiences through structured sessions, practical assignments and project development.",
    points: [
      "Multi-session programmes",
      "Progressive technical learning",
      "Practical project development",
    ],
    icon: Rocket,
  },
  {
    number: "03",
    title: "Institutional Programmes",
    subtitle: "Long-term learning partnerships",
    description:
      "Integrate practical technology learning into institutional activities through planned programmes and collaborative implementation.",
    points: [
      "School-based technology programmes",
      "Clubs and innovation activities",
      "Customised learning pathways",
    ],
    icon: School,
  },
  {
    number: "04",
    title: "Customised STEAM Initiatives",
    subtitle: "Designed around your objectives",
    description:
      "Collaborate with our team to plan STEAM experiences around your students, academic objectives, available facilities and institutional requirements.",
    points: [
      "Customised programme design",
      "Age-appropriate activities",
      "Institution-specific delivery",
    ],
    icon: Lightbulb,
  },
];

function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
  centered = true,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  light?: boolean;
  centered?: boolean;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUp}
      className={`${centered ? "mx-auto text-center" : ""} mb-10 max-w-3xl`}
    >
      <p
        className={`text-[13px] font-extrabold uppercase tracking-[0.22em] ${
          light ? "text-[#b99aff]" : "text-[#5921c7]"
        }`}
      >
        {eyebrow}
      </p>

      <h2
        className={`mt-4 text-[30px] font-black leading-[1.12] tracking-tight ${
          light ? "text-white" : "text-[#21172f]"
        }`}
      >
        {title}
      </h2>

      {description && (
        <p
          className={`mt-5 text-[15px] leading-7 sm:text-base ${
            light ? "text-white/60" : "text-gray-600"
          }`}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}

function IconTile({
  icon: Icon,
  light = false,
}: {
  icon: IconType;
  light?: boolean;
}) {
  return (
    <div
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
        light
          ? "bg-[#8c52ff]/20 text-[#c4a8ff]"
          : "bg-[#5921c7]/10 text-[#5921c7]"
      }`}
    >
      <Icon size={23} />
    </div>
  );
}

export default function STEAMWorkshopsBootcampsPage() {
  return (
    <main
      className={`${bricolage.className} min-h-screen overflow-hidden bg-white text-[#17121f]`}
    >
      {/* HERO — DARK */}
      <section className="relative isolate overflow-hidden bg-[#08060e] text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.11]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(90deg,rgba(255,255,255,0.14) 1px,transparent 1px)",
            backgroundSize: "55px 55px",
          }}
        />

        <div className="pointer-events-none absolute -left-40 top-10 h-[450px] w-[450px] rounded-full bg-[#5921c7]/25 blur-[130px]" />

        <div className="pointer-events-none absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-[#8c52ff]/20 blur-[130px]" />

        <div className="relative mx-auto grid max-w-[1290px] items-center gap-12 px-6 pb-20 pt-35 md:pb-36 md:pt-35 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="relative z-10"
          >
            <motion.p
              variants={item}
              className="text-[13px] font-bold uppercase tracking-[0.2em] text-[#c4a8ff]"
            >
              SPARK CURIOSITY AND DRIVE INNOVATION THROUGH
            </motion.p>

            <motion.h1
              variants={item}
              className="mt-3 max-w-3xl text-[30px] font-black leading-[1.3] tracking-tight sm:text-[30px] md:text-[30px]"
            >
              STEAM Workshops and Bootcamps
              <br />
              <span className="bg-gradient-to-r from-[#a77aff] via-[#8c52ff] to-[#d3bdff] bg-clip-text text-transparent">
                innovation.
              </span>
            </motion.h1>

            <motion.div
              variants={item}
              className="my-7 h-1 w-16 rounded-full bg-gradient-to-r from-[#5921c7] to-[#c4a8ff]"
            />

            <motion.p
              variants={item}
              className="max-w-2xl text-[17px] leading-8 text-white"
            >
              Adroiit Technovations delivers hands-on STEAM workshops and
              structured, mentor-facilitated bootcamps that introduce students
              to science, engineering and emerging technologies through
              practical learning.
            </motion.p>

            <motion.p
              variants={item}
              className="mt-4 max-w-2xl text-sm leading-7 text-gray-400"
            >
              From interactive short-format experiences to progressive
              technology programmes, students explore concepts, experiment
              with real tools and components, and turn ideas into working
              projects.
            </motion.p>

            <motion.div
              variants={item}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#8c52ff] px-7 py-4 text-sm font-bold text-white shadow-[0_10px_40px_rgba(140,82,255,0.25)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#7440e8]"
              >
                Enquire Now
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <a
                href="#workshops"
                className="group inline-flex items-center justify-center gap-3 rounded-full border border-white/20 bg-white/[0.05] px-7 py-4 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:border-[#b99aff] hover:bg-white/10"
              >
                Explore Domains
                <ArrowUpRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
              delay: 0.2,
            }}
            className="relative mx-auto w-full max-w-[570px] lg:ml-auto"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-[20px]">
              <Image
                src="/stem-workshop2.png"
                alt="Students exploring STEAM through hands-on workshop activities"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* LEARNING JOURNEY — LIGHT */}
      <section className="bg-[#f7f5fb] px-6 py-10 md:py-10">
        <div className="mx-auto max-w-[1290px]">
          <SectionHeading
            eyebrow="The Adroiit learning approach"
            title={
              <>
                From understanding concepts
                <span className="block text-[#8c52ff]">
                  to creating something real.
                </span>
              </>
            }
            description="A practical learning cycle that encourages students to question, explore, build, improve and share what they create."
            centered
          />

          <div className="relative">
            <div className="absolute left-[8%] right-[8%] top-9 hidden h-px bg-gradient-to-r from-transparent via-[#8c52ff]/50 to-transparent lg:block" />

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4 lg:gap-7"
            >
              {learningStages.map((stage) => (
                <motion.div
                  key={stage.number}
                  variants={item}
                  className="group flex flex-col items-center"
                >
                  <div className="relative z-10 mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-[20px] border border-[#8c52ff]/25 bg-white text-[#5921c7] shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#8c52ff] group-hover:bg-[#5921c7] group-hover:text-white">
                    <stage.icon size={27} />

                    <span className="absolute -right-3 -top-3 flex h-7 w-7 items-center justify-center rounded-full border-[3px] border-[#f7f5fb] bg-[#8c52ff] text-[10px] font-black text-white">
                      {stage.number}
                    </span>
                  </div>

                  <h3 className="text-[18px] font-black text-[#21172f] transition-colors group-hover:text-[#5921c7]">
                    {stage.title}
                  </h3>

                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#8c52ff]">
                    {stage.subtitle}
                  </p>

                  <p className="mt-3 text-sm leading-7 text-gray-600">
                    {stage.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* WORKSHOP VS BOOTCAMP — DARK */}
      <section className="relative overflow-hidden bg-[#100b1c] px-6 py-16 text-white md:py-10">
        <div className="pointer-events-none absolute -right-36 top-0 h-80 w-80 rounded-full bg-[#5921c7]/20 blur-[120px]" />

        <div className="relative mx-auto max-w-[1000px]">
          <SectionHeading
            light
            eyebrow="Two ways to experience STEAM"
            title="From a spark of curiosity to deeper technical capability."
            description="Choose an engaging introduction to a topic or a structured journey that gives students time to build stronger technical skills."
          />

          <div className="grid gap-5 lg:grid-cols-2">
            <motion.article
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={item}
              className="rounded-[26px] border border-white/10 bg-white/[0.05] p-7 transition-all duration-300 hover:border-[#8c52ff]/40 hover:bg-white/[0.07] sm:p-8"
            >
              <IconTile icon={Microscope} light />

              <p className="mt-6 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#b99aff]">
                Short-format experiences
              </p>

              <h3 className="mt-3 text-[25px] font-black text-white">
                Interactive STEAM Workshops
              </h3>

              <p className="mt-4 text-sm leading-7 text-gray-300">
                Engaging, activity-driven sessions that introduce students to
                STEAM concepts and technologies through experiments,
                demonstrations, guided activities and hands-on making.
              </p>

              <ul className="mt-5 space-y-3">
                {[
                  "Focused sessions around selected STEAM themes",
                  "Interactive demonstrations and practical activities",
                  "Suitable for school events, clubs and special programmes",
                ].map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 text-sm text-gray-300"
                  >
                    <CheckCircle2
                      size={17}
                      className="mt-0.5 shrink-0 text-[#b99aff]"
                    />
                    {point}
                  </li>
                ))}
              </ul>

              <a
                href="#workshops"
                className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#c4a8ff] hover:text-white"
              >
                Explore workshop domains
                <ArrowRight size={16} />
              </a>
            </motion.article>

            <motion.article
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={item}
              className="rounded-[26px] border border-white/10 bg-white/[0.05] p-7 transition-all duration-300 hover:border-[#8c52ff]/40 hover:bg-white/[0.07] sm:p-8"
            >
              <IconTile icon={Rocket} light />

              <p className="mt-6 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#b99aff]">
                Structured learning programmes
              </p>

              <h3 className="mt-3 text-[25px] font-black text-white">
                STEAM Bootcamps
              </h3>

              <p className="mt-4 text-sm leading-7 text-gray-300">
                Progressive, mentor-facilitated programmes that give students
                more time to understand concepts, work with technology kits,
                develop technical skills and complete practical projects.
              </p>

              <ul className="mt-5 space-y-3">
                {[
                  "Structured learning paths and progressive stages",
                  "Guided programming, assembly and project development",
                  "Opportunities to improve and demonstrate working builds",
                ].map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 text-sm text-gray-300"
                  >
                    <CheckCircle2
                      size={17}
                      className="mt-0.5 shrink-0 text-[#b99aff]"
                    />
                    {point}
                  </li>
                ))}
              </ul>

              <a
                href="#programmes"
                className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#c4a8ff] hover:text-white"
              >
                Explore bootcamp programmes
                <ArrowRight size={16} />
              </a>
            </motion.article>
          </div>
        </div>
      </section>

      {/* WORKSHOP DOMAINS — LIGHT */}
      <section
        id="workshops"
        className="bg-[#f7f5fb] px-6 py-10 md:py-10"
      >
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-10 text-center">
            <p className="text-[13px] font-extrabold uppercase tracking-[0.22em] text-[#5921c7]">
              Explore the possibilities
            </p>

            <h2 className="mt-4 text-[30px] font-black leading-tight tracking-tight text-[#21172f]">
              Our Workshop <span className="text-[#8c52ff]">Domains</span>
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-gray-600">
              A diverse range of technical experiences introducing students
              to the concepts, tools and possibilities of modern STEAM fields.
            </p>
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.08 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {workshopDomains.map((domain) => (
              <motion.article
                key={domain.title}
                variants={item}
                whileHover={{ y: -5 }}
                className="group overflow-hidden rounded-[20px] border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-[#cbb6ff] hover:shadow-xl"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={domain.image}
                    alt={domain.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="p-5">
                  <h3 className="text-[17px] font-black text-[#5921c7] transition-colors group-hover:text-[#5921c7]">
                    {domain.title}
                  </h3>

                  <p className="mt-2 text-[13px] leading-6 text-gray-600">
                    {domain.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* BOOTCAMP PROGRAMMES — DARK */}
      <section
        id="programmes"
        className="relative overflow-hidden bg-[#090711] px-6 py-10 text-white md:py-10"
      >
        <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#5921c7]/20 blur-[130px]" />

        <div className="relative mx-auto max-w-[900px]">
          <SectionHeading
            light
            eyebrow="Our programmes"
            title="Choose your path to becoming an innovator."
            description="Comprehensive learning paths designed to introduce students to technology and progressively develop their practical skills."
          />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.08 }}
            className="mx-auto grid max-w-[1100px] gap-5 lg:grid-cols-2"
          >
            {bootcampProgrammes.map((programme) => (
              <motion.article
                key={programme.title}
                variants={item}
                whileHover={{ y: -5 }}
                className="group overflow-hidden rounded-[22px] border border-white/10 bg-[#171320] transition-all duration-300 hover:border-[#8c52ff]/50 hover:shadow-[0_20px_60px_rgba(89,33,199,0.16)]"
              >
                <div className="relative aspect-[16/8] overflow-hidden">
                  <Image
                    src={programme.image}
                    alt={programme.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#09070e] via-black/10 to-transparent" />

                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#c4a8ff]">
                      {programme.level}
                    </p>

                    <h3 className="mt-2 text-[23px] font-black text-white">
                      {programme.title}
                    </h3>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <p className="text-[13px] leading-6 text-gray-300">
                    {programme.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {programme.topics.map((topic) => (
                      <span
                        key={topic}
                        className="rounded-full border border-[#8c52ff]/20 bg-[#5921c7]/15 px-3 py-1.5 text-[11px] font-semibold text-[#c4a8ff]"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-gray-500">
                        Learning focus
                      </p>

                      <p className="mt-1 text-sm font-semibold text-white">
                        {programme.audience}
                      </p>
                    </div>

                    <Link
                      href="/contact"
                      className="group/link inline-flex items-center gap-2 text-sm font-bold text-[#b99aff] transition-all hover:text-white"
                    >
                      Enquire now
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover/link:translate-x-1"
                      />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ADROIIT EXPERIENCE — LIGHT */}
      <section className="bg-white px-6 py-10 md:py-10">
        <div className="mx-auto max-w-[1100px]">
          <SectionHeading
            eyebrow="The Adroiit experience"
            title="What makes our workshops engaging?"
            description="We make technical learning approachable, engaging and meaningful through experiences that put students at the centre of learning."
          />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.08 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {workshopHighlights.map((highlight) => (
              <motion.div
                key={highlight.title}
                variants={item}
                className="group rounded-[22px] border border-gray-200 bg-[#faf9fc] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#8c52ff]/45 hover:bg-white hover:shadow-lg"
              >
                <IconTile icon={highlight.icon} />

                <h3 className="mt-5 text-[17px] font-black text-[#5921c7] transition-colors group-hover:text-[#5921c7]">
                  {highlight.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-600">
                  {highlight.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* COLLABORATION OPPORTUNITIES — DARK */}
      <section className="bg-[#100b1c] px-6 py-10 text-white md:py-10">
        <div className="mx-auto max-w-[1300px]">
          <SectionHeading
            light
            eyebrow="Collaboration opportunities"
            title="The right learning experience for every institution."
            description="Whether you are planning a one-day STEAM activity or looking to establish a structured technology-learning programme, we offer flexible engagement models to match your objectives."
          />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.08 }}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {engagementModels.map((model) => (
              <motion.article
                key={model.number}
                variants={item}
                className="group flex flex-col rounded-[24px] border border-white/10 bg-white/[0.04] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#8c52ff]/45 hover:bg-white/[0.07]"
              >
                <div className="flex items-start justify-between gap-4">
                  <IconTile icon={model.icon} light />

                  <span className="text-2xl font-black text-white/15">
                    {model.number}
                  </span>
                </div>

                <p className="mt-6 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#b99aff]">
                  {model.subtitle}
                </p>

                <h3 className="mt-2 text-[21px] font-black text-white">
                  {model.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-400">
                  {model.description}
                </p>

                <ul className="mt-5 flex-1 space-y-3 border-t border-white/10 pt-5">
                  {model.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-3 text-sm text-gray-300"
                    >
                      <CheckCircle2
                        size={16}
                        className="mt-0.5 shrink-0 text-[#b99aff]"
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA — LIGHT */}
      <section className="relative isolate overflow-hidden bg-white px-6 py-10 text-[#17121f] md:py-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(140,82,255,0.10),transparent_65%)]" />

        <div className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-[#5921c7]/10 blur-[100px]" />

        <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-[#8c52ff]/10 blur-[100px]" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="relative mx-auto max-w-4xl text-center"
        >
          <span className="mt-6 block text-[13px] font-extrabold uppercase tracking-[0.22em] text-[#5921c7]">
            Start something extraordinary
          </span>

          <h2 className="mt-4 text-[30px] font-black leading-tight tracking-tight text-[#21172f]">
            Ready to inspire the{" "}
            <span className="block bg-gradient-to-r from-[#5921c7] to-[#8c52ff] bg-clip-text text-transparent">
              next generation of innovators?
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-8 text-gray-600">
            Give your students the opportunity to explore, experiment and
            create. Partner with Adroiit Technovations to bring interactive
            STEAM workshops and structured, mentor-guided bootcamps to your
            institution.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#5921c7]/20 px-7 py-4 text-sm font-bold text-[#5921c7] transition-all hover:border-[#8c52ff] hover:bg-[#5921c7]/5 sm:w-auto"
            >
              Talk to Our Team
              <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="mt-7 inline-flex items-center gap-2 text-xs font-semibold text-gray-500">
            <CheckCircle2 size={14} className="text-[#8c52ff]" />
            Let's plan a learning experience for your students
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}