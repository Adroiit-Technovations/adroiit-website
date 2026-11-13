
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Bricolage_Grotesque } from "next/font/google";
import { ArrowRight } from "lucide-react";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

// Logo dimensions
const LOGO_WIDTH = 180;
const LOGO_HEIGHT = 90;

// Mobile Slideshow Array: Explicit Order -> Image 1, Image 4, Image 3
const MOBILE_HERO_IMAGES = [
  {
    src: "/projects/dsc-7.jpeg",
    alt: "Adroiit STEM Project 1",
  },
  {
    src: "/projects/dsc-6.jpeg",
    alt: "Adroiit STEM Project 4",
  },
  {
    src: "/projects/dsc-3.jpeg",
    alt: "Adroiit STEM Project 3",
  },
];

// Desktop 4-Image Grid Array
const DESKTOP_HERO_IMAGES = [
  {
    src: "/projects/dsc-7.jpeg",
    alt: "Adroiit STEM Project 1",
  },
  {
    src: "/projects/6.jpeg",
    alt: "Adroiit STEM Project 2",
  },
  {
    src: "/projects/dsc-3.jpeg",
    alt: "Adroiit STEM Project 3",
  },
  {
    src: "/projects/dsc-6.jpeg",
    alt: "Adroiit STEM Project 4",
  },
];

export default function ModernHero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play slideshow every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex + 1) % MOBILE_HERO_IMAGES.length
      );
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#faf9fd] text-[#21163b] pt-35 pb-16 md:pt-40 md:pb-24">
      {/* Background Glows & Grid Patterns Removed */}

      <div className="max-w-[1300px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* LEFT CONTENT COLUMN */}
          <div className="lg:col-span-6 flex flex-col items-start justify-between">
            <div className="w-full flex flex-col items-start">
              {/* Eyebrow Line */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className={`${bricolage.className} mb-3 order-2 lg:order-none text-xs text-[13px] font-semibold uppercase tracking-[0.2em] text-gray-700`}
              >
                EDUCATION . ENGINEERING . INNOVATION
              </motion.p>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`${bricolage.className} order-2 lg:order-none text-2xl text-3xl lg:text-4xl font-extrabold leading-[1.1] tracking-tight`}
              >
                Elevating{" "}
                <span className="bg-gradient-to-r from-[#5921c7] to-[#8c52ff] bg-clip-text text-transparent">
                  Education.
                </span>
              </motion.h1>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`${bricolage.className} order-2 lg:order-none text-2xl text-3xl lg:text-4xl font-extrabold leading-[1.1] tracking-tight bg-gradient-to-r from-[#5921c7] to-[#8c52ff] bg-clip-text text-transparent`}
              >
                Enabling{" "}
                <span className="bg-clip-text text-[#21163b]">
                  Innovation.
                </span>
              </motion.h1>

              {/* Mobile Hero Image Slideshow */}
              <div className="order-3 lg:hidden w-full my-6 relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl bg-white border border-purple-200 backdrop-blur-sm">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <Image
                      src={MOBILE_HERO_IMAGES[currentIndex].src}
                      alt={MOBILE_HERO_IMAGES[currentIndex].alt}
                      fill
                      priority
                      loading="eager"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`${bricolage.className} order-4 lg:order-none mt-2 lg:mt-6 text-base text-[18px] text-gray-900 max-w-xl leading-relaxed`}
              >
                Adroiit Technovations is redefining STEAM and technical
                education through experiential, hands-on learning that goes
                beyond traditional classroom boundaries. We empower young minds
                to explore emerging technologies, develop practical skills and
                transform curiosity into creativity. 
              </motion.p>

              {/* Desktop CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="hidden lg:flex mt-8 flex-row items-center gap-4 w-auto"
              >
                <Link
                  href="/services"
                  className="bg-gradient-to-r from-[#481f9b] to-[#5921c7] hover:opacity-90 transition px-7 py-3.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 group shadow-lg shadow-purple-900/30"
                >
                  Explore Solutions
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>

                <Link
                  href="/contact"
                  className="border border-purple-200 bg-white hover:bg-purple-50 backdrop-blur-sm transition px-7 py-3.5 rounded-xl font-semibold text-sm text-[#5921c7] text-center"
                >
                  Contact Us
                </Link>
              </motion.div>
            </div>

            {/* Impact Metrics Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="order-5 lg:order-none mt-4 lg:mt-6 pt-8 border-t border-purple-100 grid grid-cols-2 sm:grid-cols-4 gap-6 w-full items-center text-center lg:text-left lg:items-start"
            >
              <div className="flex flex-col items-center lg:items-start">
                <h4 className={`${bricolage.className} text-2xl font-bold text-[#21163b]`}>
                  10+
                </h4>
                <p className="text-xs text-gray-600 mt-0.5">
                  Sessions Conducted
                </p>
              </div>

              <div className="flex flex-col items-center lg:items-start">
                <h4 className={`${bricolage.className} text-2xl font-bold text-[#21163b]`}>
                  700+
                </h4>
                <p className="text-xs text-gray-600 mt-0.5">
                  Students Empowered
                </p>
              </div>

              <div className="flex flex-col items-center lg:items-start">
                <h4 className={`${bricolage.className} text-2xl font-bold text-[#21163b]`}>
                  15+
                </h4>
                <p className="text-xs text-gray-600 mt-0.5">
                  Projects Completed
                </p>
              </div>

              <div className="flex flex-col items-center lg:items-start">
                <h4 className={`${bricolage.className} text-2xl font-bold text-[#21163b]`}>
                  10+
                </h4>
                <p className="text-xs text-gray-600 mt-0.5">
                  Domains Expertise
                </p>
              </div>
            </motion.div>

            {/* Mobile CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="order-6 lg:hidden mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full"
            >
              <Link
                href="/services"
                className="bg-gradient-to-r from-[#481f9b] to-[#5921c7] hover:opacity-90 transition px-7 py-3.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 group shadow-lg shadow-purple-900/30"
              >
                Explore Solutions
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>

              <Link
                href="/contact"
                className="border border-purple-200 bg-white hover:bg-purple-50 backdrop-blur-sm transition px-7 py-3.5 rounded-xl font-semibold text-sm text-[#5921c7] text-center"
              >
                Contact Us
              </Link>
            </motion.div>
          </div>

          {/* DESKTOP VISUAL COLUMN */}
          <div className="hidden lg:flex lg:col-span-6 relative w-full flex-col justify-stretch h-full min-h-[500px]">
            {/* Ambient Background Glow Removed */}

            {/* Asymmetric 4-Image Grid */}
            <div className="relative w-full grid grid-cols-12 gap-3.5 h-full">
              {/* Image 1: Top Left */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: [0, -6, 0] }}
                transition={{
                  opacity: { duration: 0.6, delay: 0.2 },
                  y: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0,
                  },
                }}
                className="col-span-7 h-full min-h-[230px] relative rounded-2xl overflow-hidden shadow-xl border border-purple-200 hover:border-purple-400 bg-white group transition-colors duration-300"
              >
                <Image
                  src={DESKTOP_HERO_IMAGES[0].src}
                  alt={DESKTOP_HERO_IMAGES[0].alt}
                  fill
                  priority
                  loading="eager"
                  sizes="(max-width: 1280px) 35vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </motion.div>

              {/* Image 2: Top Right */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: [0, -8, 0] }}
                transition={{
                  opacity: { duration: 0.6, delay: 0.3 },
                  y: {
                    duration: 4.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  },
                }}
                className="col-span-5 h-full min-h-[230px] relative rounded-2xl overflow-hidden shadow-xl border border-purple-200 hover:border-purple-400 bg-white group transition-colors duration-300"
              >
                <Image
                  src={DESKTOP_HERO_IMAGES[1].src}
                  alt={DESKTOP_HERO_IMAGES[1].alt}
                  fill
                  sizes="(max-width: 1280px) 25vw, 18vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </motion.div>

              {/* Image 3: Bottom Left */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: [0, -7, 0] }}
                transition={{
                  opacity: { duration: 0.6, delay: 0.4 },
                  y: {
                    duration: 4.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.3,
                  },
                }}
                className="col-span-5 h-full min-h-[230px] relative rounded-2xl overflow-hidden shadow-xl border border-purple-200 hover:border-purple-400 bg-white group transition-colors duration-300"
              >
                <Image
                  src={DESKTOP_HERO_IMAGES[2].src}
                  alt={DESKTOP_HERO_IMAGES[2].alt}
                  fill
                  sizes="(max-width: 1280px) 25vw, 18vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </motion.div>

              {/* Image 4: Bottom Right */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: [0, -5, 0] }}
                transition={{
                  opacity: { duration: 0.6, delay: 0.5 },
                  y: {
                    duration: 3.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.7,
                  },
                }}
                className="col-span-7 h-full min-h-[230px] relative rounded-2xl overflow-hidden shadow-xl border border-purple-200 hover:border-purple-400 bg-white group transition-colors duration-300"
              >
                <Image
                  src={DESKTOP_HERO_IMAGES[3].src}
                  alt={DESKTOP_HERO_IMAGES[3].alt}
                  fill
                  sizes="(max-width: 1280px) 35vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
