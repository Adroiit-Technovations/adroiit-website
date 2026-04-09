"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Bricolage_Grotesque } from "next/font/google";
import { ArrowRight } from "lucide-react";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

// ✅ ADJUST LOGO SIZE
const LOGO_WIDTH = 210;
const LOGO_HEIGHT = 120;

export default function Hero() {
  return (
    /* Reduced min-height for better fit on small screens
       Reduced padding: pt-8 pb-8 on mobile, md:pt-32 md:pb-16 on desktop
    */
    <section className="min-h-[85vh] md:min-h-screen flex flex-col justify-center items-center text-center px-6 pt-8 md:pt-32 pb-8 md:pb-16 bg-gradient-to-b from-black via-[#5921c7]/20 to-black text-white">

      {/* Logo Wrapper */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full flex justify-center mb-4 md:mb-6" // Slightly reduced margin-bottom on mobile
      >
        <Image
          src="/logo2.png"
          alt="Adroiit Technovations"
          width={LOGO_WIDTH}
          height={LOGO_HEIGHT}
          priority
          className="block object-contain"
        />
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={`${bricolage.className} text-3xl md:text-5xl font-bold leading-tight max-w-4xl`}
      >
        Empowering Next-Gen through
        <br className="hidden md:block" />
        <span className="block bg-gradient-to-r from-[#5921c7] to-[#8c52ff] bg-clip-text text-transparent">
          Education and Innovation
        </span>
      </motion.h1>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`${bricolage.className} mt-3 md:mt-4 text-base md:text-lg text-gray-300 max-w-2xl`}
      >
        Adroiit Technovations is redefining STEM and technical skill education by bridging classroom theory with real-world innovation.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 flex flex-col sm:flex-row gap-4"
      >
        <Link
          href="/services"
          className="bg-[#5921c7] px-6 py-3 rounded-xl hover:bg-[#8c52ff] transition font-medium text-sm text-center flex items-center justify-center gap-2 group"
        >
          Explore Services
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/contact"
          className="border border-gray-500 px-6 py-3 rounded-xl hover:bg-gray-800 transition text-sm text-center"
        >
          Contact Us
        </Link>
      </motion.div>

      {/* Impact Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="mt-10 md:mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-5xl" // Reduced mt and gap for mobile
      >
        {[
          { value: "5+", label: "Sessions" },
          { value: "500+", label: "Students Empowered" },
          { value: "10+", label: "Projects Completed" },
          { value: "5.0", label: "Google Rating" },
        ].map((item, i) => (
          <div
            key={i}
            className="p-4 md:p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:scale-105 transition"
          >
            <h3 className={`${bricolage.className} text-xl md:text-3xl font-bold text-[#8c52ff]`}>
              {item.value}
            </h3>
            <p className={`${bricolage.className} text-gray-400 text-[10px] md:text-sm mt-1`}>
              {item.label}
            </p>
          </div>
        ))}
      </motion.div>

    </section>
  );
}
