import { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getServerSideURL } from '@/utilities/getURL'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config: configPromise })
  const baseUrl = getServerSideURL()

  // Fetch Pages
  const pages = await payload.find({
    collection: 'pages',
    where: {
      _status: { equals: 'published' },
    },
    limit: 1000,
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  // Fetch Products
  const products = await payload.find({
    collection: 'products',
    where: {
      _status: { equals: 'published' },
    },
    limit: 1000,
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  // Fetch Posts
  const posts = await payload.find({
    collection: 'posts',
    where: {
      _status: { equals: 'published' },
    },
    limit: 1000,
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  const pageEntries: MetadataRoute.Sitemap = pages.docs.map((page) => ({
    url: `${baseUrl}${page.slug === 'home' ? '' : `/${page.slug}`}`,
    lastModified: new Date(page.updatedAt),
  }))

  const productEntries: MetadataRoute.Sitemap = products.docs.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(product.updatedAt),
  }))

  const postEntries: MetadataRoute.Sitemap = posts.docs.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
  }))

  // Add static routes that are not in the CMS
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
    },
  ]

  return [...staticEntries, ...pageEntries, ...productEntries, ...postEntries]
}

