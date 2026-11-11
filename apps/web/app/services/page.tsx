
"use client";

import { motion, type Variants } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  GraduationCap,
  Settings,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { Bricolage_Grotesque } from "next/font/google";
import type { ReactNode } from "react";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

type ServiceLink = {
  name: string;
  href: string;
};

type ServiceCategory = {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  links: ServiceLink[];
};

const serviceCategories: ServiceCategory[] = [
  {
    number: "01",
    title: "For Schools",
    subtitle: "Building tomorrow's innovators",
    description:
      "Nurturing young minds through experiential STEAM education, hands-on technology learning and innovation-driven programmes.",
    icon: BookOpen,
    accent: "from-[#5921c7] to-[#8c52ff]",
    links: [
      {
        name: "STEAM Tinkering & Innovation Lab (TIL)",
        href: "/services/steam-til",
      },
      {
        name: "Composite Skill Lab (CSL)",
        href: "/services/csl",
      },
      {
        name: "STEAM Workshops & Bootcamps",
        href: "/services/steam-workshops-bootcamps",
      },
    ],
  },
  {
    number: "02",
    title: "For Colleges",
    subtitle: "Advancing technical capabilities",
    description:
      "Bridging academia with industry-relevant skills through technical training, specialised programmes and innovation infrastructure.",
    icon: GraduationCap,
    accent: "from-[#7440e8] to-[#a77aff]",
    links: [
      {
        name: "Center of Excellence (CoE)",
        href: "/services/coe",
      },
      {
        name: "Value Added Courses (VACs)",
        href: "/services/value-added-courses",
      },
      {
        name: "Technical Workshops",
        href: "/services/technical-workshop",
      },
    ],
  },
  {
    number: "03",
    title: "Engineering Services",
    subtitle: "Turning concepts into reality",
    description:
      "Supporting businesses, startups and innovators with engineering design, prototyping, fabrication and product development solutions.",
    icon: Settings,
    accent: "from-[#5921c7] to-[#a77aff]",
    links: [
      {
        name: "SPM Manufacturing",
        href: "/services/custom-machinery-fabrication",
      },
      {
        name: "FDM 3D Printing",
        href: "/services/3d-printing",
      },
      {
        name: "Mechanical CAD",
        href: "/services/mechanical-cad",
      },
    ],
  },
];

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUp}
      className="mx-auto mb-4 max-w-3xl text-center"
    >
      <p className="text-[13px] font-bold uppercase tracking-[0.22em] text-gray-700">
        {eyebrow}
      </p>

      <h2 className="mt-4 text-[30px] font-black leading-[1.15] tracking-tight text-[#21172f]">
        {title}
      </h2>

      {description && (
        <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-gray-900">
          {description}
        </p>
      )}
    </motion.div>
  );
}

export default function ServicesPage() {
  return (
    <main
      className={`${bricolage.className} min-h-screen bg-[#f7f5fb] text-[#17121f]`}
    >
      <section
        id="services"
        className="bg-[#f7f5fb] px-6 py-35 md:py-35"
      >
        <div className="mx-auto max-w-[1200px]">
          <SectionHeading
            eyebrow="Explore Our Solutions"
            title={
              <>
               
                <span className="text-[#8c52ff]">  What can we build together?</span>
              </>
            }
            description="Explore our specialised services across education, higher learning and engineering. Each solution is designed to create practical value and meaningful outcomes."
          />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.08 }}
            className="grid gap-6 lg:grid-cols-3"
          >
            {serviceCategories.map((category) => {
              const Icon = category.icon;

              return (
                <motion.article
                  key={category.number}
                  variants={item}
                  whileHover={{ y: -6 }}
                  className="group relative flex flex-col overflow-hidden rounded-[26px] border border-[#e9e3f2] bg-white p-6 shadow-[0_5px_25px_rgba(33,23,47,0.035)] transition-all duration-300 hover:border-[#cbb6ff] hover:shadow-[0_20px_55px_rgba(89,33,199,0.10)] sm:p-7"
                >
                  {/* Top accent */}
                  <div
                    className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${category.accent} opacity-80`}
                  />

                  {/* Category heading */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#5921c7]/[0.08] text-[#5921c7] transition-all duration-300 group-hover:bg-[#5921c7] group-hover:text-white">
                      <Icon size={27} strokeWidth={1.8} />
                    </div>

                    <span className="text-[34px] font-black leading-none text-[#5921c7]/10 transition-colors group-hover:text-[#5921c7]/20">
                      {category.number}
                    </span>
                  </div>

                  <p className="mt-7 text-[10px] font-extrabold uppercase tracking-[0.17em] text-[#8c52ff]">
                    {category.subtitle}
                  </p>

                  <h3 className="mt-2 text-[20px] font-semibold tracking-tight text-gray-900">
                    {category.title}
                  </h3>

                  <p className="mt-2 min-h-[88px] text-[14px] leading-7 text-gray-800">
                    {category.description}
                  </p>

                  {/* Service links */}
                  <div className="mt-4 flex-1 border-t border-gray-100 pt-5">
                    <p className="mb-3 text-[12px] font-bold uppercase tracking-[0.16em] text-[#8c52ff]">
                      Explore services
                    </p>

                    <div className="space-y-2">
                      {category.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="group/link flex items-center justify-between gap-3 rounded-xl bg-[#f8f6fb] px-4 py-3.5 transition-all duration-300 hover:bg-[#5921c7] hover:text-white"
                        >
                          <span className="text-[12px] font-bold leading-5 text-[#342944] transition-colors group-hover/link:text-white">
                            {link.name}
                          </span>

                          <ArrowUpRight
                            size={16}
                            className="shrink-0 text-gray-900 transition-all duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 group-hover/link:text-white"
                          />
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
