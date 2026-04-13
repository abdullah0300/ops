/* eslint-disable no-restricted-exports */
import { getServerSideURL } from '@/utilities/getURL'

export default function robots() {
  const baseUrl = getServerSideURL()

  return {
    host: baseUrl,
    sitemap: `${baseUrl}/sitemap.xml`,
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Keep admin panel and internal API routes out of search indexes.
        disallow: ['/admin', '/api', '/next/'],
      },
    ],
  }
}
