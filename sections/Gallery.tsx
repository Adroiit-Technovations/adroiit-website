"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Bricolage_Grotesque } from "next/font/google";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

export default function Gallery() {
  const images = [
    "/projects/1.jpg", "/projects/mvit-mou.jpeg", "/projects/3.jpeg", 
    "/projects/smvec-mou.jpeg", "/projects/6.jpeg", "/projects/mvit-mou2.jpeg", "/projects/5.jpg",
    "/projects/7.jpeg", "/projects/8.jpg", "/projects/2.jpg", "/projects/4.jpg",
  ];

  const duplicatedImages = [...images, ...images];

  return (
    <section className={`${bricolage.className} bg-black text-white py-5`}>
      
      <div className="text-center mb-4">
        <h2 className="text-2xl text-[#8c52ff] font-bold">Our Gallery</h2>
        <p className="text-gray-200 italic mt-2 max-w-2xl mx-auto px-4">
          A glimpse into our hands-on learning and innovation
        </p>
      </div>

      <div className="max-w-[100vw] overflow-hidden relative">
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

        <motion.div 
          className="flex gap-5 px-4" // Slightly reduced gap to match smaller scale
          initial={{ x: 0 }}
          animate={{ x: "-50%" }}
          transition={{
            duration: 60, // Slowed down slightly so smaller cards don't look too fast
            ease: "linear",
            repeat: Infinity,
          }}
          whileHover={{ animationPlayState: "paused" }}
          style={{ width: "fit-content" }}
        >
          {duplicatedImages.map((img, index) => (
            <div
              key={index}
              /* ✅ SCALED DOWN: Kept aspect-ratio at 16/10, reduced width to 180px/280px */
              className="relative aspect-[16/10] w-[180px] md:w-[280px] flex-shrink-0 overflow-hidden rounded-xl border border-white/10 shadow-2xl"
            >
              <Image
                src={img}
                alt={`Project ${index + 1}`}
                fill
                className="object-cover hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}