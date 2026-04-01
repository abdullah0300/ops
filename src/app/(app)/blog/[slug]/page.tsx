import React, { cache } from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { RichText } from '@/components/RichText'
import { generateMeta } from '@/utilities/generateMeta'
import type { Metadata } from 'next'
import { format } from 'date-fns'
import Link from 'next/link'
import { Media } from '@/payload-types'

export const dynamic = 'force-dynamic'
export const revalidate = 600

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'posts',
    limit: 1,
    where: {
      slug: { equals: slug },
      _status: { equals: 'published' },
    },
  })
  return result.docs?.[0] || null
})

export async function generateMetadata({ params: paramsPromise }: any): Promise<Metadata> {
  const { slug } = await paramsPromise
  const post = await queryPostBySlug({ slug })
  return generateMeta({ doc: post as any })
}

export default async function PostPage({ params: paramsPromise }: any) {
  const { slug } = await paramsPromise
  const post = await queryPostBySlug({ slug })

  if (!post) return notFound()

  const author =
    typeof post.author === 'object' ? (post.author as any).name : 'OPS Editorial Team'
  const heroImage = post.heroImage as Media
  const dateStr = post.publishedAt
    ? format(new Date(post.publishedAt), 'MMMM dd, yyyy')
    : ''

  return (
    <article>
      <style>{`
        /* ── Base ── */
        .pd {
          background: #F7F5F0;
          min-height: 100vh;
          color-scheme: light;
        }

        /* ── CMYK strip ── */
        .pd-cmyk {
          height: 3px;
          display: flex;
        }
        .pd-cmyk-c { flex:1; background:#00b4d8 }
        .pd-cmyk-m { flex:1; background:#e040fb }
        .pd-cmyk-y { flex:1; background:#f0bc2e }
        .pd-cmyk-k { flex:1; background:#222 }

        /* ── Full-bleed hero ── */
        .pd-hero {
          position: relative;
          width: 100%;
          background: #1c1c1c;
          overflow: hidden;
          min-height: 480px;
          display: flex;
          align-items: flex-end;
        }

        .pd-hero-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: .55;
        }

        /* Dark gradient bottom */
        .pd-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0,0,0,.85) 0%,
            rgba(0,0,0,.4) 50%,
            rgba(0,0,0,.1) 100%
          );
        }

        /* Halftone texture on hero */
        .pd-hero-halftone {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,.04) 1px, transparent 1px);
          background-size: 16px 16px;
          pointer-events: none;
        }

        .pd-hero-content {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          padding: 60px 48px 52px;
        }

        /* Back link */
        .pd-back {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-family: 'Arya', sans-serif;
          font-size: 11px;
          font-weight: 700;
          color: rgba(255,255,255,.55);
          text-decoration: none;
          letter-spacing: .1em;
          text-transform: uppercase;
          margin-bottom: 20px;
          transition: color .2s;
        }
        .pd-back:hover { color: #8ca62d; }

        /* Category */
        .pd-category {
          display: inline-block;
          background: #8ca62d;
          color: #fff;
          font-family: 'Arya', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          padding: 4px 12px;
          border-radius: 4px;
          margin-bottom: 20px;
        }

        /* Title on hero */
        .pd-title {
          font-family: 'Amaranth', sans-serif;
          font-weight: 700;
          font-size: clamp(32px, 5vw, 62px);
          color: #fff;
          line-height: 1.05;
          letter-spacing: -.03em;
          margin: 0 0 28px;
          word-break: break-word;
          text-shadow: 0 2px 20px rgba(0,0,0,.3);
        }

        /* Author row on hero */
        .pd-author {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .pd-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(140,166,45,.25);
          border: 2px solid rgba(140,166,45,.5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Amaranth', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #c8e6a0;
          flex-shrink: 0;
        }
        .pd-author-name {
          font-family: 'Afacad', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: rgba(255,255,255,.9);
        }
        .pd-author-date {
          font-family: 'Afacad', sans-serif;
          font-size: 13px;
          color: rgba(255,255,255,.5);
        }
        .pd-author-sep {
          color: rgba(255,255,255,.25);
          margin: 0 2px;
        }

        /* Placeholder when no image */
        .pd-hero-no-img {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #1a2a0e 0%, #2d4a18 40%, #1a2a0e 100%);
        }

        /* ── Content area ── */
        .pd-body {
          max-width: 760px;
          margin: 0 auto;
          padding: 56px 48px 80px;
        }

        /* Reading progress indicator */
        .pd-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 40px;
        }
        .pd-divider-line {
          flex: 1;
          height: 1px;
          background: repeating-linear-gradient(
            90deg, #d8d4cc 0, #d8d4cc 4px, transparent 4px, transparent 8px
          );
        }
        .pd-divider-print {
          display: flex;
          gap: 4px;
          flex-shrink: 0;
        }
        .pd-divider-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }
        .pd-divider-dot-c { background: #00b4d8; opacity: .6 }
        .pd-divider-dot-m { background: #e040fb; opacity: .6 }
        .pd-divider-dot-y { background: #f0bc2e; opacity: .6 }
        .pd-divider-dot-k { background: #333; opacity: .6 }

        /* RichText content */
        .pd-content {
          font-family: 'Afacad', sans-serif;
          font-size: 18px;
          color: #1a1a1a;
          line-height: 1.85;
          overflow-wrap: break-word;
          word-break: break-word;
          overflow: hidden;
        }

        .pd-content p { margin: 0 0 22px; }
        .pd-content h1,
        .pd-content h2,
        .pd-content h3,
        .pd-content h4 {
          font-family: 'Amaranth', sans-serif;
          font-weight: 700;
          color: #111;
          line-height: 1.2;
          margin: 40px 0 14px;
          letter-spacing: -.02em;
          word-break: break-word;
        }
        .pd-content h2 { font-size: clamp(22px, 3vw, 34px); border-left: 3px solid #8ca62d; padding-left: 16px; }
        .pd-content h3 { font-size: clamp(18px, 2.5vw, 26px); }
        .pd-content h4 { font-size: 18px; color: #555; }
        .pd-content ul, .pd-content ol { padding-left: 24px; margin: 0 0 22px; }
        .pd-content li { margin-bottom: 10px; }
        .pd-content a { color: #8ca62d; text-decoration: underline; text-underline-offset: 3px; }
        .pd-content a:hover { color: #5a7a1a; }
        .pd-content strong { color: #111; font-weight: 700; }
        .pd-content em { font-style: italic; }
        .pd-content blockquote {
          margin: 28px 0;
          padding: 20px 24px;
          background: #efffe5;
          border-left: 4px solid #8ca62d;
          border-radius: 0 8px 8px 0;
          color: #444;
          font-style: italic;
          font-size: 17px;
        }
        .pd-content img {
          max-width: 100%;
          height: auto;
          border-radius: 12px;
          margin: 24px 0;
          display: block;
          border: 1px solid #e8e8e0;
        }
        .pd-content code {
          background: #f5f2ec;
          padding: 2px 7px;
          border-radius: 4px;
          font-size: 14px;
          font-family: monospace;
          color: #8ca62d;
        }
        .pd-content pre {
          background: #1c1c1c;
          color: #efffe5;
          padding: 24px;
          border-radius: 12px;
          overflow-x: auto;
          margin: 24px 0;
          font-size: 14px;
        }
        .pd-content hr {
          border: none;
          border-top: 1px solid #e8e8e0;
          margin: 36px 0;
        }

        /* ── Share strip ── */
        .pd-share {
          max-width: 760px;
          margin: 0 auto;
          padding: 0 48px 72px;
        }
        .pd-share-inner {
          background: #fff;
          border: 1px solid #e4e0d8;
          border-radius: 14px;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .pd-share-left {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .pd-share-label {
          font-family: 'Arya', sans-serif;
          font-size: 10px;
          font-weight: 700;
          color: #aaa;
          letter-spacing: .1em;
          text-transform: uppercase;
        }
        .pd-share-text {
          font-family: 'Amaranth', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #111;
        }
        .pd-share-btns { display: flex; gap: 8px; flex-wrap: wrap; }
        .pd-share-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'Afacad', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #555;
          background: #f7f5f0;
          border: 1px solid #e4e0d8;
          border-radius: 7px;
          padding: 9px 16px;
          text-decoration: none;
          transition: all .2s;
          cursor: pointer;
        }
        .pd-share-btn:hover { border-color: #8ca62d; color: #8ca62d; background: #efffe5; }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .pd-hero { min-height: 360px; }
          .pd-hero-content { padding: 40px 24px 40px; }
          .pd-body { padding: 40px 24px 64px; }
          .pd-share { padding: 0 24px 60px; }
          .pd-content { font-size: 16px; }
          .pd-title { font-size: clamp(26px, 7vw, 44px); }
        }

        @media (max-width: 480px) {
          .pd-hero { min-height: 300px; }
          .pd-hero-content { padding: 32px 16px 32px; }
          .pd-body { padding: 32px 16px 52px; }
          .pd-share { padding: 0 16px 52px; }
          .pd-share-inner { flex-direction: column; align-items: flex-start; }
          .pd-share-btns { width: 100%; }
          .pd-share-btn { flex: 1; justify-content: center; }
        }
      `}</style>

      <div className="pd">

        {/* CMYK strip */}
        <div className="pd-cmyk">
          <div className="pd-cmyk-c"/><div className="pd-cmyk-m"/>
          <div className="pd-cmyk-y"/><div className="pd-cmyk-k"/>
        </div>

        {/* Full-bleed hero */}
        <div className="pd-hero">
          {heroImage?.url ? (
            <img src={heroImage.url} alt={post.title} className="pd-hero-img" />
          ) : (
            <div className="pd-hero-no-img" />
          )}
          <div className="pd-hero-overlay" />
          <div className="pd-hero-halftone" />

          <div className="pd-hero-content">
            <Link href="/blog" className="pd-back">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to Blog
            </Link>

            <div>
              {post.categories?.map((cat: any, i: number) => (
                <span key={i} className="pd-category">
                  {typeof cat === 'object' ? cat.title : 'General'}
                </span>
              ))}
            </div>

            <h1 className="pd-title">{post.title}</h1>

            <div className="pd-author">
              <div className="pd-avatar">{author[0]}</div>
              <div>
                <div className="pd-author-name">
                  {author}
                  <span className="pd-author-sep"> · </span>
                  <span className="pd-author-date">{dateStr}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pd-body">
          {/* Print divider */}
          <div className="pd-divider">
            <div className="pd-divider-line" />
            <div className="pd-divider-print">
              <div className="pd-divider-dot pd-divider-dot-c" />
              <div className="pd-divider-dot pd-divider-dot-m" />
              <div className="pd-divider-dot pd-divider-dot-y" />
              <div className="pd-divider-dot pd-divider-dot-k" />
            </div>
            <div className="pd-divider-line" />
          </div>

          <div className="pd-content">
            <RichText data={post.content as any} enableProse={false} enableGutter={false} />
          </div>
        </div>

        {/* Share */}
        <div className="pd-share">
          <div className="pd-share-inner">
            <div className="pd-share-left">
              <span className="pd-share-label">Share this article</span>
              <span className="pd-share-text">Found this useful? Pass it on.</span>
            </div>
            <div className="pd-share-btns">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://onlinepackagingstore.com/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="pd-share-btn"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.734l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Twitter
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://onlinepackagingstore.com/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="pd-share-btn"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' ' + `https://onlinepackagingstore.com/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="pd-share-btn"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.531 5.854L0 24l6.335-1.51C8.055 23.447 9.987 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.859 0-3.587-.5-5.077-1.371l-.361-.214-3.762.897.934-3.658-.235-.374C2.538 15.591 2 13.855 2 12 2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>

      </div>
    </article>
  )
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    limit: 1000,
    select: { slug: true },
  })
  return posts.docs.map(({ slug }) => ({ slug }))
}