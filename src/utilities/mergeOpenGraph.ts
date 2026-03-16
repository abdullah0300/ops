import type { Metadata } from 'next'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'Online Packaging Store is the world leader in custom mylar bags printing. We provide best-in-class custom packaging solutions.',
  images: [
    {
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/media/file/og-image.jpg`,
    },
  ],
  siteName: 'Online Packaging Store',
  title: 'Online Packaging Store | Premium Custom Packaging & Mylar Bags Printing',
}

export const mergeOpenGraph = (og?: Partial<Metadata['openGraph']>): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}

