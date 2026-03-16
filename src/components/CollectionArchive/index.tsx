import React from 'react'
import type { Product, Post } from '@/payload-types'
import { ProductCard } from '../FeaturedProducts/ProductCard'
import { PostCard } from '../Blog/PostCard'

export type Props = {
  posts: (Product | Post)[]
  relationTo?: 'products' | 'posts'
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { posts, relationTo = 'products' } = props

  return (
    <>
      <style>{`
        .collection-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        @media (max-width: 1024px) {
          .collection-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
        }
        @media (max-width: 540px) {
          .collection-grid { grid-template-columns: 1fr; gap: 16px; }
        }
      `}</style>
      <div className="collection-grid">
        {posts?.map((result, index) => {
          if (typeof result === 'object' && result !== null) {
            return (
              <div key={index}>
                {relationTo === 'products' ? (
                  <ProductCard product={result as Product} />
                ) : (
                  <PostCard post={result as Post} />
                )}
              </div>
            )
          }
          return null
        })}
      </div>
    </>
  )
}