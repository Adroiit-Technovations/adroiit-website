import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.adroiittechnovations.in'
  const lastModified = new Date()

  return [
    { url: baseUrl, lastModified, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/services`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/internship`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    // School Solutions
    { url: `${baseUrl}/services/stem-til`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/services/stem-workshop`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/services/stem-bootcamp`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    // College Solutions
    { url: `${baseUrl}/services/coe`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/services/coe-advanced-lab`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/services/value-added-courses`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/services/technical-workshop`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    // Engineering Services
    { url: `${baseUrl}/services/custom-machinery-fabrication`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/services/3d-printing`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/services/mechanical-cad`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    // Legal
    { url: `${baseUrl}/privacy`, lastModified, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${baseUrl}/terms`, lastModified, changeFrequency: 'yearly', priority: 0.4 },
  ]
}