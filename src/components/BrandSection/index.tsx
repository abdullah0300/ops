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

// Simple shuffle function
const shuffle = (array: string[]) => {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

export const BrandSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = React.useState(false)

  // Generate a large shuffled list for seamless looping
  const displayBrands = useMemo(() => {
    // During SSR and first paint, we return a non-shuffled list
    // This ensures server and client match.
    if (!mounted) {
      return [...ORIGINAL_BRANDS, ...ORIGINAL_BRANDS, ...ORIGINAL_BRANDS, ...ORIGINAL_BRANDS, ...ORIGINAL_BRANDS, ...ORIGINAL_BRANDS, ...ORIGINAL_BRANDS, ...ORIGINAL_BRANDS]
    }

    const shuffle1 = shuffle(ORIGINAL_BRANDS)
    const shuffle2 = shuffle(ORIGINAL_BRANDS)
    const shuffle3 = shuffle(ORIGINAL_BRANDS)
    const shuffle4 = shuffle(ORIGINAL_BRANDS)
    // We concatenate them twice to ensure seamless overflow
    return [...shuffle1, ...shuffle2, ...shuffle3, ...shuffle4, ...shuffle1, ...shuffle2, ...shuffle3, ...shuffle4]
  }, [mounted])

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  return (
    <section className="brand-section">
      <div className="container">
        <div className="brand-header">
          <div className="header-text">
            <h2>Trusted by the best.</h2>
            <p>Our growth hackers are experts in identifying and capitalizing on the most effective brand strategies.</p>
          </div>
          <div className="brand-nav">
            <button onClick={() => scroll('left')} aria-label="Scroll left" className="nav-arrow">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => scroll('right')} aria-label="Scroll right" className="nav-arrow">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

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
      </div>
    </section>
  )
}
