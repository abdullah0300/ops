import type { Metadata } from 'next'

import type { Page, Product } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

/**
 * Returns the canonical path for a document based on its collection.
 * Pages   → /slug  (or / for home)
 * Products → /products/slug
 * Posts   → /blog/slug
 */
const getDocPath = (doc: any, collection?: string): string => {
  const slug = doc?.slug
  if (!slug) return '/'
  if (collection === 'products') return `/products/${slug}`
  if (collection === 'posts') return `/blog/${slug}`
  if (slug === 'home') return '/'
  return `/${slug}`
}

export const generateMeta = async (args: {
  doc: Partial<Page | Product> | null | undefined
  collection?: string
}): Promise<Metadata> => {
  const { doc, collection } = args || {}

  // Resolve OG image: Cloudinary images have an absolute secure_url;
  // local uploads have a relative url that needs the server prefix.
  const metaImage = doc?.meta?.image
  let ogImage: string | undefined
  if (typeof metaImage === 'object' && metaImage !== null) {
    const cloudinaryUrl = (metaImage as any)?.cloudinary?.secure_url
    const localUrl = 'url' in metaImage && metaImage.url ? metaImage.url : null
    ogImage =
      cloudinaryUrl ||
      (localUrl ? `${getServerSideURL()}${localUrl}` : undefined)
  }

  const docPath = getDocPath(doc, collection)
  const canonicalUrl = `${getServerSideURL()}${docPath}`

  return {
    title: doc?.meta?.title || (doc as any)?.title || 'Online Packaging Store',
    description: doc?.meta?.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: mergeOpenGraph({
      ...(doc?.meta?.description ? { description: doc.meta.description } : {}),
      images: ogImage ? [{ url: ogImage }] : undefined,
      title: doc?.meta?.title || (doc as any)?.title || 'Online Packaging Store',
      url: docPath,
    }),
  }
}
