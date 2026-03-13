import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { ProductSlider } from './ProductSlider'
import './index.css'

export const FeaturedProducts = async () => {
  const payload = await getPayload({ config: configPromise })
  
  const { docs: products } = await payload.find({
    collection: 'products',
    limit: 12, // Show up to 12 products in the slider
    sort: '-createdAt',
  })

  return (
    <section className="featured-products">
      <div className="container">
        <h2 className="section-title">Featured Products</h2>
        <ProductSlider products={products as any} />
      </div>
    </section>
  )
}
