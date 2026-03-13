import React from 'react'
import { Hero } from '@/components/Hero'
import { BenefitsSection } from '@/components/BenefitsSection'
import { FeaturedProducts } from '@/components/FeaturedProducts'
import { VideoSection } from '@/components/VideoSection'
import { BrandSection } from '@/components/BrandSection'
import { ProductShowcase } from '@/components/ProductShowcase'
import { ReviewSection } from '@/components/ReviewSection/index'
import { FAQSection } from '@/components/FAQSection/index'
import { QuoteForm } from '@/components/QuoteForm'

export default async function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <VideoSection />
      <BrandSection />
      <ProductShowcase />
      <BenefitsSection />
      <ReviewSection />
      <FAQSection />
      <QuoteForm />
    </>
  )
}