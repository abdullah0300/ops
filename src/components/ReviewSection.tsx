'use client'

import React, { useRef, useState } from 'react'

const REVIEWS = [
  {
    name: 'Marcus T.',
    location: 'Denver, CO',
    text: 'Best Mylar bags I\'ve found in the US. The seal is incredibly tight and the print quality is absolutely stunning. Our Colorado cannabis brand finally has packaging that matches our premium product.',
  },
  {
    name: 'Ely Johnson',
    location: 'Austin, TX',
    text: 'Excellent service and super fast delivery to Texas. The packaging quality is top-notch — our products have never looked better! Will definitely be ordering again.',
  },
  {
    name: 'Sarah M.',
    location: 'Los Angeles, CA',
    text: 'We\'ve tried several packaging suppliers here in LA, but these guys are on another level. Turnaround was fast, minimum order was reasonable, and the colors on the bags are vibrant.',
  },
  {
    name: 'Johnny B.',
    location: 'Seattle, WA',
    text: 'We run a small food business in Seattle and needed smell-proof bags for our dry goods. These are perfect — professional, durable, and our customers always comment on the great packaging.',
  },
  {
    name: 'Tuche Ray',
    location: 'Miami, FL',
    text: 'Ordering was easy, and our boxes arrived the very next day. Loved the variety of sizes and the smooth finish. Great for our herbal supplements brand in Florida.',
  },
  {
    name: 'Diego R.',
    location: 'Phoenix, AZ',
    text: 'I was skeptical at first ordering custom packaging online, but these guys proved me wrong. The quality is unreal for the price. Our Arizona snack brand looks like a million bucks now.',
  },
  {
    name: 'Amanda K.',
    location: 'Chicago, IL',
    text: 'Super responsive team and beautiful end product. The Mylar bags hold up perfectly in our warehouse conditions. Highly recommend to any US business looking for reliable custom packaging.',
  },
]

export function ReviewSection() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const handleScroll = () => {
    if (!trackRef.current) return
    const scrollLeft = trackRef.current.scrollLeft
    const cardWidth = (trackRef.current.children[0] as HTMLElement)?.offsetWidth + 24 || 340
    setActiveIndex(Math.round(scrollLeft / cardWidth))
  }

  const scrollTo = (idx: number) => {
    if (!trackRef.current) return
    const cardWidth = (trackRef.current.children[0] as HTMLElement)?.offsetWidth + 24 || 340
    const target = Math.min(Math.max(idx, 0), REVIEWS.length - 1)
    trackRef.current.scrollTo({ left: target * cardWidth, behavior: 'smooth' })
  }

  return (
    <section className="reviews-section">
      <style>{`
        .reviews-section {
          background: #f0bc2e;
          padding: 80px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow: hidden;
          position: relative;
        }
        
        /* Subtle radial gradient overlay for texture */
        .reviews-section::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(circle at top left, rgba(255,255,255,0.2) 0%, transparent 60%);
          pointer-events: none;
        }

        .reviews-header {
          text-align: center;
          margin-bottom: 60px;
          padding: 0 24px;
          position: relative;
          z-index: 2;
        }
        .reviews-header-sub {
          font-family: 'Arya', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: rgba(28, 28, 28, 0.7);
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          background: rgba(255, 255, 255, 0.3);
          display: inline-block;
          padding: 6px 16px;
          border-radius: 20px;
        }
        .reviews-header h2 {
          font-family: 'Amaranth', sans-serif;
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 700;
          color: #1c1c1c;
          letter-spacing: -0.02em;
        }
        .reviews-header h2 em {
          font-style: italic;
          color: #fff;
        }

        /* Scrollable Track */
        .reviews-track {
          display: flex;
          gap: 24px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          padding: 30px 60px;
          width: 100%;
          box-sizing: border-box;
        }
        .reviews-track::-webkit-scrollbar { display: none; }

        .review-card {
          flex: 0 0 320px;
          scroll-snap-align: center;
          position: relative;
          background: #fff;
          border: none;
          border-radius: 20px;
          padding: 56px 32px 36px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          box-shadow: 0 12px 32px rgba(28, 28, 28, 0.1);
        }

        .review-text {
          font-family: 'Afacad', sans-serif;
          font-size: 15px;
          color: #444;
          line-height: 1.6;
          font-weight: 500;
        }
        .review-location {
          font-family: 'Arya', sans-serif;
          font-size: 13px;
          color: #888;
          margin-top: auto;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        /* Ribbon Banner */
        .review-ribbon-wrap {
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          width: 180px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .review-ribbon-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }
        .review-name {
          position: relative;
          z-index: 2;
          font-family: 'Amaranth', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #fff;
          white-space: nowrap;
        }

        /* Nav Controls */
        .reviews-nav {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-top: 32px;
          position: relative;
          z-index: 2;
        }
        .rv-dots {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .rv-dot {
          width: 8px;
          height: 8px;
          border-radius: 4px;
          background: rgba(255,255,255,0.5);
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 0.3s;
        }
        .rv-dot.active {
          width: 24px;
          background: #1c1c1c;
        }
        .rv-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1.5px solid #1c1c1c;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          color: #1c1c1c;
        }
        .rv-btn:hover { background: #1c1c1c; color: #f0bc2e; }
        .rv-btn svg { width: 18px; height: 18px; }
      `}</style>

      <div className="reviews-header">
        <p className="reviews-header-sub">Client Reviews</p>
        <h2>Our Clients Don&apos;t Just Trust Us — <em>They Recommend Us</em></h2>
      </div>

      <div className="reviews-track" ref={trackRef} onScroll={handleScroll}>
        {REVIEWS.map((review, i) => (
          <div key={i} className="review-card">
            <div className="review-ribbon-wrap">
              <svg className="review-ribbon-bg" viewBox="0 0 180 40" fill="none" preserveAspectRatio="none">
                <path d="M 0 1 L 180 1 L 165 20 L 180 39 L 0 39 L 15 20 Z" fill="#1c1c1c" stroke="none" />
              </svg>
              <span className="review-name">{review.name}</span>
            </div>
            <p className="review-text">{review.text}</p>
            <p className="review-location">📍 {review.location}</p>
          </div>
        ))}
      </div>

      <div className="reviews-nav">
        <div className="rv-dots">
          {REVIEWS.map((_, idx) => (
            <button
              key={idx}
              className={`rv-dot${idx === activeIndex ? ' active' : ''}`}
              onClick={() => scrollTo(idx)}
              aria-label={`Go to review ${idx + 1}`}
            />
          ))}
        </div>
        <button className="rv-btn" onClick={() => scrollTo(activeIndex + 1)} aria-label="Next review">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
      </div>
    </section>
  )
}
