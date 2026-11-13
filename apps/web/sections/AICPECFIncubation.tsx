
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Bricolage_Grotesque } from "next/font/google";
import {
  ArrowUpRight,
  Award,
  Building2,
  Lightbulb,
  ShieldCheck,
} from "lucide-react";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
});

export default function AICIncubationSection() {
  return (
    <section
      className={`${bricolage.className} relative overflow-hidden bg-[#f8f7fc] px-5 py-20 sm:px-8 lg:px-16 lg:py-24`}
    >
      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-[#8c52ff]/10 blur-[100px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-[#5921c7]/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7 }}
          className="overflow-hidden rounded-[28px] border border-[#5921c7]/10 bg-white shadow-[0_20px_70px_rgba(48,16,111,0.08)]"
        >
          <div className="grid items-center gap-10 px-7 py-12 sm:px-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14 lg:px-16 lg:py-16">
            {/* Left Content */}
            <div>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#5921c7]/15 bg-[#5921c7]/5 px-4 py-2">
                <ShieldCheck
                  size={15}
                  className="text-[#5921c7]"
                />
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5921c7]">
                  Our Incubation Journey
                </span>
              </div>

              <h2 className="max-w-2xl text-3xl font-bold leading-[1.15] tracking-tight text-[#1b1230] sm:text-4xl lg:text-5xl">
                Growing Ideas.
                <span className="block bg-gradient-to-r from-[#5921c7] to-[#8c52ff] bg-clip-text text-transparent">
                  Building Innovation.
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-base leading-8 text-[#625b70] sm:text-lg">
                Adroiit Technovations is proudly incubated at{" "}
                <span className="font-semibold text-[#30106f]">
                  Atal Incubation Centre – Pondicherry Engineering College
                  Foundation (AIC-PECF)
                </span>
                , an ecosystem that supports entrepreneurs and technology-driven
                startups in transforming ideas into impactful solutions.
              </p>

              {/* Supporting Points */}
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#5921c7]/10">
                    <Lightbulb
                      size={19}
                      className="text-[#5921c7]"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#24143e]">
                      Innovation Driven
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-[#777084]">
                      Encouraging ideas and technology-led solutions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#5921c7]/10">
                    <Award
                      size={19}
                      className="text-[#5921c7]"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#24143e]">
                      Startup Ecosystem
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-[#777084]">
                      Growing within a technology-focused incubation ecosystem.
                    </p>
                  </div>
                </div>
              </div>

              {/* Official Website Link */}
              <a
                href="https://aicpecf.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-9 inline-flex items-center gap-2 rounded-full bg-[#5921c7] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#5921c7]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#4517a5] hover:shadow-xl hover:shadow-[#5921c7]/25"
              >
                Explore AIC-PECF
                <ArrowUpRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </a>
            </div>

            {/* Right Logo Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative mx-auto w-full max-w-md"
            >
              <div className="absolute -inset-4 rounded-[30px] bg-gradient-to-br from-[#5921c7]/10 via-[#8c52ff]/5 to-[#ffcc00]/10 blur-xl" />

              <div className="relative rounded-[24px] border border-[#e9e3f3] bg-white p-7 shadow-[0_15px_45px_rgba(48,16,111,0.08)] sm:p-10">
                <div className="mb-7 text-center">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#91889f]">
                    Proudly Incubated At
                  </span>
                </div>

                <div className="flex min-h-[150px] items-center justify-center rounded-2xl bg-[#faf9fc] px-5 py-8">
                  <Image
                    src="/aic-pecf-logo.png"
                    alt="Atal Incubation Centre - Pondicherry Engineering College Foundation (AIC-PECF)"
                    width={420}
                    height={180}
                    className="h-auto max-h-[125px] w-full max-w-[300px] object-contain"
                  />
                </div>

                <div className="mt-7 text-center">
                  <h3 className="text-xl font-bold text-[#24143e]">
                    AIC-PECF
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#777084]">
                    Atal Incubation Centre
                    <br />
                    Pondicherry Engineering College Foundation
                  </p>
                </div>

                <div className="mt-7 flex items-center justify-center gap-2 border-t border-[#eeeaf4] pt-6">
                  <Building2
                    size={16}
                    className="text-[#5921c7]"
                  />
                  <span className="text-xs font-medium text-[#777084]">
                    Puducherry, India
                  </span>
                </div>
              </div>

              {/* Decorative Accent */}
              <div className="absolute -right-3 -top-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffcc00] shadow-lg shadow-[#ffcc00]/20">
                <Award size={23} className="text-[#30106f]" />
              </div>
            </motion.div>
          </div>

          {/* Bottom Supporting Strip */}
          <div className="border-t border-[#eeeaf4] bg-[#fbfaff] px-7 py-5 text-center sm:px-12">
            <p className="text-xs font-medium leading-6 text-[#777084] sm:text-sm">
              Supported by Atal Innovation Mission (AIM), NITI Aayog,
              Government of India.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
