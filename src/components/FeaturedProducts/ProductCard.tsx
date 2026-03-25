'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import NextImage from 'next/image'
import { useRouter } from 'next/navigation'
import type { Product, Media } from '@/payload-types'

export const ProductCard = ({ product }: { product: Product }) => {
  const router = useRouter()
  const cardRef = useRef<HTMLDivElement>(null)

  const mainImage = (product.gallery?.[0]?.image as Media) || product.meta?.image
  const imageUrl = typeof mainImage === 'object' ? mainImage?.url : null

  const categoryName =
    product.categories?.[0] && typeof product.categories[0] === 'object'
      ? (product.categories[0] as any).title
      : 'Packaging'

  const handleQuoteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push('/#quote')
  }

  // 3D tilt on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const rotY = ((x - cx) / cx) * 10
    const rotX = -((y - cy) / cy) * 8
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    if (!card) return
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)'
  }

  return (
    <div
      className="product-card-v2"
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3D shadow */}
      <div className="product-card-shadow" />

      <Link href={`/products/${product.slug}`} className="product-card-link">

        {/* Image */}
        <div className="product-card-image-wrap">

          {/* CMYK registration bar */}
          <div className="product-card-reg">
            <div className="reg-c" />
            <div className="reg-m" />
            <div className="reg-y" />
            <div className="reg-k" />
          </div>

          {/* Category tag */}
          <span className="product-card-tag">{categoryName}</span>

          {imageUrl ? (
            <NextImage
              src={imageUrl}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="product-card-image"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div className="product-card-placeholder">📦</div>
          )}
        </div>

        {/* Info */}
        <div className="product-card-info">
          {/* CMYK swatches */}
          <div className="product-card-swatches">
            <span className="product-card-swatch sw-g" />
            <span className="product-card-swatch sw-y" />
            <span className="product-card-swatch sw-b" />
            <span className="product-card-swatch sw-k" />
          </div>

          <div className="product-card-chips">
            <span className="product-card-chip">Custom Print</span>
            <span className="product-card-chip">Eco-Friendly</span>
            <span className="product-card-chip">Premium Finish</span>
          </div>

          <h3 className="product-card-title">{product.title}</h3>

          <div className="product-card-cta">
            <div
              className="btn-request-quote"
              onClick={handleQuoteClick}
              role="button"
              tabIndex={0}
            >
              Get Quote
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>

            <div className="btn-view-product" aria-label="View product">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        </div>

      </Link>
    </div>
  )
}