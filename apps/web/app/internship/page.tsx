
"use client";

import {
  motion,
  AnimatePresence,
  type Variants,
} from "framer-motion";

import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Code2,
  GraduationCap,
  Lightbulb,
  Rocket,
  Minus,
  Plus,
  Quote,
  TrendingUp,
  FolderKanban,
  Users,
  Wrench,
  Trophy,
  Settings,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { Bricolage_Grotesque } from "next/font/google";
import { useState, useEffect, useMemo } from "react";

import InternshipApplication from "@/components/internship-application";
import Footer from "@/sections/Footer";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
});

// ============================================================
// CUSTOMISABLE SECTION TITLE SIZE
// ============================================================

// Change this value to modify all section heading sizes in pixels.
const SECTION_TITLE_SIZE_PX = 30;

// ============================================================
// ANIMATIONS
// ============================================================

const sectionVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// ============================================================
// DATA
// ============================================================

const testimonials = [
  {
    name: "Sri Sanjana",
    role: "Research & Development Intern",
    text: "Working as an intern has been a valuable and exciting experience. I had the opportunity to learn practical skills, work on real-time projects and gain hands-on exposure. The team is supportive, encouraging and always ready to guide.",
  },
  {
    name: "Rithikka",
    role: "Research & Development Intern",
    text: "Good place to go on with STEM Education and Robotics Courses.",
  },
  {
    name: "Shanmugapriya",
    role: "Research & Development Intern",
    text: "I built my first Arduino project here. Learning is fun and practical!",
  },
  {
    name: "Aarthi",
    role: "Embedded Systems & IoT Intern",
    text: "The environment was positive and supportive, and the team was helpful throughout. Overall, it was a useful experience that helped me improve my technical knowledge and skills.",
  },
  {
    name: "Sandra Talma",
    role: "Embedded Systems & IoT Intern",
    text: "The experience at Adroiit Technovations was good and helpful. The environment was friendly and the guidance provided helped in understanding how work is done in a professional setting.",
  },
  {
    name: "Yogeshwaran",
    role: "Research & Development Intern",
    text: "I truly appreciate the valuable learning experience and hands-on exposure I gained during my internship, which helped me develop both my technical and professional skills.",
  },
];

const faqs = [
  {
    question: "Who can apply for the internships?",
    answer:
      "Our program is open to students currently pursuing graduation (B.E/B.Tech/B.Sc) or recent graduates passionate about robotics, IoT, and STEM education. We look for curiosity and a maker mindset.",
  },
  {
    question: "Do I need prior experience?",
    answer:
      "No prior experience is required. The internship is designed to guide you from basic to advanced concepts with proper mentorship.",
  },
  {
    question: "What is the duration of the internship?",
    answer:
      "Typically, our internships range from 4 to 12 weeks, depending on the domain and project requirements. Flexible schedules are available for ongoing students.",
  },
  {
    question: "Will I receive a certificate upon completion?",
    answer:
      "Yes, interns who successfully complete the programme and meet the required criteria receive an internship certificate from Adroiit Technovations. A detailed performance report and letter of recommendation may also be considered for eligible top performers.",
  },
  {
    question: "Is this a paid internship?",
    answer:
      "We offer both stipend-based and learning-based internships depending on the project complexity and candidate's experience level. Details are shared during the interview process.",
  },
  {
    question: "Is there any fee for the internship?",
    answer:
      "There is no general fee for the internship. However, if a candidate lacks specific skills required for the internship, a separate training fee may apply depending on the training structure. Any applicable charges will be communicated in advance.",
  },
  {
    question: "Can I work remotely?",
    answer:
      "While some domains like Digital Marketing and Founders' Office allow hybrid models, technical roles like Drone Technology and Embedded Systems generally require physical presence at our R&D labs for hardware access.",
  },
];

// ============================================================
// INTERNSHIP DOMAINS
// ============================================================

const domains = [
  {
    title: "Embedded Systems & IoT",
    status: "Open",
    desc: "Architect smart solutions using ESP32, Arduino, sensors and connected technologies.",
    image: "/internship/embedded-system.jfif",
  },
  {
    title: "Internet of Things Intern",
    status: "Open",
    desc: "Build connected applications using ESP32, sensors, cloud platforms, IoT dashboards and wireless communication.",
    image: "/internship/iot4.jfif",
  },
  {
    title: "Mechatronics Intern",
    status: "Open",
    desc: "Work across mechanical systems, electronics, sensors and embedded control to develop integrated solutions.",
    image: "/internship/mechatronics4.jfif",
  },
  {
    title: "Research & Development",
    status: "Open",
    desc: "Experiment with emerging technologies and develop innovative STEM solutions.",
    image: "/internship/rnd.jpg",
  },
  {
    title: "Mechanical CAD",
    status: "Open",
    desc: "Design high-precision mechanical components and explore 3D modelling workflows.",
    image: "/internship/mechanical-cad.jpg",
  },
  {
    title: "Drone Technology",
    status: "Closed",
    desc: "Explore drone systems, flight controllers, calibration and aerial technologies.",
    image: "/internship/drones.jpg",
  },
  {
    title: "Founders' Office",
    status: "Open",
    desc: "Contribute to business development, strategic initiatives and operations.",
    image: "/internship/fo.jpg",
  },
  {
    title: "Digital Marketing",
    status: "Open",
    desc: "Explore growth marketing, brand development, campaigns and content strategy.",
    image: "/internship/digital-marketing.jpg",
  },
];

const galleryImages = [
  "/internship/gallery1.jpg",
  "/internship/gallery2.jpeg",
  "/internship/gallery3.jpeg",
  "/internship/gallery4.jpeg",
  "/internship/gallery5.jpeg",
  "/internship/gallery6.jpg",
  "/internship/gallery7.jpg",
];

const heroImages = [
  {
    src: "/internship/gallery6.jpg",
    alt: "Internship experience at Adroiit Technovations",
  },
  {
    src: "/internship/gallery7.jpg",
    alt: "Hands-on technology learning",
  },
  {
    src: "/internship/gallery1.jpg",
    alt: "Students collaborating on projects",
  },
  {
    src: "/internship/gallery2.jpeg",
    alt: "Practical innovation and experimentation",
  },
];

const benefits = [
  {
    title: "Hands-on Learning",
    desc: "Work on real-world projects instead of limiting your learning to theoretical concepts.",
    icon: Wrench,
  },
  {
    title: "Industry-Relevant Skills",
    desc: "Develop practical skills and gain exposure to technologies used in the industry.",
    icon: TrendingUp,
  },
  {
    title: "Modern Technologies",
    desc: "Explore modern tools, hardware platforms, software and development workflows.",
    icon: Settings,
  },
  {
    title: "Collaborative Environment",
    desc: "Exchange ideas, work in teams and experience professional project collaboration.",
    icon: Users,
  },
  {
    title: "Dedicated Mentorship",
    desc: "Receive guidance and feedback from mentors throughout your learning journey.",
    icon: Trophy,
  },
  {
    title: "Portfolio Development",
    desc: "Build practical projects that strengthen your resume and showcase your capabilities.",
    icon: FolderKanban,
  },
];

// ============================================================
// REUSABLE COMPONENTS
// ============================================================

function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  light?: boolean;
}) {
  return (
    <div className="max-w-2xl mx-auto text-center mb-8">
      <p className="text-[#8c52ff] text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase mb-3">
        {eyebrow}
      </p>

      <h2
        style={{ fontSize: `${SECTION_TITLE_SIZE_PX}px` }}
        className={`font-bold tracking-tight leading-tight ${
          light ? "text-white" : "text-[#1c1530]"
        }`}
      >
        {title}
      </h2>

      <p
        className={`mt-3 text-sm md:text-[15px] leading-relaxed ${
          light ? "text-gray-400" : "text-gray-700"
        }`}
      >
        {description}
      </p>
    </div>
  );
}

function FAQItem({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className="border-b border-white/10">
      <button
        type="button"
        onClick={onClick}
        aria-expanded={isOpen}
        className="w-full py-5 flex items-center justify-between text-left group"
      >
        <span
          className={`text-sm md:text-base font-semibold transition-colors ${
            isOpen
              ? "text-[#a77bff]"
              : "text-white group-hover:text-purple-200"
          }`}
        >
          {question}
        </span>

        <span className="ml-4 shrink-0 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center">
          {isOpen ? (
            <Minus size={16} className="text-[#a77bff]" />
          ) : (
            <Plus size={16} className="text-gray-400" />
          )}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 pr-8 text-[15px] text-gray-200 leading-relaxed max-w-5xl">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function InternshipPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [activeDomain, setActiveDomain] = useState(
    "Embedded Systems & IoT"
  );

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const slides = useMemo(() => {
    const result = [];

    for (let i = 0; i < testimonials.length; i += 3) {
      result.push(testimonials.slice(i, i + 3));
    }

    return result;
  }, []);

  const sortedDomains = useMemo(
    () =>
      [...domains].sort((a, b) => {
        if (a.status === "Open" && b.status === "Closed") return -1;
        if (a.status === "Closed" && b.status === "Open") return 1;
        return 0;
      }),
    []
  );

  useEffect(() => {
    if (paused || slides.length <= 1) return;

    const interval = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => window.clearInterval(interval);
  }, [paused, slides.length]);

  const handleApply = (title: string) => {
    setActiveDomain(title);
    setIsModalOpen(true);
  };

  const scrollToDomains = () => {
    document
      .getElementById("specialized-domains")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main
      className={`${bricolage.className} bg-white text-[#1c1530] overflow-x-hidden`}
    >
      {/* ================================================== */}
      {/* HERO SECTION - DARK */}
      {/* ================================================== */}

      <section className="relative pt-28 md:pt-32 pb-16 md:pb-20 px-6 overflow-hidden bg-[#0c0815] text-white">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-purple-700/20 blur-[110px] pointer-events-none" />

        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-purple-900/30 blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
            className="text-[#a77bff] text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mb-5"
          >
            CAREERS START WITH CURIOSITY
          </motion.p>

          <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-[auto_auto] gap-8 lg:gap-x-10 lg:gap-y-0 items-center">
            {/* HERO HEADING */}

            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-2xl lg:col-start-1 lg:row-start-1"
            >
              <motion.h1
                variants={fadeUp}
                custom={1}
                className="text-3xl sm:text-4xl lg:text-[30px] font-extrabold leading-[1.12] tracking-tight text-white"
              >
                Don&apos;t Just Learn. Enhance Your Skills
                <br />

                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8c52ff] to-[#c4a5ff]">
                  Build the Future.
                </span>
              </motion.h1>

              <motion.div
                variants={fadeUp}
                custom={2}
                className="w-16 h-1 bg-[#8c52ff] rounded-full my-6"
              />
            </motion.div>

            {/* ASYMMETRIC HERO COLLAGE */}

            <motion.div
              initial={{ opacity: 0, scale: 0.96, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="relative mx-auto w-full max-w-[600px] lg:col-start-2 lg:row-start-1 lg:row-span-2"
            >
              <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-purple-700/30 via-purple-900/10 to-transparent blur-2xl pointer-events-none" />

              <div className="relative w-full">
                <div className="grid grid-cols-12 grid-rows-2 gap-2.5 sm:gap-3 h-[250px] sm:h-[420px] lg:h-[480px]">
                  {heroImages.map((image, i) => {
                    const positions = [
                      "col-span-7 row-start-1",
                      "col-span-5 row-start-1",
                      "col-span-5 row-start-2",
                      "col-span-7 row-start-2",
                    ];

                    return (
                      <motion.div
                        key={image.src}
                        animate={{
                          y: i % 2 === 0 ? [0, -4, 0] : [0, 4, 0],
                        }}
                        transition={{
                          duration: 6 + i * 0.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className={`relative min-w-0 min-h-0 overflow-hidden rounded-2xl border border-white/10 shadow-xl shadow-black/20 bg-[#171121] ${positions[i]}`}
                      >
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          priority={i === 0}
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 40vw, 300px"
                          className="object-cover transition-transform duration-700 hover:scale-105"
                        />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* HERO DESCRIPTION AND ACTIONS */}

            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="max-w-2xl lg:col-start-1 lg:row-start-2"
            >
              <motion.p
                variants={fadeUp}
                custom={3}
                className="text-gray-200 text-sm md:text-base leading-relaxed"
              >
                Join Adroiit Technovations to gain hands-on experience in
                cutting-edge technologies, real-world projects and
                industry-driven innovation. At Adroiit Technovations, our
                internship program is designed to bridge the gap between
                academic learning and real-world application.
              </motion.p>

              <motion.p
                variants={fadeUp}
                custom={4}
                className="mt-4 text-gray-300 text-[15px] leading-relaxed"
              >
                Whether you&apos;re passionate about engineering,
                innovation or business strategy, we provide a platform to
                learn, build and grow.
              </motion.p>

              {/* HERO BUTTONS */}

              <motion.div
                variants={fadeUp}
                custom={5}
                className="flex flex-wrap gap-3 mt-8"
              >
                <button
                  type="button"
                  onClick={scrollToDomains}
                  className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-[#5921c7] text-white text-sm font-bold hover:bg-[#713be0] transition-all shadow-lg shadow-purple-900/30"
                >
                  Explore Domains
                  <ArrowRight size={16} />
                </button>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/20 text-white text-sm font-bold hover:bg-white/5 transition-all"
                >
                  Enquire Now
                  <ArrowUpRight size={16} />
                </Link>
              </motion.div>

              {/* HERO BENEFIT POINTS */}

              <motion.div
                variants={fadeUp}
                custom={6}
                className="hidden sm:flex flex-wrap gap-x-5 gap-y-3 mt-9 pt-7 border-t border-white/10"
              >
                <div className="flex items-center gap-2 text-gray-300 text-xs sm:text-sm font-medium">
                  <CheckCircle2 size={18} className="text-[#a77bff]" />
                  Practical Learning
                </div>

                <div className="flex items-center gap-2 text-gray-300 text-xs sm:text-sm font-medium">
                  <CheckCircle2 size={18} className="text-[#a77bff]" />
                  Real-world Projects
                </div>

                <div className="flex items-center gap-2 text-gray-300 text-xs sm:text-sm font-medium">
                  <CheckCircle2 size={18} className="text-[#a77bff]" />
                  Expert Mentorship
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* LEARNING JOURNEY - LIGHT */}
      {/* MOVED DIRECTLY BELOW HERO */}
      {/* ================================================== */}

      <section className="py-16 md:py-8 px-6 bg-[#f7f0fd]">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            eyebrow="Your Journey Starts Here"
            title="From Curiosity to Capability"
            description="A structured internship experience designed to help you learn, contribute and grow through practical exposure."
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-9 left-[12%] right-[12%] h-px bg-purple-200" />

            {[
              {
                number: "01",
                title: "Explore",
                desc: "Discover your interests and choose an internship domain that aligns with your aspirations.",
                icon: Lightbulb,
              },
              {
                number: "02",
                title: "Learn",
                desc: "Understand relevant concepts, tools and technologies with guidance from mentors.",
                icon: GraduationCap,
              },
              {
                number: "03",
                title: "Build",
                desc: "Apply your knowledge through practical assignments and real-world projects.",
                icon: Code2,
              },
              {
                number: "04",
                title: "Grow",
                desc: "Showcase your work, strengthen your portfolio and develop professional confidence.",
                icon: Rocket,
              },
            ].map((item, i) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className="relative text-center"
                >
                  <div className="relative z-10 w-16 h-16 mx-auto rounded-2xl bg-[#5921c7] flex items-center justify-center shadow-lg shadow-purple-900/15">
                    <Icon size={26} className="text-white" />
                  </div>

                  <p className="mt-5 text-[11px] font-bold tracking-widest text-[#8c52ff]">
                    STEP {item.number}
                  </p>

                  <h3 className="mt-2 text-lg font-bold text-[#30106f]">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-[13px] text-gray-700 leading-relaxed max-w-[250px] mx-auto">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* INTERNSHIP DOMAINS - DARK */}
      {/* ================================================== */}

      <section
        id="specialized-domains"
        className="relative py-16 md:py-8 px-6 bg-[#0c0815] text-white scroll-mt-20 overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-700/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-700/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-[1300px] mx-auto">
          <SectionHeading
            eyebrow="Find Your Direction"
            title="Explore Internship Domains"
            description="Choose an area that matches your interests, discover new possibilities and work towards building meaningful solutions."
            light
          />

          <div className="flex flex-wrap justify-center gap-5">
            {sortedDomains.map((d, i) => (
              <motion.div
                key={d.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.45 }}
                whileHover={{ y: -4 }}
                className="w-full max-w-[340px] sm:w-[calc(50%-10px)] sm:max-w-[290px] lg:w-[calc(25%-15px)] group"
              >
                <div className="h-full rounded-2xl overflow-hidden border border-white/10 bg-[#171121] hover:border-purple-500/60 transition-all duration-300 flex flex-col">
                  {/* DOMAIN IMAGE */}

                  <div className="relative h-36 sm:h-32 overflow-hidden">
                    <Image
                      src={d.image}
                      alt={d.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className={`object-cover transition-transform duration-700 group-hover:scale-110 ${
                        d.status === "Closed" ? "grayscale-[30%]" : ""
                      }`}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#171121]/80 via-transparent to-black/10" />
                  </div>

                  {/* DOMAIN DETAILS */}

                  <div className="p-5 sm:p-4 flex flex-col flex-grow">
                    <h3 className="text-[15px] sm:text-[14px] font-bold text-white group-hover:text-[#b18aff] transition-colors min-h-[38px] sm:min-h-[36px]">
                      {d.title}
                    </h3>

                    <div className="-mt-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          d.status === "Open"
                            ? "bg-green-500/15 text-green-300 border border-green-400/30"
                            : "bg-red-500/15 text-red-300 border border-red-400/30"
                        }`}
                      >
                        {d.status === "Open"
                          ? "Applications Open"
                          : "Applications Closed"}
                      </span>
                    </div>

                    <p className="mt-3 text-[14px] sm:text-[13px] text-gray-200 leading-relaxed flex-grow">
                      {d.desc}
                    </p>

                    <button
                      type="button"
                      disabled={d.status === "Closed"}
                      onClick={() => handleApply(d.title)}
                      className={`mt-4 w-full py-3 sm:py-2.5 rounded-lg text-[11px] sm:text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                        d.status === "Open"
                          ? "bg-[#5921c7] hover:bg-[#713be0] text-white"
                          : "bg-white/5 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {d.status === "Open"
                        ? "Apply Now"
                        : "Applications Closed"}

                      {d.status === "Open" && (
                        <ArrowUpRight size={13} />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-gray-300 text-sm mt-9">
            Interested in a domain not listed here? Contact our team to
            explore potential opportunities.
          </p>
        </div>
      </section>

      {/* ================================================== */}
      {/* WHY ADROIIT - LIGHT */}
      {/* ================================================== */}

      <section className="py-16 md:py-8 px-6 bg-[#faf9fd]">
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            eyebrow="The Adroiit Experience"
            title="More Than Just an Internship"
            description="We believe that meaningful learning happens when knowledge meets experimentation. Our approach helps you develop the confidence and capabilities to turn ideas into solutions."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((item, i) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="relative p-6 rounded-2xl bg-white border border-gray-100 hover:border-purple-200 shadow-sm hover:shadow-xl hover:shadow-purple-900/5 transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center">
                      <Icon
                        size={21}
                        className="text-[#5921c7]"
                      />
                    </div>

                    <span className="text-2xl font-bold text-purple-100">
                      0{i + 1}
                    </span>
                  </div>

                  <h3 className="mt-3 text-sm font-bold text-[#5921c7]">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-[13px] text-gray-700 leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* TESTIMONIALS - DARK */}
      {/* ================================================== */}

      <section className="py-16 md:py-8 px-6 bg-[#0c0815] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            eyebrow="Intern Experiences"
            title="Hear It From Our Interns"
            description="Real stories from our interns who have experienced the Adroiit Technovations ecosystem firsthand."
            light
          />

          <div
            className="relative overflow-hidden"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={(e) => {
              const nextTarget = e.relatedTarget;

              if (
                !(nextTarget instanceof Node) ||
                !e.currentTarget.contains(nextTarget)
              ) {
                setPaused(false);
              }
            }}
          >
            <motion.div
              className="flex"
              animate={{
                x: `-${index * 100}%`,
              }}
              transition={{
                duration: 0.7,
                ease: "easeInOut",
              }}
            >
              {slides.map((group, i) => (
                <div
                  key={i}
                  className="w-full flex-shrink-0"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {group.map((t) => (
                      <div
                        key={t.name}
                        className="h-full p-6 rounded-2xl bg-gradient-to-br from-[#5921c7]/20 to-[#171121] border border-purple-500/20 flex flex-col"
                      >
                        <Quote
                          size={26}
                          className="text-[#8c52ff] mb-2"
                        />

                        <p className="text-gray-300 text-[13px] leading-relaxed flex-grow">
                          &quot;{t.text}&quot;
                        </p>

                        <div className="mt-6 pt-4 border-t border-white/10">
                          <h3 className="font-bold text-white text-sm">
                            {t.name}
                          </h3>

                          <p className="text-[11px] text-gray-500 mt-1">
                            {t.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="flex justify-center items-center gap-3 mt-4">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show testimonial group ${i + 1}`}
                aria-current={index === i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === i
                    ? "w-8 bg-[#8c52ff]"
                    : "w-2 bg-gray-600 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* LIFE AT ADROIIT - LIGHT */}
      {/* ================================================== */}

      <section className="py-16 md:py-8 bg-[#faf9fd] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <SectionHeading
            eyebrow="Behind The Experience"
            title="Glimpses at Adroiit Technovations"
            description="A glimpse into our environment of innovation, experimentation, collaboration and hands-on learning."
          />
        </div>

        <div className="relative w-full overflow-hidden group">
          <div className="flex w-max animate-internship-marquee group-hover:[animation-play-state:paused]">
            {/* FIRST GALLERY SET */}

            <div className="flex gap-6 pr-6">
              {galleryImages.map((img, i) => (
                <div
                  key={`gallery-first-${i}`}
                  className="relative w-64 h-44 md:w-80 md:h-56 flex-shrink-0 rounded-2xl overflow-hidden shadow-md border border-gray-100"
                >
                  <Image
                    src={img}
                    alt={`Life at Adroiit ${i + 1}`}
                    fill
                    sizes="320px"
                    className="object-cover transition-transform duration-2000 hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-60" />
                </div>
              ))}
            </div>

            {/* DUPLICATE GALLERY SET FOR SEAMLESS ANIMATION */}

            <div className="flex gap-6 pr-6" aria-hidden="true">
              {galleryImages.map((img, i) => (
                <div
                  key={`gallery-second-${i}`}
                  className="relative w-64 h-44 md:w-80 md:h-56 flex-shrink-0 rounded-2xl overflow-hidden shadow-md border border-gray-100"
                >
                  <Image
                    src={img}
                    alt=""
                    fill
                    sizes="320px"
                    className="object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-60" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes internship-marquee {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-50%);
            }
          }

          .animate-internship-marquee {
            animation: internship-marquee 60s linear infinite;
            will-change: transform;
          }

          @media (prefers-reduced-motion: reduce) {
            .animate-internship-marquee {
              animation: none;
            }
          }
        `}</style>
      </section>

      {/* ================================================== */}
      {/* FAQ - DARK */}
      {/* ================================================== */}

      <section className="py-16 md:py-8 px-6 bg-[#0c0815] text-white">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={sectionVariants}
          className="max-w-6xl mx-auto"
        >
          <SectionHeading
            eyebrow="Need Clarity?"
            title="Frequently Asked Questions"
            description="Find answers to common questions about our internship program, application process and experience."
            light
          />

          <div className="space-y-1">
            {faqs.map((faq, i) => (
              <FAQItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFaqIndex === i}
                onClick={() =>
                  setOpenFaqIndex(
                    openFaqIndex === i ? null : i
                  )
                }
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* ================================================== */}
      {/* FINAL CTA - LIGHT */}
      {/* ================================================== */}

      <section className="relative py-16 md:py-8 px-6 bg-[#faf9fd] overflow-hidden">
        <div className="absolute -top-32 right-0 w-96 h-96 rounded-full bg-purple-200/30 blur-[110px] pointer-events-none" />

        <div className="absolute -bottom-32 left-0 w-80 h-80 rounded-full bg-purple-100/40 blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative z-10 max-w-3xl mx-auto text-center"
        >
          <p className="text-[#8c52ff] text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase mb-4">
            YOUR NEXT CHAPTER STARTS HERE
          </p>

          <h2 className="text-2xl md:text-2xl font-bold text-[#21163b] leading-tight tracking-tight">
            Ready to Turn Your Ideas Into{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5921c7] to-[#a477ff]">
              Reality?
            </span>
          </h2>

          <p className="mt-4 text-sm md:text-base text-gray-500 leading-relaxed max-w-2xl mx-auto">
            Every great innovation begins with curiosity. Bring your
            ideas, explore new technologies and take the first step
            towards creating something meaningful with Adroiit
            Technovations.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <button
              type="button"
              onClick={scrollToDomains}
              className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-[#5921c7] text-white text-sm font-bold hover:bg-[#4515a8] transition-all shadow-lg shadow-purple-900/15"
            >
              Explore Domains
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-purple-200 text-[#5921c7] text-sm font-bold hover:bg-purple-50 transition-all"
            >
              Enquire Now
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ================================================== */}
      {/* FOOTER */}
      {/* ================================================== */}

      <Footer />

      {/* ================================================== */}
      {/* INTERNSHIP APPLICATION MODAL */}
      {/* ================================================== */}

      <InternshipApplication
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDomain={activeDomain}
      />
    </main>
  );
}
