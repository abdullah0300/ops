'use client'

import React, { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import type { Media as MediaType } from '@/payload-types'

interface FactorySlideData {
  id?: string | number
  title: string
  subtitle?: string | null
  desc?: string | null
  highlight?: string | null
  video: string | MediaType
  bgLeft?: string | null
  bgRight?: string | null
  textColor?: string | null
  highlightColor?: string | null
  btnBg?: string | null
  btnColor?: string | null
}

const DEFAULT_SLIDES: FactorySlideData[] = [
  {
    id: 1,
    title: 'It All Starts With Quality',
    subtitle: 'Raw Materials & Sheet Preparation',
    desc: 'Every great print begins long before the ink touches the surface. At our facility, we source only premium-grade raw sheets and blank bags that meet our strict quality standards. Each material is carefully loaded onto our industrial-grade machines, aligned with precision, and inspected before production begins. No shortcuts, no compromises — just the right foundation for a flawless final product.',
    highlight: 'Premium materials. Precision setup. Zero compromise.',
    video: '/media/first.mp4',
    bgLeft: '#f0bc2e',
    bgRight: '#f4f4f4',
    textColor: '#111',
    highlightColor: '#0b5fb0',
    btnBg: '#111',
    btnColor: '#fff',
  },
  {
    id: 2,
    title: 'Where Your Design Comes to Life',
    subtitle: 'High-Speed Printing Technology',
    desc: 'This is where your vision transforms into reality. Using advanced printing technology, our machines deliver sharp, vibrant, and consistent results across every single unit — whether your order is 100 pieces or 100,000. Our operators monitor every run in real-time, ensuring colour accuracy, alignment, and ink quality are maintained throughout the entire batch. Every print is an exact match to what you approved.',
    highlight: 'Your design, perfected at scale.',
    video: '/media/second.mp4',
    bgLeft: '#000000',
    bgRight: '#957cd7',
    textColor: '#111',
    highlightColor: '#ffffff',
    btnBg: '#ffffff',
    btnColor: '#111',
  },
  {
    id: 3,
    title: 'Ready, Packed, Delivered',
    subtitle: 'Quality-Checked & Ready for Your Brand',
    desc: 'The final product speaks for itself. After printing, every item goes through a quality inspection process before being packed and prepared for dispatch. What leaves our factory is exactly what your customers will see — clean edges, vibrant colours, and a finish that reflects the professionalism of your brand. From a single custom order to bulk production, the result is always something you\'re proud to put your name on.',
    highlight: 'From our floor to your door — built to impress.',
    video: '/media/third.mp4',
    bgLeft: '#eba273',
    bgRight: '#f4f4f4',
    textColor: '#111',
    highlightColor: '#957cd7',
    btnBg: '#111',
    btnColor: '#fff',
  }
]

export function FactorySlider({ slides }: { slides?: FactorySlideData[] | null }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  
  const displaySlides = (slides && slides.length > 0) ? slides : DEFAULT_SLIDES

  // Track scroll position to update dots
  const handleScroll = () => {
    if (!trackRef.current) return;
    const scrollLeft = trackRef.current.scrollLeft;
    const cardWidth = trackRef.current.children[0].clientWidth;
    const gap = 24; // gap between cards
    const newIndex = Math.round(scrollLeft / (cardWidth + gap));
    setActiveIndex(newIndex);
  }

  const handleNext = () => {
    if (!trackRef.current) return;
    const cardWidth = trackRef.current.children[0].clientWidth;
    const gap = 24;
    const nextIndex = (activeIndex + 1) % displaySlides.length;
    
    trackRef.current.scrollTo({
      left: nextIndex * (cardWidth + gap),
      behavior: 'smooth'
    });
  }

  return (
    <section className="factory-slider-sec">
      <style>{`
        .factory-slider-sec {
          background: #FCFBF7;
          padding: 80px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow: hidden;
        }
        .factory-header {
          text-align: center;
          margin-bottom: 50px;
        }
        .factory-header h2 {
          font-family: 'Amaranth', sans-serif;
          font-weight: 700;
          font-size: 28px;
          color: #1c1c1c;
          line-height: 1.2;
          margin-bottom: 12px;
        }
        .factory-header p {
          font-family: 'Arya', sans-serif;
          font-size: 16px;
          color: #888;
        }

        /* Carousel Track */
        .fs-track {
          display: flex;
          gap: 24px;
          width: 100%;
          max-width: 1400px;
          overflow-x: auto;
          padding-bottom: 40px;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none; /* Firefox */
        }
        .fs-track::-webkit-scrollbar {
          display: none; /* Chrome/Safari */
        }

        .fs-card {
          flex: 0 0 100%;
          max-width: 900px;
          scroll-snap-align: center;
          background: #f4f4f4;
          border-radius: 24px;
          overflow: hidden;
          display: flex;
          box-shadow: 0 16px 48px rgba(0,0,0,0.03);
          min-height: 480px;
          position: relative;
        }
        /* Mobile adjustment for smaller screens */
        @media (min-width: 1024px) {
          .fs-card { flex: 0 0 85%; }
        }
        @media (min-width: 1300px) {
          .fs-card { flex: 0 0 75%; max-width: 1000px; }
        }
        
        /* Video Container (Left) */
        .fs-left {
          flex: 0 0 40%;
          padding: 32px 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .fs-video-frame {
          width: 100%;
          border-radius: 16px;
          overflow: hidden;
          background: #111;
          box-shadow: 0 12px 32px rgba(0,0,0,0.15);
          position: relative;
          aspect-ratio: 4 / 4;
        }
        .fs-video-frame video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* Content Container (Right) */
        .fs-right {
          flex: 1;
          padding: 60px 48px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
        }
        .fs-title {
          font-family: 'Amaranth', sans-serif;
          font-size: 26px;
          font-weight: 700;
          margin-bottom: 8px;
          line-height: 1.15;
        }
        .fs-subtitle {
          font-family: 'Arya', sans-serif;
          font-size: 14px;
          opacity: 0.8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 24px;
          font-weight: 700;
        }
        .fs-desc {
          font-family: 'Afacad', sans-serif;
          font-size: 13px;
          opacity: 0.85;
          line-height: 1.6;
          margin-bottom: 32px;
        }
        .fs-highlight {
          font-size: 13px;
          font-weight: 700;
          font-style: italic;
        }

        .fs-action {
          margin-top: 32px;
        }
        .fs-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 28px;
          border-radius: 8px;
          font-family: 'Afacad', sans-serif;
          font-weight: 700;
          font-size: 14px;
          text-decoration: none;
          transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .fs-btn:hover {
          transform: translateY(-2px);
        }

        @media (max-width: 900px) {
          .fs-card {
            flex-direction: column;
          }
          .fs-left {
            padding: 24px;
            min-height: 300px;
          }
          .fs-right {
            padding: 32px 24px 48px;
          }
        }

        /* Navigation Controls */
        .fs-nav {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-top: 24px;
        }
        .fs-dots {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .fs-dot {
          width: 8px;
          height: 8px;
          border-radius: 4px;
          background: #889390;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 0.3s ease;
          opacity: 0.6;
        }
        .fs-dot.active {
          width: 24px;
          background: #2b3a41;
          opacity: 1;
        }
        .fs-next-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1.5px solid #111;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #111;
        }
        .fs-next-btn:hover {
          background: #111;
          color: #fff;
        }
        .fs-next-btn svg {
          width: 20px;
          height: 20px;
        }
      `}</style>
      
      <div className="factory-header">
        <h2>From Raw Material to Finished Product —<br/>See How We Craft Every Order</h2>
        <p>A behind-the-scenes look at our state-of-the-art production facility</p>
      </div>

      <div 
        className="fs-track" 
        ref={trackRef}
        onScroll={handleScroll}
      >
        {displaySlides.map((slide, index) => {
           const videoUrl = typeof slide.video === 'object' ? slide.video.url : slide.video
           
           return (
            <div key={slide.id || index} className="fs-card" style={{ background: slide.bgRight || '#f4f4f4' }}>
              
              {/* Left Side: Video */}
              <div className="fs-left" style={{ background: slide.bgLeft || '#f0bc2e' }}>
                <div className="fs-video-frame">
                  <video 
                    src={videoUrl || ''} 
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                  />
                </div>
              </div>

              {/* Right Side: Text Information */}
              <div className="fs-right" style={{ color: slide.textColor || '#111' }}>
                <h3 className="fs-title">{slide.title}</h3>
                <p className="fs-subtitle">{slide.subtitle}</p>
                <p className="fs-desc" style={{ color: slide.textColor || '#111' }}>{slide.desc}</p>
                <p className="fs-highlight" style={{ color: slide.highlightColor || '#0b5fb0' }}>{slide.highlight}</p>
                
                <div className="fs-action">
                  <Link 
                    href="/quote" 
                    className="fs-btn" 
                    style={{ background: slide.btnBg || '#111', color: slide.btnColor || '#fff' }}
                  >
                    Get a Custom Quote
                  </Link>
                </div>
              </div>

            </div>
          )
        })}
      </div>

      {/* Navigation Controls */}
      <div className="fs-nav">
        <div className="fs-dots">
          {displaySlides.map((_, idx) => (
            <button 
              key={idx}
              className={`fs-dot ${idx === activeIndex ? 'active' : ''}`}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => {
                if (!trackRef.current) return;
                const cardWidth = trackRef.current.children[0].clientWidth;
                const gap = 24;
                trackRef.current.scrollTo({
                  left: idx * (cardWidth + gap),
                  behavior: 'smooth'
                });
              }}
            />
          ))}
        </div>
        <button className="fs-next-btn" aria-label="Next slide" onClick={handleNext}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>

    </section>
  )
}

