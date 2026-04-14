import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/private/'], // Add any folders you don't want indexed
    },
    sitemap: 'https://www.adroiittechnovations.in/sitemap.xml',
  }
}