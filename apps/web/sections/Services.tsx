
"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
});

// ============================================================
// SERVICES DATA
// ============================================================

const services = [
  {
    title: "STEAM Tinkering & Innovation Lab",
    description:
      "Comprehensive lab setups equipped with STEM kits, structured curriculum, and training — where students explore, experiment, build, and innovate.",
    image: "/services/stem-lab.png",
    link: "/services/steam-til",
  },
  {
    title: "Composite Skill Lab (CSL)",
    description:
      "Interactive workshops designed to ignite curiosity, creativity, and practical skills through engaging, hands-on learning experiences.",
    image: "/services/stem-workshop.png",
    link: "/services/csl",
  },
  {
    title: "STEAM Workshops & Bootcamps",
    description:
      "Intensive learning programs that nurture critical thinking, problem-solving, and technical skills beyond the standard academic curriculum.",
    image: "/services/stem-bootcamp.png",
    link: "/services/steam-workshops-bootcamps",
  },
  {
    title: "Center of Excellence (CoE)",
    description:
      "A complete innovation ecosystem with tools, mentorship, and resources, empowering students to turn ideas into prototypes and breakthrough solutions.",
    image: "/services/coe2.png",
    link: "/services/coe",
  },
  {
    title: "Value Added Courses (VACs)",
    description:
      "Enhance academic learning with industry-relevant, skill-focused courses designed to build practical knowledge and career readiness.",
    image: "/services/advanced-labs2.png",
    link: "/services/value-added-courses",
  },
  {
    title: "Technical Workshops",
    description:
      "Industry-focused training programs that equip students with job-ready skills through immersive, hands-on experiences using modern tools and technologies.",
    image: "/services/technical-workshop2.png",
    link: "/services/technical-workshop",
  },
  {
    title: "SPM Manufacturing",
    description:
      "End-to-end machinery fabrication solutions tailored to specific requirements, from initial design to final assembly, engineered for performance and durability.",
    image: "/services/cmf.png",
    link: "/services/custom-machinery-fabrication",
  },
  {
    title: "FDM 3D Printing",
    description:
      "FDM 3D printing services that transform your designs into durable, functional parts with quality, speed, and precision — ideal for rapid prototyping and low-volume production.",
    image: "/services/3d-printing.jpg",
    link: "/services/3d-printing",
  },
  {
    title: "Mechanical CAD",
    description:
      "Professional engineering design services offering 2D drafting, 3D modelling, and assembly design with precision and attention to detail.",
    image: "/services/mechanical-cad.png",
    link: "/services/mechanical-cad",
  },
];

// ============================================================
// ANIMATIONS
// ============================================================

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function Services() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reference to the first card in the mobile carousel
  const mobileCarouselRef = useRef<HTMLDivElement>(null);

  const itemsPerSlide = 3;
  const totalSlides = Math.ceil(services.length / itemsPerSlide);

  const startIndex = currentIndex * itemsPerSlide;

  const visibleServices = services.slice(
    startIndex,
    startIndex + itemsPerSlide
  );

  // ============================================================
  // DESKTOP NAVIGATION
  // ============================================================

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // ============================================================
  // MOBILE NAVIGATION WITH AUTO SCROLL
  // ============================================================

  const scrollToMobileCarousel = () => {
    mobileCarouselRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const nextMobileSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
    scrollToMobileCarousel();
  };

  const prevMobileSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    scrollToMobileCarousel();
  };

  const goToMobileSlide = (index: number) => {
    setCurrentIndex(index);
    scrollToMobileCarousel();
  };

  return (
    <section
      className={`${bricolage.className} relative isolate overflow-hidden bg-[#faf9fd] px-5 py-8 text-gray-900 sm:px-8 sm:py-16 lg:px-10 lg:py-9`}
    >
      {/* ================================================== */}
      {/* BACKGROUND EFFECTS */}
      {/* ================================================== */}

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-0 h-[400px] w-[400px] rounded-full bg-[#8c52ff]/[0.07] blur-[130px]" />

        <div className="absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full bg-[#5921c7]/[0.06] blur-[140px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #5921c7 1px, transparent 1px), linear-gradient(to bottom, #5921c7 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage:
              "radial-gradient(ellipse at center, black 20%, transparent 85%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 1px, transparent 85%)",
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
          className="mx-auto mb-9 max-w-3xl text-center lg:mb-11"
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-gray-700 sm:text-sm">
            What We Offer
          </p>

          <h2 className="text-2xl font-extrabold leading-[1.12] tracking-tight text-[#171020] sm:text-5xl lg:text-[30px]">
            <span className="bg-gradient-to-r from-[#5921c7] via-[#8c52ff] to-[#5921c7] bg-clip-text text-transparent">
              Solutions That Inspire Innovation
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-[1.85] text-gray-900 sm:text-base">
            From transforming the way students learn to bringing engineering
            ideas to life, we deliver innovative solutions across education,
            technology and product development.
          </p>
        </motion.div>

        {/* ================================================== */}
        {/* DESKTOP SERVICE CAROUSEL */}
        {/* ================================================== */}

        <div className="mx-auto hidden max-w-6xl items-center gap-3 md:grid md:grid-cols-[40px_minmax(0,1fr)_40px] lg:gap-4">

          {/* PREVIOUS BUTTON */}

          {totalSlides > 1 ? (
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous services"
              className="flex h-9 w-9 items-center justify-center justify-self-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-all duration-300 hover:border-[#8c52ff] hover:bg-[#5921c7] hover:text-white"
            >
              <ChevronLeft size={18} />
            </button>
          ) : (
            <div />
          )}

          {/* SERVICE CARDS */}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="grid min-w-0 grid-cols-3 items-stretch gap-4 lg:gap-5"
            >
              {visibleServices.map((service, index) => (
                <ServiceCard
                  key={service.title}
                  service={service}
                  index={index}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* NEXT BUTTON */}

          {totalSlides > 1 ? (
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next services"
              className="flex h-9 w-9 items-center justify-center justify-self-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-all duration-300 hover:border-[#8c52ff] hover:bg-[#5921c7] hover:text-white"
            >
              <ChevronRight size={18} />
            </button>
          ) : (
            <div />
          )}

        </div>

        {/* ================================================== */}
        {/* MOBILE SERVICE CAROUSEL */}
        {/* THREE VERTICAL CARDS PER SLIDE */}
        {/* ================================================== */}

        <div className="mx-auto max-w-md md:hidden">

          {/* MOBILE SERVICE CARDS */}

          <AnimatePresence mode="wait">
            <motion.div
              key={`mobile-${currentIndex}`}
              ref={mobileCarouselRef}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.3 }}
              className="flex scroll-mt-6 flex-col gap-4"
            >
              {visibleServices.map((service, index) => (
                <ServiceCard
                  key={service.title}
                  service={service}
                  index={index}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* MOBILE NAVIGATION ARROWS */}

          {totalSlides > 1 && (
            <div className="mt-6 flex items-center justify-center gap-5">

              <button
                type="button"
                onClick={prevMobileSlide}
                aria-label="Previous services"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#8c52ff]/30 bg-white text-[#5921c7] shadow-sm transition-all duration-300 hover:border-[#5921c7] hover:bg-[#5921c7] hover:text-white"
              >
                <ChevronLeft size={20} />
              </button>

              {/* SLIDE INDICATOR */}

              <div className="flex items-center gap-2">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => goToMobileSlide(index)}
                    aria-label={`Go to service slide ${index + 1}`}
                    aria-current={currentIndex === index ? "true" : undefined}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "w-7 bg-[#8c52ff]"
                        : "w-1.5 bg-gray-300 hover:bg-[#8c52ff]/50"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={nextMobileSlide}
                aria-label="Next services"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#8c52ff]/30 bg-white text-[#5921c7] shadow-sm transition-all duration-300 hover:border-[#5921c7] hover:bg-[#5921c7] hover:text-white"
              >
                <ChevronRight size={20} />
              </button>

            </div>
          )}
        </div>

        {/* ================================================== */}
        {/* DESKTOP CAROUSEL INDICATORS */}
        {/* ================================================== */}

        {totalSlides > 1 && (
          <div className="mt-7 hidden items-center justify-center gap-2 md:flex">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to service slide ${index + 1}`}
                aria-current={currentIndex === index ? "true" : undefined}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-7 bg-[#8c52ff]"
                    : "w-1.5 bg-gray-300 hover:bg-[#8c52ff]/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================================
// REUSABLE SERVICE CARD
// ============================================================

function ServiceCard({
  service,
  index,
}: {
  service: {
    title: string;
    description: string;
    image: string;
    link: string;
  };
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.05,
      }}
      className="group mx-auto flex h-full w-full max-w-[340px] flex-col overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-[0_3px_16px_rgba(20,10,40,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#8c52ff]/40 hover:shadow-[0_10px_24px_rgba(89,33,199,0.09)]"
    >

      {/* IMAGE */}

      <Link
        href={service.link}
        aria-label={`Explore ${service.title}`}
        className="relative block aspect-[16/8.5] w-full overflow-hidden bg-gray-100"
      >
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1024px) 33vw, 340px"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </Link>

      {/* CONTENT */}

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <div className="flex-1">
          <h3 className="text-[14px] font-bold leading-snug text-[#5921c7] transition-colors duration-300 group-hover:text-[#5921c7] sm:text-base">
            {service.title}
          </h3>

          <p className="mt-2 text-[11px] leading-[1.75] text-gray-600 sm:text-xs">
            {service.description}
          </p>
        </div>

        {/* EXPLORE BUTTON */}

        <div className="mt-4 border-t border-gray-100 pt-3">
          <Link
            href={service.link}
            className="group/button inline-flex w-full items-center justify-between rounded-lg border border-[#8c52ff]/25 bg-[#8c52ff]/[0.045] px-3 py-2 text-[11px] font-bold text-[#5921c7] transition-all duration-300 hover:border-[#5921c7] hover:bg-[#5921c7] hover:text-white sm:text-xs"
          >
            <span>Explore Solution</span>

            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#5921c7]/10 transition-all duration-300 group-hover/button:translate-x-0.5 group-hover/button:bg-white/15">
              <ArrowRight
                size={13}
                className="transition-transform duration-300 group-hover/button:translate-x-0.5"
              />
            </span>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
