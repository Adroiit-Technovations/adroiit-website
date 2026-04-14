import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
  weight: ["200", "300", "400", "500", "600", "700", "800"], // Explicit weights for variable font
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.adroiittechnovations.in"),
  title: {
    default: "Adroiit Technovations | STEM Education, Robotics & 3D Printing in Puducherry",
    template: "%s | Adroiit Technovations",
  },
  description: "Hands-on STEM education, robotics workshops, IoT projects, 3D printing services, and engineering solutions in Puducherry. Summer robotics camps, school programs, bootcamps & custom fabrication.",
  keywords: [
    "STEM education Puducherry",
    "robotics workshop Pondicherry",
    "3D printing Puducherry",
    "IoT classes Puducherry",
    "summer robotics camp Puducherry",
    "STEM tinkering lab Pondicherry",
    "embedded systems training Puducherry",
    "mechanical CAD services Puducherry",
    "STEM bootcamps Puducherry",
    "custom machinery fabrication Puducherry"
  ],
  authors: [{ name: "Adroiit Technovations" }],
  creator: "Adroiit Technovations",
  publisher: "Adroiit Technovations",
  alternates: {
    canonical: "https://www.adroiittechnovations.in",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.adroiittechnovations.in/",
    siteName: "Adroiit Technovations",
    title: "Adroiit Technovations - STEM Education, Robotics & 3D Printing in Puducherry",
    description: "Hands-on STEM education, robotics workshops, IoT projects, 3D printing services, and engineering solutions in Puducherry.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Adroiit Technovations - STEM Robotics & Innovation in Puducherry" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@adroiittech",
    title: "Adroiit Technovations | STEM Education in Puducherry",
    description: "Hands-on Robotics, IoT, 3D Printing & Engineering Solutions",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Schema.org Organization Data (enhanced for Local SEO)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Adroiit Technovations",
    "url": "https://www.adroiittechnovations.in",
    "description": "Hands-on STEM education, robotics workshops, IoT, 3D printing services, and engineering solutions in Puducherry.",
    "logo": "https://www.adroiittechnovations.in/icon.png",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Pavendhar Street, Uppalam",
      "addressLocality": "Puducherry",
      "addressRegion": "Puducherry",
      "postalCode": "605001",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 11.9338,
      "longitude": 79.8298
    },
    "telephone": "+91-9768871110",
    "email": "info@adroiittechnovations.in",
    "sameAs": [
      "https://www.instagram.com/adroiit.technovations",
      "https://www.linkedin.com/company/adroiit-technovations",
      "https://www.youtube.com/@AdroiitTechnovations",
      "https://x.com/adroiittech"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "STEM & Engineering Services",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "STEM Workshops & Bootcamps" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Robotics Training & Summer Camps" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "3D Printing Services" } },
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Custom Machinery Fabrication" } }
      ]
    }
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