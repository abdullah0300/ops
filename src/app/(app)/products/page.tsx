/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { cache } from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ProductCard } from '@/components/FeaturedProducts/ProductCard'
import '@/components/FeaturedProducts/index.css' // Reuse FeaturedProducts styles
import { getServerSideURL } from '@/utilities/getURL'

type SearchParams = { [key: string]: string | string[] | undefined }

// Deduplicated category lookup used by both generateMetadata and the page.
const getCategoryBySlug = cache(async (slug: string) => {
  const payload = await getPayload({ config: configPromise })
  return payload.find({
    collection: 'categories',
    where: { slug: { equals: slug } },
    limit: 1,
  })
})

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}): Promise<Metadata> {
  const { category, q } = await searchParams
  const baseUrl = getServerSideURL()

  if (q && typeof q === 'string') {
    return {
      title: `Search: "${q}" | Online Packaging Store`,
      description: `Search results for "${q}" — browse our range of custom packaging solutions.`,
      alternates: { canonical: `${baseUrl}/products?q=${encodeURIComponent(q)}` },
    }
  }

  if (category && typeof category === 'string') {
    const catDoc = await getCategoryBySlug(category)
    if (catDoc.docs.length > 0) {
      const cat = catDoc.docs[0] as any
      return {
        title: `${cat.title} | Online Packaging Store`,
        description: `Explore our premium ${cat.title} — custom sizes, full-color printing, low MOQ and bulk discounts.`,
        alternates: { canonical: `${baseUrl}/products?category=${encodeURIComponent(category)}` },
      }
    }
  }

  return {
    title: 'Our Products | Online Packaging Store',
    description: 'Explore our complete range of high-quality packaging and printing solutions.',
    alternates: { canonical: `${baseUrl}/products` },
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { category, q } = await searchParams
  const payload = await getPayload({ config: configPromise })

  // Resolve category slug → ID (and title) in one query, reused via cache.
  let categoryId: string | number | null = null
  let pageTitle = 'All Products'

  if (q && typeof q === 'string') {
    pageTitle = `Search Results for "${q}"`
  } else if (category && typeof category === 'string') {
    const catDoc = await getCategoryBySlug(category)
    if (catDoc.docs.length > 0) {
      categoryId = catDoc.docs[0].id
      pageTitle = (catDoc.docs[0] as any).title
    }
  }

  // Build query — filter by category ID (not slug) or by title text search.
  const whereConditions: any[] = [{ _status: { equals: 'published' } }]

  if (categoryId) {
    // Relationship fields store IDs; use `in` with the resolved category ID.
    whereConditions.push({ categories: { in: [categoryId] } })
  }

  if (q && typeof q === 'string') {
    whereConditions.push({ title: { contains: q } })
  }

  const { docs: products } = await payload.find({
    collection: 'products',
    limit: 100,
    sort: '-createdAt',
    where: { and: whereConditions },
  })

  return (
    <div className="products-listing-page">
      <style>{`
        .products-listing-page {
          background-color: #F3F3F3;
          min-height: 100vh;
        }
        .listing-header {
          padding: 80px 0 40px;
          text-align: center;
        }
        .listing-title {
          font-family: 'Amaranth', sans-serif;
          font-size: 48px;
          font-weight: 700;
          color: #111;
          margin-bottom: 16px;
        }
        .listing-subtitle {
          font-family: 'Afacad', sans-serif;
          font-size: 18px;
          color: #666;
          max-width: 600px;
          margin: 0 auto;
        }
        .listing-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 40px 24px 100px;
        }
        .products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px;
        }
        @media (max-width: 1024px) {
          .products-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 768px) {
          .products-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
          .listing-title { font-size: 32px; }
        }
        @media (max-width: 480px) {
          .products-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <header className="listing-header">
        <div className="container">
          <h1 className="listing-title">{pageTitle}</h1>
          <p className="listing-subtitle">
            {q
              ? `Showing results for "${q}". Explore our range of high-quality packaging solutions.`
              : category
                ? `Explore our high-quality ${pageTitle} solutions tailored for your brand.`
                : 'Discover our premium range of packaging and custom printing products designed to elevate your business.'}
          </p>
        </div>
      </header>

      <main className="listing-container">
        {products.length > 0 ? (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        ) : (
          <div className="no-products text-center py-20">
            <h2 className="text-2xl font-semibold opacity-50">No products found in this category.</h2>
            <Link href="/products" className="text-blue-600 hover:underline mt-4 inline-block">View All Products</Link>
          </div>
        )}
      </main>
    </div>
  )
}
