"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bricolage_Grotesque } from "next/font/google";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

const testimonials = [
  {
    name: "Priya R",
    role: "Parent - 3D Printing Class",
    text: "I am very satisfied with the teaching. The individual care and attention given to my daughter made a big difference.",
  },
  {
    name: "Hariharan",
    role: "Parent - Robotics Class",
    text: "Good place to go on with STEM Education and Robotics Courses.",
  },
  {
    name: "Shanmugapriya M",
    role: "Research & Development Intern",
    text: "I built my first Arduino project here. Learning is fun and practical!",
  },
  {
    name: "Rahul Sharma",
    role: "Parent",
    text: "My child developed real interest in robotics. The hands-on projects are amazing!",
  },
  {
    name: "Ananya Verma",
    role: "Student",
    text: "I built my first Arduino project here. Learning is fun and practical!",
  },
  {
    name: "School Coordinator",
    role: "Partner School",
    text: "Adroiit Technovations transformed our STEM education approach completely.",
  },
  {
    name: "Rahul Sharma",
    role: "Parent",
    text: "My child developed real interest in robotics. The hands-on projects are amazing!",
  },
  {
    name: "Ananya Verma",
    role: "Student",
    text: "I built my first Arduino project here. Learning is fun and practical!",
  },
  {
    name: "School Coordinator",
    role: "Partner School",
    text: "Adroiit Technovations transformed our STEM education approach completely.",
  },
];

// Group into slides of 3
const chunkArray = (arr: any[], size: number) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

export default function Testimonials() {
  const slides = chunkArray(testimonials, 3);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [paused, slides.length]);

  return (
    <section className={`${bricolage.className} py-8 bg-black text-white overflow-hidden`}>

      {/* Heading */}
      <div className="text-center mb-6 px-4">
        <h2 className="text-3xl md:text-2xl text-purple-600 font-bold">
          What People Say
        </h2>
        <p className="text-gray-200 italic mt-2 text-sm md:text-base">
          Real feedback from students, parents and schools
        </p>
      </div>

      {/* Slider */}
      <div
        className="relative w-full overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <motion.div
          className="flex"
          animate={{ x: `-${index * 100}%` }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          {slides.map((group, i) => (
            <div
              key={i}
              className="w-full flex-shrink-0 px-4 md:px-5"
            >
              <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-3 gap-6 md:gap-8">

                  {group.map((t, j) => (
                    <div
                      key={j}
                      className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-[#5921c7]/20 to-black border border-[#8c52ff]/30 shadow-lg"
                    >
                      <p className="text-gray-300 italic text-sm md:text-base">
                        “{t.text}”
                      </p>

                      <div className="mt-6">
                        <h3 className="font-semibold text-purple-600">
                          {t.name}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {t.role}
                        </p>
                      </div>
                    </div>
                  ))}

                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Dots */}
      <div className="flex justify-center mt-8 gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-3 w-3 rounded-full transition ${
              index === i ? "bg-[#8c52ff]" : "bg-gray-600"
            }`}
          />
        ))}
      </div>

    </section>
  );
}