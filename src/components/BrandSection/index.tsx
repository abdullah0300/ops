'use client'

import React, { useRef, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import './index.css'

const ORIGINAL_BRANDS = [
  'JUICE BOX',
  'HAZE',
  'OTER',
  'Gotta Sweet',
  'Canna Kings',
  'YF',
  'Mello',
  'Extreme Kingfish',
  'CERTIFIED EXTRACTS',
  'FLYING MONKEY',
]

const shuffle = (array: string[]) => {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

const STATS = [
  { number: '4M', suffix: '+', label: 'Units Printed' },
  { number: '500', suffix: '+', label: 'Brand Partners' },
  { number: '99', suffix: '%', label: 'Satisfaction Rate' },
  { number: '8', suffix: '-12', label: 'Day Turnaround' },
]

export const BrandSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = React.useState(false)

  const displayBrands = useMemo(() => {
    if (!mounted) {
      return [
        ...ORIGINAL_BRANDS,
        ...ORIGINAL_BRANDS,
        ...ORIGINAL_BRANDS,
        ...ORIGINAL_BRANDS,
        ...ORIGINAL_BRANDS,
        ...ORIGINAL_BRANDS,
        ...ORIGINAL_BRANDS,
        ...ORIGINAL_BRANDS,
      ]
    }
    const s1 = shuffle(ORIGINAL_BRANDS)
    const s2 = shuffle(ORIGINAL_BRANDS)
    const s3 = shuffle(ORIGINAL_BRANDS)
    const s4 = shuffle(ORIGINAL_BRANDS)
    return [...s1, ...s2, ...s3, ...s4, ...s1, ...s2, ...s3, ...s4]
  }, [mounted])

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const scrollTo =
        direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  return (
    <section className="brand-section">
      <div className="container">
        {/* Header */}
        <div className="brand-header">
          <div className="brand-header-left">
            <span className="brand-eyebrow">Trusted By Brands</span>
            <h2>Printed for the best.</h2>
            <p>Premium custom packaging trusted by leading brands across the US.</p>
          </div>
          <div className="brand-nav">
            <button onClick={() => scroll('left')} aria-label="Scroll left" className="nav-arrow">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => scroll('right')} aria-label="Scroll right" className="nav-arrow">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Marquee — full bleed */}
      <div className="brand-marquee-outer">
        <div className="brand-marquee-container" ref={scrollRef}>
          <div className="brand-track marquee-left-to-right">
            {displayBrands.map((name, index) => (
              <div key={`${name}-${index}`} className="brand-item">
                <span className="brand-placeholder-logo">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="container">
        <div className="brand-stats">
          {STATS.map((stat) => (
            <div key={stat.label} className="brand-stat">
              <div className="brand-stat-number">
                {stat.number}<span>{stat.suffix}</span>
              </div>
              <div className="brand-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}