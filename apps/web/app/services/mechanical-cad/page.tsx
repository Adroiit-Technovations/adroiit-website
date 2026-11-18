
"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  Cog,
  Layers,
  Box,
  CheckCircle,
  ArrowRight,
  Wrench,
  Factory,
  Cpu,
  Search,
  Lightbulb,
  PackageCheck,
  Award,
  Clock,
  DollarSign,
  Users,
  Lock,
  HeartHandshake,
  MessageCircle,
  MoveUpRight,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Bricolage_Grotesque } from "next/font/google";
import Footer from "@/sections/Footer";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

// ============================================================
// ANIMATIONS
// ============================================================

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: "easeOut",
    },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
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
  highlight?: string;
  description: string;
  light?: boolean;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUp}
      className="mx-auto mb-14 max-w-3xl text-center"
    >
      <p
        className={`text-[13px] font-bold uppercase tracking-[0.25em] ${
          light ? "text-gray-700" : "text-purple-300"
        }`}
      >
        {eyebrow}
      </p>

      <h2
        className={`mt-4 text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-[38px] ${
          light
            ? "bg-gradient-to-r from-[#5921c7] via-[#8c52ff] to-[#5921c7] bg-clip-text text-transparent"
            : "text-white"
        }`}
      >
        {title} {highlight}
      </h2>

      <p
        className={`mx-auto mt-5 max-w-2xl text-base leading-8 ${
          light ? "text-gray-700" : "text-gray-300"
        }`}
      >
        {description}
      </p>
    </motion.div>
  );
}

// ============================================================
// SERVICES
// ============================================================

const services = [
  {
    icon: Box,
    number: "01",
    title: "3D Modeling",
    description:
      "Accurate parametric and surface models for product design, development and prototyping.",
  },
  {
    icon: Layers,
    number: "02",
    title: "2D Drafting",
    description:
      "Detailed engineering drawings with dimensions, GD&T and manufacturing specifications.",
  },
  {
    icon: Cog,
    number: "03",
    title: "Assembly Design",
    description:
      "Complex mechanical assemblies with component relationships, fit and interference analysis.",
  },
  {
    icon: Wrench,
    number: "04",
    title: "Reverse Engineering",
    description:
      "Transform physical components and reference measurements into accurate digital CAD models.",
  },
  {
    icon: Factory,
    number: "05",
    title: "Manufacturing Support",
    description:
      "Design optimization for CNC machining, injection molding, fabrication and production.",
  },
  {
    icon: Cpu,
    number: "06",
    title: "Simulation-ready Models",
    description:
      "Prepare CAD geometry for FEA, CFD and other engineering simulation workflows.",
  },
];

// ============================================================
// WORKFLOW
// ============================================================

const workflowSteps = [
  {
    number: "01",
    icon: Search,
    title: "Requirement Analysis",
    description:
      "We understand your project goals, technical specifications, design requirements and material constraints.",
  },
  {
    number: "02",
    icon: Lightbulb,
    title: "Concept Design",
    description:
      "We develop initial concepts and sketches, considering functionality, feasibility and design intent.",
  },
  {
    number: "03",
    icon: Layers,
    title: "Detailed CAD Modeling",
    description:
      "Concepts are transformed into detailed parametric models, assemblies and engineering drawings.",
  },
  {
    number: "04",
    icon: PackageCheck,
    title: "Review & Delivery",
    description:
      "The completed design is reviewed and delivered in suitable engineering file formats for your next stage.",
  },
];

// ============================================================
// WHY CHOOSE ADROIIT
// ============================================================

const whyChooseItems = [
  {
    icon: Award,
    title: "Industry Standards",
    description:
      "Designs developed with relevant ISO, ASME and DIN standards in mind.",
  },
  {
    icon: Clock,
    title: "Timely Delivery",
    description:
      "Clear project timelines and delivery planning based on project scope.",
  },
  {
    icon: DollarSign,
    title: "Cost-conscious",
    description:
      "Practical design support with attention to project budgets.",
  },
  {
    icon: Users,
    title: "Engineering Support",
    description:
      "Technical guidance throughout the design and development process.",
  },
  {
    icon: Lock,
    title: "Confidentiality",
    description:
      "Confidentiality arrangements can be discussed for your project.",
  },
  {
    icon: HeartHandshake,
    title: "Client-focused",
    description:
      "Collaborative reviews and refinements aligned with project requirements.",
  },
];

// ============================================================
// PROJECT TYPES
// ============================================================

const projectTypes = [
  "Product development",
  "Mechanical components",
  "Industrial equipment",
  "Academic projects",
  "Prototyping requirements",
  "Manufacturing drawings",
];

// ============================================================
// FAQS
// ============================================================

const faqs = [
  {
    question: "What is Mechanical CAD and how can it help my project?",
    answer:
      "Mechanical Computer-Aided Design (CAD) involves creating precise digital models, assemblies and engineering drawings of mechanical components and products. It helps visualize designs, evaluate dimensions and prepare design information for prototyping and manufacturing.",
  },
  {
    question: "What Mechanical CAD services does Adroiit Technovations offer?",
    answer:
      "Our services include 3D Modeling, 2D Drafting, Assembly Design, Reverse Engineering, Manufacturing Support and Simulation-ready Models. The scope of work can be discussed based on your project requirements.",
  },
  {
    question: "Can you work on an existing design or physical component?",
    answer:
      "Yes. We can discuss existing CAD files, reference drawings, measurements and physical components as inputs for design modification or reverse engineering. The feasibility and required inputs will depend on the project.",
  },
  {
    question: "Which CAD file formats can you provide?",
    answer:
      "The required deliverable formats can be discussed during project planning. Depending on the software, design scope and intended application, suitable native CAD and commonly used exchange formats can be considered.",
  },
  {
    question: "Do you provide CAD support for prototypes and manufacturing?",
    answer:
      "Yes. We provide design support for product development, prototyping requirements and manufacturing-oriented workflows. The design approach can be planned around the intended manufacturing process and project specifications.",
  },
  {
    question: "Can you support academic and student projects?",
    answer:
      "Yes. We can discuss Mechanical CAD requirements for academic projects, student concepts and prototype development. The scope, expected deliverables and timelines can be agreed upon before starting the work.",
  },
  {
    question: "How do you determine project cost and delivery time?",
    answer:
      "Project cost and timelines depend on factors such as design complexity, number of components, available reference material, required deliverables and revision requirements. Contact our team with your project details for a discussion.",
  },
  {
    question: "How can I get started with a Mechanical CAD project?",
    answer:
      "You can contact us through our website or WhatsApp and share your design idea, reference files, drawings or project requirements. Our team can discuss the scope and suitable next steps with you.",
  },
];

// ============================================================
// PAGE
// ============================================================

export default function MechanicalCADPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const whatsappLink =
    "https://wa.me/918870002908?text=Hi%20Adroiit%20Technovations%2C%20I%20have%20a%20mechanical%20design%20idea.%20I%20would%20like%20to%20discuss%20my%20requirements.";

  return (
    <main
      className={`${bricolage.className} min-h-screen overflow-hidden bg-white text-[#17121f]`}
    >
      {/* ====================================================== */}
      {/* 1. HERO — LIGHT THEME */}
      {/* ====================================================== */}

      <section className="relative isolate overflow-hidden border-b border-[#5921c7]/10 bg-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(89,33,199,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(89,33,199,0.2) 1px, transparent 1px)",
            backgroundSize: "55px 55px",
          }}
        />

        <div className="pointer-events-none absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-[#5921c7]/10 blur-[130px]" />

        <div className="pointer-events-none absolute -right-20 bottom-0 h-[360px] w-[360px] rounded-full bg-[#8c52ff]/15 blur-[120px]" />

        <div className="relative mx-auto grid max-w-[1350px] items-center gap-14 px-5 pb-20 pt-28 sm:px-8 md:pb-28 md:pt-35 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-12">
          <div>
            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mb-5 text-[13px] font-bold uppercase tracking-[0.2em] text-gray-700"
            >
              Engineering design services
            </motion.p>

            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="max-w-3xl text-[38px] font-black leading-[1.08] tracking-tight text-[#17121f] sm:text-5xl md:text-6xl"
            >
              Engineering Design Services
              <br />
              <span className="bg-gradient-to-r from-[#5921c7] via-[#8c52ff] to-[#5921c7] bg-clip-text text-transparent">
                Mechanical Computer Aided Design.
              </span>
            </motion.h1>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="my-8 h-1 w-20 rounded-full bg-gradient-to-r from-[#5921c7] to-[#8c52ff]"
            />

            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="max-w-2xl text-base leading-8 text-gray-700 sm:text-lg"
            >
              At Adroiit Technovations, we provide Mechanical CAD services for
              industries, startups and professionals. From initial concepts to
              detailed engineering models, we help turn design ideas into
              accurate digital representations ready for the next stage of
              development.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-9 flex flex-col gap-4 sm:flex-row"
            >
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#5921c7] to-[#8c52ff] px-7 py-4 text-sm font-bold text-white shadow-[0_10px_40px_rgba(140,82,255,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(140,82,255,0.4)]"
              >
                Consult with Us
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <a
                href="#services"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#5921c7]/25 px-7 py-4 text-sm font-bold text-[#30106f] transition-all hover:border-[#8c52ff] hover:bg-[#5921c7]/5"
              >
                Explore Our Services
                <MoveUpRight size={17} />
              </a>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-12 grid max-w-xl grid-cols-3 gap-4 border-t border-[#5921c7]/15 pt-7"
            >
              <div>
                <p className="text-3xl font-black text-[#30106f] sm:text-4xl">
                  15+
                </p>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-600 sm:text-xs">
                  Clients
                </p>
              </div>

              <div>
                <p className="text-3xl font-black text-[#30106f] sm:text-4xl">
                  20+
                </p>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-600 sm:text-xs">
                  Designs delivered
                </p>
              </div>

              <div>
                <p className="text-3xl font-black text-[#30106f] sm:text-4xl">
                  99%
                </p>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-600 sm:text-xs">
                  Satisfaction rate
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, x: 25 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative mx-auto w-full max-w-[570px] lg:ml-auto"
          >
            <div className="absolute -inset-5 rounded-[35px] bg-gradient-to-br from-[#5921c7]/20 to-[#8c52ff]/10 blur-2xl" />

            <div className="relative aspect-[5/4] overflow-hidden rounded-[21px] border border-[#5921c7]/10 shadow-[0_25px_70px_rgba(48,16,111,0.12)]">
              <Image
                src="/mechanical-cad/cad-hero.jpg"
                alt="Mechanical CAD engineering design and modeling"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* 2. SERVICES — DARK THEME */}
      {/* ====================================================== */}

      <section
        id="services"
        className="relative overflow-hidden bg-[#30106f] px-5 py-16 text-white sm:px-8 md:py-20"
      >
        <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-[#8c52ff]/15 blur-[120px]" />

        <div className="relative mx-auto max-w-[1100px]">
          <SectionHeading
            eyebrow="WHAT WE OFFER"
            title="Engineering Design Services"
            description="Comprehensive mechanical design services that bridge the gap between initial concepts, digital models and manufacturing."
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {services.map((service) => (
              <motion.article
                key={service.number}
                variants={itemVariants}
                whileHover={{ y: -7 }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#3e1b86] p-7 transition-all duration-300 hover:border-purple-300/40 hover:shadow-[0_20px_55px_rgba(0,0,0,0.2)] sm:p-8"
              >
                <div className="absolute right-6 top-5 text-5xl font-black tracking-tighter text-white/[0.06] transition-colors group-hover:text-purple-300/15">
                  {service.number}
                </div>

                <div className="relative mb-7 flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-300/20 bg-[#5921c7]/30 text-purple-200 transition-all duration-300 group-hover:bg-[#8c52ff] group-hover:text-white">
                  <service.icon size={27} />
                </div>

                <h3 className="relative text-xl font-black text-white">
                  {service.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-300">
                  {service.description}
                </p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* 3. WORKFLOW — LIGHT THEME */}
      {/* ====================================================== */}

      <section className="relative overflow-hidden bg-white px-5 py-16 text-[#17121f] sm:px-8 md:py-20">
        <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#5921c7]/10 blur-[130px]" />

        <div className="relative mx-auto max-w-[1300px]">
          <SectionHeading
            eyebrow="HOW WE WORK"
            title="A Structured Workflow."
            highlight="A Precise Outcome."
            description="Every project follows a clear design process to keep requirements, engineering decisions and final deliverables aligned."
            light
          />

          <div className="relative">
            <div className="absolute left-[8%] right-[8%] top-10 hidden h-px bg-gradient-to-r from-transparent via-[#8c52ff]/50 to-transparent lg:block" />

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
            >
              {workflowSteps.map((step) => (
                <motion.div
                  key={step.number}
                  variants={itemVariants}
                  className="group relative"
                >
                  <div className="relative z-10 mb-7 flex h-20 w-20 items-center justify-center rounded-2xl border border-[#8c52ff]/25 bg-[#f5f0ff] text-[#5921c7] shadow-[0_0_35px_rgba(140,82,255,0.08)] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#8c52ff] group-hover:bg-[#5921c7] group-hover:text-white">
                    <step.icon size={29} />

                    <span className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-[#8c52ff] text-xs font-black text-white">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#21172f] transition-colors group-hover:text-[#5921c7]">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-700">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* 4. WHERE WE CAN HELP — DARK THEME */}
      {/* ====================================================== */}

      <section className="relative overflow-hidden bg-[#30106f] px-5 py-16 text-white sm:px-8 md:py-20">
        <div className="pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full bg-[#8c52ff]/15 blur-[120px]" />

        <div className="relative mx-auto grid max-w-[1300px] gap-14 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <p className="text-[13px] font-black uppercase tracking-[0.25em] text-purple-300">
              WHERE WE CAN HELP
            </p>

            <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl md:text-[38px]">
              Supporting Ideas Across the Engineering Lifecycle.
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-gray-300">
              Whether you are developing a new product, refining an existing
              component or preparing a design for manufacturing, we can discuss
              the right CAD support for your requirements.
            </p>

            <Link
              href="/contact"
              className="group mt-8 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#5921c7] to-[#8c52ff] px-7 py-4 text-sm font-bold text-white shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(140,82,255,0.25)]"
            >
              Discuss a Project
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid gap-x-8 gap-y-5 sm:grid-cols-2"
          >
            {projectTypes.map((type, index) => (
              <motion.div
                key={type}
                variants={itemVariants}
                className="flex items-center gap-4 border-b border-white/15 py-5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purple-300/20 bg-[#3e1b86] text-purple-200">
                  <CheckCircle size={19} />
                </span>

                <span className="text-base font-bold text-white">
                  {type}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* 5. WHY ADROIIT — LIGHT THEME */}
      {/* ====================================================== */}

      <section className="relative overflow-hidden bg-[#f7f5fb] px-5 py-16 text-[#17121f] sm:px-8 md:py-20">
        <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-[#5921c7]/10 blur-[130px]" />

        <div className="relative mx-auto max-w-[1100px]">
          <SectionHeading
            eyebrow="THE ADROIIT APPROACH"
            title="Why Choose Adroiit Technovations?"
            description="We combine technical understanding, thoughtful design and a collaborative approach to deliver mechanical CAD support aligned with your project goals."
            light
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {whyChooseItems.map((item) => (
              <motion.div
                key={item.title}
                variants={itemVariants}
                className="group rounded-3xl border border-gray-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#8c52ff]/50 hover:shadow-[0_15px_40px_rgba(48,16,111,0.08)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#8c52ff]/20 bg-[#5921c7]/10 text-[#5921c7] transition-all group-hover:bg-[#5921c7] group-hover:text-white">
                  <item.icon size={23} />
                </div>

                <h3 className="mt-5 text-lg font-black text-[#21172f] transition-colors group-hover:text-[#5921c7]">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-7 text-gray-700">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* 6. FREQUENTLY ASKED QUESTIONS — DARK THEME */}
      {/* ====================================================== */}

      <section
        id="faqs"
        className="relative overflow-hidden bg-[#30106f] px-5 py-16 text-white sm:px-8 md:py-20"
      >
        <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-[#8c52ff]/15 blur-[130px]" />

        <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#5921c7]/20 blur-[130px]" />

        <div className="relative mx-auto max-w-[1000px]">
          <SectionHeading
            eyebrow="NEED MORE INFORMATION?"
            title="Frequently Asked Questions"
            description="Find answers to common questions about our Mechanical CAD services, project requirements and design process."
          />

          <div className="mx-auto max-w-[850px] space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <motion.div
                  key={faq.question}
                  initial="hidden"
                  whileInView="visible"
                  variants={itemVariants}
                  viewport={{ once: true, amount: 0.1 }}
                  className={`overflow-hidden rounded-[20px] border transition-all duration-300 ${
                    isOpen
                      ? "border-purple-300/50 bg-[#3e1b86] shadow-[0_12px_35px_rgba(0,0,0,0.12)]"
                      : "border-white/10 bg-[#3e1b86]/70 hover:border-purple-300/30"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left sm:px-7"
                  >
                    <span className="flex items-start gap-4">
                      <span className="mt-0.5 text-[13px] font-bold text-purple-300">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="text-[15px] font-bold leading-7 text-white sm:text-base">
                        {faq.question}
                      </span>
                    </span>

                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-purple-300/20 bg-[#5921c7]/30 text-purple-200 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      <ChevronDown size={19} />
                    </span>
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-white/10 px-6 pb-6 pt-4 sm:px-7">
                        <p className="pl-8 text-[13px] leading-8 text-gray-300 sm:text-sm">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeUp}
            viewport={{ once: true }}
            className="mt-10 text-center"
          >
            <p className="text-sm text-gray-300">
              Have a question about your specific design requirements?
            </p>

            <Link
              href="/contact"
              className="group mt-4 inline-flex items-center gap-2 text-sm font-bold text-purple-200 transition-colors hover:text-white"
            >
              Talk to Our Team
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* 7. FINAL CTA — LIGHT THEME */}
      {/* ====================================================== */}

      <section className="relative isolate overflow-hidden bg-[#f7f5fb] px-5 py-16 text-[#17121f] sm:px-8 md:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(140,82,255,0.12),transparent_65%)]" />

        <div className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-[#5921c7]/10 blur-[100px]" />

        <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-[#8c52ff]/10 blur-[100px]" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="relative mx-auto max-w-[1300px] text-center"
        >
          <p className="text-[13px] font-black uppercase tracking-[0.25em] text-gray-700">
            LET'S BUILD SOMETHING PRECISE
          </p>

          <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-[40px]">
            Have a Design Idea?
            <span className="block bg-gradient-to-r from-[#5921c7] via-[#8c52ff] to-[#5921c7] bg-clip-text text-transparent">
              Let's Transform It.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-gray-700 sm:text-lg">
            Turn your mechanical design idea into a precise digital model.
            Connect with Adroiit Technovations and let's discuss your
            engineering requirements.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#5921c7] to-[#8c52ff] px-7 py-4 text-sm font-bold text-white shadow-[0_10px_40px_rgba(140,82,255,0.25)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(140,82,255,0.4)] sm:w-auto"
            >
              <MessageCircle size={19} />
              Discuss on WhatsApp
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>

            <Link
              href="/contact"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#5921c7]/25 px-7 py-4 text-sm font-bold text-[#30106f] transition-all hover:border-[#8c52ff] hover:bg-[#5921c7]/5 sm:w-auto"
            >
              Contact Our Team
              <MoveUpRight size={17} />
            </Link>
          </div>

          <div className="mt-8 inline-flex items-center gap-2 text-xs font-medium text-gray-600">
            <CheckCircle size={15} className="text-[#8c52ff]" />
            Discuss your requirements with our team
          </div>
        </motion.div>
      </section>

      {/* ====================================================== */}
      {/* FOOTER */}
      {/* ====================================================== */}

      <Footer />
    </main>
  );
}
