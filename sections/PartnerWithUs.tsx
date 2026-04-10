"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Bricolage_Grotesque } from "next/font/google";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

export default function PartnerWithUs() {
  return (
    <section className={`${bricolage.className} py-8 px-6 bg-gray-50`}>
      <div className="max-w-5xl mx-auto text-center">

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-3xl md:text-2xl font-bold text-[#8c52ff]"
        >
          Partner With Us
        </motion.h2>

        {/* Description */}
        <p className="mt-4 text-gray-950 max-w-3xl mx-auto">
          We collaborate with schools, colleges and organizations to deliver
          high-quality STEM, technical education and engineering services through
          hands-on learning and innovative solutions.
        </p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-6"
        >
          <Link 
            href="/contact" 
            className="inline-block px-8 py-3 rounded-full bg-[#8c52ff] text-white transition font-medium"
          >
            Contact Us
          </Link>
        </motion.div>

      </div>
    </section>
  );
}