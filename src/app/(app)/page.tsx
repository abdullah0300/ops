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
import { PromoBannerModal } from '@/components/PromoBannerModal'
import { FactorySlider } from '@/components/FactorySlider'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })
  const homePageData = await payload.findGlobal({
    slug: 'home-page',
  })

  return (
    <>
      <Hero 
        media={homePageData?.hero?.heroImage} 
        showcase={homePageData?.hero?.showcase}
      />
      <FeaturedProducts />
      <VideoSection slides={homePageData?.videoSection?.slides} />
      <BrandSection />
      <ProductShowcase />
      <BenefitsSection />
      <ReviewSection />
      <FAQSection />
      <QuoteForm />
      <PromoBannerModal />
    </>
  )
}