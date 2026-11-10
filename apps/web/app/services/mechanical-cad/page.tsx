"use client";

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
  Settings,
  ShieldCheck,
  Target,
  MoveUpRight,
  Sparkles,
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

const projectTypes = [
  "Product development",
  "Mechanical components",
  "Industrial equipment",
  "Academic projects",
  "Prototyping requirements",
  "Manufacturing drawings",
];

export default function MechanicalCADPage() {
  const whatsappLink =
    "https://wa.me/918870002908?text=Hi%20Adroiit%20Technovations%2C%20I%20have%20a%20mechanical%20design%20idea.%20I%20would%20like%20to%20discuss%20my%20requirements.";

  return (
    <main
      className={`${bricolage.className} min-h-screen overflow-hidden bg-[#050505] text-white`}
    >
      {/* HERO - DARK THEME */}
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#08060e]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "55px 55px",
          }}
        />

        <div className="pointer-events-none absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-[#5921c7]/25 blur-[130px]" />

        <div className="pointer-events-none absolute -right-20 bottom-0 h-[360px] w-[360px] rounded-full bg-[#8c52ff]/15 blur-[120px]" />

        <div className="relative mx-auto grid max-w-[1350px] items-center gap-14 px-5 pb-20 pt-35 sm:px-8 md:pb-28 md:pt-35 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-12">
          <div>
            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mb-5 text-[14px] font-bold uppercase tracking-[0.2em] text-[#c4a8ff]"
            >
              Engineering design services
            </motion.p>

            <motion.h1
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="max-w-3xl text-5xl font-black leading-[1.08] tracking-tight sm:text-5xl md:text-6xl xl:text-[32px]"
            >
              Engineering Design Services
              <br></br>
              <span className="bg-gradient-to-r from-[#a77aff] via-[#8c52ff] to-[#d3bdff] bg-clip-text text-transparent">
                Mechanical Computer Aided Design.
              </span>
            </motion.h1>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="my-8 h-1 w-20 rounded-full bg-gradient-to-r from-[#5921c7] to-[#c4a8ff]"
            />

            <motion.p
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="max-w-2xl text-base leading-8 text-gray-300 sm:text-lg"
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
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#8c52ff] px-7 py-4 text-sm font-bold text-white shadow-[0_10px_40px_rgba(140,82,255,0.25)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#7440e8]"
              >
                Consult with Us
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <a
                href="#services"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-7 py-4 text-sm font-bold text-white transition-all hover:border-[#8c52ff] hover:bg-white/5"
              >
                Explore Our Services
                <MoveUpRight size={17} />
              </a>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-12 grid max-w-xl grid-cols-3 gap-4 border-t border-white/10 pt-7"
            >
              <div>
                <p className="text-3xl font-black text-white sm:text-4xl">
                  15+
                </p>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 sm:text-xs">
                  Clients
                </p>
              </div>

              <div>
                <p className="text-3xl font-black text-white sm:text-4xl">
                  20+
                </p>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 sm:text-xs">
                  Designs delivered
                </p>
              </div>

              <div>
                <p className="text-3xl font-black text-white sm:text-4xl">
                  99%
                </p>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 sm:text-xs">
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
            <div className="relative aspect-[5/4] overflow-hidden rounded-[21px]">
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

      {/* SERVICES - LIGHT THEME */}
      <section
        id="services"
        className="relative bg-white px-5 py-20 text-[#17121f] sm:px-8 md:py-10"
      >
        <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-[#8c52ff]/10 blur-[120px]" />

        <div className="relative mx-auto max-w-[1100px]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="mx-auto mb-14 max-w-3xl text-center"
          >
            <p className="text-[13px] font-semibold uppercase tracking-[0.25em] text-[#8c52ff]">
              What we offer
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight text-[#1a1425] sm:text-4xl md:text-3xl">
              Engineering design services built around your ideas.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
              Comprehensive mechanical design services that bridge the gap
              between initial concepts, digital models and manufacturing.
            </p>
          </motion.div>

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
                className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-[#faf9fc] p-7 transition-all duration-300 hover:border-[#8c52ff]/50 hover:bg-white hover:shadow-[0_20px_55px_rgba(48,16,111,0.10)] sm:p-8"
              >
                <div className="absolute right-6 top-5 text-5xl font-black tracking-tighter text-gray-100 transition-colors group-hover:text-[#8c52ff]/10">
                  {service.number}
                </div>

                <div className="relative mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5921c7]/10 text-[#5921c7] transition-all duration-300 group-hover:bg-[#5921c7] group-hover:text-white">
                  <service.icon size={27} />
                </div>

                <h3 className="relative text-xl font-black text-[#21172f]">
                  {service.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-600">
                  {service.description}
                </p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* WORKFLOW - DARK THEME */}
      <section className="relative overflow-hidden bg-[#09070e] px-5 py-20 sm:px-8 md:py-10">
        <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#5921c7]/20 blur-[130px]" />

        <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#8c52ff]/10 blur-[130px]" />

        <div className="relative mx-auto max-w-[1300px]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-16 max-w-3xl"
          >
            <p className="text-[13px] font-semibold uppercase tracking-[0.25em] text-[#b99aff]">
              How we work
            </p>

            <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-3xl">
              A structured workflow.
              <span className="block text-[#a77aff]">
                A precise outcome.
              </span>
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-200">
              Every project follows a clear design process to keep requirements,
              engineering decisions and final deliverables aligned.
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-[8%] right-[8%] top-10 hidden h-px bg-gradient-to-r from-transparent via-[#8c52ff]/60 to-transparent lg:block" />

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
                  <div className="relative z-10 mb-7 flex h-20 w-20 items-center justify-center rounded-2xl border border-[#8c52ff]/30 bg-[#171020] text-[#b99aff] shadow-[0_0_35px_rgba(140,82,255,0.10)] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#b99aff] group-hover:bg-[#5921c7] group-hover:text-white">
                    <step.icon size={29} />

                    <span className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full border-4 border-[#09070e] bg-[#8c52ff] text-xs font-black text-white">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white transition-colors group-hover:text-[#b99aff]">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-gray-400">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHERE WE CAN HELP - LIGHT THEME */}
      <section className="relative overflow-hidden bg-[#f6f4fa] px-5 py-20 text-[#17121f] sm:px-8 md:py-10">
        <div className="pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full bg-[#8c52ff]/10 blur-[120px]" />

        <div className="relative mx-auto grid max-w-[1300px] gap-14 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#5921c7]">
              Where we can help
            </p>

            <h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl md:text-3xl">
              Supporting ideas across the engineering lifecycle.
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-gray-600">
              Whether you are developing a new product, refining an existing
              component or preparing a design for manufacturing, we can discuss
              the right CAD support for your requirements.
            </p>

            <Link
              href="/contact"
              className="group mt-8 inline-flex items-center gap-3 rounded-full bg-[#8c52ff] px-7 py-4 text-sm font-bold text-white transition-all hover:-translate-y-1 hover:bg-[#7440e8]"
            >
              Discuss a project
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
                className="flex items-center gap-4 border-b border-[#5921c7]/15 py-5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#5921c7]/10 text-[#5921c7]">
                  <CheckCircle size={19} />
                </span>

                <span className="text-base font-bold text-[#21172f]">
                  {type}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* WHY ADROIIT - DARK THEME */}
      <section className="relative overflow-hidden bg-[#09070e] px-5 py-20 text-white sm:px-8 md:py-10">
        <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-[#5921c7]/20 blur-[130px]" />

        <div className="relative mx-auto max-w-[1100px]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mx-auto mb-14 max-w-3xl text-center"
          >
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#b99aff]">
              The Adroiit approach
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl md:text-3xl">
              Why choose Adroiit Technovations?
            </h2>

            <p className="mt-5 text-base leading-7 text-gray-400">
              We combine technical understanding, thoughtful design and a
              collaborative approach to deliver mechanical CAD support aligned
              with your project goals.
            </p>
          </motion.div>

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
                className="group rounded-3xl border border-white/10 bg-white/[0.04] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#8c52ff]/50 hover:bg-white/[0.07]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#5921c7]/20 text-[#b99aff] transition-all group-hover:bg-[#5921c7] group-hover:text-white">
                  <item.icon size={23} />
                </div>

                <h3 className="mt-5 text-lg font-black text-white">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-7 text-gray-400">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA - LIGHT THEME */}
      <section className="relative isolate overflow-hidden bg-[#f6f4fa] px-5 py-20 text-[#17121f] sm:px-8 md:py-10">
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
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#5921c7]">
            Let's build something precise
          </p>

          <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-3xl">
            Have a design idea?
            <span className="block bg-gradient-to-r from-[#5921c7] to-[#8c52ff] bg-clip-text text-transparent">
              Let's transform it.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
            Turn your mechanical design idea into a precise digital model.
            Connect with Adroiit Technovations and let's discuss your
            engineering requirements.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#8c52ff] px-7 py-4 text-sm font-bold text-white shadow-[0_10px_40px_rgba(140,82,255,0.25)] transition-all hover:-translate-y-1 hover:bg-[#7440e8] sm:w-auto"
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

          <div className="mt-8 inline-flex items-center gap-2 text-xs font-medium text-gray-500">
            <CheckCircle size={15} className="text-[#8c52ff]" />
            Discuss your requirements with our team
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}