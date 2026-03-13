'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Product, Media } from '@/payload-types'

export const ProductCard = ({ product }: { product: Product }) => {
  const router = useRouter()
  const mainImage = (product.gallery?.[0]?.image as Media) || product.meta?.image
  const imageUrl = typeof mainImage === 'object' ? mainImage?.url : null

  const handleQuoteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push('/#quote')
  }

  return (
    <div className="product-card-v2">
      <Link href={`/products/${product.slug}`} className="product-card-link">
        <div className="product-card-image-wrap">
          {imageUrl ? (
            <img src={imageUrl} alt={product.title} className="product-card-image" />
          ) : (
            <div className="product-card-placeholder">📦</div>
          )}
        </div>
        <div className="product-card-info">
          <h3 className="product-card-title">{product.title}</h3>
          <div 
            className="btn-request-quote" 
            onClick={handleQuoteClick}
            role="button"
            tabIndex={0}
          >
            Request a Custom Quote
          </div>
        </div>
      </Link>
    </div>
  )
}
