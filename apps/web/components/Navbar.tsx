
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Menu, X } from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

// ORIGINAL ADROIIT PROPERTIES PRESERVED
const IMAGE_WIDTH = 90;
const IMAGE_HEIGHT = 150;
const NAV_PADDING = -85;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Close mobile menu on resize if screen becomes large
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const navHeight = IMAGE_HEIGHT + NAV_PADDING;

  return (
    <div
      className={`${bricolage.className} absolute top-8 left-0 right-0 flex justify-center z-50 px-2`}
    >
      <nav
        className="
          flex
          items-center
          justify-between
          bg-gradient-to-r from-[#30106f] to-[#30106f] 
          text-white
          px-3
          rounded-full
          shadow-2xl
          border
          border-white/20
          w-full
          max-w-[1350px]
          relative
          transition-all
          duration-300
        "
        style={{ height: `${navHeight}px` }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex-shrink-0 pl-6"
          style={{
            lineHeight: 0,
            display: "flex",
            alignItems: "center",
          }}
        >
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

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-0 flex-1 justify-center">
          {/* Home */}
          <Link
            href="/"
            className="
              px-4
              py-1
              text-sm
              text-white
              hover:text-white
              transition-colors
              rounded-full
              hover:bg-white/15
              whitespace-nowrap
            "
          >
            Home
          </Link>

          {/* About Us */}
          <Link
            href="/about"
            className="
              px-4
              py-1
              text-sm
              text-white
              hover:text-white
              transition-colors
              rounded-full
              hover:bg-white/15
              whitespace-nowrap
            "
          >
            About Us
          </Link>

          {/* Solutions Dropdown */}
          <div
            className="relative"
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
          >
            <button
              type="button"
              className="
                flex
                items-center
                gap-1
                px-4
                py-1
                text-sm
                text-white
                hover:text-white
                transition-colors
                rounded-full
                hover:bg-white/15
                whitespace-nowrap
              "
            >
              Solutions

              <ChevronDown
                size={13}
                className={`transition-transform duration-200 mt-px ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`
                absolute
                left-1/2
                -translate-x-1/2
                bg-gradient-to-br from-[#3e1b86] to-[#30106f]
                border
                border-[#c5a5ff]/35
                rounded-2xl
                p-5
                w-[360px]
                space-y-4
                shadow-[0_20px_55px_rgba(35,8,85,0.45)]
                transition-all
                duration-200
                overflow-hidden

                ${
                  open
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
                }
              `}
              style={{
                top: `${navHeight + 10}px`,
              }}
            >
              {/* Dropdown Background Highlights */}
              <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#a77aff]/25 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-12 h-40 w-40 rounded-full bg-[#8c52ff]/25 blur-3xl" />

              <div className="relative z-10 space-y-4">
                {/* Schools */}
                <div>
                  <p className="text-[10px] text-[#d9c8ff] uppercase tracking-widest mb-2 font-bold">
                    Schools
                  </p>

                  <ul className="space-y-1 text-sm text-purple-100/90">
                    <li>
                      <Link
                        href="/services/steam-til"
                        className="
                          hover:text-white
                          transition-colors
                          block
                          py-0.5
                        "
                      >
                        STEAM Tinkering & Innovation Lab (TIL)
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/services/csl"
                        className="
                          hover:text-white
                          transition-colors
                          block
                          py-0.5
                        "
                      >
                        Composite Skill Lab (CSL)
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/services/steam-workshops-bootcamps"
                        className="
                          hover:text-white
                          transition-colors
                          block
                          py-0.5
                        "
                      >
                        STEAM Workshops & Bootcamps
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="h-px bg-white/15" />

                {/* Colleges */}
                <div>
                  <p className="text-[10px] text-[#d9c8ff] uppercase tracking-widest mb-2 font-bold">
                    Colleges
                  </p>

                  <ul className="space-y-1 text-sm text-purple-100/90">
                    <li>
                      <Link
                        href="/services/coe"
                        className="
                          hover:text-white
                          transition-colors
                          block
                          py-0.5
                          whitespace-nowrap
                        "
                      >
                        Center of Excellence (CoE)
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/services/value-added-courses"
                        className="
                          hover:text-white
                          transition-colors
                          block
                          py-0.5
                        "
                      >
                        Value Added Courses
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/services/technical-workshop"
                        className="
                          hover:text-white
                          transition-colors
                          block
                          py-0.5
                        "
                      >
                        Technical Workshops
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="h-px bg-white/15" />

                {/* Engineering */}
                <div>
                  <p className="text-[10px] text-[#d9c8ff] uppercase tracking-widest mb-2 font-bold">
                    Engineering
                  </p>

                  <ul className="space-y-1 text-sm text-purple-100/90">
                    <li>
                      <Link
                        href="/services/custom-machinery-fabrication"
                        className="
                          hover:text-white
                          transition-colors
                          block
                          py-0.5
                        "
                      >
                        SPM Manfucturing
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/services/3d-printing"
                        className="
                          hover:text-white
                          font-medium
                          transition-colors
                          block
                          py-0.5
                        "
                      >
                        FDM 3D Printing
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/services/mechanical-cad"
                        className="
                          hover:text-white
                          transition-colors
                          block
                          py-0.5
                        "
                      >
                        Mechanical CAD
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Internship */}
          <Link
            href="/internship"
            className="
              px-4
              py-1
              text-sm
              text-white
              hover:text-white
              transition-colors
              rounded-full
              hover:bg-white/15
              whitespace-nowrap
            "
          >
            Internship
          </Link>

          {/* Store */}
          <Link
            href="/store"
            className="
              px-4
              py-1
              text-sm
              text-white
              hover:text-white
              transition-colors
              rounded-full
              hover:bg-white/15
              whitespace-nowrap
            "
          >
            Store
          </Link>

          {/* Verify Certificate */}
          <Link
            href="/verify"
            className="
              px-4
              py-1
              text-sm
              text-white
              hover:text-white
              transition-colors
              rounded-full
              hover:bg-white/15
              whitespace-nowrap
            "
          >
            Verify Certificate
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Contact Us */}
          <Link
            href="/contact"
            className="
              hidden
              md:block
              px-4
              py-3
              text-sm
              font-semibold
              bg-white
              text-[#5921c7]
              rounded-full
              hover:bg-[#30106f]
              hover:text-white
              transition-all
              duration-300
              flex-shrink-0
              whitespace-nowrap
            "
          >
            Contact Us
          </Link>

          {/* Mobile Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={
              mobileMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            className="
              md:hidden
              p-2
              text-white/85
              hover:text-white
              transition-colors
            "
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`
            absolute
            top-[75px]
            left-0
            right-0
            bg-gradient-to-br from-[#30106f] to-[#30106f]
            border
            border-[#c5a5ff]/35
            rounded-3xl
            p-6
            shadow-[0_20px_55px_rgba(35,8,85,0.45)]
            transition-all
            duration-300
            md:hidden
            flex
            flex-col
            gap-6
            overflow-hidden

            ${
              mobileMenuOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4 pointer-events-none"
            }
          `}
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#a77aff]/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-[#8c52ff]/25 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-2 text-center">
            {/* Home */}
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="
                text-lg
                text-white
                hover:text-white
              "
            >
              Home
            </Link>

            {/* About Us */}
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="
                text-lg
                text-white
                hover:text-white
              "
            >
              About Us
            </Link>

            {/* Solutions */}
            <Link
              href="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="
                text-lg
                text-white
                hover:text-white
               
              "
            >
              Solutions
            </Link>

            {/* Internship */}
            <Link
              href="/internship"
              onClick={() => setMobileMenuOpen(false)}
              className="
                text-lg
                text-white
                hover:text-white
              "
            >
              Internship
            </Link>

            {/* Store */}
            <Link
              href="/store"
              onClick={() => setMobileMenuOpen(false)}
              className="
                text-lg
                text-white
                hover:text-white
              "
            >
              Store
            </Link>

            {/* Verify Certificate */}
            <Link
              href="/verify"
              onClick={() => setMobileMenuOpen(false)}
              className="
                text-lg
                text-white
                hover:text-white
              "
            >
              Verify Certificate
            </Link>

            {/* Contact Us */}
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="
                mt-4
                px-6
                py-3
                bg-white
                text-[#5921c7]
                font-bold
                rounded-full
                hover:bg-[#30106f]
                hover:text-white
                transition-all
                duration-300
              "
            >
              Contact Us
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
