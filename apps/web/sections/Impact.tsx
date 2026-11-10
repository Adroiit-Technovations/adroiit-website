"use client";

import { motion } from "framer-motion";

export default function Impact() {
  const stats = [
    { number: "500+", label: "Students Trained" },
    { number: "50+", label: "Projects Built" },
    { number: "10+", label: "Schools Partnered" },
    { number: "5+", label: "Technologies Covered" },
  ];

  return (
    <section className="bg-black text-white py-20 px-6">
      
      {/* Heading */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold">
          Our Impact
        </h2>
        <p className="text-gray-400 mt-4">
          Real numbers that showcase our contribution to future innovators
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 max-w-6xl mx-auto text-center">
        
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#5921c7] to-[#8c52ff] p-8 rounded-2xl shadow-lg hover:scale-105 transition"
          >
            <h3 className="text-3xl font-bold">
              {stat.number}
            </h3>
            <p className="mt-2 text-gray-200">
              {stat.label}
            </p>
          </motion.div>
        ))}

      </div>
    </section>
  );
}