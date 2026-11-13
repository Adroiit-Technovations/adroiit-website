
"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Instagram,
  Youtube,
  Send,
  Loader2,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { Bricolage_Grotesque } from "next/font/google";
import { handleNewsletter } from "@/app/actions";
import { useState } from "react";

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

interface FooterColors {
  newsletter?: string;
  reachUsOut?: string;
}

interface PremiumFooterProps {
  headingColors?: FooterColors;
}

export default function PremiumFooter({ headingColors }: PremiumFooterProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const socialLinks = [
    { Icon: Instagram, href: "https://www.instagram.com/adroiit.technovations" },
    { Icon: LinkedInIcon, href: "https://www.linkedin.com/company/adroiit-technovations" },
    { Icon: Youtube, href: "https://www.youtube.com/@AdroiitTechnovations" },
    { Icon: XIcon, href: "https://x.com/adroiittech" },
  ];

  async function clientAction(formData: FormData) {
    setStatus("loading");
    const res = await handleNewsletter(formData);
    if (res.success) {
      setStatus("success");
      setTimeout(() => setStatus("idle"), 4000);
    } else {
      setStatus("idle");
      alert("Something went wrong. Please try again.");
    }
  }

  return (
    <footer
      className={`${bricolage.className} relative z-10 overflow-hidden rounded-t-[40px] border-t border-white/10 px-8 pt-11 pb-12 text-white md:rounded-t-[80px]`}
      style={{
        backgroundImage:
          "linear-gradient(110deg, #30106f 0%, #30106f 100%)",
        backgroundColor: "#30106f",
      }}
    >
      {/* BACKGROUND EFFECTS */}

      <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-[#8c52ff]/12 blur-[130px]" />

        <div className="absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full bg-[#18063e]/30 blur-[150px]" />

        <div className="absolute left-1/2 top-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8c52ff]/10 blur-[140px]" />

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

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-5 grid w-full grid-cols-1 items-start gap-12 md:grid-cols-3">

          {/* COLUMN 1: BRAND */}

          <div className="flex flex-col items-start space-y-6 md:justify-self-start">
            <div className="flex flex-col space-y-3">
              <Image
                src="/logo2.png"
                alt="Adroiit Technovations"
                width={150}
                height={55}
                className="brightness-125 grayscale transition-all duration-700 hover:grayscale-0"
              />

              <p className="max-w-xs text-sm font-light leading-relaxed text-gray-200">
                Empowering the Next-Gen through <br className="hidden md:block" />
                <span className="font-medium">
                  Education & Innovation.
                </span>
              </p>

              {/* INCUBATED AT LOGO */}

              <div className="flex flex-col items-start space-y-1.5 pt-2">
                <span className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#d6c1ff]">
                  Incubated at
                </span>

                <Image
                  src="/aic-pecf-logo.png"
                  alt="Incubator Logo"
                  width={220}
                  height={100}
                  className="rounded-2xl"
                />
              </div>
            </div>
          </div>

          {/* COLUMN 2: NEWSLETTER + SOCIALS */}

          <div className="flex w-full max-w-sm flex-col items-start space-y-6 md:justify-self-center">
            <h4 className="premium-label">Newsletter</h4>

            <div className="w-full space-y-6">
              <p className="text-sm font-light text-gray-200">
                Insights on Technology and Innovation.
              </p>

              <form action={clientAction} className="group relative w-full">
                <input
                  name="email"
                  type="email"
                  required
                  placeholder={status === "success" ? "Subscribed!" : "Email Address"}
                  className={`premium-input ${
                    status === "success"
                      ? "border-green-500/50 text-green-400 placeholder:text-green-400"
                      : ""
                  }`}
                  disabled={status !== "idle"}
                />

                <button
                  type="submit"
                  disabled={status !== "idle"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-white p-2.5 text-black transition-all duration-500 hover:bg-purple-500 hover:text-white disabled:bg-neutral-800 disabled:text-neutral-500"
                >
                  {status === "loading" ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : status === "success" ? (
                    <CheckCircle2 size={16} className="text-green-500" />
                  ) : (
                    <Send size={16} />
                  )}
                </button>
              </form>

              {/* SOCIAL MEDIA LINKS */}

              <div className="flex flex-wrap gap-3 pt-2">
                {socialLinks.map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] transition-all duration-500 hover:border-purple-300/40 hover:bg-white/[0.08]"
                  >
                    <span className="text-white transition-colors duration-300 group-hover:text-white">
                      <item.Icon size={16} />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* COLUMN 3: REACH US OUT */}

          <div className="flex w-full flex-col items-start space-y-6 md:w-fit md:justify-self-end">
            <h4 className="premium-label">Reach Us Out</h4>

            <div className="flex flex-col space-y-2">

              <div className="group flex items-center gap-4">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] transition-all duration-500 group-hover:border-purple-300/40 group-hover:bg-white/[0.08]">
                  <Phone size={18} className="text-white" />
                </div>

                <a
                  href="tel:+918870002908"
                  className="text-sm font-medium text-gray-200 transition-colors hover:text-white"
                >
                  +91-8870002908
                </a>
              </div>

              <div className="group flex items-center gap-4">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] transition-all duration-500 group-hover:border-purple-300/40 group-hover:bg-white/[0.08]">
                  <Mail size={18} className="text-white" />
                </div>

                <a
                  href="mailto:info@adroiittechnovations.in"
                  className="text-sm font-medium text-gray-200 transition-colors hover:text-white"
                >
                  info@adroiittechnovations.in
                </a>
              </div>

              <div className="group flex items-start gap-4">
                <div className="mt-0.5 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] transition-all duration-500 group-hover:border-purple-300/40 group-hover:bg-white/[0.08]">
                  <MapPin size={18} className="text-white" />
                </div>

                <p className="max-w-[280px] text-sm font-medium leading-relaxed text-gray-200">
                  15A, Pavendhar Street, Thamizh Thai Nagar, Uppalam, Puducherry - 605004
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}

        <div className="flex flex-col items-center justify-between gap-8 border-t border-white/10 pt-1 md:flex-row">
          <div className="flex items-center gap-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-300">
              © 2026 Adroiit Technovations. All Rights Reserved.
            </p>
          </div>

          <div className="flex gap-10 text-[10px] font-bold uppercase tracking-[0.1em] text-gray-300">
            <Link
              href="/privacy"
              className="transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="transition-colors hover:text-white"
            >
              Terms and Conditions
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .premium-label {
          font-size: 10px;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: #d6c1ff;
          font-weight: 900;
          display: block;
          padding-top: 8px;
        }

        .premium-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 16px;
          padding: 14px 50px 14px 20px;
          font-size: 13px;
          color: white;
          transition: all 0.3s;
        }

        .premium-input:focus {
          outline: none;
          border-color: rgba(214, 193, 255, 0.65);
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </footer>
  );
}
