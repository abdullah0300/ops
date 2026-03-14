'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Product, Media } from '@/payload-types'

export const ProductCard = ({ product }: { product: Product }) => {
  const router = useRouter()
  const mainImage = (product.gallery?.[0]?.image as Media) || product.meta?.image
  const imageUrl = typeof mainImage === 'object' ? mainImage?.url : null

  // Get category name if available
  const categoryName =
    product.categories?.[0] && typeof product.categories[0] === 'object'
      ? (product.categories[0] as any).title
      : 'Packaging'

  const handleQuoteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push('/#quote')
  }

  return (
    <div className="product-card-v2">
      <Link href={`/products/${product.slug}`} className="product-card-link">

        {/* Image */}
        <div className="product-card-image-wrap">
          {/* Bg clip layer — keeps dot pattern contained while image escapes */}
          <div className="product-card-image-bg-clip" />

          {/* Category tag */}
          <span className="product-card-tag">{categoryName}</span>

          {imageUrl ? (
            <img src={imageUrl} alt={product.title} className="product-card-image" />
          ) : (
            <div className="product-card-placeholder">📦</div>
          )}
        </div>

        {/* Info */}
        <div className="product-card-info">
          <h3 className="product-card-title">{product.title}</h3>

          {/* Feature chips */}
          <div className="product-card-chips">
            <span className="product-card-chip">Custom Print</span>
            <span className="product-card-chip">Low MOQ</span>
            <span className="product-card-chip">Fast Ship</span>
          </div>

          {/* CTA row */}
          <div className="product-card-cta">
            <div
              className="btn-request-quote"
              onClick={handleQuoteClick}
              role="button"
              tabIndex={0}
            >
              {/* Quote icon */}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              Get Quote
            </div>

            {/* Arrow button — view product */}
            <div className="btn-view-product" aria-label="View product">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        </div>

      </Link>
    </div>
  )
}