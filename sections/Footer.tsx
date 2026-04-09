"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Instagram,
  Youtube,
  Send,
} from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

const LinkedInIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const XIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.494h2.039L6.486 3.24H4.298l13.311 17.407z" />
  </svg>
);

export default function PremiumFooter() {
  const socialLinks = [
    { Icon: Instagram, href: "https://www.instagram.com/adroiit.technovations" },
    { Icon: LinkedInIcon, href: "https://www.linkedin.com/company/adroiit-technovations" },
    { Icon: Youtube, href: "https://www.youtube.com/@AdroiitTechnovations" },
    { Icon: XIcon, href: "https://x.com/adroiittech" },
  ];

  return (
    <footer className={`${bricolage.className} relative bg-[#050505] text-white px-8 pt-11 pb-12 border-t border-white/10 overflow-hidden rounded-t-[40px] md:rounded-t-[80px]`}>
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* FIX: grid-cols-3 forces three equal columns. 
            w-full ensures the container spans the entire max-width.
        */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-50 mb-20 items-start w-full">
          
          {/* COLUMN 1: BRAND */}
          <div className="flex flex-col space-y-3">
            <Image
              src="/logo2.png"
              alt="Adroiit Technovations"
              width={150}
              height={55}
              className="brightness-125 grayscale hover:grayscale-0 transition-all duration-700"
            />
            <p className="text-gray-200 text-sm font-light leading-relaxed max-w-xs">
              Empowering the Next-Gen through <span className="text-purple-500 font-medium">Education </span> and <span className="text-purple-500 font-medium"> Innovation.</span>
            </p>
          </div>

          {/* COLUMN 2: CONNECT */}
          <div className="flex flex-col space-y-6">
            <h4 className="premium-label">Connect with Us</h4>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center w-11 h-11 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-purple-500/30 transition-all duration-500"
                >
                  <span className="text-white group-hover:text-white transition-colors duration-300">
                    <item.Icon size={18} />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* COLUMN 3: NEWSLETTER */}
          <div className="flex flex-col space-y-6">
            <h4 className="premium-label">Newsletter</h4>
            <div className="space-y-4">
              <p className="text-gray-00 text-sm font-light">
                Insights on mechatronics and automation.
              </p>
              <div className="relative group max-w-sm">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="premium-input"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-white text-black rounded-xl hover:bg-purple-500 hover:text-white transition-all duration-500">
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-1 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500/50" />
            <p className="text-gray-500 text-[10px] tracking-[0.3em] uppercase font-bold">
              © 2026 Adroiit Technovations
            </p>
          </div>

          <div className="flex gap-10 text-[10px] tracking-[0.2em] uppercase font-bold text-gray-500">
            <Link href="/privacy" className="hover:text-purple-500 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-purple-500 transition-colors">Terms and Conditions</Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .premium-label {
          font-size: 10px;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: #4b5563;
          font-weight: 900;
          display: block;
          padding-top: 8px; 
        }

        .premium-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 14px 50px 14px 20px;
          font-size: 13px;
          color: white;
          transition: all 0.3s;
        }

        .premium-input:focus {
          outline: none;
          border-color: rgba(140, 82, 255, 0.5);
          background: rgba(255, 255, 255, 0.04);
        }
      `}</style>
    </footer>
  );
}
