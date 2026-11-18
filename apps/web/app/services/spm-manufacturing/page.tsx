
"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  ClipboardCheck,
  PackageSearch,
  Wrench,
  ShieldCheck,
  TrendingUp,
  Zap,
  Star,
  Boxes,
  Truck,
  Lock,
  Lightbulb,
  Construction,
  LifeBuoy,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import { Bricolage_Grotesque } from "next/font/google";
import Footer from "@/sections/Footer";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
});

// ============================================================
// ANIMATIONS
// ============================================================

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 25,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.65,
      ease: "easeOut",
    },
  }),
};

const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
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
  hidden: {
    opacity: 0,
    y: 25,
  },
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
// SPECIALIZED AREAS
// ============================================================

const specializedAreas = [
  {
    title: "Conceptual Design",
    subtitle: "CAD & PROTOTYPING",
    desc: "IDEATION TO BLUEPRINT",
    icon: <Lightbulb size={22} />,
  },
  {
    title: "Precision Sourcing",
    subtitle: "BOM OPTIMIZATION",
    desc: "INDUSTRIAL GRADE PARTS",
    icon: <PackageSearch size={22} />,
  },
  {
    title: "Fabrication",
    subtitle: "ASSEMBLY & QA",
    desc: "END-TO-END PRODUCTION",
    icon: <Construction size={22} />,
  },
  {
    title: "Installation",
    subtitle: "ON-SITE DEPLOYMENT",
    desc: "SEAMLESS INTEGRATION",
    icon: <Truck size={22} />,
  },
  {
    title: "Support & AMC",
    subtitle: "MAINTENANCE",
    desc: "LONG-TERM RELIABILITY",
    icon: <LifeBuoy size={22} />,
  },
];

// ============================================================
// DEVELOPMENT LIFECYCLE
// ============================================================

const steps = [
  {
    number: "01",
    title: "Requirement Analysis",
    desc: "We analyze your specific industrial needs, performance metrics, and operational constraints.",
    icon: <ClipboardCheck size={26} />,
  },
  {
    number: "02",
    title: "Design & Sourcing",
    desc: "Engineering high-precision CAD models while sourcing high-quality materials and components.",
    icon: <Wrench size={26} />,
  },
  {
    number: "03",
    title: "Production & Assembly",
    desc: "Our technicians bring the design to life with rigorous fabrication and integration standards.",
    icon: <Construction size={26} />,
  },
  {
    number: "04",
    title: "Installation & Maintenance",
    desc: "Seamless deployment at your facility followed by dedicated post-production support.",
    icon: <ShieldCheck size={26} />,
  },
];

// ============================================================
// WHY CHOOSE US
// ============================================================

const whyChooseItems = [
  {
    icon: <Star size={23} />,
    title: "Bespoke Solutions",
    description:
      "Every machine is purpose-built to solve your unique technical and operational challenges.",
  },
  {
    icon: <TrendingUp size={23} />,
    title: "Scalable Output",
    description:
      "Our designs are engineered for efficiency, helping you scale production with ease.",
  },
  {
    icon: <Boxes size={23} />,
    title: "End-to-End Execution",
    description:
      "We handle everything from the initial sketch to final component sourcing and assembly.",
  },
  {
    icon: <Lock size={23} />,
    title: "IP Protection",
    description:
      "Your custom machinery designs and proprietary processes are kept strictly confidential.",
  },
  {
    icon: <Zap size={23} />,
    title: "Rapid Prototyping",
    description:
      "Quick turnaround for proof-of-concepts before moving into full-scale fabrication.",
  },
  {
    icon: <Truck size={23} />,
    title: "On-Site Support",
    description:
      "Dedicated maintenance and technical support team available for on-ground assistance.",
  },
];

// ============================================================
// FAQS
// ============================================================

const faqs = [
  {
    question: "What types of custom machinery do you develop?",
    answer:
      "We undertake custom machinery and product development based on specific client requirements. This includes conceptual design, mechanical systems, fabrication, assembly, automation integration and installation.",
  },
  {
    question: "Can you develop machinery based on our existing idea or concept?",
    answer:
      "Yes. You can approach us with an initial idea, sketch, reference design or technical requirement. We evaluate the feasibility and work towards developing a suitable engineering design and functional solution.",
  },
  {
    question: "Do you provide complete design and fabrication services?",
    answer:
      "Yes. Our services cover the development lifecycle, including requirement analysis, CAD design, component sourcing, fabrication, assembly and installation, depending on the project scope.",
  },
  {
    question: "Do you work on embedded systems and IoT projects?",
    answer:
      "Yes. Our technical domains include embedded systems, Arduino and ESP32 development, IoT device development, sensor integration, wireless communication and connected automation solutions.",
  },
  {
    question: "Do you provide PLC-based industrial automation?",
    answer:
      "Yes. We undertake PLC programming, industrial control system development, HMI integration and machine automation based on project requirements and technical feasibility.",
  },
  {
    question: "Can you work with startups, industries and academic institutions?",
    answer:
      "Yes. We collaborate with startups, industries, professionals and academic institutions on product development, custom machinery, prototypes, automation and engineering projects.",
  },
  {
    question: "Do you provide installation and post-development support?",
    answer:
      "Yes. Installation, commissioning, maintenance and technical support can be discussed and included based on the project requirements and agreed scope.",
  },
  {
    question: "How can I discuss my project requirements?",
    answer:
      "You can contact our team through WhatsApp or the Contact page. Share your initial concept, application, technical requirements and expected outcome so that we can understand your project and discuss the next steps.",
  },
];

// ============================================================
// PAGE
// ============================================================

export default function CustomMachineryPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const whatsappLink =
    "https://wa.me/918870002908?text=Hi%20Adroiit%20Technovations%2C%20I%20am%20interested%20in%20Custom%20Machinery%20Fabrication";

  return (
    <div
      className={`${bricolage.className} relative min-h-screen overflow-hidden bg-white text-[#17121f]`}
    >
      {/* ====================================================== */}
      {/* HERO + OUR EXPERTISE - LIGHT THEME */}
      {/* ====================================================== */}

      <section className="relative z-10 overflow-hidden bg-white pb-20 pt-35 text-[#17121f] md:pb-10">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-40 -top-32 h-[500px] w-[500px] rounded-full bg-[#5921c7]/10 blur-[150px]" />

          <div className="absolute -left-40 top-[350px] h-[400px] w-[400px] rounded-full bg-[#8c52ff]/10 blur-[150px]" />

          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(#5921c7 1px, transparent 1px), linear-gradient(90deg, #5921c7 1px, transparent 1px)",
              backgroundSize: "55px 55px",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-[1300px] px-5 sm:px-6 lg:px-8">
          {/* Hero Content */}

          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
            {/* Left Content */}

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0}
              className="flex flex-col items-start"
            >
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-gray-700 sm:text-sm">
                ENGINEERING MANUFACTURING & PRODUCT DEVELOPMENT
              </p>

              <h1 className="mb-5 text-4xl font-black leading-[1.3] tracking-tight text-[#17121f] sm:text-5xl lg:text-[30px]">
                Special Purpose Machinery (SPM){" "}
                <br />
                <span className="bg-gradient-to-r from-[#5921c7] via-[#8c52ff] to-[#5921c7] bg-clip-text text-transparent">
                  Build Smart Machines & Devices with Us.
                </span>
              </h1>

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "90px" }}
                transition={{
                  duration: 0.8,
                  delay: 0.3,
                  ease: "easeOut",
                }}
                className="mb-5 h-0.5 rounded-full bg-gradient-to-r from-[#5921c7] to-[#8c52ff]"
              />

              <p className="mb-9 max-w-xl text-justify text-[16px] leading-7 text-gray-700">
                We design and develop custom machinery upon client
                requirements, bridging the gap between complex engineering
                and functional reality. Our team manages every phase:
                conceptual design, precision sourcing, high-standard
                production, and long-term maintenance.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#5921c7] to-[#8c52ff] px-7 py-4 text-sm font-bold text-white shadow-[0_8px_35px_rgba(140,82,255,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(140,82,255,0.4)]"
                >
                  Discuss Your Project

                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </a>
              </div>
            </motion.div>

            {/* Right Image */}

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="relative mx-auto w-full max-w-[620px]"
            >
              <div className="relative aspect-[8/5] overflow-hidden rounded-[30px] shadow-[0_20px_60px_rgba(48,16,111,0.12)]">
                <Image
                  src="/cpf/cpf-hero.jpg"
                  alt="Custom Machinery and Product Fabrication"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </motion.div>
          </div>

          {/* OUR EXPERTISE */}

          <div className="mt-12 border-t border-gray-200 pt-8">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_3fr] lg:items-center lg:gap-10">
              {/* Expertise Heading */}

              <motion.div
                initial="hidden"
                whileInView="visible"
                variants={fadeUp}
                viewport={{ once: true }}
              >
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.25em] text-gray-700">
                  WHAT WE DO
                </p>

                <h2 className="text-3xl font-black tracking-tight sm:text-3xl">
                  <span className="bg-gradient-to-r from-[#5921c7] via-[#8c52ff] to-[#5921c7] bg-clip-text text-transparent">
                    Our Expertise
                  </span>
                </h2>
              </motion.div>

              {/* Expertise Cards */}

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
              >
                {specializedAreas.map((area) => (
                  <motion.div
                    key={area.title}
                    variants={itemVariants}
                    className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-[#faf9fc] p-5 transition-all duration-300 hover:-translate-y-2 hover:border-[#8c52ff]/50 hover:bg-white hover:shadow-[0_15px_40px_rgba(89,33,199,0.12)]"
                  >
                    <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#8c52ff]/0 blur-3xl transition-all duration-500 group-hover:bg-[#8c52ff]/15" />

                    <div className="relative z-10">
                      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-[#8c52ff]/20 bg-[#5921c7]/10 text-[#5921c7] transition-all duration-300 group-hover:border-[#8c52ff]/50 group-hover:bg-[#5921c7] group-hover:text-white">
                        {area.icon}
                      </div>

                      <p className="mb-2 text-[9px] font-bold tracking-[0.16em] text-[#5921c7]">
                        {area.subtitle}
                      </p>

                      <h3 className="mb-3 text-base font-bold leading-tight text-[#21172f]">
                        {area.title}
                      </h3>

                      <div className="mb-4 h-px w-10 bg-[#8c52ff]/50 transition-all duration-300 group-hover:w-16" />

                      <p className="text-[10px] font-bold tracking-wider text-gray-600">
                        {area.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* DEVELOPMENT LIFECYCLE - DARK THEME */}
      {/* ====================================================== */}

      <section className="relative z-10 overflow-hidden bg-[#30106f] py-20 text-white md:py-10">
        <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#8c52ff]/20 blur-[140px]" />

        <div className="relative mx-auto max-w-[1300px] px-5 sm:px-6 lg:px-8">
          {/* Section Heading */}

          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeUp}
            viewport={{ once: true }}
            className="mx-auto mb-6 max-w-3xl text-center"
          >
            <p className="mb-2 text-[13px] font-bold uppercase tracking-[0.25em] text-purple-300">
              HOW WE WORK
            </p>

            <h2 className="mb-2 text-3xl font-black tracking-tight text-white sm:text-4xl md:text-3xl">
              Our Development{" "}
              <span className="bg-gradient-to-r from-[#b18aff] to-[#ffffff] bg-clip-text text-transparent">
                Lifecycle
              </span>
            </h2>

            <p className="text-sm leading-7 text-purple-100 sm:text-base">
              We follow a rigorous engineering workflow to ensure your custom
              machinery is delivered with peak performance and reliability.
            </p>
          </motion.div>

          {/* Process Cards */}

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid gap-6 md:grid-cols-2 xl:grid-cols-4"
          >
            {steps.map((step) => (
              <motion.div
                key={step.number}
                variants={itemVariants}
                className="group relative rounded-3xl border border-white/[0.10] bg-[#3e1b86] p-7 transition-all duration-300 hover:-translate-y-2 hover:border-[#b18aff]/60 hover:shadow-[0_15px_40px_rgba(0,0,0,0.15)]"
              >
                <div className="mb-8 flex items-center justify-between">
                  <span className="text-4xl font-black tracking-tight text-white/20 transition-colors duration-300 group-hover:text-purple-300/50">
                    {step.number}
                  </span>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-300/20 bg-white/10 text-purple-200 transition-all duration-300 group-hover:bg-[#8c52ff] group-hover:text-white">
                    {step.icon}
                  </div>
                </div>

                <h3 className="mb-4 text-xl font-bold leading-tight text-white transition-colors group-hover:text-purple-200">
                  {step.title}
                </h3>

                <p className="text-sm leading-7 text-purple-100/75">
                  {step.desc}
                </p>

                <div className="mt-7 flex items-center gap-2">
                  <div className="h-1 w-8 rounded-full bg-[#b18aff]" />
                  <div className="h-1 w-3 rounded-full bg-purple-300/30" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* WHY CHOOSE US - LIGHT THEME */}
      {/* ====================================================== */}

      <section className="relative z-10 overflow-hidden border-y border-gray-200 bg-[#f7f6fa] py-20 text-[#17121f] md:py-10">
        <div className="pointer-events-none absolute -right-40 top-0 h-[450px] w-[450px] rounded-full bg-[#5921c7]/10 blur-[150px]" />

        <div className="relative mx-auto max-w-[1300px] px-5 sm:px-6 lg:px-8">
          {/* Heading */}

          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeUp}
            viewport={{ once: true }}
            className="mb-6 text-center"
          >
            <p className="mb-4 text-[13px] font-bold uppercase tracking-[0.25em] text-gray-700">
              THE ADROIIT ADVANTAGE
            </p>

            <h2 className="mb-2 text-3xl font-black tracking-tight text-[#17121f] sm:text-4xl md:text-3xl">
              Why Choose Our{" "}
              <span className="bg-gradient-to-r from-[#5921c7] via-[#8c52ff] to-[#5921c7] bg-clip-text text-transparent">
                Fabrication Service?
              </span>
            </h2>

            <p className="mx-auto max-w-2xl text-sm leading-7 text-gray-700 sm:text-base">
              We combine mechatronics expertise with industrial production
              capabilities to deliver results that exceed expectations.
            </p>
          </motion.div>

          {/* USP Cards */}

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {whyChooseItems.map((item) => (
              <motion.div
                key={item.title}
                variants={itemVariants}
                className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#8c52ff]/50 hover:shadow-[0_15px_40px_rgba(89,33,199,0.10)] sm:p-8"
              >
                <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#8c52ff]/0 blur-3xl transition-all duration-500 group-hover:bg-[#8c52ff]/15" />

                <div className="relative z-10">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#8c52ff]/20 bg-[#5921c7]/10 text-[#5921c7] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#5921c7] group-hover:text-white">
                    {item.icon}
                  </div>

                  <h3 className="mb-3 text-lg font-bold text-[#21172f] transition-colors group-hover:text-[#5921c7]">
                    {item.title}
                  </h3>

                  <p className="text-sm leading-7 text-gray-600">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* FAQ SECTION - DARK THEME */}
      {/* ====================================================== */}

      <section className="relative z-10 overflow-hidden bg-[#30106f] px-5 py-20 text-white sm:px-6 md:py-10 lg:px-8">
        <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-[#8c52ff]/20 blur-[130px]" />

        <div className="relative mx-auto max-w-[1100px]">
          {/* FAQ Heading */}

          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeUp}
            viewport={{ once: true }}
            className="mx-auto mb-6 max-w-3xl text-center"
          >
            <p className="mb-4 text-[13px] font-bold uppercase tracking-[0.25em] text-purple-300">
              GOT QUESTIONS?
            </p>

            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-3xl">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-[#b18aff] to-white bg-clip-text text-transparent">
                Questions
              </span>
            </h2>

            <p className="mx-auto mt-2 max-w-2xl text-sm leading-7 text-purple-100 sm:text-base">
              Find answers to common questions about our custom machinery,
              product development and engineering services.
            </p>
          </motion.div>

          {/* FAQ Accordion */}

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="space-y-4"
          >
            {faqs.map((faq, index) => {
              const isOpen = openFAQ === index;

              return (
                <motion.div
                  key={faq.question}
                  variants={itemVariants}
                  className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                    isOpen
                      ? "border-purple-300/50 bg-[#3e1b86] shadow-[0_10px_35px_rgba(0,0,0,0.15)]"
                      : "border-white/[0.12] bg-[#3e1b86]/70 hover:border-purple-300/40"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFAQ(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-7 sm:py-6"
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`hidden text-sm font-black sm:block ${
                          isOpen ? "text-purple-300" : "text-white/30"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span
                        className={`text-sm font-bold leading-6 sm:text-base ${
                          isOpen ? "text-purple-200" : "text-white"
                        }`}
                      >
                        {faq.question}
                      </span>
                    </div>

                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                        isOpen
                          ? "rotate-180 bg-[#8c52ff] text-white"
                          : "bg-white/10 text-purple-200"
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
                      <div className="border-t border-white/[0.10] px-5 pb-6 pt-5 sm:pl-[4.25rem] sm:pr-7">
                        <p className="text-sm leading-7 text-purple-100/75">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ====================================================== */}
      {/* FINAL CTA - LIGHT THEME */}
      {/* ====================================================== */}

      <section className="relative z-10 overflow-hidden bg-[#f7f6fa] px-5 py-20 text-[#17121f] sm:px-6 md:py-10 lg:px-8">
        <div className="pointer-events-none absolute -right-40 top-0 h-[450px] w-[450px] rounded-full bg-[#8c52ff]/10 blur-[150px]" />

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto max-w-[1300px] text-center"
        >
          <div className="mx-auto max-w-3xl">
            <p className="mb-4 text-[13px] font-bold uppercase tracking-[0.25em] text-gray-700">
              LET'S ENGINEER SOMETHING GREAT
            </p>

            <h2 className="mb-2 text-3xl font-black leading-tight tracking-tight text-[#17121f] sm:text-4xl md:text-3xl">
              Ready to Build Your{" "}
              <span className="bg-gradient-to-r from-[#5921c7] via-[#8c52ff] to-[#5921c7] bg-clip-text text-transparent">
                Custom Product?
              </span>
            </h2>

            <p className="mx-auto mb-4 max-w-2xl text-sm leading-8 text-gray-700 sm:text-base">
              Connect with our engineering team today to transform your
              technical requirement into a fully functional product.
            </p>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#5921c7] to-[#8c52ff] px-9 py-4 text-sm font-bold text-white shadow-[0_8px_35px_rgba(140,82,255,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_45px_rgba(140,82,255,0.45)] sm:text-base"
            >
              Consult with Us

              <ArrowRight
                size={19}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
          </div>
        </motion.div>
      </section>

      {/* ====================================================== */}
      {/* FOOTER */}
      {/* ====================================================== */}

      <Footer />
    </div>
  );
}
