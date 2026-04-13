import { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getServerSideURL } from '@/utilities/getURL'

// Revalidate the sitemap every hour so newly published content appears promptly.
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config: configPromise })
  const baseUrl = getServerSideURL()

  // Fetch Pages
  const pages = await payload.find({
    collection: 'pages',
    where: { _status: { equals: 'published' } },
    limit: 1000,
    select: { slug: true, updatedAt: true },
  })

  // Fetch Products
  const products = await payload.find({
    collection: 'products',
    where: { _status: { equals: 'published' } },
    limit: 1000,
    select: { slug: true, updatedAt: true },
  })

  // Fetch Posts
  const posts = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    limit: 1000,
    select: { slug: true, updatedAt: true },
  })

  // Homepage — highest priority; rendered via the home-page global (not in pages collection).
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

  // CMS pages — exclude 'home' since it's covered by the static entry above.
  const pageEntries: MetadataRoute.Sitemap = pages.docs
    .filter((page) => page.slug !== 'home')
    .map((page) => ({
      url: `${baseUrl}/${page.slug}`,
      lastModified: new Date(page.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

  const productEntries: MetadataRoute.Sitemap = products.docs.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const postEntries: MetadataRoute.Sitemap = posts.docs.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticEntries, ...pageEntries, ...productEntries, ...postEntries]
}
