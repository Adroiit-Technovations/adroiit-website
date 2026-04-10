"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Bricolage_Grotesque } from "next/font/google";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

export default function Clients() {
  const logos = [
    "/clients/client1.png",
    "/clients/client2.jpg",
    //"/clients/client3.png",
  ];

  return (
    <section className={`${bricolage.className} bg-gray-50 text-gray-900 py-8 px-6`}>

      {/* Heading */}
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-2xl font-bold text-[#8c52ff]">
          Our Clients & Partners
        </h2>
        <p className="text-gray-600 italic mt-3 max-w-3xl mx-auto">
          Trusted by Prominent Educational Institutions
        </p>
      </div>

      {/* Logos */}
      <div className="flex flex-wrap justify-center gap-6 md:gap-8 max-w-7xl mx-auto items-center">
        {logos.map((logo, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            viewport={{ once: true }}
            className="flex justify-center items-center p-6 md:p-8 bg-white rounded-2xl shadow-sm hover:shadow-lg border border-purple-100 hover:border-[#8c52ff] transition-all duration-300 hover:scale-105 w-[160px]"
          >
            <Image
              src={logo}
              alt="Client or Partner Logo"
              width={160}
              height={80}
              className="object-contain transition duration-400 max-h-20"
            />
          </motion.div>
        ))}
      </div>

    </section>
  );
}