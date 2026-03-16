import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { CollectionArchive } from '@/components/CollectionArchive'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 600

export const metadata: Metadata = {
  title: 'Blog | Online Packaging Store - Custom Mylar Bags Expert',
  description:
    'Expert insights on custom mylar bags printing. Online Packaging Store is a world leader in premium custom packaging and mylar bag printing solutions.',
}

export default async function BlogPage() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    where: { _status: { equals: 'published' } },
    sort: '-publishedAt',
  })

  return (
    <div className="blog-page">
      <style>{`
        .blog-page {
          background: #F3F3F3;
          min-height: 80vh;
          color-scheme: light;
        }
        .blog-hero {
          background: #fff;
          border-bottom: 1px solid #e8e8e0;
          padding: 64px 0 52px;
          position: relative;
          overflow: hidden;
        }
        .blog-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(140,166,45,0.1) 1px, transparent 1px);
          background-size: 22px 22px;
          pointer-events: none;
        }
        .blog-cmyk-bar {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          display: flex;
        }
        .blog-cmyk-bar span { flex: 1; }
        .blog-cmyk-bar .bc { background: #00b4d8; }
        .blog-cmyk-bar .bm { background: #e040fb; }
        .blog-cmyk-bar .by { background: #f0bc2e; }
        .blog-cmyk-bar .bk { background: #222; }
        .blog-hero-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 48px;
          position: relative;
          z-index: 1;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 40px;
        }
        .blog-hero-left { max-width: 640px; }
        .blog-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: 'Arya', sans-serif;
          font-size: 11px;
          font-weight: 700;
          color: #8ca62d;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }
        .blog-eyebrow::before {
          content: '';
          width: 24px; height: 2px;
          background: #8ca62d;
          border-radius: 2px;
        }
        .blog-hero h1 {
          font-family: 'Amaranth', sans-serif;
          font-size: clamp(40px, 5.5vw, 72px);
          font-weight: 700;
          color: #111;
          letter-spacing: -0.03em;
          line-height: 0.95;
          margin: 0 0 20px;
        }
        .blog-hero h1 em { color: #8ca62d; font-style: italic; }
        .blog-hero-desc {
          font-family: 'Afacad', sans-serif;
          font-size: 16px;
          color: #666;
          line-height: 1.65;
          margin: 0;
        }
        .blog-hero-stat { text-align: right; flex-shrink: 0; }
        .blog-hero-stat-n {
          font-family: 'Amaranth', sans-serif;
          font-size: 52px;
          font-weight: 700;
          color: #111;
          line-height: 1;
        }
        .blog-hero-stat-n em { color: #8ca62d; font-style: normal; }
        .blog-hero-stat-l {
          font-family: 'Arya', sans-serif;
          font-size: 11px;
          font-weight: 700;
          color: #aaa;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-top: 4px;
        }
        .blog-grid-section {
          max-width: 1280px;
          margin: 0 auto;
          padding: 48px 48px 80px;
        }
        @media (max-width: 1024px) {
          .blog-hero-inner { padding: 0 32px; }
          .blog-grid-section { padding: 40px 32px 64px; }
          .blog-hero-stat { display: none; }
        }
        @media (max-width: 640px) {
          .blog-hero { padding: 48px 0 36px; }
          .blog-hero-inner { padding: 0 20px; flex-direction: column; }
          .blog-grid-section { padding: 28px 16px 56px; }
        }
      `}</style>

      <div className="blog-hero">
        <div className="blog-cmyk-bar">
          <span className="bc"/><span className="bm"/><span className="by"/><span className="bk"/>
        </div>
        <div className="blog-hero-inner">
          <div className="blog-hero-left">
            <div className="blog-eyebrow">Printing Insights & Industry News</div>
            <h1>From the <em>Press.</em></h1>
            <p className="blog-hero-desc">
              Expert insights from the world leader in custom packaging and mylar bag printing — tips, techniques, and industry knowledge straight from our production floor.
            </p>
          </div>
          <div className="blog-hero-stat">
            <div className="blog-hero-stat-n">{posts.totalDocs}<em>+</em></div>
            <div className="blog-hero-stat-l">Articles Published</div>
          </div>
        </div>
      </div>

      <div className="blog-grid-section">
        <CollectionArchive posts={posts.docs as any} relationTo="posts" />
      </div>
    </div>
  )
}