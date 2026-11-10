
"use client";

import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Atom,
  BrainCircuit,
  CheckCircle2,
  CircuitBoard,
  Compass,
  Cpu,
  Drone,
  GraduationCap,
  Lightbulb,
  Microscope,
  Puzzle,
  Rocket,
  School,
  Sparkles,
  Target,
  Trophy,
  Users,
  Wrench,
  Zap,
  CalendarCheck,
  Boxes,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Bricolage_Grotesque } from "next/font/google";
import Footer from "@/sections/Footer";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
      staggerChildren: 0.12,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};

const workshopModules = [
  {
    number: "01",
    image: "/stem-workshop/science.jpg",
    title: "Experimenting Science",
    category: "Explore & Discover",
    desc: "Encourages hands-on exploration of scientific concepts through fun and interactive experiments.",
    icon: Microscope,
  },
  {
    number: "02",
    image: "/stem-workshop/electronics.jpg",
    title: "Electronics & Circuits",
    category: "Understand & Build",
    desc: "Builds understanding of electronic components and circuit design through practical learning.",
    icon: CircuitBoard,
  },
  {
    number: "03",
    image: "/stem-workshop/3d-printing.png",
    title: "3D Modelling & Printing",
    category: "Imagine & Create",
    desc: "Introduces digital design and rapid prototyping using 3D modelling and 3D printing technologies.",
    icon: Boxes,
  },
  {
    number: "04",
    image: "/stem-workshop/embedded-systems.jpg",
    title: "Embedded Systems",
    category: "Code & Connect",
    desc: "Focuses on creating smart devices by combining programming with electronic hardware.",
    icon: Cpu,
  },
  {
    number: "05",
    image: "/stem-workshop/robotics.jpg",
    title: "Robotics",
    category: "Design & Innovate",
    desc: "Enables students to design and program robots to perform practical, real-world tasks.",
    icon: Puzzle,
  },
  {
    number: "06",
    image: "/stem-workshop/drone.jpg",
    title: "Drone Technology",
    category: "Explore New Frontiers",
    desc: "Provides exposure to drone technology, operations and its applications in the real world.",
    icon: Drone,
  },
  {
    number: "07",
    image: "/stem-workshop/ai.jpg",
    title: "Artificial Intelligence",
    category: "Think & Transform",
    desc: "Introduces intelligent systems and fundamental AI concepts for building smart applications.",
    icon: BrainCircuit,
  },
];

const learningStages = [
  {
    number: "01",
    title: "Discover",
    subtitle: "Build curiosity",
    description:
      "Students explore new concepts, observe how things work and connect classroom knowledge with the world around them.",
    icon: Lightbulb,
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
    title: "Create",
    subtitle: "Turn ideas into reality",
    description:
      "Students apply what they learn to design, assemble and develop practical models and technology-based projects.",
    icon: Wrench,
  },
  {
    number: "04",
    title: "Present",
    subtitle: "Share their innovation",
    description:
      "They demonstrate their creations, explain how they work and develop confidence in communicating their ideas.",
    icon: Rocket,
  },
];

const highlights = [
  {
    title: "Activity-driven learning",
    description: "Students learn through practical activities and guided experimentation.",
    icon: Wrench,
  },
  {
    title: "Real components and tools",
    description: "Hands-on exposure to the components and technologies used in projects.",
    icon: Cpu,
  },
  {
    title: "Engaging experiences",
    description: "Interactive activities that make complex ideas easier to explore.",
    icon: Sparkles,
  },
  {
    title: "Live demonstrations",
    description: "Demonstrations that turn abstract concepts into something students can see.",
    icon: Zap,
  },
  {
    title: "Career awareness",
    description: "Exposure to emerging technologies and the opportunities they create.",
    icon: Compass,
  },
  {
    title: "Confidence and creativity",
    description: "Opportunities to develop ideas, solve problems and showcase creations.",
    icon: Trophy,
  },
];

const outcomes = [
  "Understand scientific and engineering concepts through practical application.",
  "Develop logical thinking and structured problem-solving skills.",
  "Gain exposure to emerging technologies and their applications.",
  "Build confidence in experimenting, designing and creating.",
  "Develop teamwork and communication through collaborative activities.",
  "Connect classroom learning with real-world challenges.",
];

const partnershipBenefits = [
  {
    title: "Curriculum-aligned experiences",
    description:
      "Workshop activities can be planned around relevant academic concepts and student learning objectives.",
    icon: GraduationCap,
  },
  {
    title: "Multiple technology domains",
    description:
      "Introduce students to a broad range of STEM fields, from scientific experiments to emerging technologies.",
    icon: Atom,
  },
  {
    title: "Practical implementation",
    description:
      "Move beyond presentations and demonstrations with activities that encourage students to build and experiment.",
    icon: CircuitBoard,
  },
  {
    title: "Collaborative learning",
    description:
      "Create opportunities for students to work together, exchange ideas and develop solutions.",
    icon: Users,
  },
];

export default function STEMWorkshopPage() {
  return (
    <div className={`${bricolage.className} bg-white text-[#17131f] overflow-x-hidden`}>
      {/* HERO SECTION */}
      <section className="relative isolate overflow-hidden bg-[#080610] text-white">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:55px_55px]" />
          <div className="absolute -top-48 -right-32 h-[550px] w-[550px] rounded-full bg-[#5921c7]/30 blur-[130px]" />
          <div className="absolute -bottom-64 -left-32 h-[500px] w-[500px] rounded-full bg-[#8c52ff]/20 blur-[130px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={sectionVariants}
              className="relative z-10"
            >
              <motion.div variants={itemVariants}>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#8c52ff]/40 bg-[#8c52ff]/10 px-4 py-2 text-sm font-semibold text-[#c5aaff]">
                  <span className="h-2 w-2 rounded-full bg-[#ffcc00]" />
                  Education through exploration
                </span>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="mt-7 text-4xl sm:text-5xl lg:text-[4.25rem] font-extrabold leading-[1.08] tracking-tight"
              >
                Where Curiosity
                <br />
                Meets <span className="text-[#a77bff]">Innovation.</span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="mt-7 max-w-xl text-lg md:text-xl leading-relaxed text-white/75"
              >
                Interactive STEM Workshops
              </motion.p>

              <motion.p
                variants={itemVariants}
                className="mt-4 max-w-xl text-base md:text-lg leading-relaxed text-white/60"
              >
                Adroiit Technovations delivers hands-on, interactive and
                future-ready STEM workshops designed to ignite curiosity by
                practically implementing STEM concepts.
              </motion.p>

              <motion.p
                variants={itemVariants}
                className="mt-4 max-w-xl text-base leading-relaxed text-white/60"
              >
                We go beyond conventional learning. Students explore,
                experiment and build while developing practical skills and
                discovering the technologies shaping tomorrow.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="mt-9 flex flex-wrap items-center gap-4"
              >
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 rounded-full bg-[#8c52ff] px-7 py-4 font-bold text-white shadow-xl shadow-purple-900/30 transition-all duration-300 hover:-translate-y-1 hover:bg-[#7440e6]"
                >
                  Host a Workshop
                  <ArrowRight size={19} />
                </Link>

                <Link
                  href="#workshops"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-4 font-semibold text-white/85 transition-all hover:border-[#a77bff] hover:text-white"
                >
                  Explore Workshops
                </Link>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/10 pt-7"
              >
                <div>
                  <p className="text-sm font-semibold text-white">Explore</p>
                  <p className="mt-1 text-xs text-white/45">New technologies</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Experiment</p>
                  <p className="mt-1 text-xs text-white/45">Through practical learning</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Create</p>
                  <p className="mt-1 text-xs text-white/45">Real-world projects</p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94, x: 25 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-[#8c52ff]/30 to-[#30106f]/10 blur-2xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/5 p-2 shadow-2xl">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem]">
                  <Image
                    src="/stem-workshop2.png"
                    alt="Students participating in a hands-on STEM workshop"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080610]/65 via-transparent to-transparent" />

                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d5c0ff]">
                      Learn. Build. Innovate.
                    </p>
                    <p className="mt-2 text-xl font-bold text-white md:text-2xl">
                      Experience the joy of making.
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-7 -left-5 hidden sm:flex items-center gap-3 rounded-2xl border border-white/10 bg-[#171020] px-5 py-4 shadow-xl">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#8c52ff]/20 text-[#b995ff]">
                  <Lightbulb size={23} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Curiosity to Creation</p>
                  <p className="text-xs text-white/50">Learning by doing</p>
                </div>
              </div>

              <div className="absolute -right-4 -top-5 hidden sm:flex h-16 w-16 items-center justify-center rounded-2xl border border-[#8c52ff]/30 bg-[#21143b] text-[#c4a5ff] shadow-xl">
                <Atom size={30} />
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#30106f] via-[#8c52ff] to-[#ffcc00]" />
      </section>

      {/* INTRODUCTION */}
      <section className="relative py-20 md:py-24 px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          className="max-w-5xl mx-auto text-center"
        >
          <motion.span
            variants={itemVariants}
            className="text-sm font-bold uppercase tracking-[0.2em] text-[#8c52ff]"
          >
            Rethinking the learning experience
          </motion.span>

          <motion.h2
            variants={itemVariants}
            className="mt-5 text-3xl md:text-5xl font-extrabold leading-tight tracking-tight"
          >
            Not Just Learning About Technology.
            <span className="block text-[#8c52ff]">Learning to Create With It.</span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mx-auto mt-7 max-w-3xl text-base md:text-lg leading-relaxed text-gray-600"
          >
            STEM education becomes meaningful when students get the
            opportunity to apply what they learn. Our workshops bring
            science, technology, engineering and mathematics together through
            interactive activities that encourage exploration, creativity
            and practical problem-solving.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            {[
              { label: "Science", icon: Atom },
              { label: "Technology", icon: Cpu },
              { label: "Engineering", icon: Wrench },
              { label: "Mathematics", icon: Target },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-5"
                >
                  <Icon size={21} className="text-[#8c52ff]" />
                  <span className="text-sm font-bold text-gray-800">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </motion.div>
        </motion.div>
      </section>

      {/* WORKSHOP DOMAINS */}
      <section
        id="workshops"
        className="relative overflow-hidden bg-[#090711] px-6 py-20 md:py-28 text-white"
      >
        <div className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-[#5921c7]/20 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[#8c52ff]/10 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariants}
            className="mb-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
          >
            <div>
              <motion.span
                variants={itemVariants}
                className="text-sm font-bold uppercase tracking-[0.2em] text-[#b995ff]"
              >
                Explore the possibilities
              </motion.span>
              <motion.h2
                variants={itemVariants}
                className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight"
              >
                Our Workshop <span className="text-[#a77bff]">Domains</span>
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="mt-5 max-w-2xl text-base md:text-lg leading-relaxed text-white/55"
              >
                A diverse range of technical experiences that introduce
                students to the concepts, tools and possibilities of modern
                STEM fields.
              </motion.p>
            </div>

            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
                <Sparkles size={16} className="text-[#b995ff]" />
                7 Learning Domains
              </span>
            </motion.div>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {workshopModules.map((module, index) => {
              const Icon = module.icon;

              return (
                <motion.article
                  key={module.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.55, delay: index * 0.07 }}
                  whileHover={{ y: -7 }}
                  className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#15121f] transition-all duration-300 hover:border-[#8c52ff]/60 hover:shadow-2xl hover:shadow-purple-950/30"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={module.image}
                      alt={module.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090711]/80 via-transparent to-transparent" />

                    <div className="absolute left-5 top-5 flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-black/35 text-sm font-bold text-white backdrop-blur-md">
                      {module.number}
                    </div>

                    <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                      <span className="rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-md">
                        {module.category}
                      </span>
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8c52ff] text-white shadow-lg">
                        <Icon size={20} />
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white transition-colors group-hover:text-[#b995ff]">
                      {module.title}
                    </h3>
                    <p className="mt-3 min-h-[72px] text-sm leading-relaxed text-white/55">
                      {module.desc}
                    </p>
                    <div className="mt-5 h-px w-full bg-white/10" />
                    <div className="mt-4 flex items-center justify-between text-xs font-semibold text-white/40">
                      <span>STEM WORKSHOP</span>
                      <span className="flex items-center gap-1 text-[#b995ff]">
                        Explore <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* LEARNING JOURNEY */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariants}
            className="mx-auto mb-16 max-w-3xl text-center"
          >
            <motion.span
              variants={itemVariants}
              className="text-sm font-bold uppercase tracking-[0.2em] text-[#8c52ff]"
            >
              The Adroiit learning approach
            </motion.span>
            <motion.h2
              variants={itemVariants}
              className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight"
            >
              From <span className="text-[#8c52ff]">Curiosity</span> to Creation
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="mt-5 text-base md:text-lg leading-relaxed text-gray-600"
            >
              Every learning experience should give students the opportunity
              to understand, apply and express their ideas. Our approach
              brings that process to life.
            </motion.p>
          </motion.div>

          <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="absolute left-[12%] right-[12%] top-12 hidden h-px bg-gradient-to-r from-[#d9c7ff] via-[#8c52ff] to-[#d9c7ff] lg:block" />

            {learningStages.map((stage, index) => {
              const Icon = stage.icon;

              return (
                <motion.div
                  key={stage.number}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.12, duration: 0.55 }}
                  className="relative z-10 text-center"
                >
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] border border-[#e7dcff] bg-white text-[#8c52ff] shadow-lg shadow-purple-100 transition-all duration-300 hover:-translate-y-2 hover:bg-[#8c52ff] hover:text-white">
                    <Icon size={34} strokeWidth={1.7} />
                  </div>

                  <p className="mt-6 text-xs font-bold tracking-[0.2em] text-[#8c52ff]">
                    STEP {stage.number}
                  </p>
                  <h3 className="mt-2 text-2xl font-extrabold">
                    {stage.title}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-gray-500">
                    {stage.subtitle}
                  </p>
                  <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-gray-600">
                    {stage.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* STUDENT OUTCOMES */}
      <section className="relative overflow-hidden bg-[#f7f5fb] px-6 py-20 md:py-28">
        <div className="absolute -right-40 top-0 h-96 w-96 rounded-full bg-[#8c52ff]/10 blur-[110px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#8c52ff]">
              Beyond the workshop
            </span>
            <h2 className="mt-4 text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
              Learning That Builds
              <span className="block text-[#8c52ff]">More Than Skills.</span>
            </h2>
            <p className="mt-6 text-base md:text-lg leading-relaxed text-gray-600">
              The value of a STEM workshop goes beyond completing an
              activity. It is about developing the mindset to question,
              investigate, solve problems and approach new challenges with
              confidence.
            </p>

            <div className="mt-9 space-y-4">
              {outcomes.map((outcome, index) => (
                <motion.div
                  key={outcome}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.07 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2
                    size={21}
                    className="mt-0.5 shrink-0 text-[#8c52ff]"
                  />
                  <p className="text-sm md:text-base leading-relaxed text-gray-700">
                    {outcome}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-[#8c52ff]/20 to-transparent blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white bg-white p-3 shadow-xl">
              <div className="relative aspect-[5/4] overflow-hidden rounded-[1.5rem] bg-[#171020]">
                <Image
                  src="/stem-workshop/robotics.jpg"
                  alt="Practical robotics learning"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090711]/80 via-transparent to-transparent" />

                <div className="absolute bottom-7 left-7 right-7">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#8c52ff] text-white">
                    <Rocket size={25} />
                  </div>
                  <h3 className="mt-4 text-2xl md:text-3xl font-bold text-white">
                    Think Beyond the Textbook.
                  </h3>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/70">
                    Give students the space to question, experiment and turn
                    their ideas into something tangible.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WORKSHOP HIGHLIGHTS */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariants}
            className="mx-auto mb-14 max-w-3xl text-center"
          >
            <motion.span
              variants={itemVariants}
              className="text-sm font-bold uppercase tracking-[0.2em] text-[#8c52ff]"
            >
              The Adroiit difference
            </motion.span>
            <motion.h2
              variants={itemVariants}
              className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight"
            >
              What Makes Our Workshops
              <span className="block text-[#8c52ff]">Different?</span>
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="mt-5 text-base md:text-lg leading-relaxed text-gray-600"
            >
              We make technical learning approachable, engaging and
              meaningful through experiences that put students at the centre
              of the learning process.
            </motion.p>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="group rounded-[1.5rem] border border-gray-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#cbb6ff] hover:shadow-xl hover:shadow-purple-100/70"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f2ebff] text-[#8c52ff] transition-colors group-hover:bg-[#8c52ff] group-hover:text-white">
                    <Icon size={25} />
                  </div>
                  <h3 className="mt-6 text-lg font-bold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SCHOOL PARTNERSHIPS */}
      <section className="relative overflow-hidden bg-[#100b1c] px-6 py-20 md:py-28 text-white">
        <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-[#5921c7]/25 blur-[120px]" />
        <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#8c52ff]/15 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#b995ff]">
                For schools & institutions
              </span>
              <h2 className="mt-5 text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
                Bring the Future of
                <span className="block text-[#a77bff]">Learning to Your Campus.</span>
              </h2>
              <p className="mt-6 text-base md:text-lg leading-relaxed text-white/60">
                Partner with Adroiit Technovations to introduce students to
                practical STEM experiences. We work with educational
                institutions to plan engaging workshops around relevant
                learning goals and technology domains.
              </p>

              <Link
                href="/contact"
                className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#8c52ff] px-7 py-4 font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#7440e6]"
              >
                Partner With Us
                <ArrowRight size={19} />
              </Link>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2">
              {partnershipBenefits.map((benefit, index) => {
                const Icon = benefit.icon;

                return (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-6 transition-colors hover:border-[#8c52ff]/50 hover:bg-white/[0.07]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#8c52ff]/20 text-[#c3a5ff]">
                      <Icon size={23} />
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-white">
                      {benefit.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/55">
                      {benefit.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden px-6 py-20 md:py-28">
        <div className="absolute inset-0 bg-[#f8f6fc]" />
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-[#8c52ff]/10 blur-[100px]" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-[#5921c7]/10 blur-[100px]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto max-w-4xl text-center"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#8c52ff] text-white shadow-xl shadow-purple-200">
            <School size={30} />
          </div>

          <p className="mt-7 text-sm font-bold uppercase tracking-[0.2em] text-[#8c52ff]">
            Let's create something extraordinary
          </p>

          <h2 className="mt-4 text-3xl md:text-5xl font-extrabold leading-tight tracking-tight text-[#17131f]">
            Ready to Transform Your
            <span className="block text-[#8c52ff]">School?</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-gray-600">
            Bring industry-relevant technology exposure and hands-on STEM
            learning to your campus. Let's inspire students to explore,
            experiment and become tomorrow's innovators.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 rounded-full bg-[#8c52ff] px-8 py-4 font-bold text-white shadow-lg shadow-purple-200 transition-all duration-300 hover:-translate-y-1 hover:bg-[#7440e6]"
            >
              <CalendarCheck size={20} />
              Book a Workshop
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-8 py-4 font-bold text-gray-800 transition-all hover:border-[#8c52ff] hover:text-[#8c52ff]"
            >
              Discuss a Partnership
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
