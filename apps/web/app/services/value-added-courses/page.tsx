"use client";

import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Award,
  BarChart3,
  FileText,
  Zap,
  CheckCircle2,
  GraduationCap,
  Layers3,
  Target,
  Lightbulb,
  Cpu,
  BriefcaseBusiness,
  Users,
  Rocket,
  ClipboardCheck,
  Presentation,
  Building2,
  BadgeCheck,
  Wrench,
  Code2,
  Workflow,
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
      duration: 0.75,
      ease: "easeOut",
      staggerChildren: 0.12,
    } as any,
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.65,
      ease: "easeOut",
    } as any,
  }),
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.07,
      duration: 0.55,
      ease: "easeOut",
    } as any,
  }),
};

export default function ValueAddedCoursesPage() {
  const courseList = [
    {
      image: "/vac/3d-cad.jpg",
      number: "01",
      title: "3D Design & Modelling",
      desc: "Develop skills in creating precise digital models using industry-standard design tools.",
      category: "Digital Design",
      icon: <Layers3 size={18} />,
    },
    {
      image: "/vac/3d-printing.jpg",
      number: "02",
      title: "Additive Manufacturing & 3D Printing",
      desc: "Learn modern manufacturing techniques to transform digital designs into functional prototypes.",
      category: "Advanced Manufacturing",
      icon: <Wrench size={18} />,
    },
    {
      image: "/vac/embedded.jpg",
      number: "03",
      title: "Embedded Systems & IoT",
      desc: "Understand the integration of hardware and software to develop smart, connected systems.",
      category: "Electronics & Technology",
      icon: <Cpu size={18} />,
    },
    {
      image: "/vac/pcb.jpg",
      number: "04",
      title: "PCB Design & Prototyping",
      desc: "Learn to design, develop and prototype professional Printed Circuit Boards (PCBs) for electronic applications.",
      category: "Electronics Design",
      icon: <Workflow size={18} />,
    },
    {
      image: "/vac/drone.jpg",
      number: "05",
      title: "Drone Technology",
      desc: "Gain practical knowledge of UAV systems, including design, flight control and real-world applications.",
      category: "Emerging Technology",
      icon: <Rocket size={18} />,
    },
    {
      image: "/vac/ai.jpg",
      number: "06",
      title: "Artificial Intelligence",
      desc: "Explore machine learning and data-driven technologies to build intelligent applications.",
      category: "Intelligent Systems",
      icon: <Code2 size={18} />,
    },
  ];

  const highlights = [
    {
      title: "Curriculum-Integrated Learning",
      desc: "Programs designed to complement academic learning and institutional curricula.",
      icon: <BookOpen size={23} />,
    },
    {
      title: "Standardized Certification",
      desc: "Structured learning pathways with certification upon successful completion.",
      icon: <Award size={23} />,
    },
    {
      title: "Project-based Assessments",
      desc: "Practical evaluation through assignments, prototypes and applied projects.",
      icon: <BarChart3 size={23} />,
    },
    {
      title: "Industry Mentorship Program",
      desc: "Guidance from technology practitioners to connect learning with industry.",
      icon: <GraduationCap size={23} />,
    },
    {
      title: "Placement Assistance Modules",
      desc: "Career-oriented learning modules to support professional readiness.",
      icon: <CheckCircle2 size={23} />,
    },
    {
      title: "Comprehensive Course Material",
      desc: "Structured learning resources to support classroom and practical sessions.",
      icon: <FileText size={23} />,
    },
  ];

  const learningSteps = [
    {
      number: "01",
      title: "Learn",
      subtitle: "Build the foundation",
      desc: "Understand fundamental concepts, principles and technologies through structured instruction and guided learning.",
      icon: <BookOpen size={25} />,
    },
    {
      number: "02",
      title: "Apply",
      subtitle: "Gain practical experience",
      desc: "Translate theoretical knowledge into practical skills through guided exercises, tools and technology demonstrations.",
      icon: <Wrench size={25} />,
    },
    {
      number: "03",
      title: "Build",
      subtitle: "Create real solutions",
      desc: "Develop prototypes, technical projects and working models that demonstrate applied understanding.",
      icon: <Lightbulb size={25} />,
    },
    {
      number: "04",
      title: "Demonstrate",
      subtitle: "Showcase your skills",
      desc: "Present project outcomes, demonstrate technical competencies and receive structured feedback.",
      icon: <Presentation size={25} />,
    },
  ];

  const institutionalBenefits = [
    {
      title: "Enhanced Academic Value",
      desc: "Complement existing academic programs with emerging technology and practical learning opportunities.",
      icon: <Building2 size={23} />,
    },
    {
      title: "Improved Student Employability",
      desc: "Help students develop relevant technical competencies and professional confidence.",
      icon: <BriefcaseBusiness size={23} />,
    },
    {
      title: "Practical Learning Ecosystem",
      desc: "Introduce project-based learning, hands-on activities and technology-driven experiences.",
      icon: <Target size={23} />,
    },
    {
      title: "Faculty & Student Development",
      desc: "Encourage continuous learning, technical exposure and collaborative development.",
      icon: <Users size={23} />,
    },
  ];

  const studentOutcomes = [
    "Applied understanding of emerging technologies",
    "Practical experience with relevant tools and platforms",
    "Technical project development and documentation",
    "Problem-solving and analytical thinking",
    "Presentation and demonstration experience",
    "Greater awareness of industry applications",
  ];

  const implementationSteps = [
    {
      number: "01",
      title: "Institutional Discussion",
      desc: "Understand the institution's academic objectives, student requirements and program expectations.",
      icon: <Users size={22} />,
    },
    {
      number: "02",
      title: "Program Customization",
      desc: "Identify suitable technology domains, learning outcomes, duration and delivery structure.",
      icon: <ClipboardCheck size={22} />,
    },
    {
      number: "03",
      title: "Training & Execution",
      desc: "Conduct structured sessions with practical activities, demonstrations and project development.",
      icon: <Zap size={22} />,
    },
    {
      number: "04",
      title: "Assessment & Certification",
      desc: "Evaluate student learning through practical outcomes, project reviews and completion assessments.",
      icon: <BadgeCheck size={22} />,
    },
  ];

  return (
    <div className={`${bricolage.className} overflow-x-hidden bg-white text-[#17151c]`}>
      {/* ======================================================
          SECTION 01 — HERO | DARK
      ====================================================== */}
      <section className="relative isolate overflow-hidden bg-[#090711] px-6 pb-20 pt-35 text-white md:pb-28 md:pt-35">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#8c52ff]/20 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-48 -left-40 h-[450px] w-[450px] rounded-full bg-[#5921c7]/20 blur-[110px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:55px_55px]" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          className="relative z-10 mx-auto grid max-w-[1240px] items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16"
        >
          <div className="flex flex-col items-start">
            <motion.div
              custom={0}
              variants={fadeUp}
              className="mb-5"
            >
              <span className="text-[14px] font-bold uppercase tracking-[0.16em] text-[#c4aaff]">
                ACADEMIC EXCELLENCE THROUGH
              </span>
            </motion.div>

            <motion.h1
              custom={1}
              variants={fadeUp}
              className="max-w-2xl text-[32px] font-extrabold leading-[1.12] tracking-tight text-white"
            >
              Value Added Courses (VACs)
              <span className="mt-2 block bg-gradient-to-r from-[#5921c7] via-[#8c52ff] to-[#b28aff] bg-clip-text text-transparent">
                Career-Focused Skill Development 
              </span>
            </motion.h1>

            <motion.div
              custom={2}
              variants={fadeUp}
              className="my-7 h-1.5 w-20 rounded-full bg-gradient-to-r from-[#8c52ff] to-[#a77bff]"
            />

            <motion.p
              custom={3}
              variants={fadeUp}
              className="max-w-xl text-[18px] leading-relaxed text-white"
            >
              Adroiit Technovations partners with institutions and universities
              to offer in-demand Value Added Courses (VACs) across different emerging domains. 
              
            </motion.p>

            <motion.p
              custom={4}
              variants={fadeUp}
              className="mt-5 max-w-xl text-[18px] leading-8 text-white"
            >
              Our courses are designed in accordance with the industry demands thereby
              enhancing the employability of the students. The courses are curated 
              specifically for stronger foundations and practical learning. 
            </motion.p>

            <motion.div
              custom={5}
              variants={fadeUp}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 rounded-full bg-[#5921c7] px-7 py-4 text-[14px] font-bold text-white shadow-xl shadow-[#5921c7]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#4516a5] hover:shadow-[#5921c7]/30"
              >
                Partner with us
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>

          {/* Mobile Hero Image */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={6}
            className="my-7 w-full lg:hidden"
          >
            <div className="relative aspect-[16/10] w-full">
              <div className="absolute -inset-4 rounded-[35px] bg-[#8c52ff]/20 blur-2xl" />

              <div className="relative h-full w-full overflow-hidden rounded-[28px] border border-white/10 bg-[#111111] shadow-2xl">
                <Image
                  src="/vac.png"
                  alt="Value Added Courses at Adroiit Technovations"
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </motion.div>

          {/* Desktop Hero Image */}
          <motion.div
            custom={6}
            variants={fadeUp}
            className="relative mx-auto hidden w-full max-w-[700px] lg:block"
          >
            <div className="relative overflow-hidden rounded-[2rem]">
              <div className="relative aspect-[6/3.5] overflow-hidden rounded-[2rem] bg-[#171020]">
                <Image
                  src="/vac.png"
                  alt="Value Added Courses at Adroiit Technovations"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 700px"
                  className="object-contain"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ======================================================
          SECTION 02 — COURSE DOMAINS | LIGHT
      ====================================================== */}
      <section id="courses" className="relative isolate overflow-hidden bg-[#f8f7fb] px-6 py-10 text-[#17151c] md:py-10">
        <div className="pointer-events-none absolute -left-40 top-0 h-[450px] w-[450px] rounded-full bg-[#5921c7]/[0.07] blur-[140px]" />
        <div className="pointer-events-none absolute -bottom-48 right-0 h-[500px] w-[500px] rounded-full bg-[#8c52ff]/[0.07] blur-[150px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:60px_60px]" />

        <div className="relative z-10 mx-auto max-w-[1050px]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
            className="mb-6 flex flex-col items-center text-center"
          >
            <motion.div
              custom={0}
              variants={fadeUp}
              className="mb-2"
            >
              <span className="text-[13px] font-bold uppercase tracking-[0.18em] text-[#5921c7]">
                Explore our courses
              </span>
            </motion.div>

            <motion.h2
              custom={1}
              variants={fadeUp}
              className="text-[30px] font-extrabold tracking-tight leading-9 text-[#211a2c]"
            >
              Emerging Technological Domains That
              <br></br>
              <span className="bg-gradient-to-r from-[#5921c7] to-[#8c52ff] bg-clip-text text-transparent">
                Industries Look Out For
              </span>
            </motion.h2>

            <motion.p
              custom={2}
              variants={fadeUp}
              className="mt-2 max-w-2xl text-[16px] leading-7 text-gray-900"
            >
              Explore specialized programs designed to help students gain
              practical expertise in technologies shaping modern industries.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courseList.map((course, i) => (
              <motion.article
                key={course.number}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                variants={cardVariants}
                whileHover={{ y: -8 }}
                className="group relative mx-auto w-full max-w-[360px] overflow-hidden rounded-[1.25rem] border border-[#e9e3f1] bg-white p-2 transition-all duration-500 hover:-translate-y-1 hover:border-[#b99bff] hover:shadow-[0_16px_40px_-25px_rgba(89,33,199,0.25)]"
              >
                <div className="relative aspect-[16/9] overflow-hidden rounded-[0.9rem] bg-[#f3edff]">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="px-2 pb-3 pt-4">
                  <div className="mb-2 flex items-center gap-2 text-[#5921c7]">
                    {course.icon}
                    <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#5921c7]">
                      {course.category}
                    </p>
                  </div>

                  <h3 className="min-h-[22px] text-[17px] font-bold leading-snug text-[#5921c7] transition-colors duration-300 group-hover:text-[#5921c7]">
                    {course.title}
                  </h3>

                  <p className="mt-2 text-[14px] leading-6 text-gray-900">
                    {course.desc}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================
          SECTION 03 — BEYOND CLASSROOM | DARK
      ====================================================== */}
      <section className="relative overflow-hidden bg-[#100b1b] px-6 py-10 text-white md:py-10">
        <div className="pointer-events-none absolute -right-40 top-0 h-[450px] w-[450px] rounded-full bg-[#8c52ff]/10 blur-[130px]" />

        <div className="relative z-10 mx-auto grid max-w-[1240px] items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
          >
            <motion.div
              custom={0}
              variants={fadeUp}
              className="mb-5"
            >
              <span className="text-[12px] font-bold uppercase tracking-[0.16em] text-[#b99bff]">
                Beyond classroom learning
              </span>
            </motion.div>

            <motion.h2
              custom={1}
              variants={fadeUp}
              className="text-[32px] font-extrabold leading-tight tracking-tight text-white"
            >
              Preparing Students for the
              <br></br>
              <span className="bg-gradient-to-r from-[#a77bff] to-[#d3bfff] bg-clip-text text-transparent">
                Evolving Industry
              </span>
            </motion.h2>

            <motion.p
              custom={2}
              variants={fadeUp}
              className="mt-6 text-[16px] leading-8 text-[#b7b1c1]"
            >
              Academic foundations are essential. But the ability to apply
              knowledge, work with modern technologies and solve practical
              problems is what helps students stand out in a competitive
              professional environment.
            </motion.p>

            <motion.p
              custom={3}
              variants={fadeUp}
              className="mt-4 text-[16px] leading-8 text-[#b7b1c1]"
            >
              Our Value Added Courses complement institutional learning with
              focused technology training, practical activities and
              project-oriented experiences.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            {[
              {
                icon: <BookOpen size={23} />,
                title: "Academic Foundation",
                desc: "Build upon the knowledge students gain through their core academic subjects.",
              },
              {
                icon: <Cpu size={23} />,
                title: "Technology Exposure",
                desc: "Introduce students to modern tools, platforms and emerging technology domains.",
              },
              {
                icon: <Wrench size={23} />,
                title: "Practical Competence",
                desc: "Encourage learning through experimentation, implementation and hands-on tasks.",
              },
              {
                icon: <Rocket size={23} />,
                title: "Career Readiness",
                desc: "Develop technical confidence and an understanding of real-world applications.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                custom={i}
                variants={fadeUp}
                whileHover={{ y: -5 }}
                className="rounded-2xl border border-white/10 bg-white/[0.045] p-6 shadow-sm transition-all duration-300 hover:border-[#8c52ff]/50 hover:bg-white/[0.075]"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#5921c7] text-white shadow-lg shadow-[#5921c7]/20">
                  {item.icon}
                </div>
                <h3 className="text-[18px] font-bold text-white">{item.title}</h3>
                <p className="mt-3 text-[14px] leading-7 text-[#b7b1c1]">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ======================================================
          SECTION 04 — LEARNING METHODOLOGY | LIGHT
      ====================================================== */}
      <section className="relative overflow-hidden bg-white px-6 py-10 text-[#17151c] md:py-10">
        <div className="pointer-events-none absolute -left-40 top-20 h-[400px] w-[400px] rounded-full bg-[#5921c7]/[0.06] blur-[130px]" />
        <div className="pointer-events-none absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full bg-[#8c52ff]/[0.06] blur-[140px]" />

        <div className="relative z-10 mx-auto max-w-[1280px]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
            className="mx-auto mb-6 max-w-3xl text-center"
          >
            <motion.p
              custom={0}
              variants={fadeUp}
              className="text-[13px] font-bold uppercase tracking-[0.2em] text-[#8c52ff]"
            >
              Our learning methodology
            </motion.p>

            <motion.h2
              custom={1}
              variants={fadeUp}
              className="mt-2 text-[30px] font-extrabold tracking-tight text-[#211a2c]"
            >
              From Concepts to{" "}
              <span className="bg-gradient-to-r from-[#5921c7] to-[#8c52ff] bg-clip-text text-transparent">
                Real-World Creation
              </span>
            </motion.h2>

            <motion.p
              custom={2}
              variants={fadeUp}
              className="mt-2 text-[16px] leading-7 text-gray-900"
            >
              A structured learning journey that moves students from
              understanding concepts to applying knowledge and demonstrating
              their capabilities.
            </motion.p>
          </motion.div>

          <div className="relative grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {learningSteps.map((step, i) => (
              <motion.div
                key={step.number}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                variants={cardVariants}
                className="relative rounded-2xl border border-[#e9e3f1] bg-[#fbfaff] p-7 transition-all duration-300 hover:-translate-y-2 hover:border-[#b99bff] hover:bg-white hover:shadow-lg"
              >
                <div className="relative z-10 mb-7 flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#8c52ff]/20 bg-[#8c52ff]/10 text-[#5921c7]">
                    {step.icon}
                  </div>
                  <span className="text-[30px] font-extrabold tracking-tight text-[#d9d0e8]">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-[20px] font-bold text-[#282130]">{step.title}</h3>
                <p className="mt-1 text-[12px] font-bold uppercase tracking-wider text-[#5921c7]">
                  {step.subtitle}
                </p>
                <p className="mt-2 text-[14px] leading-7 text-gray-900">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================
          SECTION 05 — PARTNERSHIP BENEFITS | DARK
      ====================================================== */}
      <section className="relative isolate overflow-hidden bg-[#090711] px-6 py-10 text-white md:py-10">
        <div className="pointer-events-none absolute -right-40 top-0 h-[450px] w-[450px] rounded-full bg-[#8c52ff]/10 blur-[130px]" />

        <div className="relative z-10 mx-auto max-w-[1240px]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
            className="mb-6 text-center"
          >
            <motion.p
              custom={0}
              variants={fadeUp}
              className="text-[13px] font-bold uppercase tracking-[0.2em] text-[#b99bff]"
            >
              A partnership that creates value
            </motion.p>

            <motion.h2
              custom={1}
              variants={fadeUp}
              className="mt-3 text-[32px] font-extrabold tracking-tight text-white"
            >
              Benefits for{" "}
              <span className="bg-gradient-to-r from-[#5921c7] to-[#a77bff] bg-clip-text text-transparent">
                Institutions
              </span>
            </motion.h2>

            <motion.p
              custom={2}
              variants={fadeUp}
              className="mx-auto mt-2 max-w-2xl text-[16px] leading-7 text-gray-200"
            >
              Strengthen your institution's academic ecosystem with programs
              that connect classroom knowledge to practical technology
              applications.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {institutionalBenefits.map((item, i) => (
              <motion.div
                key={item.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                variants={cardVariants}
                whileHover={{ y: -6 }}
                className="group rounded-2xl border border-white/10 bg-white/[0.045] p-7 transition-all duration-300 hover:border-[#8c52ff]/50 hover:bg-white/[0.075]"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#5921c7] to-[#8c52ff] text-white shadow-lg shadow-[#5921c7]/20 transition-transform duration-300 group-hover:scale-110">
                  {item.icon}
                </div>

                <h3 className="text-[18px] font-bold leading-snug text-white">
                  {item.title}
                </h3>

                <p className="mt-3 text-[14px] leading-7 text-[#b7b1c1]">{item.desc}</p>

                <div className="mt-6 h-1 w-9 rounded-full bg-[#8c52ff]/50 transition-all duration-300 group-hover:w-14 group-hover:bg-[#8c52ff]" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================
          SECTION 06 — STUDENT OUTCOMES | LIGHT
      ====================================================== */}
      <section className="relative overflow-hidden bg-[#f8f7fb] px-6 py-10 text-[#17151c] md:py-10">
        <div className="pointer-events-none absolute -left-40 top-0 h-[450px] w-[450px] rounded-full bg-[#5921c7]/[0.07] blur-[140px]" />
        <div className="pointer-events-none absolute -bottom-48 right-0 h-[450px] w-[450px] rounded-full bg-[#8c52ff]/[0.07] blur-[140px]" />

        <div className="relative z-10 mx-auto grid max-w-[1300px] items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
          >
            <motion.p
              custom={0}
              variants={fadeUp}
              className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#7d55c5]"
            >
              Learning outcomes
            </motion.p>

            <motion.h2
              custom={1}
              variants={fadeUp}
              className="mt-5 text-[32px] font-extrabold leading-tight tracking-tight text-[#211a2c]"
            >
              Skills That Go{" "}
              <span className="bg-gradient-to-r from-[#5921c7] to-[#8c52ff] bg-clip-text text-transparent">
                Beyond the Classroom
              </span>
            </motion.h2>

            <motion.p
              custom={2}
              variants={fadeUp}
              className="mt-6 text-[16px] leading-8 text-[#77717f]"
            >
              Our programs emphasize the application of knowledge. Students
              engage with tools, technology and practical challenges to build
              competencies that can support their academic and professional
              journeys.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
            className="rounded-[2rem] border border-[#e9e3f1] bg-white p-7 shadow-sm sm:p-9"
          >
            <motion.h3
              custom={0}
              variants={fadeUp}
              className="mb-7 text-[20px] font-bold text-[#282130]"
            >
              What students work towards
            </motion.h3>

            <div className="space-y-4">
              {studentOutcomes.map((outcome, i) => (
                <motion.div
                  key={outcome}
                  custom={i}
                  variants={fadeUp}
                  className="flex items-start gap-4 border-b border-[#eee8f4] pb-4 last:border-0 last:pb-0"
                >
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#8c52ff]/10 text-[#5921c7]">
                    <CheckCircle2 size={15} />
                  </div>
                  <p className="text-[14px] leading-7 text-[#5f5968]">
                    {outcome}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ======================================================
          SECTION 07 — IMPLEMENTATION PROCESS | DARK
      ====================================================== */}
      <section className="relative isolate overflow-hidden bg-[#100b1b] px-6 py-10 text-white md:py-10">
        <div className="relative z-10 mx-auto max-w-[1240px]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={sectionVariants}
            className="mx-auto mb-6 max-w-3xl text-center"
          >
            <motion.p
              custom={0}
              variants={fadeUp}
              className="text-[13px] font-bold uppercase tracking-[0.2em] text-[#b99bff]"
            >
              Simple. Structured. Collaborative.
            </motion.p>

            <motion.h2
              custom={1}
              variants={fadeUp}
              className="mt-2 text-[32px] font-extrabold tracking-tight text-white"
            >
              How We Work With{" "}
              <span className="bg-gradient-to-r from-[#5921c7] to-[#a77bff] bg-clip-text text-transparent">
                Your Institution
              </span>
            </motion.h2>

            <motion.p
              custom={2}
              variants={fadeUp}
              className="mt-2 text-[16px] leading-7 text-gray-200"
            >
              A collaborative approach from understanding your requirements to
              delivering a structured learning experience.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {implementationSteps.map((step, i) => (
              <motion.div
                key={step.number}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                variants={cardVariants}
                className="relative rounded-2xl border border-white/10 bg-white/[0.045] p-7 transition-all duration-300 hover:-translate-y-2 hover:border-[#8c52ff]/50 hover:bg-white/[0.075]"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#5921c7] text-white shadow-lg shadow-[#5921c7]/20">
                    {step.icon}
                  </div>
                  <span className="text-[30px] font-extrabold text-white/20">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-[18px] font-bold text-white">{step.title}</h3>
                <p className="mt-3 text-[14px] leading-7 text-[#b7b1c1]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================
          SECTION 08 — FINAL CTA | LIGHT
      ====================================================== */}
      <section className="relative isolate overflow-hidden bg-[#f8f7fb] px-6 py-10 md:py-10">

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={sectionVariants}
          className="relative z-10 mx-auto max-w-[1300px] px-7 py-8 text-center sm:px-12 md:py-10"
        >

          <motion.p
            custom={1}
            variants={fadeUp}
            className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#7d55c5]"
          >
            Build future-ready graduates
          </motion.p>

          <motion.h2
            custom={2}
            variants={fadeUp}
            className="mx-auto mt-4 max-w-3xl text-[30px] font-extrabold leading-tight tracking-tight text-[#211a2c]"
          >
            Elevate Your{" "}
            <span className="bg-gradient-to-r from-[#5921c7] to-[#a77bff] bg-clip-text text-transparent">
              Institutional Standards
            </span>
          </motion.h2>

          <motion.p
            custom={3}
            variants={fadeUp}
            className="mx-auto mt-5 max-w-3xl text-[18px] leading-8 text-[#716a7c]"
          >
            Partner with Adroiit Technovations to integrate industry-aligned
            Value Added Courses into your academic curriculum and empower
            students with the practical skills needed to thrive in a
            technology-driven world.
          </motion.p>

          <motion.div
            custom={4}
            variants={fadeUp}
            className="mt-8"
          >
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-[#5921c7] px-8 py-4 text-[14px] font-bold text-white shadow-xl shadow-[#5921c7]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#4516a5] hover:shadow-[#5921c7]/30"
            >
              Request Course Details
            </Link>
          </motion.div>

          <motion.p
            custom={5}
            variants={fadeUp}
            className="mt-6 text-[12px] font-medium tracking-wide text-[#91899d]"
          >
            Let’s collaborate to shape the next generation of innovators.
          </motion.p>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}