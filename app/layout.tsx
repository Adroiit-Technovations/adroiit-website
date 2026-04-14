import type { Metadata } from "next";
import { Geist, Geist_Mono, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.adroiittechnovations.in"),
  title: {
    default: "Adroiit Technovations | STEM Education, Robotics, Embedded Systems, IoT, 3D Printing & Engineering Solutions",
    template: "%s | Adroiit Technovations",
  },
  description: "Adroiit Technovations is an Ed-Tech and Innovation firm empowering the next generation through experiential STEM education and advanced technological innovation.",
  alternates: {
    canonical: "https://www.adroiittechnovations.in",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.adroiittechnovations.in/",
    siteName: "Adroiit Technovations",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@adroiittech",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Schema.org Organization Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Adroiit Technovations",
    "url": "https://www.adroiittechnovations.in",
    "logo": "https://www.adroiittechnovations.in/icon.png", 
    "sameAs": [
      "https://www.instagram.com/adroiit.technovations",
      "https://www.linkedin.com/company/adroiit-technovations",
      "https://www.youtube.com/@AdroiitTechnovations",
      "https://x.com/adroiittech"
    ]
  };

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} antialiased`}>
        {/* Injecting Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        {children}
      </body>
    </html>
  );
}