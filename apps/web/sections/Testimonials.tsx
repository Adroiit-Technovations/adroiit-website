
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Bricolage_Grotesque } from "next/font/google";
import {
  ChevronLeft,
  ChevronRight,
  Quote,
  Star,
  ExternalLink,
} from "lucide-react";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
});

// ============================================================
// GOOGLE BUSINESS PROFILE
// ============================================================

const GOOGLE_BUSINESS_URL =
  "https://maps.app.goo.gl/1fyCYmH1h9paiVca6";

// ============================================================
// TESTIMONIAL DATA
// ============================================================

const testimonials = [
  {
    name: "Priya R",
    role: "Parent",
    text: "I am very satisfied with the teaching. The individual care and attention given to my daughter made a big difference.",
  },
  {
    name: "Santhosh",
    role: "Educational Client",
    text: "We choose Adroiit Technovations for their expertize in robotics, embedded systems, IoT and Drones. They conduct the workshop in a professional manner and with industrial trends.",
  },
  {
    name: "Saran Senthilkumar",
    role: "Client",
    text: "The team is hardworking, skilled and does an excellent job. Collaborated for an automation project. Trustworthy!",
  },
  {
    name: "Shanmugapriya M",
    role: "Research & Development Intern",
    text: "I built my first project here. Learning is fun and practical!",
  },
  {
    name: "Hariharan",
    role: "Parent",
    text: "Good place to go on with STEM Education and Robotics Courses.",
  },
  {
    name: "Mukundan Raman",
    role: "Client",
    text: "Adroiit Technovations became more than just a service provider—they became a strategic partner. Their guidance and technical support have been invaluable to our growth.",
  },
  {
    name: "Mohammad Suhail",
    role: "Client",
    text: "From planning to execution, the Adroiit Technovations team handled every aspect of our project with professionalism and commitment. We highly recommend their services.",
  },
  {
    name: "Anupriya Ramasamy",
    role: "Parent",
    text: "My child has developed a genuine interest in robotics, thanks to the instructors at Adroiit Technovations.",
  },
  {
    name: "Kanmani",
    role: "Parent",
    text: "Highly recommended for parents looking to introduce their children to future technologies like robotics, drones and 3D printing",
  },
];

// ============================================================
// SLIDE GROUPING
// ============================================================

function chunkArray<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];

  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }

  return result;
}

// ============================================================
// GOOGLE ICON
// ============================================================

function GoogleIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      className="h-8 w-8"
      role="img"
      aria-label="Google"
    >
      <path
        fill="#4285F4"
        d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15Z"
      />
      <path
        fill="#34A853"
        d="M24 44c5.5 0 10.1-1.8 13.5-4.8l-6.6-5.1c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.2A20 20 0 0 0 24 44Z"
      />
      <path
        fill="#FBBC05"
        d="M12.6 27.7a12 12 0 0 1 0-7.4v-5.2H5.8a20 20 0 0 0 0 17.8l6.8-5.2Z"
      />
      <path
        fill="#EA4335"
        d="M24 11.9c3 0 5.7 1 7.8 3.1l5.8-5.8C34.1 5.9 29.5 4 24 4A20 20 0 0 0 5.8 15.1l6.8 5.2c1.6-4.8 6.1-8.4 11.4-8.4Z"
      />
    </svg>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cardsPerSlide, setCardsPerSlide] = useState(3);

  // Responsive slide grouping
  useEffect(() => {
    const updateCardsPerSlide = () => {
      setCardsPerSlide(window.innerWidth < 768 ? 1 : 3);
    };

    updateCardsPerSlide();

    window.addEventListener("resize", updateCardsPerSlide);

    return () => {
      window.removeEventListener("resize", updateCardsPerSlide);
    };
  }, []);

  const slides = useMemo(
    () => chunkArray(testimonials, cardsPerSlide),
    [cardsPerSlide]
  );

  // Keep active slide within range after resizing
  useEffect(() => {
    setIndex((current) => Math.min(current, slides.length - 1));
  }, [slides.length]);

  // Automatic slider
  useEffect(() => {
    if (paused || slides.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [paused, slides.length]);

  const previousSlide = () => {
    setIndex((current) =>
      current === 0 ? slides.length - 1 : current - 1
    );
  };

  const nextSlide = () => {
    setIndex((current) => (current + 1) % slides.length);
  };

  return (
    <section
      className={`${bricolage.className} relative isolate overflow-hidden bg-[#08060d] py-16 text-white sm:py-20 lg:py-10`}
    >
      {/* ================================================== */}
      {/* BACKGROUND EFFECTS */}
      {/* ================================================== */}

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-0 h-[350px] w-[350px] rounded-full bg-[#8c52ff]/[0.10] blur-[140px]" />

        <div className="absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-[#5921c7]/[0.12] blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #8c52ff 1px, transparent 1px), linear-gradient(to bottom, #8c52ff 1px, transparent 1px)",
            backgroundSize: "65px 65px",
            maskImage:
              "radial-gradient(ellipse at center, black 10%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 10%, transparent 80%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        {/* ================================================== */}
        {/* SECTION HEADER */}
        {/* ================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-6 max-w-3xl text-center sm:mb-8"
        >
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-[#a77aff] sm:text-sm">
            Voices of Our Community
          </p>

          <h2 className="text-2xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-4xl">
            What People {" "}
           
            <span className="bg-gradient-to-r from-[#8c52ff] via-[#b18aff] to-[#d2baff] bg-clip-text text-transparent">
              Say About Us.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-[1.9] text-gray-300 sm:text-base">
            Every experience tells a story. Discover what students, parents,
            and our partners say about learning, creating, and innovating
            with Adroiit Technovations.
          </p>
        </motion.div>

        {/* ================================================== */}
        {/* GOOGLE RATING STRIP */}
        {/* Positioned above testimonial cards */}
        {/* ================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65 }}
          className="mx-auto mb-8 max-w-3xl sm:mb-10"
        >
          <a
            href={GOOGLE_BUSINESS_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View Adroiit Technovations Google Business Profile"
            className="group flex flex-col items-center justify-between gap-5 rounded-2xl border border-white/[0.09] bg-white/[0.025] px-5 py-5 transition-all duration-300 hover:border-[#8c52ff]/40 hover:bg-[#8c52ff]/[0.06] sm:flex-row sm:px-7"
          >
            {/* Google branding and label */}

            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04]">
                <GoogleIcon />
              </div>

              <div className="text-center sm:text-left">
                <p className="text-sm font-bold text-white">
                  Find us on Google
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Adroiit Technovations
                </p>
              </div>
            </div>

            {/* Divider */}

            <div className="hidden h-10 w-px bg-white/[0.12] sm:block" />

            {/* Rating */}

            <div className="flex flex-col items-center gap-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold tracking-tight text-white">
                  5.0
                </span>

                <span className="text-xs font-medium text-gray-500">
                  / 5.0
                </span>
              </div>

              <div
                className="flex items-center gap-1"
                aria-label="5 out of 5 stars"
              >
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star
                    key={starIndex}
                    size={14}
                    strokeWidth={1.8}
                    className="fill-[#ffcc00] text-[#ffcc00]"
                  />
                ))}
              </div>
            </div>

            {/* Google profile link */}

            <div className="flex items-center gap-2 rounded-full border border-[#8c52ff]/25 bg-[#8c52ff]/[0.08] px-4 py-2.5 text-xs font-semibold text-[#c4a7ff] transition-all duration-300 group-hover:border-[#8c52ff]/50 group-hover:bg-[#5921c7] group-hover:text-white">
              View Profile

              <ExternalLink
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </div>
          </a>
        </motion.div>

        {/* ================================================== */}
        {/* TESTIMONIAL SLIDER */}
        {/* ================================================== */}

        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div className="overflow-hidden">
            <motion.div
              className="flex"
              animate={{ x: `-${index * 100}%` }}
              transition={{
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {slides.map((group, slideIndex) => (
                <div
                  key={slideIndex}
                  className="w-full flex-shrink-0 px-1 py-3"
                >
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
                    {group.map((testimonial, cardIndex) => (
                      <motion.div
                        key={testimonial.name}
                        initial={{ opacity: 0, y: 22 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{
                          duration: 0.55,
                          delay: cardIndex * 0.1,
                        }}
                        className="group relative flex min-h-[270px] flex-col overflow-hidden rounded-3xl border border-[#8c52ff]/20 bg-gradient-to-br from-[#171020] via-[#100c18] to-[#0b0811] p-6 shadow-[0_10px_35px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1 hover:border-[#8c52ff]/40 hover:shadow-[0_18px_40px_rgba(89,33,199,0.16)] sm:p-7 lg:p-8"
                      >
                        {/* Decorative quote icon */}

                        <div className="mb-5 flex items-center">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#8c52ff]/20 bg-[#8c52ff]/10 text-[#a77aff]">
                            <Quote size={21} strokeWidth={2.2} />
                          </div>
                        </div>

                        {/* Testimonial text */}

                        <p className="flex-1 text-sm leading-[1.9] text-gray-300 sm:text-[15px]">
                          “{testimonial.text}”
                        </p>

                        {/* Author details */}

                        <div className="mt-7 border-t border-white/[0.08] pt-5">
                          <h3 className="text-base font-bold text-white">
                            {testimonial.name}
                          </h3>

                          <p className="mt-1 text-xs font-medium text-[#a77aff] sm:text-sm">
                            {testimonial.role}
                          </p>
                        </div>

                        {/* Subtle corner accent */}

                        <div className="pointer-events-none absolute -bottom-12 -right-12 h-28 w-28 rounded-full bg-[#8c52ff]/[0.06] blur-2xl transition-all duration-500 group-hover:bg-[#8c52ff]/[0.12]" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ================================================== */}
          {/* SLIDER CONTROLS */}
          {/* ================================================== */}

          {slides.length > 1 && (
            <div className="mt-8 flex items-center justify-center gap-5">
              {/* Previous */}

              <button
                type="button"
                onClick={previousSlide}
                aria-label="Previous testimonials"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#8c52ff]/25 bg-[#171020] text-[#b18aff] shadow-sm transition-all duration-300 hover:border-[#8c52ff] hover:bg-[#5921c7] hover:text-white"
              >
                <ChevronLeft size={19} />
              </button>

              {/* Pagination dots */}

              <div className="flex items-center gap-2.5">
                {slides.map((_, slideIndex) => (
                  <button
                    key={slideIndex}
                    type="button"
                    onClick={() => setIndex(slideIndex)}
                    aria-label={`Go to testimonial slide ${slideIndex + 1}`}
                    aria-current={index === slideIndex ? "true" : undefined}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      index === slideIndex
                        ? "w-8 bg-[#8c52ff]"
                        : "w-2.5 bg-gray-600 hover:bg-[#8c52ff]/60"
                    }`}
                  />
                ))}
              </div>

              {/* Next */}

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next testimonials"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#8c52ff]/25 bg-[#171020] text-[#b18aff] shadow-sm transition-all duration-300 hover:border-[#8c52ff] hover:bg-[#5921c7] hover:text-white"
              >
                <ChevronRight size={19} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
