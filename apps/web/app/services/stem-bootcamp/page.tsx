"use client";

import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Zap,
  Cpu,
  Trophy,
  Wrench,
  Lightbulb,
  Users,
  Target,
  Rocket,
  Brain,
  CircuitBoard,
  Code2,
  Bot,
  GraduationCap,
  BookOpen,
  Microscope,
  Blocks,
  Sparkles,
  CheckCircle2,
  Compass,
  Layers3,
  MoveUpRight,
  School,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Bricolage_Grotesque } from "next/font/google";
import Footer from "@/sections/Footer";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const bootcampProgrammes = [
  {
    image: "/services/junior-robochamp3.jpg",
    number: "01",
    level: "Foundation to advanced learning",
    title: "Junior RoboChamp",
    description:
      "A hands-on foundation programme where students explore electronics, microcontroller programming, sensor and actuator interfacing, and robotics through exciting real-world projects.",
    topics: [
      "Electronics",
      "Arduino",
      "Sensors and actuators",
      "Robotics",
    ],
    audience: "Young technology explorers",
  },
  {
    image: "/services/ultimate-tech-mastery6.png",
    number: "02",
    level: "Multi-domain technology programme",
    title: "Ultimate Tech-Mastery",
    description:
      "An advanced technology programme covering electronics, embedded systems, robotics, IoT and 3D printing to build real-world innovation skills.",
    topics: [
      "Embedded systems",
      "Robotics",
      "IoT",
      "3D printing",
    ],
    audience: "Aspiring innovators and makers",
  },
];

const highlights = [
  {
    title: "Builds a strong maker mindset",
    description: "Encourages students to explore, experiment and create.",
    icon: Lightbulb,
  },
  {
    title: "Strengthens STEM concepts",
    description: "Connects classroom concepts with practical applications.",
    icon: Zap,
  },
  {
    title: "Progressive learning pathway",
    description: "Introduces concepts gradually through structured stages.",
    icon: Target,
  },
  {
    title: "Mentor-guided learning",
    description: "Supports students through guided activities and projects.",
    icon: Users,
  },
  {
    title: "Project and competition readiness",
    description: "Builds confidence to take on technical challenges.",
    icon: Trophy,
  },
  {
    title: "Engaging practical experiences",
    description: "Keeps learning active through hands-on exploration.",
    icon: Cpu,
  },
];

const learningStages = [
  {
    number: "01",
    icon: BookOpen,
    title: "Understand",
    description:
      "Explore scientific principles, engineering concepts and the technology behind each topic.",
  },
  {
    number: "02",
    icon: Wrench,
    title: "Experiment",
    description:
      "Work with electronic components, tools, software and technology kits through guided activities.",
  },
  {
    number: "03",
    icon: Code2,
    title: "Build",
    description:
      "Apply what has been learned by programming, assembling and developing practical projects.",
  },
  {
    number: "04",
    icon: Rocket,
    title: "Innovate",
    description:
      "Improve projects, solve challenges and demonstrate working solutions.",
  },
];

const technologyAreas = [
  {
    icon: CircuitBoard,
    title: "Electronics",
    description:
      "Understand circuits, components, signals and the foundations of electronic systems.",
  },
  {
    icon: Cpu,
    title: "Embedded Systems",
    description:
      "Explore microcontrollers, programming logic and hardware-software integration.",
  },
  {
    icon: Bot,
    title: "Robotics",
    description:
      "Discover mechanisms, movement, sensing and intelligent control.",
  },
  {
    icon: Blocks,
    title: "3D Design & Printing",
    description:
      "Transform digital designs into physical objects and prototypes.",
  },
  {
    icon: Workflow,
    title: "Internet of Things",
    description:
      "Connect devices and sensors to develop connected, data-driven applications.",
  },
  {
    icon: Brain,
    title: "Emerging Technologies",
    description:
      "Build awareness of new technologies and their real-world applications.",
  },
];

const outcomes = [
  "Understand core STEM and engineering concepts",
  "Gain practical exposure to electronic components and tools",
  "Develop programming and logical thinking skills",
  "Build and test functional technology projects",
  "Improve problem-solving and creative thinking",
  "Present ideas and communicate technical work",
];

const institutionalBenefits = [
  {
    icon: School,
    title: "Institution-focused delivery",
    description:
      "Learning programmes can be discussed around your institution's academic objectives and student requirements.",
  },
  {
    icon: GraduationCap,
    title: "Student-centred learning",
    description:
      "Activities are structured to encourage curiosity, participation and progressive skill development.",
  },
  {
    icon: Microscope,
    title: "Practical technology exposure",
    description:
      "Students get opportunities to explore technology through components, tools, experiments and projects.",
  },
];

export default function STEMBootcampPage() {
  return (
    <main
      className={`${bricolage.className} min-h-screen overflow-hidden bg-[#050505] text-white`}
    >
      {/* HERO SECTION */}
      <section className="relative isolate overflow-hidden bg-[#08060e]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.13]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.14) 1px, transparent 1px)",
            backgroundSize: "55px 55px",
          }}
        />

        <div className="pointer-events-none absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-[#5921c7]/25 blur-[130px]" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-[380px] w-[380px] rounded-full bg-[#8c52ff]/20 blur-[130px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-28 sm:px-8 md:pb-28 md:pt-36 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-12">
          <div>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#8c52ff]/30 bg-[#5921c7]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#c4a8ff]"
            >
              <Sparkles size={14} />
              Learn · Build · Innovate
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="max-w-3xl text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl md:text-6xl xl:text-[68px]"
            >
              Turn curiosity into{" "}
              <span className="bg-gradient-to-r from-[#a77aff] via-[#8c52ff] to-[#d3bdff] bg-clip-text text-transparent">
                innovation.
              </span>
              <span className="mt-2 block text-white">STEM Bootcamps</span>
            </motion.h1>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="my-8 h-1 rounded-full bg-gradient-to-r from-[#5921c7] to-[#c4a8ff]"
            />

            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="max-w-2xl text-base leading-8 text-gray-300 sm:text-lg"
            >
              Adroiit Technovations' STEM bootcamps are structured,
              mentor-facilitated learning programmes designed to provide
              students with in-depth exposure to emerging technologies.
            </motion.p>

            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-4 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base"
            >
              Through progressive learning and continuous hands-on
              experiences, students develop foundational knowledge, practical
              technical skills and the confidence to turn ideas into working
              projects.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-9 flex flex-col gap-4 sm:flex-row"
            >
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#8c52ff] px-7 py-4 text-sm font-bold text-white shadow-[0_10px_40px_rgba(140,82,255,0.25)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#7440e8]"
              >
                Organize a Bootcamp
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <a
                href="#programmes"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-7 py-4 text-sm font-bold text-white transition-all hover:border-[#8c52ff] hover:bg-white/5"
              >
                Explore Programmes
                <MoveUpRight size={17} />
              </a>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/10 pt-7"
            >
              {[
                "Hands-on learning",
                "Progressive curriculum",
                "Mentor-guided projects",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#b99aff]" />
                  <span className="text-xs font-semibold text-gray-300 sm:text-sm">
                    {item}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, x: 25 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative mx-auto w-full max-w-[570px] lg:ml-auto"
          >
            <div className="absolute -inset-5 rounded-[36px] bg-gradient-to-br from-[#5921c7]/30 to-[#8c52ff]/5 blur-2xl" />

            <div className="relative overflow-hidden rounded-[28px] border border-white/15 bg-[#111] p-2 shadow-2xl">
              <div className="relative aspect-[5/4] overflow-hidden rounded-[21px]">
                <Image
                  src="/services/stem-bootcamp2.png"
                  alt="Students exploring STEM and technology through practical learning"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#c4a8ff]">
                    Explore. Experiment. Engineer.
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                    The next generation of innovators starts here.
                  </h2>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-3 hidden items-center gap-3 rounded-2xl border border-white/10 bg-[#17121f]/95 p-4 shadow-xl backdrop-blur sm:flex">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#5921c7]/25 text-[#b99aff]">
                <Rocket size={23} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">
                  Learn by building
                </p>
                <p className="text-xs text-gray-400">
                  Practical technology experiences
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* LEARNING PHILOSOPHY */}
      <section className="border-y border-white/10 bg-[#0d0b12] px-5 py-14 sm:px-8 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#b99aff]">
              Our learning philosophy
            </span>
            <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl">
              Less passive learning.
              <span className="block text-[#a77aff]">
                More hands-on discovery.
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-base leading-8 text-gray-400 sm:text-lg"
          >
            Technology becomes meaningful when students get to interact with
            it. Our bootcamps connect theoretical concepts with experiments,
            practical challenges and guided projects, helping students
            understand not only how something works, but also how they can
            build it themselves.
          </motion.p>
        </div>
      </section>

      {/* PROGRAMMES */}
      <section
        id="programmes"
        className="relative overflow-hidden bg-[#09070e] px-5 py-20 sm:px-8 md:py-28"
      >
        <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-[#5921c7]/20 blur-[130px]" />

        <div className="relative mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mx-auto mb-14 max-w-3xl text-center"
          >
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#b99aff]">
              Our programmes
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
              Choose your path to becoming an innovator.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
              Comprehensive learning paths designed to introduce students to
              technology and progressively develop their practical skills.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid gap-7 lg:grid-cols-2"
          >
            {bootcampProgrammes.map((programme) => (
              <motion.article
                key={programme.number}
                variants={itemVariants}
                whileHover={{ y: -6 }}
                className="group overflow-hidden rounded-[28px] border border-white/10 bg-[#121019] transition-all duration-300 hover:border-[#8c52ff]/50 hover:shadow-[0_20px_60px_rgba(89,33,199,0.16)]"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={programme.image}
                    alt={programme.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#09070e] via-black/10 to-transparent" />

                  <div className="absolute left-6 top-6 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur">
                    Programme {programme.number}
                  </div>

                  <div className="absolute bottom-5 left-6 right-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#c4a8ff]">
                      {programme.level}
                    </p>
                    <h3 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                      {programme.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <p className="text-sm leading-7 text-gray-300 sm:text-base">
                    {programme.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {programme.topics.map((topic) => (
                      <span
                        key={topic}
                        className="rounded-full border border-[#8c52ff]/20 bg-[#5921c7]/15 px-3 py-1.5 text-xs font-semibold text-[#c4a8ff]"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  <div className="mt-7 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">
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
                        size={17}
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

      {/* TECHNOLOGY AREAS */}
      <section className="bg-white px-5 py-20 text-[#17121f] sm:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mx-auto mb-14 max-w-3xl text-center"
          >
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#5921c7]">
              Explore technology
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
              A world of technologies to discover.
            </h2>
            <p className="mt-5 text-base leading-7 text-gray-600 sm:text-lg">
              Students explore a range of interconnected technology domains
              through concepts, experiments and project-based activities.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {technologyAreas.map((area, index) => (
              <motion.div
                key={area.title}
                variants={itemVariants}
                className="group rounded-3xl border border-gray-200 bg-[#faf9fc] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#8c52ff]/50 hover:bg-white hover:shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5921c7]/10 text-[#5921c7] transition-all group-hover:bg-[#5921c7] group-hover:text-white">
                    <area.icon size={27} />
                  </div>
                  <span className="text-3xl font-black text-gray-100 transition-colors group-hover:text-[#8c52ff]/20">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-black text-[#21172f]">
                  {area.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-gray-600">
                  {area.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* LEARNING JOURNEY */}
      <section className="relative overflow-hidden bg-[#09070e] px-5 py-20 sm:px-8 md:py-28">
        <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#5921c7]/20 blur-[130px]" />

        <div className="relative mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-16 max-w-3xl"
          >
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#b99aff]">
              The learning journey
            </span>
            <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl md:text-5xl">
              From understanding concepts
              <span className="block text-[#a77aff]">
                to creating something real.
              </span>
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-400">
              A practical learning cycle that encourages students to question,
              explore, build and improve.
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-[8%] right-[8%] top-10 hidden h-px bg-gradient-to-r from-transparent via-[#8c52ff]/60 to-transparent lg:block" />

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7"
            >
              {learningStages.map((stage) => (
                <motion.div
                  key={stage.number}
                  variants={itemVariants}
                  className="group"
                >
                  <div className="relative z-10 mb-7 flex h-20 w-20 items-center justify-center rounded-2xl border border-[#8c52ff]/30 bg-[#171020] text-[#b99aff] shadow-[0_0_35px_rgba(140,82,255,0.10)] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#b99aff] group-hover:bg-[#5921c7] group-hover:text-white">
                    <stage.icon size={29} />
                    <span className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full border-4 border-[#09070e] bg-[#8c52ff] text-xs font-black text-white">
                      {stage.number}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white transition-colors group-hover:text-[#b99aff]">
                    {stage.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-gray-400">
                    {stage.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* STUDENT OUTCOMES */}
      <section className="bg-[#f6f4fa] px-5 py-20 text-[#17121f] sm:px-8 md:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#5921c7]">
              Beyond the classroom
            </span>
            <h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl md:text-5xl">
              Skills that go beyond knowing.
            </h2>
            <p className="mt-6 text-base leading-8 text-gray-600">
              Our focus is not simply introducing students to new technologies.
              It is helping them develop the ability to understand concepts,
              apply knowledge, work through challenges and create meaningful
              solutions.
            </p>

            <div className="mt-8 flex items-center gap-4 rounded-2xl border border-[#5921c7]/15 bg-white p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#5921c7]/10 text-[#5921c7]">
                <Target size={24} />
              </div>
              <div>
                <p className="font-bold text-[#21172f]">
                  Learning with purpose
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Concepts connected to practical applications.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid gap-3 sm:grid-cols-2"
          >
            {outcomes.map((outcome, index) => (
              <motion.div
                key={outcome}
                variants={itemVariants}
                className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:border-[#8c52ff]/40 hover:shadow-md"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#5921c7]/10 text-[#5921c7]">
                  <CheckCircle2 size={17} />
                </span>
                <p className="text-sm font-semibold leading-6 text-gray-700">
                  {outcome}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* BOOTCAMP HIGHLIGHTS */}
      <section className="bg-white px-5 py-20 text-[#17121f] sm:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mx-auto mb-12 max-w-3xl text-center"
          >
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#5921c7]">
              The Adroiit difference
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
              Bootcamp highlights.
            </h2>
            <p className="mt-5 text-base leading-7 text-gray-600">
              A learning experience designed to make technology engaging,
              accessible and practical.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {highlights.map((item) => (
              <motion.div
                key={item.title}
                variants={itemVariants}
                className="group flex gap-4 rounded-3xl border border-gray-200 bg-[#faf9fc] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#8c52ff]/40 hover:bg-white hover:shadow-lg"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#5921c7]/10 text-[#5921c7] transition-all group-hover:bg-[#5921c7] group-hover:text-white">
                  <item.icon size={23} />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#21172f]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* INSTITUTIONAL PARTNERSHIPS */}
      <section className="bg-[#f6f4fa] px-5 py-20 text-[#17121f] sm:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mx-auto mb-12 max-w-3xl text-center"
          >
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#5921c7]">
              For schools and institutions
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
              Bring hands-on technology learning to your institution.
            </h2>
            <p className="mt-5 text-base leading-7 text-gray-600">
              Collaborate with Adroiit Technovations to explore STEM learning
              programmes that complement your institution's educational
              objectives.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid gap-5 md:grid-cols-3"
          >
            {institutionalBenefits.map((benefit) => (
              <motion.div
                key={benefit.title}
                variants={itemVariants}
                className="rounded-3xl border border-gray-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#8c52ff]/40 hover:shadow-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5921c7]/10 text-[#5921c7]">
                  <benefit.icon size={26} />
                </div>
                <h3 className="mt-6 text-xl font-black text-[#21172f]">
                  {benefit.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-gray-600">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative isolate overflow-hidden bg-[#08060e] px-5 py-20 sm:px-8 md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(89,33,199,0.25),transparent_65%)]" />
        <div className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-[#5921c7]/20 blur-[100px]" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-[#8c52ff]/15 blur-[100px]" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="relative mx-auto max-w-4xl text-center"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#8c52ff]/30 bg-[#5921c7]/20 text-[#c4a8ff]">
            <Rocket size={31} />
          </div>

          <span className="mt-7 block text-xs font-black uppercase tracking-[0.25em] text-[#b99aff]">
            Start something extraordinary
          </span>

          <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-6xl">
            Ready to inspire the
            <span className="block bg-gradient-to-r from-[#a77aff] to-[#d3bdff] bg-clip-text text-transparent">
              next generation of innovators?
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-gray-400 sm:text-lg">
            Give your students the opportunity to explore, experiment and
            create. Partner with Adroiit Technovations to bring structured,
            mentor-guided STEM bootcamps to your institution.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#8c52ff] px-7 py-4 text-sm font-bold text-white shadow-[0_10px_40px_rgba(140,82,255,0.25)] transition-all hover:-translate-y-1 hover:bg-[#7440e8] sm:w-auto"
            >
              <Rocket size={19} />
              Organize a Bootcamp
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/contact"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-7 py-4 text-sm font-bold text-white transition-all hover:border-[#8c52ff] hover:bg-white/5 sm:w-auto"
            >
              Talk to Our Team
              <MoveUpRight size={17} />
            </Link>
          </div>

          <div className="mt-8 inline-flex items-center gap-2 text-xs font-medium text-gray-500">
            <CheckCircle2 size={15} className="text-[#a77aff]" />
            Let's plan a learning experience for your students
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}