import React from 'react'
import './index.css'
import type { Media as MediaType } from '@/payload-types'

export const Hero = ({ media }: { media?: MediaType | string | null }) => {
  const imageUrl = typeof media === 'object' && media?.url ? media.url : '/media/hero.png'
  
  return (
    <section className="hero">
      <div className="hero-image-wrapper">
        <img src={imageUrl} alt="Hero" className="hero-full-image" />
      </div>
    </section>
  )
}
