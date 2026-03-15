'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import './index.css'
import type { Media as MediaType, Product } from '@/payload-types'

// ── Default showcase products (used when no real products passed) ──
const DEFAULT_PRODUCTS = [
  {
    id: '1',
    name: 'Cannabis Packaging',
    tag: 'Best Seller',
    emoji: '🌿',
    bg: '#2D4A1E',
    chips: ['Smell Proof', 'Custom Print', 'Child Resistant'],
    imageUrl: '/media/cannabis.jpg',
  },
  {
    id: '2',
    name: 'Nuts & Dried Fruit',
    tag: 'Freshness Seal',
    emoji: '🥜',
    bg: '#3D3020',
    chips: ['Oxygen Barrier', 'Moisture Proof', 'Clear Window'],
    imageUrl: '/media/nuts.jpg',
  },
  {
    id: '3',
    name: 'Premium Tea Bags',
    tag: 'Custom Design',
    emoji: '🍵',
    bg: '#1A2D40',
    chips: ['Aroma Seal', 'Eco-Friendly', 'Luxury Finish'],
    imageUrl: '/media/tea.jpg',
  },
  {
    id: '4',
    name: 'Roasted Coffee',
    tag: 'Degassing Valve',
    emoji: '☕',
    bg: '#2A3318',
    chips: ['Valve Support', 'Block Bottom', 'Foil Lined'],
    imageUrl: '/media/coffee.jpg',
  },
  {
    id: '5',
    name: 'Candy & Sweets',
    tag: 'Vibrant Print',
    emoji: '🍬',
    bg: '#2D1F40',
    chips: ['Gloss Finish', 'Tear Notch', 'Food Grade'],
    imageUrl: '/media/candy.jpg',
  },
]

const STRIP_ITEMS = [
  'Custom Sizes', 'Full Color CMYK', 'Eco Materials',
  'Low MOQ', 'Samples', '5–8 Day Ship',
  'Premium Finish', 'Free Design Proof',
]

interface ShowcaseProduct {
  id: string | number
  name: string
  tag: string
  emoji: string
  bg: string
  chips: string[]
  imageUrl: string | null
}

interface HeroProps {
  media?: MediaType | string | null
  products?: Product[]
}

export const Hero = ({ media, products }: HeroProps) => {
  // Build showcase from real products if available
  const showcaseProducts: ShowcaseProduct[] = products && products.length > 0
    ? products.slice(0, 5).map((p, i) => {
        const img = (p as any).gallery?.[0]?.image
        const imgUrl = typeof img === 'object' ? img?.url : null
        const metaImg = (p as any).meta?.image
        const metaUrl = typeof metaImg === 'object' ? metaImg?.url : null
        return {
          id: p.id,
          name: p.title,
          tag: ['Best Seller', 'Custom Print', 'Premium', 'Eco-Friendly', 'Low MOQ'][i % 5],
          emoji: ['🛍️', '📦', '🎁', '🌿', '⭐'][i % 5],
          bg: ['#2D4A1E', '#3D3020', '#1A2D40', '#2A3318', '#2D1F40'][i % 5],
          chips: ['Custom Size', 'CMYK Print', 'Fast Ship'],
          imageUrl: imgUrl || metaUrl || null,
        }
      })
    : DEFAULT_PRODUCTS

  const total = showcaseProducts.length
  const [cur, setCur] = useState(0)
  const [visible, setVisible] = useState(false)
  const [pct, setPct] = useState(0)
  const pctRef = useRef(0)
  const curRef = useRef(0)
  const animRef = useRef<number | null>(null)
  const lastRef = useRef<number>(0)

  const DURATION = 4000

  const goto = useCallback((i: number) => {
    if (i === curRef.current) return
    setVisible(false)
    setPct(0)
    pctRef.current = 0
    setTimeout(() => {
      curRef.current = i
      setCur(i)
      setVisible(true)
    }, 250)
  }, [])

  const advance = useCallback(() => {
    goto((curRef.current + 1) % total)
  }, [goto, total])

  // Animate progress bar + auto-advance
  useEffect(() => {
    let last = performance.now()
    const tick = (now: number) => {
      const delta = now - last
      last = now
      pctRef.current += (delta / DURATION) * 100
      if (pctRef.current >= 100) {
        pctRef.current = 0
        advance()
      }
      setPct(pctRef.current)
      animRef.current = requestAnimationFrame(tick)
    }
    animRef.current = requestAnimationFrame(tick)
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [advance])

  // Show on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 600)
    return () => clearTimeout(t)
  }, [])

  const product = showcaseProducts[cur]

  return (
    <>
      {/* Hero grid */}
      <section className="hero">

        {/* ── LEFT: Copy ── */}
        <div className="hero-left">
          <div>
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-dot" />
              <span className="hero-eyebrow-text">Custom Packaging & Print</span>
            </div>

            <h1 className="hero-headline">
              <span className="hero-headline-line">
                <span className="hero-headline-inner">Your Brand</span>
              </span>
              <span className="hero-headline-line">
                <span className="hero-headline-inner">Deserves</span>
              </span>
              <span className="hero-headline-line">
                <span className="hero-headline-inner">
                  the{' '}
                  <span className="hero-headline-accent">Perfect</span>
                </span>
              </span>
              <span className="hero-headline-line">
                <span className="hero-headline-inner">Package.</span>
              </span>
            </h1>

            <p className="hero-sub">
              Premium custom printed packaging for brands that care about every detail. From concept to delivery in 5–8 business days.
            </p>
          </div>

          <div className="hero-bottom">
            <div className="hero-ctas">
              <Link href="/#quote" className="hero-btn-primary">
                Get Free Quote
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <Link href="/products" className="hero-btn-secondary">
                View Products
              </Link>
            </div>

            <div className="hero-trust">
              <div className="hero-stars">
                {[1,2,3,4,5].map(s => <span key={s} className="hero-star">★</span>)}
              </div>
              <div className="hero-trust-label">4M+ orders fulfilled</div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Full bleed ── */}
        <div className="hero-right">
          {/* Background */}
          <div
            className="hero-panel-bg"
            style={{ background: product.bg }}
          >
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="hero-panel-img"
              />
            ) : (
              <div className="hero-panel-emoji">{product.emoji}</div>
            )}
          </div>

          {/* Gradient overlay */}
          <div className="hero-panel-overlay" />

          {/* Progress bar */}
          <div className="hero-prog" style={{ width: `${pct}%` }} />

          {/* Overlay content */}
          <div className="hero-panel-content">
            <div className="hero-panel-info">
              <div className={`hero-panel-tag${visible ? ' visible' : ''}`}>
                {product.tag}
              </div>
              <div className={`hero-panel-name${visible ? ' visible' : ''}`}>
                {product.name}
              </div>
              <div className={`hero-panel-chips${visible ? ' visible' : ''}`}>
                {product.chips.map((chip) => (
                  <span key={chip} className="hero-panel-chip">{chip}</span>
                ))}
              </div>
            </div>

            <div className="hero-panel-nav">
              <div className="hero-panel-counter">
                <span>{String(cur + 1).padStart(2, '0')}</span>
                {' / '}
                {String(total).padStart(2, '0')}
              </div>
              <div className="hero-panel-arrows">
                <button
                  className="hero-arrow"
                  onClick={() => goto((cur - 1 + total) % total)}
                  aria-label="Previous product"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                  </svg>
                </button>
                <button
                  className="hero-arrow"
                  onClick={() => goto((cur + 1) % total)}
                  aria-label="Next product"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Vertical dots */}
          <div className="hero-panel-dots">
            {showcaseProducts.map((_, i) => (
              <button
                key={i}
                className={`hero-dot${i === cur ? ' active' : ''}`}
                onClick={() => goto(i)}
                aria-label={`Go to product ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom strip */}
      <div className="hero-strip">
        <div className="hero-strip-track">
          {[...STRIP_ITEMS, ...STRIP_ITEMS, ...STRIP_ITEMS, ...STRIP_ITEMS].map((item, i) => (
            <div key={i} className="hero-strip-item">
              <em>·</em>
              {item}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}