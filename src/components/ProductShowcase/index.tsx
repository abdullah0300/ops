import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ProductCard } from '../FeaturedProducts/ProductCard'
import Link from 'next/link'
import './index.css'

export const ProductShowcase = async () => {
  const payload = await getPayload({ config })

  const { docs: products } = await payload.find({
    collection: 'products',
    limit: 30,
  })

  const row1 = products.filter((_, i) => i % 3 === 0)
  const row2 = products.filter((_, i) => i % 3 === 1)
  const row3 = products.filter((_, i) => i % 3 === 2)

  return (
    <section className="product-showcase">

      {/* Header */}
      <div className="showcase-header container">
        <span className="showcase-eyebrow">Full Product Range</span>
        <h2>Everything You Need to <span>Print & Pack</span></h2>
        <p>Explore our complete range of premium custom packaging and printing solutions built for your brand.</p>
      </div>

      {/* ── Desktop: Auto-scrolling marquee rows ── */}
      <div className="showcase-rows-outer">
        <div className="showcase-row-wrap">
          <div className="showcase-track marquee-left">
            {[...row1, ...row1].map((product, index) => (
              <div key={`${product.id}-r1-${index}`} className="showcase-item">
                <ProductCard product={product as any} />
              </div>
            ))}
          </div>
        </div>

        <div className="showcase-row-wrap">
          <div className="showcase-track marquee-right">
            {[...row2, ...row2].map((product, index) => (
              <div key={`${product.id}-r2-${index}`} className="showcase-item">
                <ProductCard product={product as any} />
              </div>
            ))}
          </div>
        </div>

        <div className="showcase-row-wrap">
          <div className="showcase-track marquee-left">
            {[...row3, ...row3].map((product, index) => (
              <div key={`${product.id}-r3-${index}`} className="showcase-item">
                <ProductCard product={product as any} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile: Static swipeable scroll ── */}
      <div className="showcase-mobile-wrap">
        <div className="showcase-mobile-scroll">
          {products.map((product) => (
            <div key={product.id} className="showcase-mobile-item">
              <ProductCard product={product as any} />
            </div>
          ))}
        </div>
        <div className="showcase-swipe-hint">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
          Swipe to explore
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
      </div>

      {/* CTA */}
      <div className="showcase-cta">
        <Link href="/products" className="showcase-cta-btn">
          View All Products
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>

    </section>
  )
}