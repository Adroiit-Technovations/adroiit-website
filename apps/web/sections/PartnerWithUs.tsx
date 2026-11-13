
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Bricolage_Grotesque } from "next/font/google";
import { ArrowRight, Sparkles } from "lucide-react";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

export default function PartnerWithUs() {
  return (
    <section
      className={`${bricolage.className} relative isolate overflow-hidden bg-[#faf9fc] px-5 py-8 sm:px-8 sm:py-20 lg:py-10`}
    >
      {/* ================================================== */}
      {/* BACKGROUND EFFECTS */}
      {/* ================================================== */}

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-0 h-80 w-80 rounded-full bg-[#8c52ff]/[0.08] blur-[120px]" />

        <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#5921c7]/[0.07] blur-[130px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #5921c7 1px, transparent 1px), linear-gradient(to bottom, #5921c7 1px, transparent 1px)",
            backgroundSize: "65px 65px",
            maskImage:
              "radial-gradient(ellipse at center, black 0%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 0%, transparent 75%)",
          }}
        />
      </div>

      {/* ================================================== */}
      {/* MAIN CONTENT */}
      {/* ================================================== */}

      <div className="relative mx-auto max-w-5xl text-center">
        {/* Section label */}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-3 inline-flex items-center gap-2"
        >
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-gray-800 sm:text-sm">
            Let's Build the Future Together
          </span>
        </motion.div>

        {/* Heading */}

        <motion.h2
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
  className="mx-auto max-w-full whitespace-nowrap text-[clamp(1.35rem,4.5vw,3.75rem)] font-extrabold leading-tight tracking-tight text-[#171020] sm:text-3xl"
>
  <span className="bg-gradient-to-r from-[#5921c7] via-[#8c52ff] to-[#5921c7] bg-clip-text text-transparent">
    Partner with Adroiit Technovations.
  </span>
</motion.h2>

        {/* Description */}

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="mx-auto mt-3 max-w-3xl leading-[1.9] text-gray-900 text-[17px]"
        >
          We collaborate with educational institutions
          to deliver impactful and meaningful 
          STEAM and technical education through experiential approach.
        </motion.p>

        {/* CTA */}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-5 flex flex-col items-center gap-4"
        >
          <Link
            href="/contact"
            className="bg-gradient-to-r from-[#481f9b] to-[#5921c7] hover:opacity-90 transition px-7 py-3.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 group shadow-lg shadow-purple-900/30"
          >
            Let's Collaborate

            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
