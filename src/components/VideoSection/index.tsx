'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import './index.css'
import type { Media as MediaType } from '@/payload-types'

interface SlideData {
  id?: string | number
  video: string | MediaType
  title: string
  subtitle?: string | null
  body?: string | null
  tagline?: string | null
}

const DEFAULT_SLIDES: SlideData[] = [
  {
    id: 1,
    video: '/media/first.mp4',
    title: 'It All Starts With Quality',
    subtitle: 'Step 01 · Raw Materials',
    body: 'Every great print begins long before the ink touches the surface. At our facility, we source only premium-grade raw sheets and blank bags that meet our strict quality standards.',
    tagline: 'Premium materials. Precision setup. Zero compromise.',
  },
  {
    id: 2,
    video: '/media/second.mp4',
    title: 'Where Your Design Comes to Life',
    subtitle: 'Step 02 · High-Precision Printing',
    body: 'Using advanced printing technology, our machines deliver sharp, vibrant, and consistent results across every single unit — monitored in real time.',
    tagline: 'Your design, perfected at scale.',
  },
  {
    id: 3,
    video: '/media/third.mp4',
    title: 'Ready. Packed. Delivered.',
    subtitle: 'Step 03 · Quality Check & Dispatch',
    body: 'Every item goes through a quality inspection before packing. What leaves our factory is exactly what your customers will see — clean, vibrant, professional.',
    tagline: 'From our floor to your door — built to impress.',
  },
]

export const VideoSection = ({ slides }: { slides?: SlideData[] | null }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  const displaySlides = slides && slides.length > 0 ? slides : DEFAULT_SLIDES
  const total = displaySlides.length

  const goTo = (index: number) => {
    if (isAnimating || index === currentSlide) return
    setIsAnimating(true)
    setCurrentSlide(index)
  }

  const next = () => goTo((currentSlide + 1) % total)
  const prev = () => goTo((currentSlide - 1 + total) % total)

  // Reset animation lock
  useEffect(() => {
    const t = setTimeout(() => setIsAnimating(false), 750)
    return () => clearTimeout(t)
  }, [currentSlide])

  // Auto-advance every 6s
  useEffect(() => {
    autoPlayRef.current = setInterval(next, 6000)
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }
  }, [currentSlide])

  // Pause autoplay on interaction
  const resetAutoplay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    autoPlayRef.current = setInterval(next, 6000)
  }

  const handleNav = (fn: () => void) => {
    fn()
    resetAutoplay()
  }

  return (
    <section className="video-section">
      {/* Header */}
      <div className="video-section-header container">
        <span className="video-section-eyebrow">Production Showcase</span>
        <h2>From Raw Material to Finished Product</h2>
        <p>A behind-the-scenes look at our state-of-the-art production facility</p>
      </div>

      {/* Slider */}
      <div className="video-slider">
        <div className="video-slider-inner">

          {displaySlides.map((slide, index) => {
            const videoUrl = typeof slide.video === 'object' ? (slide.video as MediaType).url : slide.video

            return (
              <div
                key={slide.id || index}
                className={`video-slide${index === currentSlide ? ' active' : ''}`}
              >
                {/* Background video */}
                <div className="video-background">
                  <video
                    ref={(el) => { videoRefs.current[index] = el }}
                    src={videoUrl || ''}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="bg-video"
                  />
                  <div className="video-overlay" />
                </div>

                {/* Content */}
                <div className="slide-content">
                  <div className="content-inner">
                    {slide.subtitle && (
                      <div className="slide-step-badge">
                        <span className="slide-step-dot" />
                        {slide.subtitle}
                      </div>
                    )}
                    <h3 className="slide-title">{slide.title}</h3>
                    {slide.body && <p className="slide-body">{slide.body}</p>}
                    {slide.tagline && (
                      <div className="slide-tagline">
                        <span className="tagline-star">✦</span>
                        {slide.tagline}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          {/* Slide counter */}
          <div className="slide-counter">
            <span className="slide-counter-current">{String(currentSlide + 1).padStart(2, '0')}</span>
            {' / '}
            {String(total).padStart(2, '0')}
          </div>

          {/* Controls */}
          <div className="slider-controls">
            <button
              className="nav-btn"
              onClick={() => handleNav(prev)}
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="slide-indicators">
              {displaySlides.map((_, index) => (
                <button
                  key={index}
                  className={`indicator${index === currentSlide ? ' active' : ''}`}
                  onClick={() => { handleNav(() => goTo(index)) }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <button
              className="nav-btn"
              onClick={() => handleNav(next)}
              aria-label="Next slide"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Thumbnail strip — desktop only */}
        <div className="video-thumbs">
          {displaySlides.map((slide, index) => (
            <button
              key={index}
              className={`video-thumb${index === currentSlide ? ' active' : ''}`}
              onClick={() => handleNav(() => goTo(index))}
            >
              <div className="video-thumb-step">
                {slide.subtitle || `Step 0${index + 1}`}
              </div>
              <div className="video-thumb-title">{slide.title}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}