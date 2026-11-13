
"use client";

import Image from "next/image";
import { motion, useAnimationControls } from "framer-motion";
import { Bricolage_Grotesque } from "next/font/google";
import { useState } from "react";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
});

// ============================================================
// GALLERY IMAGES
// ============================================================

const images = [
  "/projects/1.jpg",
  "/projects/mvit-mou.jpeg",
  "/projects/3.jpeg",
  "/projects/smvec-mou.jpeg",
  "/projects/6.jpeg",
  "/projects/mvit-mou2.jpeg",
  "/projects/dsc-3.jpeg",
  "/projects/aic-pecf-mou.jpeg",
  "/projects/5.jpg",
  "/projects/dsc-2.jpeg",
  "/projects/7.jpeg",
  "/projects/dsc-1.jpeg",
  "/projects/8.jpg",
  "/projects/dsc-7.jpeg",
  "/projects/2.jpg",
  "/projects/4.jpg",
];

// Duplicate images for seamless scrolling
const duplicatedImages = [...images, ...images];

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function Gallery() {
  const controls = useAnimationControls();

  const [isPaused, setIsPaused] = useState(false);

  const startScrolling = () => {
    setIsPaused(false);

    controls.start({
      x: "-50%",
      transition: {
        duration: 75,
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop",
      },
    });
  };

  const stopScrolling = () => {
    setIsPaused(true);
    controls.stop();
  };

  return (
    <section
      className={`${bricolage.className} relative isolate overflow-hidden py-8 text-white sm:py-20 lg:py-10`}
      style={{
        backgroundImage:
          "linear-gradient(110deg, #30106f 0%, #30106f 100%)",
        backgroundColor: "#30106f",
      }}
    >
      {/* ================================================== */}
      {/* BACKGROUND EFFECTS */}
      {/* ================================================== */}

      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* LEFT PURPLE GLOW */}

        <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-[#8c52ff]/12 blur-[130px]" />

        {/* RIGHT DEEP PURPLE GLOW */}

        <div className="absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full bg-[#18063e]/30 blur-[150px]" />

        {/* CENTRAL SOFT GLOW */}

        <div className="absolute left-1/2 top-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8c52ff]/10 blur-[140px]" />

        {/* SUBTLE GRID TEXTURE */}

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "65px 65px",
            maskImage:
              "radial-gradient(ellipse at center, black 10%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 10%, transparent 80%)",
          }}
        />
      </div>

      <div className="relative z-10">
        {/* ================================================== */}
        {/* SECTION HEADER */}
        {/* ================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-5 max-w-4xl px-5 text-center sm:mb-5"
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-gray-200 sm:text-sm">
            Moments That Inspire
          </p>

          <h2 className="text-2xl font-extrabold leading-[1.1] tracking-tight lg:text-3xl">
            <span className="bg-gradient-to-r from-[#ffffff] via-[#ffffff] to-[#ffffff] bg-clip-text text-transparent">
              Glimpses of our Journey.
            </span>
          </h2>

          <p className="mx-auto mt-3 max-w-4xl text-sm leading-[1.9] text-gray-200 sm:text-base">
            A glimpse into our journey of impactful collaboration,
            empowering young minds and driving innovation.
          </p>
        </motion.div>

        {/* ================================================== */}
        {/* SINGLE ROW GALLERY MARQUEE */}
        {/* ================================================== */}

        <div
          className="relative overflow-hidden"
          onMouseEnter={stopScrolling}
          onMouseLeave={startScrolling}
          onTouchStart={stopScrolling}
          onTouchEnd={startScrolling}
          onTouchCancel={startScrolling}
        >
          {/* EDGE FADES */}

          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#30106f] to-transparent sm:w-24 lg:w-36" />

          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#30106f] to-transparent sm:w-24 lg:w-36" />

          {/* SCROLLING IMAGES */}

          <motion.div
            className="flex w-max gap-4 px-2 sm:gap-5"
            initial={{ x: "0%" }}
            animate={controls}
            onAnimationComplete={() => {
              if (!isPaused) {
                startScrolling();
              }
            }}
          >
            {duplicatedImages.map((img, index) => (
              <GalleryImage
                key={`${img}-${index}`}
                src={img}
                index={index}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// REUSABLE GALLERY IMAGE
// ============================================================

function GalleryImage({
  src,
  index,
}: {
  src: string;
  index: number;
}) {
  const [hasError, setHasError] = useState(false);

  // Hide unavailable images instead of showing blank cards
  if (hasError) {
    return null;
  }

  return (
    <div className="group relative h-[145px] w-[210px] flex-shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#171020] shadow-[0_12px_35px_rgba(0,0,0,0.25)] sm:h-[190px] sm:w-[290px] sm:rounded-2xl lg:h-[220px] lg:w-[340px]">
      <Image
        src={src}
        alt={`Adroiit Technovations gallery image ${index + 1}`}
        fill
        sizes="(max-width: 640px) 210px, (max-width: 1024px) 290px, 340px"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        onError={() => setHasError(true)}
      />

      {/* IMAGE OVERLAY */}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-100" />

      {/* HOVER ACCENT */}

      <div className="pointer-events-none absolute inset-0 rounded-xl border border-[#b18aff]/0 transition-all duration-500 group-hover:border-[#b18aff]/40 sm:rounded-2xl" />
    </div>
  );
}
