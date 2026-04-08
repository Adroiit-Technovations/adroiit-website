import type { Metadata } from "next";
import { Geist, Geist_Mono, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // ✅ ADD THIS

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} antialiased`}
      >
        {/* 🔝 Navbar added globally */}
        <Navbar />

        {/* 📄 Keep your content same */}
        {children}
      </body>
    </html>
  );
}