
"use client";

import Image from "next/image";
import { Bricolage_Grotesque } from "next/font/google";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

export default function VerifyCertificatePage() {
  const router = useRouter();

  const [certificateId, setCertificateId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanId = certificateId.trim();

    if (!cleanId) {
      setError("Please enter a certificate ID.");
      return;
    }

    setError("");

    router.push(`/verify/${encodeURIComponent(cleanId)}`);
  };

  return (
    <main
      className={`${bricolage.className} relative isolate flex min-h-screen flex-col overflow-hidden bg-[#05030A] px-4 py-5 text-white sm:px-6 sm:py-6 lg:h-screen lg:min-h-0 lg:py-30`}
    >
      {/* BACKGROUND EFFECTS */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-[#5921c7]/20 blur-[150px]" />
        <div className="absolute -right-40 top-[35%] h-[450px] w-[450px] rounded-full bg-[#8c52ff]/10 blur-[150px]" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-[#30106f]/20 blur-[130px]" />
      </div>

      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center">
        {/* Top Center Logo */}
        <div className="flex shrink-0 justify-center">
          <div className="relative h-12 w-40 sm:h-16 sm:w-48 lg:h-16 lg:w-48">
            <Image
              src="/logo2.png"
              alt="Adroiit Technovations"
              fill
              priority
              className="object-contain"
            />
          </div>
        </div>

        {/* Hero */}
        <section className="mx-auto mt-6 w-full max-w-3xl shrink-0 text-center sm:mt-5 lg:mt-4">
          <h1 className="text-center text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-5xl lg:text-3xl">
  
  <span className="bg-gradient-to-r from-[#8c52ff] via-[#a87ffb] to-purple-300 bg-clip-text text-transparent">
    Certificate Verification System
  </span>
</h1>

          <p className="mx-auto mt-2 max-w-3xl text-xs leading-6 text-gray-200 text-[16px] sm:leading-7">
            Verify the authenticity and details of the certificate
            issued by Adroiit Technovations.
          </p>
        </section>

        {/* Verification Card */}
        <section className="mx-auto mt-7 w-full max-w-2xl shrink-0 sm:mt-6 lg:mt-5">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/20 sm:p-7 lg:p-7">
            <div>
              <h2 className="text-base font-semibold text-white sm:text-lg">
                Enter Certificate ID
              </h2>

              <p className="mt-1 text-xs leading-5 text-white/45 sm:text-sm sm:leading-6">
                Enter the certificate ID exactly as shown on the certificate.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 sm:mt-6">
              <label
                htmlFor="certificate-id"
                className="mb-2 block text-sm font-medium text-white/75"
              >
                Certificate ID
              </label>

              <div className="relative">
                <input
                  id="certificate-id"
                  type="text"
                  value={certificateId}
                  onChange={(event) => {
                    setCertificateId(event.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Enter certificate ID"
                  autoComplete="off"
                  className={`h-12 w-full rounded-2xl border bg-white/[0.025] px-4 text-sm text-white outline-none transition placeholder:text-white/25 sm:h-13 ${
                    error
                      ? "border-red-500/50 focus:border-red-500"
                      : "border-white/10 focus:border-[#8C52FF]/70"
                  }`}
                />
              </div>

              {error && (
                <p className="mt-2 text-sm text-red-400">{error}</p>
              )}

              <button
                type="submit"
                className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#5921C7] px-5 text-sm font-semibold text-white transition hover:bg-[#6D2EE3] active:scale-[0.99] sm:h-13"
              >
                Verify Certificate
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-4 border-t border-white/10 pt-3">
              <p className="text-center text-[13px] leading-5 text-gray-300 sm:text-[13px]">
                The verification result is retrieved directly from the
                official Adroiit Technovations&apos; certificate record.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-6 shrink-0 pb-1 text-center sm:mt-5 lg:mt-4">
          <p className="text-[13px] text-gray-300">
            Official Certificate Verification Portal
          </p>

          <p className="mt-1.5 text-[13px] text-gray-300">
            © {new Date().getFullYear()} Adroiit Technovations
          </p>
        </footer>
      </div>
    </main>
  );
}
