
"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  PenTool,
  PackageCheck,
  Star,
  Banknote,
  Boxes,
  Infinity,
  Truck,
  Lock,
  Printer,
  Lightbulb,
  GraduationCap,
  Settings2,
  FileCheck2,
  ScanLine,
  Check,
  ChevronDown,
  ShieldCheck,
  Zap,
  Cog,
  Layers,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Bricolage_Grotesque } from "next/font/google";
import Footer from "@/sections/Footer";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.09,
      duration: 0.65,
      ease: "easeOut",
    },
  }),
};

const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
};

const viewport = { once: true, amount: 0.15 };

export default function ThreeDPrintingPage() {
  const whatsappLink =
    "https://wa.me/918870002908?text=Hi%20Adroiit%20Technovations%2C%20I%20would%20like%20to%20enquire%20about%20your%203D%20printing%20service.";

  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // ============================================================
  // APPLICATIONS
  // ============================================================

  const applications = [
    {
      number: "01",
      title: "Rapid Prototyping",
      description:
        "Convert early-stage concepts and CAD designs into physical prototypes for evaluation, testing, and refinement.",
      icon: <Lightbulb size={25} />,
      tag: "IDEA TO PROTOTYPE",
    },
    {
      number: "02",
      title: "Functional Components",
      description:
        "Create customized parts, mechanical components, brackets, enclosures, and practical replacement components.",
      icon: <Settings2 size={25} />,
      tag: "ENGINEERED PARTS",
    },
    {
      number: "03",
      title: "Academic Models",
      description:
        "Bring educational models, project components, and student innovations into the physical world.",
      icon: <GraduationCap size={25} />,
      tag: "LEARN BY BUILDING",
    },
    {
      number: "04",
      title: "Custom Products",
      description:
        "Produce personalized objects, product concepts, custom enclosures, and low-volume production parts.",
      icon: <Boxes size={25} />,
      tag: "MADE TO YOUR NEEDS",
    },
  ];

  // ============================================================
  // PROCESS
  // ============================================================

  const steps = [
    {
      title: "Share Your Design",
      description:
        "Send your STL, STEP, 3MF, or other supported design file along with your requirements.",
      detail: "DESIGN SUBMISSION",
      icon: <FileCheck2 size={25} />,
    },
    {
      title: "Technical Evaluation",
      description:
        "Our team reviews the model, dimensions, geometry, material requirements, and print feasibility.",
      detail: "FILE VALIDATION",
      icon: <ScanLine size={25} />,
    },
    {
      title: "Precision Printing",
      description:
        "Your model is manufactured using suitable print settings, material selection, and quality checks.",
      detail: "PRODUCTION",
      icon: <Printer size={25} />,
    },
    {
      title: "Quality & Delivery",
      description:
        "The finished component is inspected, securely packaged, and dispatched to your location.",
      detail: "FINAL DELIVERY",
      icon: <PackageCheck size={25} />,
    },
  ];

  // ============================================================
  // MATERIALS
  // ============================================================

  const materials = [
    {
      name: "PLA",
      subtitle: "Everyday versatility",
      description:
        "An excellent choice for concept models, educational projects, decorative objects, and general-purpose prototypes.",
      applications: [
        "Concept models",
        "Educational projects",
        "Decorative products",
      ],
      label: "GENERAL PURPOSE",
      icon: <Layers size={25} />,
      number: "01",
    },
    {
      name: "ABS",
      subtitle: "Strength and toughness",
      description:
        "A thermoplastic option for selected functional applications that require toughness and improved heat resistance.",
      applications: [
        "Functional components",
        "Mechanical enclosures",
        "Engineering prototypes",
      ],
      label: "ENGINEERING",
      icon: <ShieldCheck size={25} />,
      number: "02",
    },
    {
      name: "PETG",
      subtitle: "Balanced performance",
      description:
        "A practical balance of strength, flexibility, and durability for functional parts and everyday applications.",
      applications: [
        "Functional parts",
        "Protective enclosures",
        "Durable components",
      ],
      label: "VERSATILE",
      icon: <Zap size={25} />,
      number: "03",
    },
    {
      name: "PC",
      subtitle: "Advanced applications",
      description:
        "A higher-performance material option for selected applications requiring enhanced mechanical properties.",
      applications: [
        "Specialized components",
        "Engineering applications",
        "Performance-oriented parts",
      ],
      label: "ADVANCED",
      icon: <Cog size={25} />,
      number: "04",
    },
  ];

  // ============================================================
  // WHY CHOOSE US
  // ============================================================

  const whyChooseItems = [
    {
      icon: <Star size={23} />,
      title: "Quality-Focused Printing",
      description:
        "Careful print preparation and quality checks to deliver consistent, dependable results.",
    },
    {
      icon: <Banknote size={23} />,
      title: "Competitive Pricing",
      description:
        "Cost-conscious printing solutions with pricing based on material, complexity, and requirements.",
    },
    {
      icon: <Boxes size={23} />,
      title: "Prototype to Production",
      description:
        "Support for individual prototypes, custom components, and suitable batch requirements.",
    },
    {
      icon: <Infinity size={23} />,
      title: "No Minimum Order",
      description:
        "Order a single prototype or multiple components according to your project needs.",
    },
    {
      icon: <Lock size={23} />,
      title: "Confidential File Handling",
      description:
        "Your design files are handled responsibly with an emphasis on confidentiality.",
    },
    {
      icon: <Truck size={23} />,
      title: "Pan-India Delivery",
      description:
        "Get your finished 3D printed components delivered across India.",
    },
  ];

  // ============================================================
  // FAQS
  // ============================================================

  const faqs = [
    {
      question: "What 3D printing technology do you use?",
      answer:
        "We use Fused Deposition Modeling (FDM) technology with our Bambu Lab A1 3D printer. The process builds components layer by layer using thermoplastic filament.",
    },
    {
      question: "Which file formats can I submit?",
      answer:
        "You can share commonly used 3D model formats such as STL, 3MF, and OBJ. If you have a CAD design in another format, contact our team so we can help determine the best way to prepare it for printing.",
    },
    {
      question: "What if I do not have a 3D model?",
      answer:
        "You can consult our CAD design team. Share your concept, sketch, dimensions, or reference images, and our designers can help develop a suitable 3D model. Visit our Mechanical CAD service page to learn more.",
    },
    {
      question: "Which materials are available?",
      answer:
        "We offer material options such as PLA, ABS, PETG, and PC, subject to application requirements and material availability. Our team can help you choose a suitable material based on strength, durability, appearance, and intended use.",
    },
    {
      question: "Can you print functional mechanical components?",
      answer:
        "Yes. We can manufacture selected functional components, brackets, enclosures, prototypes, and customized mechanical parts. Print feasibility depends on the geometry, material, tolerances, and intended operating conditions.",
    },
    {
      question: "Do you accept single-piece orders?",
      answer:
        "Yes. We accept individual prototype requirements as well as suitable batch orders. There is no fixed minimum order quantity.",
    },
    {
      question: "Do you provide delivery outside Puducherry?",
      answer:
        "Yes. We provide Pan-India delivery. Shipping availability, charges, and delivery timelines are confirmed based on your location and order requirements.",
    },
    {
      question: "How is the final printing cost determined?",
      answer:
        "The final price depends on filament consumption, material selection, print settings, model complexity, post-processing requirements, quantity, and delivery. Share your model with us for a quotation.",
    },
  ];

  return (
    <div
      className={`${bricolage.className} min-h-screen overflow-x-hidden bg-white text-[#17151c]`}
    >
      {/* ===================================================== */}
      {/* HERO — LIGHT                                          */}
      {/* ===================================================== */}

      <section className="relative isolate overflow-hidden bg-white pb-20 pt-35 text-[#17151c] md:pb-28 md:pt-35">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(89,33,199,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(89,33,199,0.25) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="pointer-events-none absolute -left-48 top-20 h-[420px] w-[420px] rounded-full bg-[#5921c7]/10 blur-[130px]" />
        <div className="pointer-events-none absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-[#8c52ff]/10 blur-[130px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-gray-700 sm:text-sm"
          >
            ADDITIVE MANUFACTURING THROUGH
          </motion.p>

          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={sectionReveal}
              className="flex flex-col items-start"
            >
              <motion.h1
                variants={fadeUp}
                className="max-w-2xl text-[40px] font-black leading-[1.08] tracking-tight sm:text-[52px] lg:text-[32px]"
              >
                FDM 3D Printing Service
                <span className="mt-2 block bg-gradient-to-r from-[#5921c7] via-[#8c52ff] to-[#5921c7] bg-clip-text text-transparent">
                  Turn Digital Design To Physical Reality.
                </span>
              </motion.h1>

              <motion.div
                variants={fadeUp}
                className="my-4 h-0.5 w-20 rounded-full bg-gradient-to-r from-[#5921c7] to-[#8c52ff]"
              />

              <motion.p
                variants={fadeUp}
                className="max-w-xl text-[14px] leading-9 text-gray-700 md:text-[17px]"
              >
                Transform your ideas into functional prototypes and tangible
                products with Adroiit Technovations&apos; FDM 3D printing
                services. From rapid prototypes and engineering components to
                customized products, we help turn your CAD designs into
                reality.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
              >
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#5921c7] px-7 py-4 text-[14px] font-bold text-white shadow-xl shadow-purple-900/15 transition-all duration-300 hover:-translate-y-1 hover:bg-[#7540e8]"
                >
                  Request a Quote
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </a>

                <Link
                  href="/services/mechanical-cad"
                  className="inline-flex items-center justify-center gap-3 rounded-full border border-[#5921c7]/25 bg-white px-7 py-4 text-[14px] font-bold text-[#5921c7] transition-all hover:border-[#8c52ff] hover:bg-[#f8f5ff]"
                >
                  <PenTool size={17} />
                  Need a CAD Designer?
                </Link>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="mt-10 grid w-full grid-cols-3 gap-3 sm:gap-5"
              >
                {[
                  { value: "100+", label: "Orders Delivered" },
                  { value: "2000+", label: "Parts Printed" },
                  { value: "99%", label: "On-Time Delivery" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="border-l border-[#8c52ff]/40 pl-3 sm:pl-5"
                  >
                    <p className="text-[22px] font-black tracking-tight text-[#30106f] sm:text-[28px]">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-[9px] font-bold uppercase leading-4 tracking-[0.12em] text-gray-700 sm:text-[10px]">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* HERO IMAGE */}

            <motion.div
              initial={{ opacity: 0, scale: 0.94, x: 25 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.85, ease: "easeOut", delay: 0.2 }}
              className="relative mx-auto w-full max-w-[610px]"
            >
              <div className="absolute -inset-4 rounded-[36px] bg-gradient-to-br from-[#8c52ff]/20 via-transparent to-[#5921c7]/15 blur-2xl" />

              <div className="relative aspect-[7/5] overflow-hidden rounded-[22px] border border-[#5921c7]/10 shadow-[0_20px_60px_rgba(48,16,111,0.12)]">
                <Image
                  src="/3d-printing/3d-printing-hero.jpg"
                  alt="FDM 3D printing using Bambu Lab A1"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* APPLICATIONS — DARK                                   */}
      {/* ===================================================== */}

      <section className="relative overflow-hidden bg-[#30106f] py-20 text-white md:py-10">
        <div className="pointer-events-none absolute -right-40 top-0 h-80 w-80 rounded-full bg-[#8c52ff]/20 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={sectionReveal}
            className="mx-auto mb-14 max-w-3xl text-center"
          >
            <motion.p
              variants={fadeUp}
              className="mb-3 text-[13px] font-bold uppercase tracking-[0.22em] text-purple-300"
            >
              What can we manufacture?
            </motion.p>

            <motion.h2
              variants={fadeUp}
              className="text-[32px] font-black leading-9 tracking-tight text-white md:text-[32px]"
            >
              One technology.
              <span className="block text-white">
                Countless applications.
              </span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-5 max-w-3xl text-[14px] leading-7 text-gray-200 md:text-[16px]"
            >
              Whether you are developing a new product, building an engineering
              project, or creating a customized component, 3D printing helps
              accelerate the journey from concept to creation.
            </motion.p>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {applications.map((item, i) => (
              <motion.div
                key={item.number}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                variants={fadeUp}
                whileHover={{ y: -7 }}
                className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-[#3e1b86] p-7 transition-all duration-300 hover:border-[#b99aff]/50 hover:shadow-[0_16px_40px_rgba(0,0,0,0.16)]"
              >
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#8c52ff]/10 blur-3xl transition-all group-hover:bg-[#8c52ff]/25" />

                <div className="relative flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-purple-300 transition-colors group-hover:bg-[#8c52ff] group-hover:text-white">
                    {item.icon}
                  </div>
                </div>

                <p className="relative mt-5 text-[10px] font-bold tracking-[0.2em] text-purple-300">
                  {item.tag}
                </p>

                <h3 className="relative mt-2 text-[16px] font-bold text-white">
                  {item.title}
                </h3>

                <p className="relative mt-2 text-[13px] leading-7 text-gray-200">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* PROCESS — LIGHT                                       */}
      {/* ===================================================== */}

      <section className="relative overflow-hidden bg-white py-20 text-[#17151c] md:py-10">
        <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-purple-100/70 blur-[120px]" />
        <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-purple-100/50 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={sectionReveal}
            className="mx-auto mb-16 max-w-3xl text-center"
          >
            <motion.p
              variants={fadeUp}
              className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-gray-700"
            >
              Simple. Structured. Seamless.
            </motion.p>

            <motion.h2
              variants={fadeUp}
              className="text-[32px] font-black tracking-tight md:text-[28px]"
            >
              <span className="bg-gradient-to-r from-[#5921c7] via-[#8c52ff] to-[#5921c7] bg-clip-text text-transparent">
                From file submission to final delivery.
              </span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mt-2 text-[14px] leading-7 text-gray-700 md:text-[16px]"
            >
              Our structured workflow ensures your design is reviewed,
              manufactured, and delivered with care at every stage.
            </motion.p>
          </motion.div>

          <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="absolute left-[12%] right-[12%] top-8 hidden h-px border-t border-dashed border-[#c4aaff] lg:block" />

            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                variants={fadeUp}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="relative mb-7">
                  <div className="flex h-[68px] w-[68px] items-center justify-center rounded-[22px] border border-[#5921c7]/10 bg-[#f2edff] text-[#5921c7] shadow-[0_8px_30px_rgba(89,33,199,0.10)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#8c52ff] hover:text-white">
                    {step.icon}
                  </div>

                  <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#5921c7] text-[12px] font-black text-white">
                    {i + 1}
                  </div>
                </div>

                <p className="text-[12px] font-bold tracking-[0.18em] text-[#5921c7]">
                  {step.detail}
                </p>

                <h3 className="mt-2 text-[17px] font-bold text-[#17151c]">
                  {step.title}
                </h3>

                <p className="mt-2 max-w-[250px] text-[13px] leading-7 text-gray-700">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* MATERIAL SELECTION — DARK                             */}
      {/* ===================================================== */}

      <section className="relative overflow-hidden bg-[#30106f] py-20 text-white md:py-10">
        <div className="pointer-events-none absolute -right-40 top-10 h-96 w-96 rounded-full bg-[#8c52ff]/20 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={sectionReveal}
            className="mx-auto mb-12 max-w-3xl text-center"
          >
            <motion.p
              variants={fadeUp}
              className="mb-3 text-[13px] font-bold uppercase tracking-[0.22em] text-purple-300"
            >
              Material selection
            </motion.p>

            <motion.h2
              variants={fadeUp}
              className="text-[32px] font-black leading-[1.15] tracking-tight text-white md:text-[32px]"
            >
              Every material has a purpose.
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-3 max-w-3xl text-[14px] leading-8 text-gray-200 md:text-[16px]"
            >
              The right material makes a difference in the strength,
              durability, appearance, and performance of your printed part.
              We help you identify suitable options based on your design and
              intended application.
            </motion.p>
          </motion.div>

          {/* MATERIAL CARDS */}

          <div className="grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {materials.map((material, i) => (
              <motion.div
                key={material.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                variants={fadeUp}
                whileHover={{ y: -5 }}
                className="group relative flex flex-col overflow-hidden rounded-[24px] border border-white/10 bg-[#3e1b86] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.10)] transition-all duration-300 hover:border-purple-300/50 hover:shadow-[0_15px_35px_rgba(0,0,0,0.18)] sm:p-7"
              >
                <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#8c52ff]/10 blur-3xl transition-all group-hover:bg-[#8c52ff]/20" />

                <div className="relative flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-purple-300 transition-all group-hover:bg-[#8c52ff] group-hover:text-white">
                    {material.icon}
                  </div>
                </div>

                <div className="relative mt-4 flex items-center justify-between gap-3">
                  <h3 className="text-[19px] font-black text-white">
                    {material.name}
                  </h3>
                </div>

                <p className="relative mt-2 text-[13px] font-bold text-purple-200">
                  {material.subtitle}
                </p>

                <p className="relative mt-2 text-[12px] leading-7 text-gray-200">
                  {material.description}
                </p>

                <div className="relative mt-2 flex-1 border-t border-white/10 pt-5">
                  <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-purple-200">
                    Suitable applications
                  </p>

                  <div className="space-y-2">
                    {material.applications.map((application) => (
                      <div
                        key={application}
                        className="flex items-center gap-2"
                      >
                        <Check
                          size={13}
                          className="shrink-0 text-purple-300"
                        />
                        <span className="text-[12px] font-medium text-gray-200">
                          {application}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* THE DIFFERENTIATORS — LIGHT                           */}
      {/* ===================================================== */}

      <section className="relative overflow-hidden bg-white py-20 text-[#17151c] md:py-10">
        <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-purple-100/70 blur-[120px]" />
        <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-purple-100/60 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={sectionReveal}
            className="mx-auto mb-12 max-w-3xl text-center"
          >
            <motion.p
              variants={fadeUp}
              className="mb-3 text-[13px] font-bold uppercase tracking-[0.22em] text-gray-700"
            >
              The differentiators
            </motion.p>

            <motion.h2
              variants={fadeUp}
              className="text-[32px] font-black tracking-tight md:text-[32px]"
            >
              <span className="bg-gradient-to-r from-[#5921c7] via-[#8c52ff] to-[#5921c7] bg-clip-text text-transparent">
                Why print with Adroiit Technovations?
              </span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mt-2 text-[14px] leading-7 text-gray-700 md:text-[16px]"
            >
              We combine practical engineering understanding with accessible
              digital manufacturing to support ideas at every stage.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {whyChooseItems.map((item, i) => (
              <motion.div
                key={item.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={viewport}
                variants={fadeUp}
                whileHover={{ y: -5 }}
                className="group flex gap-5 rounded-[22px] border border-[#5921c7]/10 bg-[#f8f5ff] p-6 shadow-[0_8px_30px_rgba(48,16,111,0.05)] transition-all duration-300 hover:border-[#8c52ff]/40 hover:bg-white hover:shadow-[0_16px_35px_rgba(48,16,111,0.10)]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#5921c7]/10 text-[#5921c7] transition-all group-hover:bg-[#5921c7] group-hover:text-white">
                  {item.icon}
                </div>

                <div>
                  <h3 className="text-[15px] font-bold text-[#17151c]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-6 text-gray-700">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* FAQ — DARK                                            */}
      {/* ===================================================== */}

      <section className="relative overflow-hidden bg-[#30106f] py-20 text-white md:py-10">
        <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-[#8c52ff]/20 blur-[120px]" />
        <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#5921c7]/30 blur-[120px]" />

        <div className="relative mx-auto max-w-4xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={sectionReveal}
            className="mx-auto mb-12 max-w-3xl text-center"
          >
            <motion.p
              variants={fadeUp}
              className="mb-3 text-[13px] font-semibold uppercase tracking-[0.22em] text-purple-300"
            >
              Frequently asked questions
            </motion.p>

            <motion.h2
              variants={fadeUp}
              className="text-[32px] font-black leading-tight tracking-tight text-white md:text-[32px]"
            >
              Got questions?
              <span className="block text-white">We have answers.</span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="mx-auto mt-2 max-w-3xl text-[14px] leading-8 text-gray-200 md:text-[15px]"
            >
              Find answers to common questions about our 3D printing services,
              materials, design files and delivery.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            variants={sectionReveal}
            className="space-y-3"
          >
            {faqs.map((faq, i) => {
              const isOpen = activeFaq === i;

              return (
                <motion.div
                  key={faq.question}
                  variants={fadeUp}
                  className={`overflow-hidden rounded-[18px] border transition-colors duration-300 ${
                    isOpen
                      ? "border-purple-300/50 bg-[#3e1b86]"
                      : "border-white/10 bg-[#3e1b86]/60 hover:border-white/20"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setActiveFaq((current) => (current === i ? null : i))
                    }
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-6"
                  >
                    <span
                      className={`text-[13px] font-bold leading-6 sm:text-[14px] ${
                        isOpen ? "text-white" : "text-gray-200"
                      }`}
                    >
                      {faq.question}
                    </span>

                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                        isOpen
                          ? "rotate-180 bg-[#8c52ff] text-white"
                          : "bg-white/10 text-purple-200"
                      }`}
                    >
                      <ChevronDown size={17} />
                    </span>
                  </button>

                  <div
                    className={`grid transition-all duration-300 ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-[12px] leading-7 text-gray-200 sm:px-6 sm:text-[13px]">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* BOTTOM CTA — LIGHT                                    */}
      {/* ===================================================== */}

      <section className="relative overflow-hidden bg-white px-6 py-20 text-[#17151c] md:py-10">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[450px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-100/70 blur-[120px]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.7 }}
          className="relative mx-auto max-w-4xl text-center"
        >
          <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.25em] text-gray-700">
            Your idea deserves to be built
          </p>

          <h2 className="text-[34px] font-black leading-tight tracking-tight sm:text-[42px] md:text-[32px]">
            Ready to turn your{" "}
            <span className="bg-gradient-to-r from-[#5921c7] via-[#8c52ff] to-[#5921c7] bg-clip-text text-transparent">
              design into reality?
            </span>
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-[14px] leading-8 text-gray-700 md:text-[16px]">
            Whether you have a ready-to-print 3D model or just an idea, Adroiit
            Technovations can help you take the next step. Let&apos;s build
            something meaningful together.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#5921c7] px-8 py-4 text-[14px] font-bold text-white shadow-lg shadow-purple-900/15 transition-all hover:-translate-y-1 hover:bg-[#7540e8]"
            >
              Request a Quote
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>

            <Link
              href="/services/mechanical-cad"
              className="inline-flex items-center justify-center gap-3 rounded-full border border-[#8c52ff]/30 bg-white px-8 py-4 text-[14px] font-bold text-[#5921c7] transition-all hover:-translate-y-1 hover:border-[#8c52ff] hover:bg-[#f8f5ff]"
            >
              <PenTool size={17} />
              Need a CAD Designer?
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
