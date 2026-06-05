import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hyperfantasy.studio'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogs, portfolios] = await Promise.all([
    prisma.blog.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.portfolio.findMany({
      where: { isVisible: true },
      select: { id: true, updatedAt: true },
    }),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/works`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/projects`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/articles`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/enquiry`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/lab`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${BASE_URL}/articles/${blog.slug}`,
    lastModified: blog.updatedAt ?? new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const portfolioRoutes: MetadataRoute.Sitemap = portfolios.map((portfolio) => ({
    url: `${BASE_URL}/works/${portfolio.id}`,
    lastModified: portfolio.updatedAt ?? new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...blogRoutes, ...portfolioRoutes]
}
