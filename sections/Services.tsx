"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

export default function Services() {
  const services = [
    {
      title: "STEM Tinkering & Innovation Lab",
      description: "Comprehensive lab setups equipped with STEM kits, structured curriculum and training - where students explore, experiment, build and innovate.",
      image: "/services/stem-lab.png",
      link: "/services/stem-til",
    },
    {
      title: "STEM Workshops",
      description: "Interactive workshops designed to ignite curiosity, creativity and practical skills through hands-on learning experiences.",
      image: "/services/stem-workshop.png",
      link: "/services/stem-workshop",
    },
    {
      title: "STEM Bootcamps",
      description: "Intensive learning programs that nurture critical thinking, problem-solving and technical skills beyond the standard academic curriculum.",
      image: "/services/stem-bootcamp.png",
      link: "/services/stem-bootcamp",
    },
    {
      title: "Center of Excellence (CoE)",
      description: "A complete innovation ecosystem with tools, mentorship and resources - empowering students learn and turn their ideas into prototypes and breakthrough solutions.",
      image: "/services/coe2.png",
      link: "/services/coe-advanced-lab",
    },
    {
      title: "Value Added Courses",
      description: "Enhance core academic learning with industry-relevant, skill-focused courses designed to build practical knowledge and improve career readiness.",
      image: "/services/advanced-labs2.png",
      link: "/services/value-added-courses",
    },
    {
      title: "Technical Workshops",
      description: "Industry-focused training programs that equip students with job ready skills through immersive, hands-on experience using modern tools and technologies.",
      image: "/services/technical-workshop2.png",
      link: "/services/stem-workshop",
    },
    {
      title: "Custom Machinery Fabrication",
      description: "End-to-end machinery fabrication solutions tailored to exact requirements, from design to final assembly. Engineered for high performance and durability.",
      image: "/services/cmf.png",
      link: "/services/custom-machinery-fabrication",
    },
    {
      title: "3D Printing",
      description: "FDM 3D printing serivce that transforms your designs into durable, functional parts with quality, speed and precision. Ideal for rapid prototyping and low-volume production.",
      image: "/services/3d-printing.png",
      link: "/services/3d-printing",
    },
    {
      title: "Mechanical CAD",
      description: "Professional design services offering 2D drafting, 3D modelling and assembly design with engineering precision.",
      image: "/services/mechanical-cad.png",
      link: "/services/mechanical-cad",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerSlide = 3;
  const totalSlides = Math.ceil(services.length / itemsPerSlide);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);

  const startIndex = currentIndex * itemsPerSlide;
  const visibleServices = services.slice(startIndex, startIndex + itemsPerSlide);

  return (
    <section className={`${bricolage.className} bg-gray-50 text-gray-900 py-8 px-6 overflow-hidden`}>
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-2xl font-bold text-purple-600">Our Services</h2>
        <p className="text-gray-700 italic mt-2 max-w-2xl mx-auto">
          Explore what we offer across Schools, Colleges and Industry
        </p>
      </div>

      <div className="max-w-[1200px] mx-auto">
        {/* DESKTOP VIEW: EXACT ORIGINAL CARD STYLE IN A SLIDER */}
        <div className="hidden md:flex relative items-center justify-center gap-6">
          {totalSlides > 1 && (
            <button
              onClick={prevSlide}
              className="absolute left-[-15px] lg:left-[-30px] bg-white hover:bg-gray-100 shadow-lg rounded-full p-2.5 text-gray-700 hover:text-gray-900 transition z-10 border border-gray-100"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* This wrapper mimics your original flex container for cards */}
          <div className="flex items-center justify-center gap-6 w-full">
            <AnimatePresence mode="wait">
              {visibleServices.map((service, idx) => (
                <motion.div
                  key={startIndex + idx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 flex-1 max-w-[340px] flex flex-col h-full"
                >
                  <div className="relative w-full h-40 overflow-hidden shrink-0">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-5 flex flex-col flex-1 justify-between min-h-[220px]">
                    <div>
                      <h3 className="text-lg font-bold text-purple-600 leading-tight">
                        {service.title}
                      </h3>
                      <p className="text-sm text-black mt-2 text-justify">
                        {service.description}
                      </p>
                    </div>
                    
                    <Link href={service.link}>
                      <button className="mt-4 inline-flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-[#8c52ff] text-white text-sm font-semibold rounded-lg shadow-md hover:scale-105 active:scale-95 transition-all duration-300 self-start">
                        Explore
                        <ChevronRight size={14} className="stroke-[2.5]" />
                      </button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {totalSlides > 1 && (
            <button
              onClick={nextSlide}
              className="absolute right-[-15px] lg:right-[-30px] bg-white hover:bg-gray-100 shadow-lg rounded-full p-2.5 text-gray-700 hover:text-gray-900 transition z-10 border border-gray-100"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>

        {/* MOBILE VIEW: EXACT ORIGINAL CARD STYLE STACKED */}
        <div className="flex md:hidden flex-col items-center gap-8">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="group overflow-hidden rounded-2xl bg-white shadow-md border border-gray-200 w-full max-w-[340px] flex flex-col"
            >
              <div className="relative w-full h-40 overflow-hidden shrink-0">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-5 flex flex-col min-h-[220px] justify-between">
                <div>
                  <h3 className="text-lg font-bold text-purple-600 leading-tight">
                    {service.title}
                  </h3>
                  <p className="text-sm text-black mt-2 text-justify">
                    {service.description}
                  </p>
                </div>
                <Link href={service.link}>
                  <button className="mt-4 w-full inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-[#8c52ff] text-white text-sm font-semibold rounded-lg shadow-md">
                    Explore
                    <ChevronRight size={14} className="stroke-[2.5]" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* DOTS (Desktop Only) */}
        {totalSlides > 1 && (
          <div className="hidden md:flex justify-center mt-10 gap-3">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === currentIndex ? "bg-purple-700 scale-125" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
