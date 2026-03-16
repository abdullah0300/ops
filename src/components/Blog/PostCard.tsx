'use client'

import './index.css'

import React from 'react'
import Link from 'next/link'
import type { Post, Media } from '@/payload-types'
import { format } from 'date-fns'

export const PostCard = ({ post }: { post: Post }) => {
  const mainImage = post.heroImage as Media
  const imageUrl = typeof mainImage === 'object' ? mainImage?.url : null

  const categoryName =
    post.categories?.[0] && typeof post.categories[0] === 'object'
      ? (post.categories[0] as any).title
      : 'Blog'

  const dateStr = post.publishedAt
    ? format(new Date(post.publishedAt), 'MMM dd, yyyy')
    : ''

  return (
    <Link href={`/blog/${post.slug}`} className="post-card">
      {/* Image */}
      <div className="post-card-img">
        <div className="post-card-reg">
          <div className="reg-c" /><div className="reg-m" /><div className="reg-y" /><div className="reg-k" />
        </div>
        <span className="post-card-cat">{categoryName}</span>
        {imageUrl ? (
          <img src={imageUrl} alt={post.title} />
        ) : (
          <div className="post-card-ph">📝</div>
        )}
      </div>

      {/* Info */}
      <div className="post-card-info">
        {dateStr && <div className="post-card-date">{dateStr}</div>}
        <h3 className="post-card-title">{post.title}</h3>
        {(post as any).excerpt && (
          <p className="post-card-excerpt">{(post as any).excerpt}</p>
        )}
        <div className="post-card-cta">
          Read Article
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
    </Link>
  )
}