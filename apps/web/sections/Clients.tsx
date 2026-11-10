
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Bricolage_Grotesque } from "next/font/google";
import { useState } from "react";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
});

// ============================================================
// CLIENT & PARTNER LOGOS
// ============================================================

const logos = [
  "/clients/client1.png",
  "/clients/client2.jpg",
  // "/clients/client3.png",
];

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function Clients() {
  return (
    <section
      className={`${bricolage.className} relative isolate overflow-hidden bg-[#f8f7fc] py-16 text-gray-900 sm:py-20 lg:py-10`}
    >
      {/* ================================================== */}
      {/* BACKGROUND EFFECTS */}
      {/* ================================================== */}

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-0 h-[350px] w-[350px] rounded-full bg-[#8c52ff]/[0.06] blur-[140px]" />

        <div className="absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-[#5921c7]/[0.05] blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #5921c7 1px, transparent 1px), linear-gradient(to bottom, #5921c7 1px, transparent 1px)",
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
          className="mx-auto mb-12 max-w-3xl text-center sm:mb-4"
        >
          {/* Eyebrow */}

          <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-[#8c52ff] sm:text-sm">
            Trusted Relationships
          </p>

          {/* Heading */}

          <h2 className="text-2xl font-extrabold leading-[1.1] tracking-tight text-[#171020] sm:text-5xl lg:text-4xl">
            Our Clients & {" "}
           
            <span className="bg-gradient-to-r from-[#5921c7] via-[#8c52ff] to-[#b18aff] bg-clip-text text-transparent">
              Partners.
            </span>
          </h2>

          {/* Description */}

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-[1.7] text-gray-900 sm:text-base">
            Trusted by prominent educational institutions, we collaborate
            to inspire innovation, empower learners, and create meaningful
            opportunities through education and technology.
          </p>
        </motion.div>

        {/* ================================================== */}
        {/* CLIENT & PARTNER LOGOS */}
        {/* ================================================== */}

        <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-7 lg:gap-4">
          {logos.map((logo, index) => (
            <ClientLogo
              key={logo}
              src={logo}
              index={index}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

// ============================================================
// REUSABLE CLIENT LOGO CARD
// ============================================================

function ClientLogo({
  src,
  index,
}: {
  src: string;
  index: number;
}) {
  const [hasError, setHasError] = useState(false);

  // Hide unavailable logos instead of displaying blank cards
  if (hasError) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.6,
        delay: index * 0.12,
        ease: "easeOut",
      }}
      className="flex h-[130px] w-[130px] flex-shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-gray-200 bg-white p-4 shadow-[0_8px_25px_rgba(0,0,0,0.04)] sm:h-[180px] sm:w-[180px] sm:p-0"
    >
      {/* Square Logo Image */}

      <div className="relative flex h-full w-full items-center justify-center">
        <Image
          src={src}
          alt={`Adroiit Technovations client and partner ${index + 1}`}
          width={180}
          height={180}
          onError={() => setHasError(true)}
          className="h-[65%] w-[65%] object-contain"
        />
      </div>
    </motion.div>
  );
}
