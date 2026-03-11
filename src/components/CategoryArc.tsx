'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const BG_COLORS = ['#f5dde8','#f0eaf5','#f5f0e0','#f0e8e0','#e0edf5','#e8f0e0','#f5e8e0','#e0e8f5']

export function CategoryArc({ heroProducts }: { heroProducts: any[] }) {
  const [isVisible, setIsVisible] = useState(false)
  const observerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (observerRef.current) {
      observer.observe(observerRef.current)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <div className={`categories-section ${isVisible ? 'is-visible' : ''}`} ref={observerRef}>
      <div className="categories-row">
        {heroProducts.map((p: any, i: number) => {
          const imgUrl = p.meta?.image?.url || p.gallery?.[0]?.image?.url
          return (
            <Link key={String(p.id)} href={`/products/${String(p.slug)}`} className="cat-item">
              <div
                className="cat-circle"
                style={{ background: imgUrl ? 'transparent' : BG_COLORS[i % BG_COLORS.length] }}
              >
                {imgUrl ? (
                  <img src={String(imgUrl)} alt={String(p.title)} />
                ) : (
                  <span className="cat-placeholder">📦</span>
                )}
              </div>
              <span className="cat-label">{String(p.title)}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
