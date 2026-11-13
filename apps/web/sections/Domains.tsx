
"use client";

import { motion } from "framer-motion";
import { Bricolage_Grotesque } from "next/font/google";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
});

const domains = [
  {
    number: "01",
    title: "Embedded Systems",
    description:
      "Designing intelligent electronic systems by integrating microcontrollers, hardware and software to bring products and devices to life.",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=85",
    category: "Electronics & Engineering",
  },
  {
    number: "02",
    title: "Internet of Things",
    description:
      "Connecting devices, sensors and systems to enable smart monitoring, automation, data exchange and connected experiences.",
    image: "/domains/iot.jpg",
    category: "Connected Technologies",
  },
  {
    number: "03",
    title: "PLC & Industrial Automation",
    description:
      "Exploring programmable logic controllers, industrial control systems and automation concepts for modern manufacturing.",
    image:
      "https://images.unsplash.com/photo-1567789884554-0b844b597180?auto=format&fit=crop&w=900&q=85",
    category: "Industrial Technologies",
  },
  {
    number: "04",
    title: "Drone Technology",
    description:
      "Working with unmanned aerial systems, flight fundamentals, electronics and practical applications of drone technology.",
    image:
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=900&q=85",
    category: "Aerial Technologies",
  },
  {
    number: "05",
    title: "3D Printing",
    description:
      "Turning digital designs into physical objects through 3D modelling, prototyping and additive manufacturing.",
    image: "/3d-printing/3d-printing-hero.jpg",
    category: "Digital Manufacturing",
  },
  {
    number: "06",
    title: "Artificial Intelligence",
    description:
      "Exploring intelligent systems, machine learning concepts and AI-driven applications that enable smarter solutions.",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=85",
    category: "Intelligent Technologies",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: "easeOut" as const,
    },
  },
};

export default function DomainsSection() {
  return (
    <section
      id="domains"
      className={`${bricolage.className} relative overflow-hidden bg-[#080611] px-5 py-10 text-white sm:px-8 lg:px-16 lg:py-10`}
    >
      {/* Background Effects */}
      <div className="pointer-events-none absolute -left-40 top-20 h-[450px] w-[450px] rounded-full bg-[#5921c7]/20 blur-[150px]" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full bg-[#30106f]/25 blur-[150px]" />

      {/* Background Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "70px 70px",
        }}
      />

      <div className="relative mx-auto max-w-[1000px]">
        {/* Section Heading */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          className="mx-auto mb-8 max-w-[900px] text-center"
        >
          <p className="text-[13px] font-semibold uppercase tracking-[0.3em] text-gray-300">
            Our Expertise
          </p>

          <h2 className="mt-3 text-2xl font-extrabold leading-[1.05] tracking-[-0.06em] sm:text-5xl lg:text-[30px]">
            <span className="bg-gradient-to-r from-[#8c52ff] via-[#b18aff] to-[#8c52ff] bg-clip-text text-transparent">
              Domains We Work On
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-[800px] text-[15px] leading-7 text-gray-300 sm:text-[16px]">
            Our multidisciplinary expertise spans across connected systems,
            intelligent automation and digital manufacturing which enables use to create
            meaningful learning experiences and develop technology solutions
            for real-world needs.
          </p>
        </motion.div>

        {/* Domain Cards */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {domains.map((domain, index) => (
            <motion.div
              key={domain.number}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.55,
                delay: (index % 3) * 0.1,
              }}
              className="group relative flex min-h-[320px] flex-col overflow-hidden rounded-[1.25rem] border border-white/[0.09] bg-white/[0.035] p-4 transition-all duration-500 hover:-translate-y-1 hover:border-[#8c52ff]/50 hover:bg-[#5921c7]/[0.10] sm:p-5"
            >
              {/* Domain Image */}
              <div className="relative mb-4 h-36 w-full overflow-hidden rounded-[0.9rem] border border-white/10 bg-[#171024] sm:h-40">
                <div
                  className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage: `url("${domain.image}")`,
                  }}
                  role="img"
                  aria-label={`${domain.title} technology`}
                />

                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080611]/40 via-transparent to-transparent opacity-70" />
              </div>

              {/* Domain Details */}
              <div className="relative flex flex-1 flex-col">
                

                <h3 className="mt-2 text-lg font-bold leading-snug tracking-tight text-[#b18aff]">
                  {domain.title}
                </h3>

                <p className="mt-2 text-[13px] leading-6 text-gray-300">
                  {domain.description}
                </p>
              </div>

              {/* Hover Accent */}
              <div className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#5921c7] to-[#b18aff] transition-all duration-500 group-hover:w-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
