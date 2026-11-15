
"use client";

import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Lightbulb,
  Zap,
  Users,
  MessageCircle,
  IndianRupee,
  BrainCircuit,
  BookOpen,
  FileText,
  BookmarkCheck,
  GraduationCap,
  Library,
  Microscope,
  Puzzle,
  Workflow,
  ShieldCheck,
  Wrench,
  Headphones,
  TrendingUp,
  Briefcase,
  MonitorSmartphone,
  School,
  Rocket,
  CheckCircle2,
  Boxes,
  FlaskConical,
  Handshake,
  Layers3,
  Building2,
  ClipboardCheck,
  Lightbulb as Idea,
  Cpu,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Bricolage_Grotesque } from "next/font/google";
import Footer from "@/sections/Footer";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
});

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
      delay: i * 0.08,
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
// EDITABLE SECTION TITLE SIZE (PIXELS)
// ============================================================

const SECTION_TITLE_SIZE = 30;

// ============================================================
// EDITABLE SECTION CONTENT WIDTHS (PIXELS)
// ============================================================

const SECTION_1_CONTENT_WIDTH = 1290; // Hero + Educational Standards
const SECTION_2_CONTENT_WIDTH = 1290; // Why STEAM TIL
const SECTION_3_CONTENT_WIDTH = 1200; // Our Goals with STEAM TIL
const SECTION_4_CONTENT_WIDTH = 1200; // How Students Learn
const SECTION_5_CONTENT_WIDTH = 1200; // Domains of Focus
const SECTION_6_CONTENT_WIDTH = 1200; // Why Adroiit + Institutional Partnership
const SECTION_7_CONTENT_WIDTH = 1200; // Three STEAM Lab Packages
const SECTION_8_CONTENT_WIDTH = 1200; // Frequently Asked Questions
const SECTION_9_CONTENT_WIDTH = 1200; // Final CTA

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
  const titleStyle = light
    ? "bg-gradient-to-r from-[#5921c7] via-[#8c52ff] to-[#5921c7] bg-clip-text text-transparent"
    : "text-white";

  return (
    <div className="mx-auto mb-6 max-w-[850px] text-center">
      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={titleVariants}
        className={`mb-4 text-[13px] font-bold uppercase tracking-[0.25em] sm:text-[12px] ${
          light ? "text-gray-700" : "text-purple-300"
        }`}
      >
        {eyebrow}
      </motion.p>

      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={titleVariants}
        style={{ fontSize: `${SECTION_TITLE_SIZE}px` }}
        className={`${titleStyle} font-black leading-tight tracking-tight`}
      >
        {title}{" "}
        <span className={titleStyle}>{highlight}</span>
      </motion.h2>

      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={descVariants}
        className={`mx-auto mt-3 max-w-[850px] text-[14px] leading-[28px] sm:text-[16px] sm:leading-[30px] ${
          light ? "text-gray-600" : "text-gray-300"
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

export default function STEMLabPage() {
  // ============================================================
  // STEM STATISTICS
  // ============================================================

  const stats = [
    {
      icon: <Briefcase size={21} />,
      number: "60%",
      text: "Of employers report difficulty finding candidates with strong technical and problem-solving skills.",
    },
    {
      icon: <TrendingUp size={21} />,
      number: "70%",
      text: "Of the fastest-growing industries globally are driven by STEM fields.",
    },
    {
      icon: <MonitorSmartphone size={21} />,
      number: "85%",
      text: "Of future job roles require at least basic digital and technical literacy.",
    },
    {
      icon: <School size={21} />,
      number: "65%",
      text: "Of children entering primary school today will work in careers that don't yet exist.",
    },
    {
      icon: <Rocket size={21} />,
      number: "3x",
      text: "STEM occupations are growing up to 3x faster than non-STEM careers worldwide.",
    },
  ];

  // ============================================================
  // EDUCATIONAL STANDARDS
  // ============================================================

  const standards = [
    {
      name: "NEP 2020",
      full: "National Education Policy 2020",
      icon: <BookOpen size={23} />,
    },
    {
      name: "NCF 2023",
      full: "National Curriculum Framework 2023",
      icon: <FileText size={23} />,
    },
    {
      name: "NCERT",
      full: "National Council of Educational Research and Training",
      icon: <Library size={23} />,
    },
    {
      name: "CBSE",
      full: "Central Board of Secondary Education",
      icon: <BookmarkCheck size={23} />,
    },
    {
      name: "ICSE",
      full: "Indian Certificate of Secondary Education",
      icon: <GraduationCap size={23} />,
    },
  ];

  // ============================================================
  // STEM DOMAINS
  // ============================================================

  const domains = [
    {
      image: "/stem-til/electronics.jpg",
      title: "Electronics & Circuits",
      desc: "Builds a strong foundation in understanding electrical components, circuit design and real-world electronic systems.",
    },
    {
      image: "/stem-til/3d-modelling.jpg",
      title: "3D Design & Modelling",
      desc: "Encourages creativity and design thinking through the creation of precise digital 3D models using modern tools.",
    },
    {
      image: "/stem-til/3d-printing.jpg",
      title: "3D Printing",
      desc: "Facilitates rapid prototyping, allowing ideas to be transformed into tangible models and functional parts.",
    },
    {
      image: "/stem-til/embedded-systems.jpg",
      title: "Embedded Systems",
      desc: "Focuses on integrating hardware and software to develop smart, intelligent devices using microcontrollers.",
    },
    {
      image: "/stem-til/robotics.jpg",
      title: "Robotics",
      desc: "Promotes engineering and problem-solving through the design, construction and programming of interactive robotic systems.",
    },
    {
      image: "/stem-til/iot.jpg",
      title: "Internet of Things",
      desc: "Encourages innovation by enabling the development of connected systems with real-world applications.",
    },
    {
      image: "/stem-til/drone.jpg",
      title: "Drone Technology",
      desc: "Introduces aerial systems, covering design, functionality and real-world industry applications.",
    },
    {
      image: "/stem-til/ai.jpg",
      title: "Artificial Intelligence",
      desc: "Introduces future-ready concepts in intelligent systems, automation and data-driven decision making.",
    },
  ];

  // ============================================================
  // OBJECTIVES
  // ============================================================

  const objectives = [
    {
      text: "Bridge the gap between theory and hands-on learning",
      icon: <Workflow size={24} />,
    },
    {
      text: "Promote experiential and interdisciplinary learning",
      icon: <Microscope size={24} />,
    },
    {
      text: "Foster creativity, innovation, teamwork and collaboration",
      icon: <Users size={24} />,
    },
    {
      text: "Support cognitive and practical skill development",
      icon: <BrainCircuit size={24} />,
    },
    {
      text: "Enhance critical thinking and problem-solving skills",
      icon: <Puzzle size={24} />,
    },
  ];

  // ============================================================
  // WHY CHOOSE ADROIIT
  // ============================================================

  const whyChooseItems = [
    {
      icon: <Library size={25} />,
      title: "Structured Curriculum & Course Materials",
      description:
        "Well-designed, grade-appropriate curriculum aligned with practical, hands-on learning outcomes.",
    },
    {
      icon: <IndianRupee size={25} />,
      title: "Customizable & Cost Effective Solutions",
      description:
        "Premium lab setups tailored to institutional needs while ensuring optimal cost efficiency.",
    },
    {
      icon: <ShieldCheck size={25} />,
      title: "High Quality & Standardized Procurement",
      description:
        "Reliable sourcing of industry-grade equipment with consistent quality standards.",
    },
    {
      icon: <Lightbulb size={25} />,
      title: "Interactive & Innovative DIY Kits",
      description:
        "Engaging, hands-on kits that encourage experiential learning and creativity.",
    },
    {
      icon: <Zap size={25} />,
      title: "Progressive & Future-focused Learning",
      description:
        "Curriculum designed to keep pace with emerging technologies and industry trends.",
    },
    {
      icon: <Wrench size={25} />,
      title: "Regular Maintenance & Upgrades",
      description:
        "Continuous support with timely maintenance and technology updates.",
    },
    {
      icon: <GraduationCap size={25} />,
      title: "Efficient & Dedicated Instructors",
      description:
        "Trained instructors and expert mentors ensure effective learning and student engagement.",
    },
    {
      icon: <Headphones size={25} />,
      title: "Friendly & Dedicated Support Team",
      description:
        "Responsive support system for smooth implementation and ongoing assistance.",
    },
  ];

  // ============================================================
  // OUR METHODOLOGY
  // ============================================================

  const methodology = [
    {
      icon: <Lightbulb size={25} />,
      title: "Explore",
      description:
        "Students discover concepts, observe how things work and develop curiosity about the technologies around them.",
      number: "01",
    },
    {
      icon: <FlaskConical size={25} />,
      title: "Experiment",
      description:
        "Learners investigate ideas, work with components and tools, test possibilities and learn through experimentation.",
      number: "02",
    },
    {
      icon: <Wrench size={25} />,
      title: "Build",
      description:
        "Students apply their understanding to design, assemble and program models, prototypes and working projects.",
      number: "03",
    },
    {
      icon: <Rocket size={25} />,
      title: "Innovate",
      description:
        "Learners use their knowledge and creativity to develop solutions, improve ideas and present their innovations.",
      number: "04",
    },
  ];

  // ============================================================
  // INSTITUTIONAL PARTNERSHIP
  // ============================================================

  const partnershipPoints = [
    {
      icon: <Building2 size={19} />,
      text: "Lab solutions tailored to institutional requirements",
    },
    {
      icon: <Layers3 size={19} />,
      text: "Integration of multiple STEAM learning domains",
    },
    {
      icon: <Handshake size={19} />,
      text: "Implementation and continued support partnership",
    },
    {
      icon: <ClipboardCheck size={19} />,
      text: "Structured learning resources and practical activities",
    },
  ];

  const ecosystemItems = [
    {
      icon: <BookOpen size={20} />,
      title: "Curriculum",
      desc: "Structured concepts and learning resources",
    },
    {
      icon: <Boxes size={20} />,
      title: "Infrastructure",
      desc: "Tools, equipment and practical learning kits",
    },
    {
      icon: <MonitorSmartphone size={20} />,
      title: "Technology",
      desc: "Exposure to emerging STEAM domains",
    },
    {
      icon: <Users size={20} />,
      title: "Mentorship",
      desc: "Guidance and support for student learning",
    },
  ];

  // ============================================================
  // THREE STEAM LAB PACKAGES
  // ============================================================

  const labPackages = [
    {
      number: "01",
      name: "Essential Lab",
      subtitle: "Build the foundations",
      description:
        "An introductory STEAM learning environment that helps students understand fundamental scientific and engineering concepts through practical activities.",
      icon: <Lightbulb size={27} />,
      idealFor: "Schools starting their STEAM journey",
      features: [
        "Basic electronics and circuit-building resources",
        "Fundamental science experiment kits",
        "Basic 3D design and modelling exposure",
        "Introductory robotics activities",
        "Foundational STEAM curriculum",
        "Structured activity guides and learning resources",
      ],
    },
    {
      number: "02",
      name: "Elite Lab",
      subtitle: "Develop practical capabilities",
      description:
        "A comprehensive STEAM environment that enables students to explore multiple technology domains and develop practical engineering and programming skills.",
      icon: <Cpu size={27} />,
      idealFor: "Schools seeking a comprehensive STEAM lab",
      featured: true,
      features: [
        "Everything included in Starter Lab",
        "Intermediate electronics and circuit projects",
        "Arduino-based embedded systems learning",
        "3D modelling and 3D printing facilities",
        "Robotics and sensor-based project development",
        "Structured grade-wise curriculum",
        "Practical project and assessment resources",
      ],
    },
    {
      number: "03",
      name: "Advanced Lab",
      subtitle: "Create future-ready innovators",
      description:
        "An advanced innovation environment designed to provide students with opportunities to work on integrated technology projects and explore emerging engineering domains.",
      icon: <Rocket size={27} />,
      idealFor: "Institutions building an advanced innovation ecosystem",
      features: [
        "Everything included in Professional Lab",
        "Advanced embedded systems and IoT projects",
        "Advanced robotics and automation activities",
        "Drone technology learning resources",
        "Artificial intelligence learning exposure",
        "Advanced prototyping and product development",
        "Innovation projects and guided mentoring",
      ],
    },
  ];

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div
      className={`${bricolage.className} relative min-h-screen overflow-hidden bg-white text-[#17131f]`}
    >
      {/* ====================================================== */}
      {/* 1. HERO + EDUCATIONAL STANDARDS */}
      {/* LIGHT THEME */}
      {/* ====================================================== */}

      <section className="relative z-10 overflow-hidden bg-[#faf9fc] pb-8 pt-35 text-[#17131f] md:pb-10 md:pt-35">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-40 -top-40 h-[450px] w-[450px] rounded-full bg-[#8c52ff]/[0.12] blur-[150px]" />
          <div className="absolute -left-40 bottom-0 h-[350px] w-[350px] rounded-full bg-[#5921c7]/[0.10] blur-[140px]" />
        </div>

        <div
          className="relative z-10 mx-auto w-full px-6"
          style={{ maxWidth: `${SECTION_1_CONTENT_WIDTH}px` }}
        >
          <div className="grid items-center gap-9 lg:grid-cols-[1fr_1fr] lg:gap-12">
            {/* HERO CONTENT */}

            <div className="flex w-full flex-col items-start">
              <motion.p
                initial="hidden"
                animate="visible"
                variants={descVariants}
                className="mb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-gray-700 sm:text-[13px] sm:tracking-[0.14em]"
              >
                ESTABLISH A STATE-OF-THE-ART EXPLORATION HUB
              </motion.p>

              <motion.h1
                initial="hidden"
                animate="visible"
                variants={titleVariants}
                className="bg-gradient-to-r from-[#5921c7] via-[#8c52ff] to-[#5921c7] bg-clip-text text-[32px] font-black leading-[1.12] tracking-tight text-transparent sm:text-[40px] lg:text-[36px] xl:text-[30px]"
              >
                STEAM Tinkering and Innovation Lab (TIL)<br></br>
                <span className="bg-clip-text text-[22px] text-[#542ead]">
                  A holistic space for experiential learning and innovation.
                </span>{" "}
              </motion.h1>

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100px" }}
                transition={{
                  duration: 0.8,
                  delay: 0.3,
                  ease: "easeOut",
                }}
                className="mt-4 h-[3px] rounded-full bg-gradient-to-r from-[#8c52ff] to-[#5921c7]"
              />

              <motion.div
                initial="hidden"
                animate="visible"
                variants={descVariants}
                className="mt-5 space-y-5"
              >
                <p className="text-justify text-[15px] font-medium leading-[29px] text-gray-900 sm:text-[17px] sm:leading-[28px]">
                  STEAM Tinkering and Innovation Lab (TIL) is a dynamic and
                  collaborative space where learning meets exploration and
                  creativity meets technology. It is designed to foster
                  curiosity and provides opportunities for discovery, hands-on
                  experimentation and innovation across Science, Technology,
                  Engineering, Arts and Mathematics (S.T.E.A.M).
                </p>
              </motion.div>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={3}
                className="mt-7 flex flex-wrap items-center gap-4"
              >
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#5921c7] to-[#8c52ff] px-6 py-3 text-[14px] font-bold text-white shadow-[0_8px_30px_rgba(140,82,255,0.22)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(140,82,255,0.35)]"
                >
                  Book a Demo
                  <ArrowRight
                    size={19}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

                <Link
                  href="#lab-packages"
                  className="group inline-flex items-center gap-3 rounded-full border border-[#8c52ff]/40 bg-white px-6 py-3 text-[14px] font-bold text-[#5921c7] transition-all duration-300 hover:-translate-y-1 hover:border-[#a981ff] hover:bg-[#5921c7]/20"
                >
                  Explore Packages
                  <ArrowRight
                    size={19}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </motion.div>
            </div>

            {/* HERO IMAGE */}

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="relative w-full"
            >
              <div className="relative aspect-[18/10] w-full overflow-hidden rounded-[28px] border border-[#e9e4f1] bg-[#eeeaf5] shadow-[0_20px_60px_rgba(35,15,70,0.10)] sm:rounded-[32px]">
                <Image
                  src="/stem-til2.png"
                  alt="Students working in the STEAM Tinkering and Innovation Lab"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </motion.div>
          </div>

          {/* EDUCATIONAL STANDARDS */}

          <div className="relative mt-10 border-t border-[#e9e4f1] pt-10 md:mt-10 md:pt-5">
            <div className="grid items-center gap-8 lg:grid-cols-[0.95fr_2.7fr] lg:gap-10">
              {/* STANDARDS INTRO */}

              <div>
                <motion.p
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={titleVariants}
                  className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#30106f]"
                >
                  OUR CURRICULUM ALIGNS WITH
                </motion.p>

                <motion.h2
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={titleVariants}
                  className="bg-gradient-to-r from-[#5921c7] via-[#8c52ff] to-[#5921c7] bg-clip-text text-[25px] font-black leading-tight text-transparent sm:text-[22px]"
                >
                  Educational Standards
                </motion.h2>

                <motion.p
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={descVariants}
                  className="mt-3 text-[12px] leading-[23px] text-gray-900 sm:text-[13px] sm:leading-[18px]"
                >
                  We ensure our curriculum and methodology align with relevant
                  educational frameworks and institutional requirements.
                </motion.p>
              </div>

              {/* STANDARDS CARDS */}

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {standards.map((std, i) => (
                  <motion.div
                    key={std.name}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    variants={fadeUp}
                    viewport={{ once: true }}
                    className="group flex min-h-[150px] flex-col rounded-[20px] border border-[#e9e4f1] bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#8c52ff]/50 hover:bg-[#f7f3ff] hover:shadow-[0_12px_35px_rgba(89,33,199,0.15)] sm:min-h-[158px] sm:p-5"
                  >
                    <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-lg text-[#5921c7] transition-all group-hover:bg-[#5921c7]/20">
                      {std.icon}
                    </div>

                    <h3 className="mb-1 text-[16px] font-black text-[#5921c7] sm:text-[15px]">
                      {std.name}
                    </h3>

                    <p className="text-[9px] font-semibold uppercase leading-[15px] text-gray-900 sm:text-[10px] sm:leading-[14px]">
                      {std.full}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* 2. WHY STEAM TIL */}
      {/* DARK THEME */}
      {/* ====================================================== */}

      <section className="relative z-10 overflow-hidden bg-[#30106f] py-10 text-white md:py-10">
        <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-[#8c52ff]/[0.07] blur-[130px]" />
        <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#5921c7]/[0.06] blur-[130px]" />

        <div
          className="relative mx-auto w-full px-6"
          style={{ maxWidth: `${SECTION_2_CONTENT_WIDTH}px` }}
        >
          <SectionHeading
            eyebrow="THE NEED FOR STEAM EDUCATION"
            title="Why STEAM Tinkering and Innovation Lab?"
            description="A STEAM Tinkering and Innovation Lab provides students with opportunities to connect classroom concepts with real-world applications, develop practical skills and prepare for a technology-driven future."
          />

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {stats.map((item, i) => (
              <motion.div
                key={item.number + i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                variants={fadeUp}
                viewport={{ once: true, amount: 0.2 }}
                className="group relative flex flex-col items-center overflow-hidden rounded-3xl border border-white/[0.10] bg-[#3e1b86] p-5 text-center transition-all duration-300 hover:-translate-y-2 hover:border-[#b99aff]/60 hover:shadow-[0_18px_45px_rgba(89,33,199,0.12)] sm:p-6"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#8c52ff]/20 bg-[#8c52ff]/20 text-[#ffffff] transition-all duration-300 group-hover:bg-[#5921c7] group-hover:text-white">
                  {item.icon}
                </div>

                <h3 className="mb-3 text-[24px] font-black text-[#ffffff] transition-colors group-hover:text-[#ffffff]">
                  {item.number}
                </h3>

                <div className="mb-4 h-[4px] w-8 rounded-full bg-[#8c52ff]/60" />

                <p className="text-[11px] font-medium leading-[21px] text-gray-200 sm:text-[14px] sm:leading-[23px]">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* 3. OUR GOALS WITH STEAM TIL */}
      {/* LIGHT THEME */}
      {/* ====================================================== */}

      <section className="relative z-10 overflow-hidden bg-[#faf9fc] py-10 text-[#17131f] md:py-10">
        <div className="pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full bg-[#8c52ff]/10 blur-[140px]" />
        <div className="pointer-events-none absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-[#5921c7]/[0.12] blur-[140px]" />

        <div
          className="relative mx-auto w-full px-6"
          style={{ maxWidth: `${SECTION_3_CONTENT_WIDTH}px` }}
        >
          <div className="mb-6">
            <div className="mb-8 flex flex-col items-center text-center">
              <p className="text-[13px] font-bold uppercase tracking-[0.22em] text-gray-700">
                OUR GOALS WITH STEAM TIL
              </p>

              <h3 className="mt-3 bg-gradient-to-r from-[#5921c7] via-[#8c52ff] to-[#5921c7] bg-clip-text text-[23px] font-black text-transparent sm:text-[30px]">
                Build Future Skills That Matter
              </h3>

              <p className="mt-3 mb-1 max-w-[850px] text-[14px] leading-[26px] text-gray-800 sm:text-[16px]">
                Adroiit Technovations' STEAM TIL is designed to transform the
                way students learn. By combining experiential learning,
                interdisciplinary exploration and practical applications, we
                help students develop confidence and capabilities to turn their
                ideas into meaningful solutions.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {objectives.map((obj, i) => (
                <motion.div
                  key={obj.text}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  variants={fadeUp}
                  viewport={{ once: true, amount: 0.2 }}
                  whileHover={{ y: -7 }}
                  className="group relative flex min-h-[210px] flex-col overflow-hidden rounded-[24px] border border-[#e9e4f1] bg-white p-6 transition-all duration-300 hover:border-[#8c52ff]/50 hover:shadow-[0_18px_45px_rgba(89,33,199,0.18)]"
                >
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#8c52ff]/[0.04] blur-2xl transition-all duration-500 group-hover:bg-[#8c52ff]/15" />

                  <div className="relative z-10 mb-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#8c52ff]/25 bg-gradient-to-br from-[#5921c7]/10 to-[#8c52ff]/20 text-[#5921c7] shadow-[0_6px_18px_rgba(89,33,199,0.08)] transition-all duration-300 group-hover:scale-105 group-hover:border-[#5921c7]/30 group-hover:bg-gradient-to-br group-hover:from-[#5921c7] group-hover:to-[#8c52ff] group-hover:text-white">
                      {obj.icon}
                    </div>
                  </div>

                  <div className="relative z-10 mt-1">
                    <div className="mb-4 h-[3px] w-9 rounded-full bg-gradient-to-r from-[#5921c7] to-[#a981ff] transition-all duration-300 group-hover:w-16" />

                    <p className="text-[13px] font-bold leading-[24px] text-gray-700 transition-colors group-hover:text-[#17131f]">
                      {obj.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* 4. HOW STUDENTS LEARN */}
      {/* DARK THEME */}
      {/* ====================================================== */}

      <section className="relative z-10 overflow-hidden bg-[#30106f] py-10 text-white md:py-10">
        <div className="pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full bg-[#8c52ff]/10 blur-[140px]" />
        <div className="pointer-events-none absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-[#5921c7]/[0.12] blur-[140px]" />

        <div
          className="relative mx-auto w-full px-6"
          style={{ maxWidth: `${SECTION_4_CONTENT_WIDTH}px` }}
        >
          
            <div className="mx-auto mb-12 max-w-[800px] text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-purple-300">
                HOW STUDENTS LEARN
              </p>

              <h3 className="mt-3 text-[27px] font-black text-white sm:text-[32px]">
                Explore, Experiment, Build & Innovate
              </h3>

              <p className="mt-4 text-[13px] leading-[26px] text-gray-300 sm:text-[14px] sm:leading-[28px]">
                Our learning methodology takes students through a structured
                journey, moving from understanding concepts to creating
                practical solutions through hands-on experiences.
              </p>
            </div>

            <div className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {methodology.map((step, i) => (
                <motion.div
                  key={step.title}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  variants={fadeUp}
                  viewport={{ once: true, amount: 0.2 }}
                  whileHover={{ y: -7 }}
                  className="group relative flex min-h-[300px] flex-col overflow-hidden rounded-[28px] border border-white/[0.10] bg-[#3e1b86] p-7 transition-all duration-300 hover:border-[#8c52ff]/50 hover:shadow-[0_20px_55px_rgba(89,33,199,0.18)]"
                >
                  <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-[#8c52ff]/[0.04] blur-2xl transition-all duration-500 group-hover:bg-[#8c52ff]/15" />

                  <div className="relative z-10 mb-8 flex items-center justify-between">
                    <div className="flex h-[62px] w-[62px] items-center justify-center rounded-[20px] border border-[#8c52ff]/20 bg-[#5921c7]/30 text-[#b18aff] transition-all duration-300 group-hover:bg-[#5921c7] group-hover:text-white">
                      {step.icon}
                    </div>

                    <span className="text-[38px] font-black leading-none text-white/10 transition-colors group-hover:text-[#8c52ff]/40">
                      {step.number}
                    </span>
                  </div>

                  <div className="relative z-10 mt-auto">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-purple-300">
                      STEP {step.number}
                    </p>

                    <h4 className="mb-3 text-[23px] font-black text-white">
                      {step.title}
                    </h4>

                    <p className="text-[13px] leading-[26px] text-gray-300">
                      {step.description}
                    </p>

                    <div className="mt-6 h-[4px] w-9 rounded-full bg-gradient-to-r from-[#5921c7] to-[#8c52ff] transition-all duration-300 group-hover:w-16" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
      </section>

      {/* ====================================================== */}
      {/* 5. DOMAINS OF FOCUS */}
      {/* LIGHT THEME */}
      {/* ====================================================== */}

      <section className="relative z-10 overflow-hidden bg-[#faf9fc] py-10 text-[#17131f] md:py-10">
        <div className="pointer-events-none absolute -left-40 top-20 h-[450px] w-[450px] rounded-full bg-[#5921c7]/[0.07] blur-[150px]" />

        <div
          className="relative mx-auto w-full px-6"
          style={{ maxWidth: `${SECTION_5_CONTENT_WIDTH}px` }}
        >
          <SectionHeading
            eyebrow="EXPLORE THE POSSIBILITIES"
            title="Domains Students Will"
            highlight="Explore"
            description="Students will explore a diverse range of future-focused STEAM fields designed for progressive learning, building stronger foundations and fostering innovation."
            light
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {domains.map((domain, i) => (
              <motion.div
                key={domain.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                variants={fadeUp}
                viewport={{ once: true, amount: 0.15 }}
                whileHover={{ y: -7 }}
                className="group relative overflow-hidden rounded-3xl border border-[#e9e4f1] bg-white p-4 shadow-[0_10px_35px_rgba(35,15,70,0.035)] transition-all duration-300 hover:border-[#b99aff]/60 hover:shadow-[0_15px_40px_rgba(89,33,199,0.12)]"
              >
                <div className="relative mb-5 aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[#eeeaf5]">
                  <Image
                    src={domain.image}
                    alt={domain.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-70" />
                </div>

                <div className="px-2 pb-3">
                  <h3 className="mb-3 bg-gradient-to-r from-[#5921c7] via-[#8c52ff] to-[#5921c7] bg-clip-text text-[18px] font-bold text-transparent">
                    {domain.title}
                  </h3>

                  <div className="mb-4 h-[4px] w-9 rounded-full bg-[#8c52ff]/60 transition-all duration-300 group-hover:w-14" />

                  <p className="text-[12px] leading-[25px] text-gray-600 sm:text-[13px] sm:leading-[27px]">
                    {domain.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* 6. WHY ADROIIT + INSTITUTIONAL PARTNERSHIP */}
      {/* DARK THEME */}
      {/* ====================================================== */}

      <section className="relative z-10 overflow-hidden bg-[#30106f] py-10 text-white md:py-10">
        <div className="pointer-events-none absolute -right-40 top-0 h-[450px] w-[450px] rounded-full bg-[#5921c7]/15 blur-[150px]" />
        <div className="pointer-events-none absolute -left-40 bottom-0 h-[450px] w-[450px] rounded-full bg-[#8c52ff]/[0.08] blur-[150px]" />

        <div
          className="relative mx-auto w-full px-6"
          style={{ maxWidth: `${SECTION_6_CONTENT_WIDTH}px` }}
        >
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
            {/* LEFT: ADROIIT ADVANTAGE */}

            <div>
              <motion.p
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={titleVariants}
                className="mb-4 text-[11px] font-bold uppercase tracking-[0.25em] text-purple-300 sm:text-[12px]"
              >
                THE ADROIIT ADVANTAGE
              </motion.p>

              <motion.h2
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={titleVariants}
                style={{ fontSize: `${SECTION_TITLE_SIZE}px` }}
                className="font-black leading-tight tracking-tight text-white"
              >
                More Than a Lab.
                <br />
                A Foundation for Innovation.
              </motion.h2>

              <motion.p
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={descVariants}
                className="mt-6 text-[14px] leading-[29px] text-gray-300 sm:text-[16px] sm:leading-[32px]"
              >
                Adroiit Technovations works with educational institutions to
                create future-ready STEAM learning environments. From
                curriculum and infrastructure to technology, mentorship and
                continued support, we bring together the essential elements
                required to make practical learning meaningful and sustainable.
              </motion.p>

              <div className="mt-8 space-y-4">
                {partnershipPoints.map((item, i) => (
                  <motion.div
                    key={item.text}
                    custom={i}
                    initial="hidden"
                    whileInView="visible"
                    variants={fadeUp}
                    viewport={{ once: true }}
                    className="flex items-start gap-4"
                  >
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#8c52ff]/25 bg-[#5921c7]/30 text-[#b18aff]">
                      {item.icon}
                    </div>

                    <p className="text-[13px] leading-[26px] text-gray-200 sm:text-[14px] sm:leading-[28px]">
                      {item.text}
                    </p>
                  </motion.div>
                ))}
              </div>

              <Link
                href="/contact"
                className="group mt-9 inline-flex items-center gap-3 rounded-full border border-[#8c52ff]/40 px-7 py-4 text-[14px] font-bold text-white transition-all hover:border-[#a981ff] hover:bg-[#5921c7]/30"
              >
                Plan Your STEAM Lab
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>

            {/* RIGHT: LEARNING ECOSYSTEM */}

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              className="relative"
            >
              <div className="absolute -inset-5 rounded-[35px] bg-gradient-to-br from-[#5921c7]/20 to-[#8c52ff]/[0.06] blur-2xl" />

              <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#3e1b86] p-7 shadow-[0_15px_50px_rgba(0,0,0,0.25)] sm:p-9">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-purple-300">
                      THE BIGGER PICTURE
                    </p>
                    <h3 className="mt-2 text-[24px] font-black text-white">
                      A Complete Learning Ecosystem
                    </h3>
                  </div>

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#8c52ff]/25 bg-[#5921c7]/30 text-[#b18aff]">
                    <Idea size={23} />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {ecosystemItems.map((item, i) => (
                    <motion.div
                      key={item.title}
                      custom={i}
                      initial="hidden"
                      whileInView="visible"
                      variants={fadeUp}
                      viewport={{ once: true }}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#30106f] p-4 transition-all hover:border-[#8c52ff]/35 hover:bg-[#3e1b86]"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#5921c7]/40 text-[#c4a8ff]">
                        {item.icon}
                      </div>

                      <div>
                        <h4 className="text-[13px] font-bold text-white">
                          {item.title}
                        </h4>
                        <p className="mt-1 text-[11px] leading-[19px] text-gray-300">
                          {item.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="my-8 h-px w-full bg-white/[0.10]" />

                <div className="mb-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-purple-300">
                    WHY INSTITUTIONS CHOOSE US
                  </p>
                  <h4 className="mt-2 text-[18px] font-black text-white">
                    Designed Around Your Institution
                  </h4>
                </div>

                <div className="space-y-3">
                  {whyChooseItems.map((item, i) => (
                    <motion.div
                      key={item.title}
                      custom={i}
                      initial="hidden"
                      whileInView="visible"
                      variants={fadeUp}
                      viewport={{ once: true }}
                      className="flex items-start gap-3 rounded-2xl border border-white/10 bg-[#30106f] p-4 transition-all hover:border-[#8c52ff]/30 hover:bg-[#3e1b86]"
                    >
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#8c52ff]/20 bg-[#5921c7]/30 text-[#b18aff]">
                        {item.icon}
                      </div>

                      <div>
                        <h5 className="text-[13px] font-bold leading-[21px] text-white">
                          {item.title}
                        </h5>
                        <p className="mt-1 text-[11px] leading-[21px] text-gray-300">
                          {item.description}
                        </p>
                      </div>

                      <CheckCircle2
                        size={16}
                        className="mt-1 ml-auto shrink-0 text-[#b18aff]"
                      />
                    </motion.div>
                  ))}
                </div>

                <div className="mt-7 rounded-2xl border border-[#8c52ff]/25 bg-gradient-to-r from-[#5921c7]/30 to-[#8c52ff]/[0.12] p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#c4a8ff]">
                    THE OUTCOME WE WORK TOWARDS
                  </p>
                  <p className="mt-2 text-[18px] font-bold leading-[29px] text-white">
                    A learning environment where curiosity becomes capability.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* 7. THREE STEAM LAB PACKAGES */}
      {/* LIGHT THEME */}
      {/* ====================================================== */}

      <section
        id="lab-packages"
        className="relative z-10 scroll-mt-24 overflow-hidden bg-[#faf9fc] py-10 text-[#17131f] md:py-10"
      >
        <div className="pointer-events-none absolute -left-40 top-0 h-[450px] w-[450px] rounded-full bg-[#5921c7]/15 blur-[150px]" />
        <div className="pointer-events-none absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full bg-[#8c52ff]/10 blur-[150px]" />

        <div
          className="relative mx-auto w-full px-6"
          style={{ maxWidth: `${SECTION_7_CONTENT_WIDTH}px` }}
        >
          <SectionHeading
            eyebrow="STEAM LAB SOLUTIONS"
            title="Choose the Right"
            highlight="Lab Package"
            description="Explore our range of STEAM lab solutions designed to suit different institutional requirements, learning objectives and levels of technology integration."
            light
          />

          <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-3">
            {labPackages.map((pkg, i) => (
              <motion.article
                key={pkg.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                variants={fadeUp}
                viewport={{ once: true, amount: 0.1 }}
                whileHover={{ y: -7 }}
                className={`group relative flex flex-col overflow-hidden rounded-[28px] border p-7 transition-all duration-300 hover:shadow-[0_22px_60px_rgba(89,33,199,0.20)] sm:p-8 ${
                  pkg.featured
                    ? "border-[#8c52ff]/60 bg-white shadow-[0_15px_50px_rgba(89,33,199,0.16)]"
                    : "border-[#e9e4f1] bg-white hover:border-[#8c52ff]/50"
                }`}
              >
                {pkg.featured && (
                  <div className="absolute right-0 top-0 rounded-bl-2xl bg-gradient-to-r from-[#5921c7] to-[#8c52ff] px-5 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white">
                    Recommended
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#8c52ff]/25 bg-[#5921c7]/10 text-[#5921c7] transition-all duration-300 group-hover:bg-[#5921c7] group-hover:text-white">
                    {pkg.icon}
                  </div>

                  <span className="text-[36px] font-black text-[#5921c7]/10">
                    {pkg.number}
                  </span>
                </div>

                <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.2em] text-[#5921c7]">
                  {pkg.subtitle}
                </p>

                <h3 className="mt-2 bg-gradient-to-r from-[#5921c7] via-[#8c52ff] to-[#5921c7] bg-clip-text text-[26px] font-black text-transparent sm:text-[29px]">
                  {pkg.name}
                </h3>

                <p className="mt-4 min-h-[105px] text-[13px] leading-[27px] text-gray-600 sm:text-[14px]">
                  {pkg.description}
                </p>

                <div className="my-7 h-px w-full bg-[#e9e4f1]" />

                <p className="mb-5 text-[11px] font-black uppercase tracking-[0.16em] text-[#5921c7]">
                  Package Inclusions
                </p>

                <ul className="flex-1 space-y-4">
                  {pkg.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-[12px] leading-[22px] text-gray-700 sm:text-[13px]"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#5921c7]/10 text-[#5921c7]">
                        <CheckCircle2 size={13} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 rounded-2xl border border-[#8c52ff]/25 bg-[#f7f3ff] p-4">
                  <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-[#5921c7]">
                    IDEAL FOR
                  </p>
                  <p className="mt-2 text-[12px] font-bold leading-[21px] text-[#17131f]">
                    {pkg.idealFor}
                  </p>
                </div>

                <Link
                  href="/contact"
                  className={`group/btn mt-7 inline-flex w-full items-center justify-center gap-3 rounded-full px-6 py-4 text-[13px] font-bold transition-all duration-300 hover:-translate-y-1 ${
                    pkg.featured
                      ? "bg-gradient-to-r from-[#5921c7] to-[#8c52ff] text-white shadow-[0_8px_25px_rgba(89,33,199,0.25)] hover:shadow-[0_12px_35px_rgba(89,33,199,0.35)]"
                      : "border border-[#8c52ff]/35 bg-white text-[#5921c7] hover:border-[#8c52ff]/60 hover:bg-[#5921c7]/[0.06]"
                  }`}
                >
                  Enquire About This Package
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover/btn:translate-x-1"
                  />
                </Link>
              </motion.article>
            ))}
          </div>

          <p className="mx-auto mt-7 max-w-[850px] text-center text-[10px] leading-[20px] text-gray-500">
            Package inclusions are indicative and can be customised based on
            institutional requirements, available infrastructure, student
            strength and selected technology domains.
          </p>
        </div>
      </section>

      {/* ====================================================== */}
      {/* 8. FREQUENTLY ASKED QUESTIONS */}
      {/* DARK THEME */}
      {/* ====================================================== */}

      <section className="relative z-10 overflow-hidden bg-[#30106f] px-6 py-10 text-white md:py-10">
        <div className="pointer-events-none absolute -right-40 top-0 h-[420px] w-[420px] rounded-full bg-[#8c52ff]/10 blur-[145px]" />
        <div className="pointer-events-none absolute -left-40 bottom-0 h-[380px] w-[380px] rounded-full bg-[#5921c7]/15 blur-[140px]" />

        <div
          className="relative mx-auto w-full px-6"
          style={{ maxWidth: `${SECTION_8_CONTENT_WIDTH}px` }}
        >
          <SectionHeading
            eyebrow="FREQUENTLY ASKED QUESTIONS"
            title="Everything You Need to"
            highlight="Know"
            description="Find answers to common questions about our STEAM Tinkering and Innovation Lab and how it can support your institution."
          />

          <div className="mx-auto max-w-[900px] space-y-4">
            {[
              {
                question: "What is a STEAM Tinkering and Innovation Lab?",
                answer:
                  "A STEAM Tinkering and Innovation Lab is a practical learning environment where students explore Science, Technology, Engineering, Arts and Mathematics through hands-on activities, experimentation, design and project development.",
              },
              {
                question: "Which technology domains can students explore?",
                answer:
                  "Students can explore electronics and circuits, 3D design and modelling, 3D printing, embedded systems, robotics, Internet of Things, drone technology and artificial intelligence, depending on the selected lab package and learning plan.",
              },
              {
                question: "Can the lab be customised for our institution?",
                answer:
                  "Yes. Lab infrastructure, equipment, learning resources and technology domains can be planned around your institution's requirements, available space, student strength and learning objectives.",
              },
              {
                question: "Is the curriculum aligned with educational frameworks?",
                answer:
                  "Our learning approach is designed with reference to NEP 2020, NCF 2023, NCERT and CBSE requirements. The specific curriculum plan can be discussed based on your institution's academic needs.",
              },
              {
                question: "Do you provide implementation and ongoing support?",
                answer:
                  "Yes. Adroiit can support institutions with lab planning, infrastructure, curriculum and learning resources, implementation guidance, maintenance and continued support based on the agreed partnership scope.",
              },
              {
                question: "How can our school enquire about setting up a STEAM Lab?",
                answer:
                  "You can contact our team through the Book a Demo or Enquire links on this page. We can discuss your institution's requirements and recommend a suitable lab solution.",
              },
            ].map((faq, index) => (
              <motion.details
                key={faq.question}
                initial="hidden"
                whileInView="visible"
                variants={fadeUp}
                custom={index}
                viewport={{ once: true, amount: 0.15 }}
                className="group rounded-2xl border border-white/10 bg-[#3e1b86] p-5 transition-colors duration-300 open:border-[#b18aff]/50 sm:p-6"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-[14px] font-bold leading-6 text-white marker:content-none sm:text-[16px]">
                  <span>{faq.question}</span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#b18aff]/30 text-[#b18aff] transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-[800px] pr-10 text-[13px] leading-[26px] text-gray-300 sm:text-[14px] sm:leading-[28px]">
                  {faq.answer}
                </p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* 9. FINAL CTA */}
      {/* LIGHT THEME */}
      {/* ====================================================== */}

      <section className="relative z-10 overflow-hidden bg-[#faf9fc] px-6 py-10 text-[#17131f] md:py-10">
        <div className="pointer-events-none absolute -right-40 -top-20 h-[450px] w-[450px] rounded-full bg-[#8c52ff]/10 blur-[140px]" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-[450px] w-[450px] rounded-full bg-[#5921c7]/[0.08] blur-[140px]" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={fadeUp}
          viewport={{ once: true }}
          className="relative mx-auto w-full px-6 text-center"
          style={{ maxWidth: `${SECTION_9_CONTENT_WIDTH}px` }}
        >
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.25em] text-gray-700 sm:text-[12px]">
            BUILD THE FUTURE WITH US
          </p>

          <h2
            style={{ fontSize: `${SECTION_TITLE_SIZE}px` }}
            className="mb-6 bg-gradient-to-r from-[#5921c7] via-[#8c52ff] to-[#5921c7] bg-clip-text font-black leading-tight tracking-tight text-transparent"
          >
            Transform Your School into a Future-Ready Innovation Hub
          </h2>

          <p className="mx-auto mb-9 max-w-[750px] text-[14px] leading-[29px] text-gray-600 sm:text-[16px] sm:leading-[32px]">
            Let's join to empower your institution with a STEAM Tinkering and
            Innovation Lab designed to foster creativity, hands-on learning
            and future-ready skills.
          </p>

          <Link
            href="/contact"
            className="group inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#5921c7] to-[#8c52ff] px-9 py-4 text-[14px] font-bold text-white shadow-[0_8px_35px_rgba(140,82,255,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_45px_rgba(140,82,255,0.4)] sm:text-[16px]"
          >
            <MessageCircle size={19} />
            Book a Demo
            <ArrowRight
              size={19}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>

          <p className="mt-7 text-[12px] font-medium tracking-wide text-gray-500">
            Empowering the Next-Gen through Education and Innovation!
          </p>
        </motion.div>
      </section>

      {/* ====================================================== */}
      {/* FOOTER */}
      {/* ====================================================== */}

      <Footer />
    </div>
  );
}
