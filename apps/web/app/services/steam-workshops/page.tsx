
"use client";

import { motion, type Variants } from "framer-motion";
import { useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Compass,
  Cpu,
  Lightbulb,
  Microscope,
  Rocket,
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
    image: "/steam-workshop/electronics.jpg",
    title: "Electronics & Circuits Building",
    description:
      "Explore the fundamentals of electricity, electronic components and how electronic devices work by connecting components and building circuits.",
  },
  {
    image: "/steam-workshop/3d-printing.png",
    title: "3D Modelling & Printing",
    description:
      "Discover how to create 3D digital designs, understand dimensions and transform virtual models into physical objects using 3D printing technology.",
  },
  {
    image: "/steam-workshop/embedded-systems.jpg",
    title: "Embedded Systems",
    description:
      "Understand how microcontrollers interact with electronic components, sensors, actuators and explore the development of programmable electronic systems.",
  },
  {
    image: "/steam-workshop/robotics.jpg",
    title: "Robotics",
    description:
      "Discover robot construction, mechanical movements, motor control, sensor integration, programming of robots to navigate in environments and perform automated tasks.",
  },
  {
    image: "/steam-workshop/drone.jpg",
    title: "Drone Technology",
    description:
      "Explore the science of flight, flight controllers, propulsion systems, drone components, operations, stability, navigation and applications across different industries.",
  },
  {
    image: "/steam-workshop/ai.jpg",
    title: "Artificial Intelligence",
    description:
      "Introduces AI fundamentals, machine learning, computer vision and explore how intelligent systems recognise information, make predictions and solve problems.",
  },
];

const bootcampProgrammes = [
  {
    image: "/services/junior-robochamp3.jpg",
    level: "MASTER THE FOUNDATION OF ROBOTICS",
    title: "Junior RoboChamp",
    description:
      "A hands-on robotics programme that strenghtens the foundation in electronics, gradually diving into embedded systems - sensor and actuator interfacing and ",
    topics: ["Electronics", "Arduino", "Sensors and actuators", "Robotics"],
    audience: "Young technology explorers",
  },
  {
    image: "/services/ultimate-tech-mastery6.png",
    level: "MULTIPLE TECH EXPLORATION",
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
    title: "Explore",
    subtitle: "Build curiosity",
    description:
      "Discover new concepts and spark curiosity through exploration.",
    icon: BookOpen,
  },
  {
    number: "02",
    title: "Experiment",
    subtitle: "Learn by doing",
    description:
      "Understand concepts through hands-on activities and practical experiments.",
    icon: Microscope,
  },
  {
    number: "03",
    title: "Build",
    subtitle: "Turn ideas into reality",
    description:
      "Transform innovative ideas into functional projects and prototypes.",
    icon: Wrench,
  },
  {
    number: "04",
    title: "Innovate",
    subtitle: "Improve the idea",
    description:
      "Refine creations through creative thinking, testing and problem-solving.",
    icon: Rocket,
  },
];

const workshopHighlights = [
  {
    title: "Curriculum Connected Learning",
    description:
      "Connects classroom concepts with practical applications, reinforcing academic understanding through real-world technology experiences.",
    icon: Wrench,
  },
  {
    title: "Hands-on Approach",
    description:
      "Move beyond theoretical learning through interactive activities that encourage students to explore, experiment, build and innovate.",
    icon: Trophy,
  },
  {
    title: "Strengthens STEAM Understanding",
    description:
      "Integrates Science, Technology, Engineering, Arts and Mathematics to develop inter-disciplinary thinking, creativity and problem-solving skills.",
    icon: Lightbulb,
  },
  {
    title: "Real Components & Tools",
    description:
      "Gives students practical exposure to actual electronic components, engineering tools, development boards and technology kits.",
    icon: Cpu,
  },
  {
    title: "Engaging Live Demonstrations",
    description:
      "Breaks down complex technologies into simpler analogies through interactive demonstrations that spark curiosity and make advanced concepts easier to understand.",
    icon: Zap,
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
    question: "How does the STEAM workshops benefit the students?",
    answer:
      "Through our STEAM workshops, students enhance their STEAM concepts understanding, develop practical skills, creativity, crictical thinking and problem-solving abilities through engaging activities, experiments and projects.",
  },
  {
    question: "Which grades can participate in the workshops?",
    answer:
      "Our workshops are designed for the students from Grade 6 to 12, with activities and technical complexity adapted to their age, grade level and learning capabilities.",
  },
  {
    question: "Do students require prior technical knowledge to participate?",
    answer:
      "No. Our workshops are designed for complete beginners, introducing the foundational concepts through simple explanations, guided demonstrations and step-by-step hands-on activities, enabling them to learn, experiment and build projects confidently.",
  },
  {
    question: "Will students build actual working projects?",
    answer:
      "Absolutely! Students will actively engage in designing, assembling, programming and testing of the projects they have build, depending on the workshop domain.",
  },
  {
    question: "What is the duration of each workshop?",
    answer:
      "Workshops can range from short introductory sessions to half-day, full-day and multi-day sessions, depending on the selected topic and learning objectives.",
  },
  {
    question: "Can workshops be customized according to our school's requirements?",
    answer:
      "Yes! We customize workshop themes, durations and activities based on your school's academic objectives, available infrastructure, student age-groups and learning priorities.",
  },
  {
    question: "Does the school need to provide any equipment or materials?",
    answer:
      "No. Adroiit Technovations will arrange the required equipment, kits, tools and learning materials. Schools generally need to provide a suitable classroom or activity space.",
  },
  {
    question: "Will students receive certificates to the participating students?",
    answer:
      "Yes! Participation certificates to the students and Acknowlegement certificates to the school and the participating staff members of the school will be provided upon the successful completion of the workshop.",
  },
  {
    question: "When can the workshops be scheduled?",
    answer:
      "Workshops can be scheduled during regular school hours, activity periods, special programs, science days or other mutually agreed school events.",
  },
  {
    question: "Will the school receive any documentations or reports?",
    answer:
      "Yes! Schools will receive workshop report which includes summaries, activity details, participation information and photographs of the workshop conducted.",
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
        className={`text-[13px] font-semibold uppercase tracking-[0.12em] ${
          light ? "text-purple-300" : "text-gray-700"
        }`}
      >
        {eyebrow}
      </p>

      <h2
        className={`mt-3 text-2xl sm:text-[28px] font-bold leading-[1.12] tracking-tight ${
          light
            ? "text-white"
            : "bg-gradient-to-r from-[#30106f] via-[#8c52ff] to-[#30106f] bg-clip-text text-transparent"
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
          : "bg-[#5020b0] text-[#ffffff]"
      }`}
    >
      <Icon size={23} />
    </div>
  );
}

function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [currentPage, setCurrentPage] = useState(0);

  const questionsPerPage = 5;
  const totalPages = Math.ceil(workshopFAQs.length / questionsPerPage);

  const visibleFAQs = workshopFAQs.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  );

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(0, page - 1));
    setOpenIndex(null);
  };

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(totalPages - 1, page + 1));
    setOpenIndex(null);
  };

  return (
    <div>
      <div className="space-y-3">
        {visibleFAQs.map((faq, index) => {
          const faqIndex = currentPage * questionsPerPage + index;
          const isOpen = openIndex === faqIndex;

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
                onClick={() => setOpenIndex(isOpen ? null : faqIndex)}
                className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-7"
              >
                <span className="text-[15px] font-semibold leading-6 text-white sm:text-base">
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
                  <p className="px-5 pb-5 text-sm leading-7 text-gray-200 sm:px-7 sm:pb-6">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-center gap-4">
        <button
          type="button"
          aria-label="Previous questions"
          onClick={goToPreviousPage}
          disabled={currentPage === 0}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-purple-300 hover:bg-[#3e1b86] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft size={18} />
        </button>

        <button
          type="button"
          aria-label="Next questions"
          onClick={goToNextPage}
          disabled={currentPage === totalPages - 1}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-purple-300 hover:bg-[#3e1b86] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowRight size={18} />
        </button>
      </div>
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
          description="A glimpse into the activities, technologies and hands-on experiences that inspire students to explore, experiment, build and innovate."
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
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
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
              className="text-[13px] font-bold uppercase tracking-[0.12em] text-gray-700"
            >
              SPARK CURIOSITY AND DRIVE INNOVATION THROUGH
            </motion.p>

            <motion.h1
              variants={item}
              className="mt-3 max-w-3xl text-[24px] font-black leading-[1.3] text-[#3e1b86] tracking-tight sm:text-[30px] md:text-[30px]"
            >
              Interactive STEAM Workshops
              <br />
              <span className="bg-gradient-to-r from-[#5921c7] via-[#8c52ff] to-[#5921c7] bg-clip-text text-transparent">
                Inspiring Minds . Fueling Makers
              </span>
            </motion.h1>

            <motion.div
              variants={item}
              className="my-4 h-1 w-25 rounded-full bg-gradient-to-r from-[#5921c7] to-[#c4a8ff]"
            />

            {/* MOBILE HERO IMAGE — BELOW GRADIENT LINE */}
            <motion.div
              variants={item}
              className="relative mx-auto mb-5 w-full max-w-[800px] lg:hidden"
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

            <motion.p
              variants={item}
              className="max-w-2xl text-[17px] leading-8 text-gray-900"
            >
              Empower your students with future-ready skills through
              hands-on STEAM workshops. Designed to complement
              academic learning, our workshops bring technology, everyday STEAM
              concepts, creativity and problem-solving activities into the classroom.
            </motion.p>

            <motion.p
              variants={item}
              className="mt-4 max-w-2xl text-[17px] leading-8 text-gray-900"
            >
              Through our structured, practical workshops, we urge to help schools 
              enrich their academic curriculum, strengthen experiential learning, 
              encourage innovation and provide students with meangingful exposure 
              for their impactful futures.
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

          {/* DESKTOP HERO IMAGE — RIGHT COLUMN */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
              delay: 0.2,
            }}
            className="relative mx-auto hidden w-full max-w-[800px] lg:ml-auto lg:block"
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

                  <p className="mt-1 text-[12px] font-bold uppercase tracking-[0.12em] text-purple-300">
                    {stage.subtitle}
                  </p>

                  <p className="mt-1 text-[14px] leading-6 text-gray-200">
                    {stage.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* WORKSHOP DOMAINS — LIGHT */}
      <section
        id="workshops"
        className="bg-[#f7f5fb] px-6 py-10 text-[#17121f] md:py-10"
      >
        <div className="mx-auto max-w-[950px]">
          <div className="mb-6 text-center">
            <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-gray-600">
              Explore the possibilities
            </p>

            <h2 className="mt-3 text-2xl sm:text-[28px] font-bold leading-tight tracking-tight bg-gradient-to-r from-[#30106f] via-[#8c52ff] to-[#30106f] bg-clip-text text-transparent">
              Our Interactive Workshops
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-7 text-gray-600">
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
                className="group overflow-hidden rounded-[20px] border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:border-[#8c52ff]/50 hover:shadow-xl"
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
                  <h3 className="text-[17px] font-bold text-[#5921c7] transition-colors group-hover:text-[#8c52ff]">
                    {domain.title}
                  </h3>

                  <p className="mt-2 text-[14px] leading-6 text-gray-800">
                    {domain.description}
                  </p>
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
            title="What makes our workshops unique?"
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

                <h3 className="mt-4 text-[17px] font-bold text-white transition-colors group-hover:text-purple-200">
                  {highlight.title}
                </h3>

                <p className="mt-2 text-sm leading-7 text-gray-300">
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
            title="Everything you need to know about our STEAM workshops"
            description="Find answers to common questions about our workshops."
          />

          <FAQAccordion />
        </div>
      </section>

      {/* FINAL CTA — LIGHT */}
      <section className="relative isolate overflow-hidden bg-white px-6 py-5 text-[#17121f] md:py-5">
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
          <span className="mt-6 block text-[13px] font-semibold uppercase tracking-[0.12em] text-gray-600">
            Give your students the opportunity to explore, experiment, build and innovate.
          </span>

          <h2 className="mt-4 text-2xl sm:text-[30px] font-bold leading-tight tracking-tight text-[#30106f]">
            <span className=" bg-gradient-to-r from-[#30106f] via-[#8c52ff] to-[#30106f] bg-clip-text text-transparent">
              Let us ignite spark of curiosity.
            </span>
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-8 text-gray-900">
            Partner with Adroiit Technovations to bring interactive
            STEAM workshops to your institution.
          </p>

          <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#5921c7]/20 px-7 py-4 text-sm font-bold text-[#5921c7] transition-all hover:border-[#8c52ff] hover:bg-[#5921c7]/5 sm:w-auto"
            >
              Talk to Our Team
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
