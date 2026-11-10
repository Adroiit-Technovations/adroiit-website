import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/private/',
        '/admin/',
        '/api/',           // Protect any API routes
        '/_next/',         // Next.js internal files
        '/server-actions/', // Optional: if you use server actions
      ],
    },
    sitemap: 'https://www.adroiittechnovations.in/sitemap.xml',
  };
}