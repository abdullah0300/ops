'use client'
import React, { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ProductCard } from './ProductCard'
import type { Product } from '@/payload-types'

export const ProductSlider = ({ products }: { products: Product[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const scrollAmount = clientWidth * 0.8
      const newScroll = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount
      
      scrollRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div className="product-slider-wrapper">
      <button className="slider-nav prev" onClick={() => scroll('left')} aria-label="Previous products">
        <ChevronLeft size={24} />
      </button>
      
      <div className="product-slider-container" ref={scrollRef}>
        {products.map((product) => (
          <div key={product.id} className="slider-item">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <button className="slider-nav next" onClick={() => scroll('right')} aria-label="Next products">
        <ChevronRight size={24} />
      </button>
    </div>
  )
}
