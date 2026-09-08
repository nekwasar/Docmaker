import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://docmaker.io';
  
  const d = new Date("2026-09-08");
  const staticPages = [
    { url: baseUrl, lastModified: d, changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: `${baseUrl}/generate`, lastModified: d, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/pdf`, lastModified: d, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/pdf/merge`, lastModified: d, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/pdf/split`, lastModified: d, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/pdf/compress`, lastModified: d, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/pdf/protect`, lastModified: d, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/pdf/rotate`, lastModified: d, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/pdf/flatten`, lastModified: d, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/pdf/page-numbers`, lastModified: d, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/pdf/pdfa`, lastModified: d, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/pdf/unlock`, lastModified: d, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/pdf/repair`, lastModified: d, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/sign`, lastModified: d, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/convert`, lastModified: d, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/convert/audio`, lastModified: d, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/convert/video`, lastModified: d, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/convert/image`, lastModified: d, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/convert/document`, lastModified: d, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/convert/mixed`, lastModified: d, changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/enterprise`, lastModified: d, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/api-docs`, lastModified: d, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/pricing`, lastModified: d, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: d, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: d, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/help`, lastModified: d, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: d, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/privacy`, lastModified: d, changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: d, changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${baseUrl}/cookies`, lastModified: d, changeFrequency: 'yearly' as const, priority: 0.3 },
    { url: `${baseUrl}/mobile`, lastModified: d, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/transfer`, lastModified: d, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/qa`, lastModified: d, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/summarize`, lastModified: d, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/change-style`, lastModified: d, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/how-it-works`, lastModified: new Date("2026-09-08"), changeFrequency: 'monthly' as const, priority: 0.7 },
  ];

  return staticPages;
}
