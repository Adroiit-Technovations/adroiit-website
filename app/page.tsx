import type { Metadata } from 'next';
import Image from 'next/image';
import Script from 'next/script';

// Optimized Metadata for SEO + Local Search
export const metadata: Metadata = {
  title: 'Adroiit Technovations | STEM Education, Robotics & 3D Printing in Puducherry',
  description: 'Hands-on STEM education, robotics workshops, IoT projects, 3D printing services, and engineering solutions in Puducherry. Summer robotics camps, school programs, bootcamps & custom fabrication.',
  keywords: [
    'STEM education Puducherry',
    'robotics workshop Pondicherry',
    '3D printing Puducherry',
    'IoT classes Puducherry',
    'summer robotics camp Puducherry',
    'STEM tinkering lab Pondicherry',
    'embedded systems training Puducherry',
    'mechanical CAD services Puducherry'
  ],
  authors: [{ name: 'Adroiit Technovations' }],
  openGraph: {
    title: 'Adroiit Technovations - Best STEM Education & Robotics in Puducherry',
    description: 'Empowering students and institutions with practical STEM, Robotics, IoT & 3D Printing skills in Puducherry.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    url: 'https://www.adroiittechnovations.in',
    type: 'website',
  },
  icons: {
    icon: '/icon.png',
  },
};

export default function Home() {
  return (
    <>
      {/* JSON-LD Structured Data for LocalBusiness + EducationalOrganization */}
      <Script
        id="schema-script"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "Adroiit Technovations",
            "url": "https://www.adroiittechnovations.in",
            "description": "Hands-on STEM education, robotics workshops, IoT, 3D printing, and engineering solutions in Puducherry.",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Puducherry",
              "addressRegion": "Puducherry",
              "addressCountry": "IN"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "11.9416",   // Replace with your exact latitude
              "longitude": "79.8083"   // Replace with your exact longitude
            },
            "telephone": "+91-8870002908",   // Replace with your real phone number
            "email": "info@adroiittechnovations.in",   // Update if different
            "sameAs": [
              "https://www.instagram.com/adroiittechnovations/",   // Add your actual social links
              // Add more: LinkedIn, YouTube, Facebook if available
            ],
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "STEM Education & Engineering Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "STEM Workshops & Bootcamps"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Robotics Training"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "3D Printing Services"
                  }
                }
              ]
            }
          })
        }}
      />

      {/* Your existing homepage content goes here */}
      <main>
        {/* Hero Section - Keep your original hero but ensure only ONE <h1> */}
        <section className="hero">
          <h1 className="text-5xl font-bold">
            Empowering Next-Gen through STEM Education & Innovation in Puducherry
          </h1>
          <p>Hands-on Robotics, IoT, 3D Printing & Engineering Solutions</p>
          {/* Your buttons, stats, etc. */}
        </section>

        {/* Services Section - Use H2 for main headings */}
        <section>
          <h2 className="text-4xl font-semibold">Our Services</h2>
          {/* Your service cards: STEM Lab, Workshops, Bootcamps, 3D Printing, etc. */}
        </section>

        {/* Gallery, Testimonials, Partners, Contact CTA - Use H2/H3 appropriately */}

        {/* Footer / Final CTA */}
      </main>
    </>
  );
}