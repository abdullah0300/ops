/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { ProductCard } from '@/components/FeaturedProducts/ProductCard'
import '@/components/FeaturedProducts/index.css' // Reuse FeaturedProducts styles

export const metadata = {
  title: 'Our Products | Online Packaging Store',
  description: 'Explore our complete range of high-quality packaging and printing solutions.',
}

type SearchParams = { [key: string]: string | string[] | undefined }

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { category } = await searchParams
  const payload = await getPayload({ config: configPromise })

  // Build query
  const query: any = {
    collection: 'products',
    limit: 100,
    sort: '-createdAt',
    where: {
      and: [
        {
          _status: {
            equals: 'published',
          },
        },
      ],
    },
  }

  // Add category filter if present
  if (category) {
    query.where.and.push({
      categories: {
        contains: category,
      },
    })
  }

  const { docs: products } = await payload.find(query)

  // Fetch category title if filtering
  let pageTitle = 'All Products'
  if (category) {
    const catDoc = await payload.find({
      collection: 'categories',
      where: {
        slug: {
          equals: category,
        },
      },
      limit: 1,
    })
    if (catDoc.docs.length > 0) {
      pageTitle = (catDoc.docs[0] as any).title
    }
  }

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
            {category 
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
