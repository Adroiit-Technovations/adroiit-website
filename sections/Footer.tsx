"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Linkedin,
  Instagram,
  Youtube,
  Mail,
  ArrowUp,
  ArrowRight,
} from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

export default function PremiumFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socialLinks = [
    { Icon: Instagram, href: "#" },
    { Icon: Linkedin, href: "#" },
    { Icon: Youtube, href: "#" },
    { Icon: Mail, href: "mailto:info@adroiittechnovations.in" },
  ];

  return (
    <footer
      className={`${bricolage.className} relative bg-black text-white px-6 pt-16 pb-10 border-t border-white/5 overflow-hidden`}
    >
      {/* Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-40 bg-[#8c52ff]/10 blur-3xl rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
          {/* BRAND */}
          <div className="space-y-5">
            <Image
              src="/logo2.png"
              alt="Adroiit Technovations"
              width={150}
              height={60}
              className="brightness-110"
            />
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Pioneering the future of autonomous robotics through innovation
              and education.
            </p>

            {/* Recognition */}
            <div className="flex items-center gap-3 pt-2">
              <span className="text-[10px] uppercase tracking-widest text-gray-500">
                Recognized by
              </span>
              <Image
                src="/msme.png" // <-- add MSME logo here
                alt="MSME"
                width={60}
                height={30}
                className="opacity-80 hover:opacity-100 transition"
              />
            </div>
          </div>

          {/* NAVIGATION */}
          <div>
            <h4 className="footer-heading">Navigation</h4>
            <ul className="footer-links">
              {["Home", "About Us", "Services", "Contact"].map((link) => (
                <li key={link}>
                  <Link href={`/${link.toLowerCase().replace(" ", "")}`}>
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SOCIAL */}
          <div>
            <h4 className="footer-heading">Connect</h4>
            <div className="flex gap-3">
              {socialLinks.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="social-icon group"
                >
                  <item.Icon size={16} />
                </Link>
              ))}
            </div>
          </div>

          {/* NEWSLETTER */}
          <div>
            <h4 className="footer-heading">Newsletter</h4>

            <div className="flex flex-col gap-3">
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input-premium"
                />
              </div>

              <button className="btn-premium group">
                Subscribe
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition"
                />
              </button>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

        {/* BOTTOM */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-[11px] uppercase tracking-wider">
            © {new Date().getFullYear()} Adroiit Technovations
          </p>

          <div className="flex items-center gap-8">
            <div className="flex gap-6 text-[11px] text-gray-500 uppercase tracking-wider">
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </div>

            <button onClick={scrollToTop} className="scroll-top">
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* STYLES */}
      <style jsx>{`
        .footer-heading {
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #6b7280;
          margin-bottom: 18px;
          font-weight: 700;
        }

        .footer-links li {
          margin-bottom: 10px;
        }

        .footer-links a {
          font-size: 14px;
          color: #9ca3af;
          transition: 0.3s;
        }

        .footer-links a:hover {
          color: #8c52ff;
        }

        .social-icon {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.02);
          color: #6b7280;
          transition: all 0.3s ease;
        }

        .social-icon:hover {
          color: white;
          border-color: rgba(140, 82, 255, 0.4);
          box-shadow: 0 0 20px rgba(140, 82, 255, 0.15);
        }

        .input-premium {
          width: 100%;
          background: #0d0d0d;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 12px 14px 12px 42px;
          font-size: 13px;
          transition: 0.3s;
        }

        .input-premium:focus {
          outline: none;
          border-color: rgba(140, 82, 255, 0.5);
          box-shadow: 0 0 0 2px rgba(140, 82, 255, 0.1);
        }

        .btn-premium {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #8c52ff;
          padding: 12px;
          border-radius: 14px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          transition: all 0.4s;
        }

        .btn-premium:hover {
          background: white;
          color: black;
        }

        .scroll-top {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
          transition: 0.3s;
        }

        .scroll-top:hover {
          color: #8c52ff;
          border-color: rgba(140, 82, 255, 0.4);
        }
      `}</style>
    </footer>
  );
}