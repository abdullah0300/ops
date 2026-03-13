import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ProductCard } from '../FeaturedProducts/ProductCard'
import './index.css'

export const ProductShowcase = async () => {
  const payload = await getPayload({ config })
  
  // Fetch a larger number of products to fill 3 rows
  const { docs: products } = await payload.find({
    collection: 'products',
    limit: 30, // Adjust as needed
  })

  // Split into 3 rows
  const row1 = products.filter((_, i) => i % 3 === 0)
  const row2 = products.filter((_, i) => i % 3 === 1)
  const row3 = products.filter((_, i) => i % 3 === 2)

  return (
    <section className="product-showcase">
      <div className="showcase-header container">
        <h2>Our Best Products</h2>
        <p>Explore our complete range of high-quality packaging and printing solutions.</p>
      </div>

      <div className="showcase-rows-outer">
        {/* Row 1 - Left to Right */}
        <div className="showcase-row-wrap">
          <div className="showcase-track marquee-left">
            {[...row1, ...row1].map((product, index) => (
              <div key={`${product.id}-r1-${index}`} className="showcase-item">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 - Right to Left */}
        <div className="showcase-row-wrap">
          <div className="showcase-track marquee-right">
            {[...row2, ...row2].map((product, index) => (
              <div key={`${product.id}-r2-${index}`} className="showcase-item">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* Row 3 - Left to Right */}
        <div className="showcase-row-wrap">
          <div className="showcase-track marquee-left">
            {[...row3, ...row3].map((product, index) => (
              <div key={`${product.id}-r3-${index}`} className="showcase-item">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
