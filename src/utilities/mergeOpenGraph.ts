import type { Metadata } from 'next'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'Premium custom packaging and printing solutions by Webcraftio.',
  images: [
    {
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/media/file/og-image.jpg`,
    },
  ],
  siteName: 'Webcraftio',
  title: 'Webcraftio | Premium Custom Packaging & Printing',
}

export const mergeOpenGraph = (og?: Partial<Metadata['openGraph']>): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}

