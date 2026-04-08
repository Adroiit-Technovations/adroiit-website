"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

// ✅ ORIGINAL ADROIIT PROPERTIES PRESERVED
const IMAGE_WIDTH = 90;  
const IMAGE_HEIGHT = 150; 
const NAV_PADDING = -85;   

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 200);
  };

  const navHeight = IMAGE_HEIGHT + NAV_PADDING;

  return (
    <div className={`${bricolage.className} fixed top-2 left-0 right-0 flex justify-center z-50 px-2`}>
      <nav
        className="flex items-center bg-[#0a0a0a] text-white px-3 rounded-full shadow-2xl border border-white/10 w-full max-w-[1400px]"
        style={{ height: `${navHeight}px` }}
      >

        {/* Logo Section */}
        <Link href="/" className="flex-shrink-0 pl-1" style={{ lineHeight: 0, display: "flex", alignItems: "center" }}>
          <Image
            src="/logo2.png"
            alt="Adroiit Technovations"
            width={IMAGE_WIDTH}
            height={IMAGE_HEIGHT}
            priority
            style={{
              width: `${IMAGE_WIDTH}px`,
              height: `${IMAGE_HEIGHT}px`,
              display: "block",
              objectFit: "contain",
            }}
          />
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-0 flex-1 justify-center">
          <Link href="/" className="px-4 py-1 text-sm text-gray-300 hover:text-white transition-colors rounded-full hover:bg-white/5 whitespace-nowrap">
            Home
          </Link>

          <Link href="/about" className="px-4 py-1 text-sm text-gray-300 hover:text-white transition-colors rounded-full hover:bg-white/5 whitespace-nowrap">
            About Us
          </Link>

          {/* Solutions Dropdown */}
          <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
            <button className="flex items-center gap-1 px-4 py-1 text-sm text-gray-300 hover:text-white transition-colors rounded-full hover:bg-white/5 whitespace-nowrap">
              Solutions
              <ChevronDown size={13} className={`transition-transform duration-200 mt-px ${open ? "rotate-180" : ""}`} />
            </button>

            <div
              className={`absolute left-1/2 -translate-x-1/2 bg-[#111111] border border-white/10 rounded-2xl p-5 w-[360px] space-y-4 shadow-2xl transition-all duration-200
              ${open ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-1 pointer-events-none"}`}
              style={{ top: `${navHeight + 10}px` }}
            >
              {/* 1. Schools Section */}
              <div>
                {/* Headers kept original purple for brand consistency, or you can change these too */}
                <p className="text-[10px] text-[#a855f7] uppercase tracking-widest mb-2 font-bold">Schools</p>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li><Link href="/services/stem-til" className="hover:text-[#a855f7] transition-colors block py-0.5">STEM Tinkering & Innovation Lab</Link></li>
                  <li><Link href="/services/stem-workshop" className="hover:text-[#a855f7] transition-colors block py-0.5">STEM Workshops</Link></li>
                  <li><Link href="/services/stem-bootcamp" className="hover:text-[#a855f7] transition-colors block py-0.5">STEM Bootcamps</Link></li>
                </ul>
              </div>

              <div className="h-px bg-white/5" />

              {/* 2. Colleges Section */}
              <div>
                <p className="text-[10px] text-[#a855f7] uppercase tracking-widest mb-2 font-bold">Colleges</p>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li>
                    <Link href="/services/coe" className="hover:text-[#a855f7] transition-colors block py-0.5 whitespace-nowrap">
                      Center of Excellence (CoE)
                    </Link>
                  </li>
                  <li><Link href="/services/value-added-courses" className="hover:text-[#a855f7] transition-colors block py-0.5">Value Added Courses</Link></li>
                  <li><Link href="/services/technical-workshop" className="hover:text-[#a855f7] transition-colors block py-0.5">Technical Workshops</Link></li>
                </ul>
              </div>

              <div className="h-px bg-white/5" />

              {/* 3. Engineering Section */}
              <div>
                <p className="text-[10px] text-[#a855f7] uppercase tracking-widest mb-2 font-bold">Engineering</p>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li><Link href="/services/custom-machinery-fabrication" className="hover:text-[#a855f7] transition-colors block py-0.5">Custom Machinery Fabrication</Link></li>
                  <li><Link href="/services/3d-printing" className="hover:text-[#a855f7] font-medium transition-colors block py-0.5">3D Printing Service</Link></li>
                  <li><Link href="/services/mechanical-cad" className="hover:text-[#a855f7] transition-colors block py-0.5">Mechanical CAD</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <Link href="/careers" className="px-4 py-1 text-sm text-gray-300 hover:text-white transition-colors rounded-full hover:bg-white/5 whitespace-nowrap">
            Apply for Internship
          </Link>
        </div>

          


        {/* CTA Button */}
        <Link
          href="/contact"
          className="px-4 py-1 text-sm font-semibold bg-white text-black rounded-full hover:bg-[#a855f7] hover:text-white transition-all duration-300 flex-shrink-0 whitespace-nowrap mr-2"
        >
          Contact Us
        </Link>

      </nav>
    </div>
  );
}