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

const DEFAULT_SLIDES = [
  {
    id: 1,
    video: '/media/first.mp4',
    title: 'It All Starts With Quality',
    subtitle: 'Raw Materials & Preparation',
    body: 'Every great print begins long before the ink touches the surface. At our facility, we source only premium-grade raw sheets and blank bags that meet our strict quality standards. Each material is carefully loaded onto our industrial-grade machines, aligned with precision, and inspected before production begins.',
    tagline: 'Premium materials. Precision setup. Zero compromise.',
  },
  {
    id: 2,
    video: '/media/second.mp4',
    title: 'Where Your Design Comes to Life',
    subtitle: 'High-Precision Printing Technology',
    body: 'This is where your vision transforms into reality. Using advanced printing technology, our machines deliver sharp, vibrant, and consistent results across every single unit. Our operators monitor every run in real time, ensuring colour accuracy, alignment, and ink quality are maintained throughout the entire batch.',
    tagline: 'Your design, perfected at scale.',
  },
  {
    id: 3,
    video: '/media/third.mp4',
    title: 'Ready. Packed. Delivered.',
    subtitle: 'Quality-Checked & Ready for Your Brand',
    body: 'The final product speaks for itself. After printing, every item goes through a quality inspection process before being packed and prepared for dispatch. What leaves our factory is exactly what your customers will see — clean edges, vibrant colours, and a finish that reflects the professionalism of your brand.',
    tagline: 'From our floor to your door — built to impress.',
  },
]

export const VideoSection = ({ slides }: { slides?: SlideData[] | null }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  const displaySlides = (slides && slides.length > 0) ? slides : DEFAULT_SLIDES

  const nextSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev + 1) % displaySlides.length)
  }

  const prevSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentSlide((prev) => (prev - 1 + displaySlides.length) % displaySlides.length)
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 800)
    return () => clearTimeout(timer)
  }, [currentSlide])

  return (
    <section className="video-section">
      <div className="video-section-header container">
        <span className="section-badge">Production Showcase</span>
        <h2>From Raw Material to Finished Product</h2>
        <p>A behind-the-scenes look at our state-of-the-art production facility</p>
      </div>

      <div className="video-slider">
        {displaySlides.map((slide, index) => {
          const videoUrl = typeof slide.video === 'object' ? slide.video.url : slide.video
          
          return (
            <div
              key={slide.id || index}
              className={`video-slide ${index === currentSlide ? 'active' : ''} ${
                index < currentSlide ? 'prev' : ''
              } ${index > currentSlide ? 'next' : ''}`}
            >
              <div className="video-background">
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el
                  }}
                  src={videoUrl || ''}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="bg-video"
                />
                <div className="video-overlay" />
              </div>

              <div className="slide-content container">
                <div className="content-inner">
                  <span className="slide-subtitle">{slide.subtitle}</span>
                  <h3 className="slide-title">{slide.title}</h3>
                  <p className="slide-body">{slide.body}</p>
                  <div className="slide-tagline">
                    <span className="tagline-icon">✦</span>
                    {slide.tagline}
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        <div className="slider-controls">
          <button className="nav-btn prev" onClick={prevSlide} aria-label="Previous slide">
            <ChevronLeft size={24} />
          </button>
          
          <div className="slide-indicators">
            {displaySlides.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => {
                  if (!isAnimating && index !== currentSlide) {
                    setIsAnimating(true)
                    setCurrentSlide(index)
                  }
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <button className="nav-btn next" onClick={nextSlide} aria-label="Next slide">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  )
}
