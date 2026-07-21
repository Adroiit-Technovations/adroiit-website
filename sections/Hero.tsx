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

// Slideshow images for mobile view
const MOBILE_HERO_IMAGES = [
  {
    src: "/projects/dsc-7.jpeg",
    alt: "Adroiit STEM Project 1",
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

// All 4 images for desktop grid
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

  // Auto-play slideshow every 4 seconds for mobile single frame
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % MOBILE_HERO_IMAGES.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#05030A] text-white pt-24 pb-16 md:pt-32 md:pb-24">
      {/* Background Glows & Grid Patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(89,33,199,0.25),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(140,82,255,0.15),transparent_40%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          
          {/* LEFT CONTENT COLUMN */}
          <div className="lg:col-span-6 flex flex-col items-start justify-between">
            
            <div className="w-full flex flex-col items-start">
              {/* ORDER 1: Logo */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6 order-1 lg:order-none"
              >
                <Image
                  src="/logo2.png"
                  alt="Adroiit Technovations"
                  width={LOGO_WIDTH}
                  height={LOGO_HEIGHT}
                  priority
                  loading="eager"
                  style={{ width: "auto", height: "auto" }}
                  className="block object-contain"
                />
              </motion.div>

              {/* ORDER 2: Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className={`${bricolage.className} order-2 lg:order-none text-4xl sm:text-5xl lg:text-4xl font-extrabold leading-[1.1] tracking-tight`}
              >
                Empowering the Next-Gen Through <br />
                <span className="bg-gradient-to-r from-[#8c52ff] via-[#a87ffb] to-purple-400 bg-clip-text text-transparent">
                  Education & Innovation
                </span>
              </motion.h1>

              {/* MOBILE ONLY ORDER 3: Hero Image Slideshow Frame */}
              <div className="order-3 lg:hidden w-full my-6 relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl bg-white/5 border border-purple-500/20 backdrop-blur-sm">
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

              {/* ORDER 4 (Mobile) / Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`${bricolage.className} order-4 lg:order-none mt-2 lg:mt-6 text-base sm:text-lg text-gray-300 max-w-xl leading-relaxed`}
              >
                Adroiit Technovations is redefining STEM and technical skill learning. We bridge the gap between classroom theory and hands-on real-world innovation.
              </motion.p>

              {/* ORDER 5 (Mobile) / CTA Buttons below subtext on Desktop */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="order-5 lg:order-none mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
              >
                <Link
                  href="/services"
                  className="bg-gradient-to-r from-[#5921c7] to-[#8c52ff] hover:opacity-90 transition px-7 py-3.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 group shadow-lg shadow-purple-900/30"
                >
                  Explore Services
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/contact"
                  className="border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition px-7 py-3.5 rounded-xl font-semibold text-sm text-white text-center"
                >
                  Contact Us
                </Link>
              </motion.div>
            </div>

            {/* ORDER 6 (Mobile) / Impact Metrics Bar (Left-aligned on Desktop, Center on Mobile) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="order-6 lg:order-none mt-10 lg:mt-12 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6 w-full items-center text-center lg:text-left lg:items-start"
            >
              <div className="flex flex-col items-center lg:items-start">
                <h4 className={`${bricolage.className} text-2xl font-bold text-white`}>10+</h4>
                <p className="text-xs text-gray-400 mt-0.5">Sessions Conducted</p>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <h4 className={`${bricolage.className} text-2xl font-bold text-white`}>700+</h4>
                <p className="text-xs text-gray-400 mt-0.5">Learners Empowered</p>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <h4 className={`${bricolage.className} text-2xl font-bold text-white`}>15+</h4>
                <p className="text-xs text-gray-400 mt-0.5">Projects Completed</p>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <h4 className={`${bricolage.className} text-2xl font-bold text-white`}>10+</h4>
                <p className="text-xs text-gray-400 mt-0.5">Domain Expertise</p>
              </div>
            </motion.div>

          </div>

          {/* DESKTOP VISUAL COLUMN (Matching your uploaded screenshot) */}
          <div className="hidden lg:flex lg:col-span-6 relative w-full flex-col justify-stretch h-full min-h-[500px]">
            
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#5921c7] to-[#8c52ff] rounded-full blur-3xl opacity-25 pointer-events-none" />

            {/* Asymmetric 4-Image Grid Matching Image Screenshot */}
            <div className="relative w-full grid grid-cols-12 gap-3.5 h-full">
              
              {/* Image 1: Top Left (Wide) */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: [0, -6, 0] }}
                transition={{
                  opacity: { duration: 0.6, delay: 0.2 },
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0 },
                }}
                className="col-span-7 h-full min-h-[230px] relative rounded-2xl overflow-hidden shadow-xl border border-purple-500/20 hover:border-purple-500/50 bg-white/5 group transition-colors duration-300"
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

              {/* Image 2: Top Right (Narrow) */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: [0, -8, 0] }}
                transition={{
                  opacity: { duration: 0.6, delay: 0.3 },
                  y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
                }}
                className="col-span-5 h-full min-h-[230px] relative rounded-2xl overflow-hidden shadow-xl border border-purple-500/20 hover:border-purple-500/50 bg-white/5 group transition-colors duration-300"
              >
                <Image
                  src={DESKTOP_HERO_IMAGES[1].src}
                  alt={DESKTOP_HERO_IMAGES[1].alt}
                  fill
                  sizes="(max-width: 1280px) 25vw, 18vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </motion.div>

              {/* Image 3: Bottom Left (Narrow) */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: [0, -7, 0] }}
                transition={{
                  opacity: { duration: 0.6, delay: 0.4 },
                  y: { duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 },
                }}
                className="col-span-5 h-full min-h-[230px] relative rounded-2xl overflow-hidden shadow-xl border border-purple-500/20 hover:border-purple-500/50 bg-white/5 group transition-colors duration-300"
              >
                <Image
                  src={DESKTOP_HERO_IMAGES[2].src}
                  alt={DESKTOP_HERO_IMAGES[2].alt}
                  fill
                  sizes="(max-width: 1280px) 25vw, 18vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </motion.div>

              {/* Image 4: Bottom Right (Wide) */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: [0, -5, 0] }}
                transition={{
                  opacity: { duration: 0.6, delay: 0.5 },
                  y: { duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.7 },
                }}
                className="col-span-7 h-full min-h-[230px] relative rounded-2xl overflow-hidden shadow-xl border border-purple-500/20 hover:border-purple-500/50 bg-white/5 group transition-colors duration-300"
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