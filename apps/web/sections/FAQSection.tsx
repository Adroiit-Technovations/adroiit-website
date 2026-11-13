"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  MessageCircle,
} from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
});

// ============================================================
// FAQ DATA
// ============================================================

const faqs = [
  {
    category: "ABOUT ADROIIT",
    question: "What is Adroiit Technovations?",
    answer:
      "Adroiit Technovations is an Education and Product Development firm based in Puducherry, India. Founded by mechatronics engineers, we work at the intersection of education, engineering, and innovation. Through our Education, Product Development, and Research & Development divisions, we empower learners, businesses, and institutions to turn ideas into practical solutions.",
  },
  {
    category: "ABOUT ADROIIT",
    question: "What are the core divisions of Adroiit Technovations?",
    answer:
      "Adroiit operates through three core divisions. Education focuses on experiential STEAM learning, technical training, and skill development. Product Development delivers engineering design, prototyping, and custom product solutions. Research & Development focuses on exploring technologies, developing innovative concepts, and creating practical engineering solutions.",
  },
  {
    category: "EDUCATION",
    question: "What educational services does Adroiit offer?",
    answer:
      "We offer STEAM Tinkering & Innovation Labs, Composite Skill Labs, STEAM Workshops and Bootcamps, Centers of Excellence, Value Added Courses, and Technical Workshops. Our programs cover areas such as electronics, Arduino programming, robotics, IoT, drone technology, artificial intelligence, 3D modelling, and emerging technologies.",
  },
  {
    category: "EDUCATION",
    question: "Which schools and educational institutions can collaborate with Adroiit?",
    answer:
      "We collaborate with schools, colleges, and other educational institutions to establish technology-driven learning environments and deliver practical skill-development programs. Our solutions can be structured around institutional requirements, student learning levels, available infrastructure, and academic objectives.",
  },
  {
    category: "EDUCATION",
    question: "Are Adroiit's educational programs aligned with NEP 2020?",
    answer:
      "Our educational initiatives are designed around experiential, activity-based, and technology-driven learning approaches that support the vision of NEP 2020 and NCF 2023. We also consider relevant NCERT and CBSE academic frameworks while developing age-appropriate learning experiences.",
  },
  {
    category: "EDUCATION",
    question: "Do students get hands-on experience with actual hardware?",
    answer:
      "Absolutely. Practical learning is central to our educational approach. Students work with electronic components, development boards, sensors, actuators, robotics platforms, and other technology kits. We also develop and assemble our own Arduino and ESP32-based learning kits to provide meaningful hands-on engineering experiences.",
  },
  {
    category: "ENGINEERING",
    question: "What engineering and product development services do you provide?",
    answer:
      "Our engineering capabilities include SPM manufacturing and custom machinery fabrication, FDM 3D printing, mechanical CAD, 2D drafting, 3D modelling, assembly design, prototyping, and product development. We work towards translating concepts and engineering requirements into functional, manufacturable solutions.",
  },
  {
    category: "ENGINEERING",
    question: "Can Adroiit develop custom products or machinery based on our requirements?",
    answer:
      "Yes. We undertake customised engineering and product development projects based on specific requirements. Depending on the project, our involvement can include concept development, mechanical design, CAD modelling, prototyping, fabrication, and assembly. Project scope and feasibility are evaluated before proceeding.",
  },
  {
    category: "COLLABORATION",
    question: "Does Adroiit work with startups and industries?",
    answer:
      "Yes. We welcome collaborations with startups, businesses, industries, and institutions. Our engineering and product development capabilities can support organisations looking for prototyping, mechanical design, custom machinery, and technology-based solutions.",
  },
  {
    category: "COLLABORATION",
    question: "Does Adroiit offer internships and technical training?",
    answer:
      "Yes. We offer internship and practical learning opportunities across selected technical and non-technical domains. Depending on the program, participants may gain exposure to embedded systems, IoT, mechanical CAD, drone technology, research and development, and other areas. Visit our Internship page for current opportunities.",
  },
  {
    category: "COLLABORATION",
    question: "Where is Adroiit Technovations located?",
    answer:
      "Adroiit Technovations is based in Puducherry, India. You can reach out to us through our Contact Us page for enquiries, project discussions, institutional collaborations, and service-related requirements.",
  },
  {
    category: "COLLABORATION",
    question: "How can I collaborate with or get started with Adroiit?",
    answer:
      "Getting started is simple. Reach out to us through our Contact Us page with your requirements. Whether you represent a school, college, startup, business, or industry, our team will connect with you to understand your objectives and explore suitable solutions.",
  },
];

// ============================================================
// ANIMATIONS
// ============================================================

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut" as const,
    },
  },
};

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      className={`${bricolage.className} relative isolate overflow-hidden bg-[#080510] px-5 py-14 text-white sm:px-8 sm:py-20 lg:px-10 lg:py-24`}
    >
      {/* ================================================== */}
      {/* BACKGROUND EFFECTS */}
      {/* ================================================== */}

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-10 h-[400px] w-[400px] rounded-full bg-[#8c52ff]/[0.10] blur-[140px]" />

        <div className="absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full bg-[#5921c7]/[0.12] blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #8c52ff 1px, transparent 1px), linear-gradient(to bottom, #8c52ff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage:
              "radial-gradient(ellipse at center, black 15%, transparent 85%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 15%, transparent 85%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* ================================================== */}
        {/* SECTION HEADER */}
        {/* ================================================== */}

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto mb-12 max-w-3xl text-center lg:mb-16"
        >
          {/* Eyebrow */}

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#8c52ff]/25 bg-[#8c52ff]/[0.08] px-4 py-2">
            <MessageCircle
              size={14}
              className="text-[#b58aff]"
            />

            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c5a5ff] sm:text-xs">
              Frequently Asked Questions
            </span>
          </div>

          {/* Heading */}

          <h2 className="text-3xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-[42px]">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-[#8c52ff] via-[#b58aff] to-[#8c52ff] bg-clip-text text-transparent">
              Know About Us
            </span>
          </h2>

          {/* Description */}

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-[1.9] text-gray-400 sm:text-base">
            Curious about what we do, how we work, or how we can
            collaborate? Find answers to some of the most common
            questions about Adroiit Technovations.
          </p>
        </motion.div>

        {/* ================================================== */}
        {/* FAQ ACCORDION */}
        {/* ================================================== */}

        <div className="mx-auto max-w-4xl">

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeIndex === index;

              return (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{
                    duration: 0.4,
                    delay: (index % 4) * 0.05,
                  }}
                  className={`overflow-hidden rounded-xl border transition-all duration-300 ${
                    isOpen
                      ? "border-[#8c52ff]/45 bg-[#171020] shadow-[0_8px_30px_rgba(89,33,199,0.12)]"
                      : "border-white/[0.08] bg-[#110c1b] hover:border-[#8c52ff]/30 hover:bg-[#151020]"
                  }`}
                >
                  {/* QUESTION */}

                  <button
                    type="button"
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6 sm:py-6"
                  >
                    <div className="flex min-w-0 items-start gap-4">

                      {/* QUESTION NUMBER */}

                      <span
                        className={`mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-[10px] font-bold transition-colors duration-300 ${
                          isOpen
                            ? "bg-[#5921c7] text-white"
                            : "bg-white/[0.06] text-gray-500"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      {/* QUESTION CONTENT */}

                      <div className="min-w-0">
                        <span className="mb-1.5 block text-[9px] font-bold uppercase tracking-[0.17em] text-[#9b73e8]">
                          {faq.category}
                        </span>

                        <h3
                          className={`text-sm font-semibold leading-relaxed transition-colors duration-300 sm:text-base ${
                            isOpen
                              ? "text-white"
                              : "text-gray-300"
                          }`}
                        >
                          {faq.question}
                        </h3>
                      </div>
                    </div>

                    {/* TOGGLE ICON */}

                    <span
                      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                        isOpen
                          ? "rotate-180 border-[#8c52ff]/50 bg-[#5921c7] text-white"
                          : "border-white/10 bg-white/[0.04] text-gray-400"
                      }`}
                    >
                      <ChevronDown size={17} />
                    </span>
                  </button>

                  {/* ANSWER */}

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-answer-${index}`}
                        initial={{
                          height: 0,
                          opacity: 0,
                        }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                        transition={{
                          duration: 0.3,
                          ease: "easeInOut",
                        }}
                        className="overflow-hidden"
                      >
                        <div className="ml-12 mr-5 border-t border-white/[0.07] px-0 pb-5 pt-4 sm:ml-[68px] sm:mr-6 sm:pb-6">
                          <p className="text-xs leading-[1.9] text-gray-400 sm:text-sm">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ================================================== */}
        {/* BOTTOM CONTACT CTA */}
        {/* ================================================== */}

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto mt-14 max-w-4xl overflow-hidden rounded-2xl border border-[#8c52ff]/20 bg-gradient-to-br from-[#1c1031] via-[#160d25] to-[#10091c] px-6 py-9 text-center sm:mt-16 sm:px-10 sm:py-12"
        >
          {/* Decorative Glow */}

          <div className="pointer-events-none relative">
            <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8c52ff]/15 blur-[70px]" />
          </div>

          <div className="relative z-10">

            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#b58aff] sm:text-xs">
              Still Have Questions?
            </p>

            <h3 className="text-xl font-extrabold leading-tight text-white sm:text-3xl">
              Let's Build Something Innovative Together.
            </h3>

            <p className="mx-auto mt-3 max-w-xl text-xs leading-[1.9] text-gray-400 sm:text-sm">
              Whether you're an educational institution, a startup,
              or an industry professional, we'd love to hear from you
              and explore how we can work together.
            </p>

            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">

              {/* CONTACT BUTTON */}

              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#8c52ff] px-7 py-3 text-xs font-bold text-white shadow-[0_5px_20px_rgba(140,82,255,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#5921c7] hover:shadow-[0_8px_25px_rgba(140,82,255,0.35)] sm:text-sm"
              >
                Contact Us

                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>

              {/* SERVICES BUTTON */}

              <Link
                href="/services"
                className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-7 py-3 text-xs font-bold text-gray-300 transition-all duration-300 hover:border-[#8c52ff]/50 hover:bg-[#8c52ff]/10 hover:text-white sm:text-sm"
              >
                Explore Our Solutions

                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}