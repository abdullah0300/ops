import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { ProductSlider } from './ProductSlider'
import Link from 'next/link'
import './index.css'

export const FeaturedProducts = async ({ featuredProducts }: { featuredProducts?: any[] }) => {
  const payload = await getPayload({ config: configPromise })

  let products: any[]

  if (featuredProducts && featuredProducts.length > 0) {
    // Admin has picked specific products — resolve any that are just IDs
    const resolved = await Promise.all(
      featuredProducts.map(async (item: any) => {
        if (typeof item === 'object' && item.slug) return item
        const id = typeof item === 'object' ? item.id : item
        return payload.findByID({ collection: 'products', id })
      }),
    )
    products = resolved.filter(Boolean)
  } else {
    const { docs } = await payload.find({
      collection: 'products',
      limit: 12,
      sort: '-createdAt',
    })
    products = docs
  }

  return (
    <section className="featured-products">
      <div className="container">
        <div className="featured-products-header">
          <div className="featured-products-title-group">
            <span className="featured-products-eyebrow">Our Products</span>
            <h2 className="section-title">Custom Packaging & Print</h2>
          </div>
          <Link href="/products" className="featured-products-view-all">
            View All Products
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
        <ProductSlider products={products as any} />
      </div>
    </section>
  )
}