import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import WhatsappButton from "@/components/WhatsappButton"; // ✅ Imported

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Adroiit Technovations",
  description: "Empowering Next-Gen through Education and Innovation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} antialiased bg-[#f5f5f5]`}
      >
        <Navbar />
        
        {/* Main background layout that contrasts with the black footer to show the curves */}
        <main className="min-h-screen bg-[#f5f5f5] w-full">
          {children}
        </main>
        
        {/* ✅ WhatsApp button added globally */}
        <WhatsappButton />
        
        <Analytics />
      </body>
    </html>
  );
}