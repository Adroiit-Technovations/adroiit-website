"use client";

import { motion, type Variants } from "framer-motion";
import { useState } from "react";
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
  ChevronDown,
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

const galleryImages = [
  {
    image: "/steam-workshop/dsc-1.jpeg",
    title: "Hands-on STEAM Learning",
  },
  {
    image: "/steam-workshop/dsc-2.jpeg",
    title: "Hands-on STEAM Learning",
  },
  {
    image: "/steam-workshop/dsc-3.jpeg",
    title: "Hands-on STEAM Learning",
  },
  {
    image: "/steam-workshop/dsc-4.jpeg",
    title: "Hands-on STEAM Learning",
  },
  {
    image: "/steam-workshop/dsc-5.jpeg",
    title: "Hands-on STEAM Learning",
  },
  {
    image: "/steam-workshop/dsc-6.jpeg",
    title: "Hands-on STEAM Learning",
  },
  {
    image: "/steam-workshop/dsc-7.jpeg",
    title: "Hands-on STEAM Learning",
  },
  {
    image: "/steam-workshop/dsc-8.jpeg",
    title: "Hands-on STEAM Learning",
  },
  {
    image: "/steam-workshop/dsc-9.jpeg",
    title: "Hands-on STEAM Learning",
  },
];

const workshopFAQs = [
  {
    question: "Who can participate in the STEAM workshops and bootcamps?",
    answer:
      "Our workshops and bootcamps are designed for school students and young learners. The topics, activities and level of technical depth can be adapted to suit the age group and learning requirements of the institution.",
  },
  {
    question: "What is the difference between a STEAM workshop and a bootcamp?",
    answer:
      "A workshop is a short-format experience that introduces selected concepts through demonstrations and guided activities. A bootcamp is a structured, multi-session programme that gives students more time to develop technical skills and complete practical projects.",
  },
  {
    question: "Which domains are covered in the programmes?",
    answer:
      "Depending on the programme, students can explore electronics and circuits, 3D modelling and printing, embedded systems, robotics, drone technology and artificial intelligence.",
  },
  {
    question: "Do students get hands-on experience with real components and tools?",
    answer:
      "Yes. Our learning experiences emphasise practical activities using electronic components, technology kits, tools and equipment, supported by mentor-led demonstrations and guidance.",
  },
  {
    question: "Can the workshops be conducted at our school or institution?",
    answer:
      "Yes. We offer flexible engagement models, including workshops, bootcamps, institutional programmes and customised STEAM initiatives. The delivery format can be planned around your institution's objectives and facilities.",
  },
  {
    question: "Can the programme be customised for different age groups?",
    answer:
      "Yes. Topics, activity complexity and project outcomes can be tailored to the students' age, prior exposure, available time and the institution's learning objectives.",
  },
  {
    question: "Will students build projects during the sessions?",
    answer:
      "Practical making and project development are central to our approach. Depending on the format, students experiment with concepts, assemble or programme solutions, and demonstrate what they have created.",
  },
  {
    question: "How can our institution collaborate with Adroiit Technovations?",
    answer:
      "You can contact our team with your institution's requirements. We will discuss the intended student group, learning objectives, preferred format and schedule to plan a suitable STEAM experience.",
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
      className={`${centered ? "mx-auto text-center" : ""} mb-10 max-w-7xl`}
    >
      <p
        className={`text-[13px] font-bold uppercase tracking-[0.15em] ${
          light ? "text-purple-300" : "text-gray-700"
        }`}
      >
        {eyebrow}
      </p>

      <h2
        className={`mt-3 text-[30px] font-black leading-[1.12] tracking-tight ${
          light
            ? "text-white"
            : "bg-gradient-to-r from-[#5921c7] via-[#8c52ff] to-[#5921c7] bg-clip-text text-transparent"
        }`}
      >
        {title}
      </h2>

      {description && (
        <p
          className={`mt-3 text-[15px] leading-7 sm:text-base ${
            light ? "text-gray-200" : "text-gray-600"
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

function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {workshopFAQs.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <motion.article
            key={faq.question}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={item}
            className="overflow-hidden rounded-2xl border border-white/10 bg-[#3e1b86] transition-colors hover:border-purple-300/40"
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-7"
            >
              <span className="text-[15px] font-bold leading-6 text-white sm:text-base">
                {faq.question}
              </span>

              <ChevronDown
                size={20}
                className={`shrink-0 text-purple-300 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`grid transition-all duration-300 ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-sm leading-7 text-white/70 sm:px-7 sm:pb-6">
                  {faq.answer}
                </p>
              </div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}

function ExperienceGallery() {
  return (
    <section
      aria-label="STEAM workshop gallery"
      className="relative overflow-hidden bg-[#f7f5fb] py-10"
    >
      <div className="mx-auto max-w-[1290px] px-6">
        <SectionHeading
          eyebrow="Inside our STEAM experiences"
          title="Learning that comes to life."
          description="A glimpse into the activities, technologies and hands-on experiences that inspire students to explore, experiment and create."
        />
      </div>

      <div className="gallery-marquee relative w-full overflow-hidden">
        <div className="gallery-track flex w-max">
          {[0, 1].map((group) => (
            <div
              key={group}
              className="flex shrink-0 gap-5 pr-5"
              aria-hidden={group === 1}
            >
              {galleryImages.map((galleryImage, index) => (
                <article
                  key={`${group}-${galleryImage.title}-${index}`}
                  className="gallery-card group relative h-[230px] w-[310px] shrink-0 overflow-hidden rounded-[22px] bg-[#30106f] shadow-[0_12px_35px_rgba(48,16,111,0.12)] sm:h-[280px] sm:w-[380px]"
                >
                  <Image
                    src={galleryImage.image}
                    alt={group === 0 ? galleryImage.title : ""}
                    fill
                    sizes="(max-width: 640px) 310px, 380px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#f7f5fb] to-transparent sm:w-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#f7f5fb] to-transparent sm:w-20" />

      <style jsx>{`
        .gallery-track {
          animation: gallery-scroll 65s linear infinite;
          will-change: transform;
        }

        .gallery-marquee:hover .gallery-track {
          animation-play-state: paused;
        }

        @keyframes gallery-scroll {
          from {
            transform: translateX(-50%);
          }
          to {
            transform: translateX(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .gallery-track {
            animation: none;
            transform: translateX(0);
          }
        }
      `}</style>
    </section>
  );
}

export default function STEAMWorkshopsBootcampsPage() {
  return (
    <main
      className={`${bricolage.className} min-h-screen overflow-hidden bg-white text-[#17121f]`}
    >
      {/* HERO — LIGHT */}
      <section className="relative isolate overflow-hidden bg-[#f7f5fb] text-[#17121f]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(89,33,199,0.12) 1px, transparent 1px), linear-gradient(90deg,rgba(89,33,199,0.12) 1px,transparent 1px)",
            backgroundSize: "55px 55px",
          }}
        />

        <div className="pointer-events-none absolute -left-40 top-10 h-[450px] w-[450px] rounded-full bg-[#5921c7]/10 blur-[130px]" />

        <div className="pointer-events-none absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-[#8c52ff]/10 blur-[130px]" />

        <div className="relative mx-auto grid max-w-[1290px] items-center gap-12 px-6 pb-20 pt-35 md:pb-18 md:pt-35 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="relative z-10"
          >
            <motion.p
              variants={item}
              className="text-[13px] font-bold uppercase tracking-[0.2em] text-gray-700"
            >
              SPARK CURIOSITY AND DRIVE INNOVATION THROUGH
            </motion.p>

            <motion.h1
              variants={item}
              className="mt-3 max-w-3xl text-[24px] font-black leading-[1.3] text-[#3e1b86] tracking-tight sm:text-[30px] md:text-[30px]"
            >
              STEAM Workshops and Bootcamps
              <br />
              <span className="bg-gradient-to-r from-[#5921c7] via-[#8c52ff] to-[#5921c7] bg-clip-text text-transparent">
                Inspiring Minds . Fueling Makers
              </span>
            </motion.h1>

            <motion.div
              variants={item}
              className="my-4 h-1 w-25 rounded-full bg-gradient-to-r from-[#5921c7] to-[#c4a8ff]"
            />

            <motion.p
              variants={item}
              className="max-w-2xl text-[17px] leading-8 text-gray-900"
            >
              Empower your students with future-ready skills through
              hands-on STEAM workshops and bootcamps. Designed to complement
              academic learning, our programs bring technology, everyday STEAM
              concepts, creativity and problem-solving activities into the classroom.
            </motion.p>

            <motion.p
              variants={item}
              className="mt-4 max-w-2xl text-[17px] leading-8 text-gray-900"
            >
              Through our structured,
              practical programs, we urge to help schools enrich their academic
              curriculum, strengthen experiential learning, encourage innovation
              and provide students with meangingful exposure for their impactful
              futures.
            </motion.p>

            <motion.div
              variants={item}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="/contact"
                className="bg-gradient-to-r from-[#481f9b] to-[#5921c7] hover:opacity-90 transition px-7 py-3.5 rounded-4xl font-semibold text-sm text-white flex items-center justify-center gap-2 group shadow-lg shadow-purple-900/30"
              >
                Enquire Now
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <a
                href="#workshops"
                className="group inline-flex items-center justify-center gap-3 rounded-full border border-[#5921c7]/25 bg-white px-7 py-4 text-sm font-bold text-[#30106f] transition-all duration-300 hover:-translate-y-1 hover:border-[#8c52ff] hover:bg-[#5921c7]/5"
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
            className="relative mx-auto w-full max-w-[800px] lg:ml-auto"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-[20px]">
              <Image
                src="/projects/dsc-9.jpeg"
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

      {/* LEARNING JOURNEY — DARK */}
      <section className="bg-[#30106f] px-6 py-10 text-white md:py-10">
        <div className="mx-auto max-w-[1290px]">
          <SectionHeading
            light
            eyebrow="The Adroiit learning approach"
            title={
              <>
                From understanding concepts
                <span className="block text-white">
                  to creating something real.
                </span>
              </>
            }
            description="A practical learning cycle that encourages students to explore, question, learn and build."
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
                  <div className="relative z-10 mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-[20px] border border-[#8c52ff] bg-[#3e1b86] text-white shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#ffffff] group-hover:bg-[#5921c7] group-hover:text-white">
                    <stage.icon size={27} />

                    <span className="absolute -right-3 -top-3 flex h-7 w-7 items-center justify-center rounded-full border-[3px] border-[#30106f] bg-[#8c52ff] text-[10px] font-black text-white">
                      {stage.number}
                    </span>
                  </div>

                  <h3 className="text-[18px] font-black text-white transition-colors group-hover:text-purple-200">
                    {stage.title}
                  </h3>

                  <p className="mt-1 text-[12px] font-bold uppercase tracking-[0.14em] text-purple-300">
                    {stage.subtitle}
                  </p>

                  <p className="mt-3 text-[14px] leading-7 text-gray-200">
                    {stage.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* WORKSHOP VS BOOTCAMP — LIGHT */}
      <section className="relative overflow-hidden bg-[#f7f5fb] px-6 py-16 text-[#17121f] md:py-10">
        <div className="pointer-events-none absolute -right-36 top-0 h-80 w-80 rounded-full bg-[#5921c7]/20 blur-[120px]" />

        <div className="relative mx-auto max-w-[1000px]">
          <SectionHeading
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
              className="rounded-[26px] border border-gray-200 bg-white p-7 shadow-sm transition-all duration-300 hover:border-[#8c52ff]/40 hover:shadow-lg sm:p-8"
            >
              <div className="flex items-center gap-4">
                <IconTile icon={Microscope} light />

                <h3 className="text-[22px] font-black text-[#30106f]">
                  STEAM Workshops
                </h3>
              </div>

              <p className="mt-6 text-[13px] font-extrabold uppercase tracking-[0.2em] text-[#5921c7]">
                Short-duration exploration
              </p>

              <p className="mt-4 text-sm leading-7 text-gray-600">
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
                    className="flex items-start gap-3 text-sm text-gray-600"
                  >
                    <CheckCircle2
                      size={17}
                      className="mt-0.5 shrink-0 text-[#5921c7]"
                    />
                    {point}
                  </li>
                ))}
              </ul>

              <a
                href="#workshops"
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-full border border-[#5921c7]/20 bg-[#5921c7] px-5 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#8c52ff]"
              >
                Explore Workshop Domains
                <ArrowRight size={16} />
              </a>
            </motion.article>

            <motion.article
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={item}
              className="rounded-[26px] border border-gray-200 bg-white p-7 shadow-sm transition-all duration-300 hover:border-[#8c52ff]/40 hover:shadow-lg sm:p-8"
            >
              <div className="flex items-center gap-4">
                <IconTile icon={Rocket} />

                <h3 className="text-[22px] font-black text-[#30106f]">
                  STEAM Bootcamps
                </h3>
              </div>

              <p className="mt-6 text-[13px] font-extrabold uppercase tracking-[0.2em] text-[#5921c7]">
                in-depth learning programmes
              </p>

              <p className="mt-4 text-sm leading-7 text-gray-600">
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
                    className="flex items-start gap-3 text-sm text-gray-600"
                  >
                    <CheckCircle2
                      size={17}
                      className="mt-0.5 shrink-0 text-[#5921c7]"
                    />
                    {point}
                  </li>
                ))}
              </ul>

              <a
                href="#programmes"
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-full border border-[#5921c7]/20 bg-[#5921c7] px-5 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#8c52ff]"
              >
                Explore Bootcamp Programmes
                <ArrowRight size={16} />
              </a>
            </motion.article>
          </div>
        </div>
      </section>

      {/* WORKSHOP DOMAINS — DARK */}
      <section
        id="workshops"
        className="bg-[#30106f] px-6 py-10 text-white md:py-10"
      >
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-10 text-center">
            <p className="text-[13px] font-extrabold uppercase tracking-[0.22em] text-purple-300">
              Explore the possibilities
            </p>

            <h2 className="mt-4 text-[30px] font-black leading-tight tracking-tight text-white">
              Our Workshop <span className="text-purple-300">Domains</span>
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-white/70">
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
                className="group overflow-hidden rounded-[20px] border border-white/10 bg-[#3e1b86] shadow-sm transition-all duration-300 hover:border-purple-300/50 hover:shadow-xl"
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
                  <h3 className="text-[17px] font-black text-white transition-colors group-hover:text-purple-200">
                    {domain.title}
                  </h3>

                  <p className="mt-2 text-[13px] leading-6 text-white/70">
                    {domain.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* BOOTCAMP PROGRAMMES — LIGHT */}
      <section
        id="programmes"
        className="relative overflow-hidden bg-[#f7f5fb] px-6 py-10 text-[#17121f] md:py-10"
      >
        <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#5921c7]/20 blur-[130px]" />

        <div className="relative mx-auto max-w-[900px]">
          <SectionHeading
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
                className="group overflow-hidden rounded-[22px] border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-[#8c52ff]/50 hover:shadow-[0_20px_60px_rgba(89,33,199,0.16)]"
              >
                <div className="relative aspect-[16/8] overflow-hidden">
                  <Image
                    src={programme.image}
                    alt={programme.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="p-5 sm:p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#5921c7]">
                    {programme.level}
                  </p>

                  <h3 className="mt-2 text-[23px] font-black text-[#21172f]">
                    {programme.title}
                  </h3>

                  <p className="mt-4 text-[13px] leading-6 text-gray-600">
                    {programme.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {programme.topics.map((topic) => (
                      <span
                        key={topic}
                        className="rounded-full border border-[#8c52ff]/20 bg-[#5921c7]/15 px-3 py-1.5 text-[11px] font-semibold text-[#5921c7]"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-col gap-4 border-t border-gray-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-gray-500">
                        Learning focus
                      </p>

                      <p className="mt-1 text-sm font-semibold text-[#21172f]">
                        {programme.audience}
                      </p>
                    </div>

                    <Link
                      href="/contact"
                      className="group/link inline-flex items-center gap-2 text-sm font-bold text-[#5921c7] transition-all hover:text-[#8c52ff]"
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

      {/* ADROIIT EXPERIENCE — DARK */}
      <section className="bg-[#30106f] px-6 py-10 text-white md:py-10">
        <div className="mx-auto max-w-[1100px]">
          <SectionHeading
            light
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
                className="group rounded-[22px] border border-white/10 bg-[#3e1b86] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-purple-300/45 hover:bg-[#482095] hover:shadow-lg"
              >
                <IconTile icon={highlight.icon} />

                <h3 className="mt-5 text-[17px] font-black text-white transition-colors group-hover:text-purple-200">
                  {highlight.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-white/70">
                  {highlight.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* EXPERIENCE GALLERY — LIGHT */}
      <ExperienceGallery />

      {/* FAQs — DARK */}
      <section className="bg-[#30106f] px-6 py-10 text-white md:py-10">
        <div className="mx-auto max-w-[950px]">
          <SectionHeading
            light
            eyebrow="Frequently asked questions"
            title="Everything you need to know about our STEAM experiences."
            description="Find answers to common questions about our workshops, bootcamps and institutional programmes."
          />

          <FAQAccordion />
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