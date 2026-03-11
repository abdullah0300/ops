/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import { FactorySlider } from '@/components/FactorySlider'
import { ReviewSection } from '@/components/ReviewSection'
import { FAQSection } from '@/components/FAQSection'
import { QuoteForm } from '@/components/QuoteForm'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const payload = await getPayload({ config: configPromise })
  const resolvedParams = (await (searchParams || Promise.resolve({}))) as { tab?: string }
  const activeTab = resolvedParams?.tab || 'All Products'

  // Fetch real categories from Payload (with image depth)
  const categoriesData = await payload.find({
    collection: 'categories',
    limit: 20,
    depth: 1,
  })
  const categories = categoriesData.docs as any[]

  // Fetch published products with category and meta image populated
  const productsData = await payload.find({
    collection: 'products',
    limit: 24,
    depth: 2,
    where: { _status: { equals: 'published' } },
  })
  const products = productsData.docs as any[]

  // Build tab list: "All Products" + each distinct category that has products
  const categoriesWithProducts = categories.filter((cat: any) =>
    products.some((p: any) =>
      p.categories?.some((c: any) =>
        (typeof c === 'object' ? c.slug : '') === cat.slug
      )
    )
  )

  const tabFilters = [
    'All Products',
    ...categoriesWithProducts.map((c: any) => c.title),
  ]

  // Group products by category title for tab filtering
  const productsByTab: Record<string, any[]> = { 'All Products': products }
  for (const cat of categoriesWithProducts) {
    productsByTab[cat.title] = products.filter((p: any) =>
      p.categories?.some((c: any) =>
        (typeof c === 'object' ? c.slug : '') === cat.slug
      )
    )
  }

  // Top 4 categories for navbar links (use whatever exists in the DB)
  const navCategories = categories.slice(0, 4)

  // Fetch Mylar Bags for the hero showcase
  const mylarCat = categories.find((c: any) => c.slug === 'mylar-bags')
  const heroProductsData = mylarCat
    ? await payload.find({
        collection: 'products',
        limit: 10,
        depth: 2,
        where: {
          and: [
            { _status: { equals: 'published' } },
            { categories: { contains: mylarCat.id } },
          ],
        },
      })
    : { docs: [] }
  const heroProducts = heroProductsData.docs as any[]

  const BG_COLORS = ['#f5dde8','#f0eaf5','#f5f0e0','#f0e8e0','#e0edf5','#e8f0e0','#f5e8e0','#e0e8f5']

  const displayProducts = productsByTab[activeTab] ?? products

  // Build grid items: pattern of 3 products, CTA, CTA, 3 products (repeating every 8 slots)
  // Row 1: P P P CTA | Row 2: CTA P P P | Row 3: P P P CTA | Row 4: CTA P P P ...
  type GridItem = { type: 'product'; data: any; ci: number } | { type: 'cta'; key: string }
  const gridItems: GridItem[] = []
  let pIdx = 0
  let slot = 0
  while (pIdx < displayProducts.length) {
    const posInCycle = slot % 8
    if (posInCycle === 3 || posInCycle === 4) {
      const cycleProductStart = Math.floor(slot / 8) * 6
      if (cycleProductStart < displayProducts.length) {
        gridItems.push({ type: 'cta', key: `cta-${slot}` })
      }
    } else {
      if (pIdx < displayProducts.length) {
        gridItems.push({ type: 'product', data: displayProducts[pIdx], ci: pIdx % BG_COLORS.length })
        pIdx++
      }
    }
    slot++
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amaranth:wght@400;700&family=Arya:wght@400;700&family=Afacad:wght@400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html, body {
          font-family: 'Afacad', sans-serif;
          background: #FCFBF7;
          color: #1c1c1c;
        }

        /* ════════════════════════════════════════════════════
           CATEGORY TUNING — edit :root vars only
        ════════════════════════════════════════════════════ */
        :root {
          --cat-1-size:  250px;  --cat-1-nudge: -160px;
          --cat-2-size:  220px;  --cat-2-nudge:  -40px;
          --cat-3-size:  250px;  --cat-3-nudge:  -10px;
          --cat-4-size:  220px;  --cat-4-nudge:  -70px;
          --cat-5-size:  250px;  --cat-5-nudge: -160px;
          --cat-gap: 50px;
        }

        /* ══════════════════════════════════════
           NAVBAR
        ══════════════════════════════════════ */
        .nav-outer {
          width: 100%; padding: 18px 32px 0;
          display: flex; justify-content: center;
          position: sticky; top: 14px; z-index: 200;
        }
        .navbar {
          width: 100%; max-width: 920px;
          background: #FCFBF7; border: 1.5px solid #1c1c1c;
          border-radius: 100px; padding: 10px 12px 10px 20px;
          display: flex; align-items: center;
          justify-content: space-between; gap: 16px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.05);
        }
        .nav-logo { display: flex; align-items: center; gap: 6px; text-decoration: none; flex-shrink: 0; }
        .nav-logo-icon { width: 38px; height: 38px; }
        .nav-logo-icon svg { width: 38px; height: 38px; }
        .nav-logo-wordmark { font-family: 'Amaranth', sans-serif; font-weight: 700; font-size: 22px; color: #f0bc2e; letter-spacing: -0.5px; line-height: 1; }
        .nav-links { display: flex; align-items: center; gap: 2px; list-style: none; flex: 1; justify-content: center; }
        .nav-links li a { display: block; text-decoration: none; color: #1c1c1c; font-size: 15px; font-weight: 500; padding: 8px 16px; border-radius: 100px; transition: background 0.18s; white-space: nowrap; }
        .nav-links li a:hover { background: rgba(0,0,0,0.05); }
        .nav-cta { flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; background: #f0bc2e; color: #1c1c1c; font-family: 'Afacad', sans-serif; font-weight: 600; font-size: 15px; padding: 11px 26px; border-radius: 100px; text-decoration: none; transition: background 0.18s, transform 0.18s; white-space: nowrap; }
        .nav-cta:hover { background: #e6b020; transform: translateY(-1px); }
        .nav-hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 6px; border: none; background: none; }
        .nav-hamburger span { display: block; width: 22px; height: 2px; background: #1c1c1c; border-radius: 2px; }

        /* ══════════════════════════════════════
           HERO SLOT
        ══════════════════════════════════════ */
        .hero-wrap { position: relative; width: 100%; margin-top: 24px; }
        .hero-slot {
          width: 100%; background: #FCFBF7; overflow: hidden;
          min-height: 420px; display: flex; align-items: center; justify-content: center;
        }
        .hero-slot img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .hero-placeholder { display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 12px; color: #bbb; font-size: 15px; }
        .hero-cta-wrap { position: absolute; bottom: -22px; left: 50%; transform: translateX(-50%); z-index: 10; }
        .hero-cta { display: inline-flex; align-items: center; justify-content: center; background: #f0bc2e; color: #1c1c1c; font-family: 'Afacad', sans-serif; font-weight: 700; font-size: 16px; padding: 14px 44px; border-radius: 100px; text-decoration: none; box-shadow: 0 6px 24px rgba(240,188,46,0.4); transition: background 0.18s, transform 0.2s; white-space: nowrap; }
        .hero-cta:hover { background: #e6b020; }

        /* ══════════════════════════════════════
           CATEGORIES ARC
        ══════════════════════════════════════ */
        .categories-section { width: 100%; padding: 70px 24px 60px; display: flex; justify-content: center; }
        .categories-row { display: flex; align-items: flex-end; justify-content: center; gap: var(--cat-gap); width: 100%; max-width: 1100px; }
        .cat-item { display: flex; flex-direction: column; align-items: center; gap: 10px; text-decoration: none; flex: 1; max-width: 220px; transition: filter 0.2s; }
        .cat-item:hover .cat-circle { box-shadow: 0 14px 40px rgba(0,0,0,0.15); transform: scale(1.04); }
        .cat-circle { border-radius: 50%; overflow: hidden; border: 3px solid #fff; box-shadow: 0 6px 24px rgba(0,0,0,0.10); background: #e0dbd0; display: flex; align-items: center; justify-content: center; transition: box-shadow 0.25s, transform 0.25s; flex-shrink: 0; }
        .cat-circle img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .cat-placeholder { font-size: 36px; }
        .cat-label { font-family: 'Afacad', sans-serif; font-size: 13px; font-weight: 600; color: #1c1c1c; text-align: center; }
        .cat-item:nth-child(1) .cat-circle { width: var(--cat-1-size); height: var(--cat-1-size); }
        .cat-item:nth-child(1) { transform: translateY(var(--cat-1-nudge)); }
        .cat-item:nth-child(2) .cat-circle { width: var(--cat-2-size); height: var(--cat-2-size); }
        .cat-item:nth-child(2) { transform: translateY(var(--cat-2-nudge)); }
        .cat-item:nth-child(3) .cat-circle { width: var(--cat-3-size); height: var(--cat-3-size); }
        .cat-item:nth-child(3) { transform: translateY(var(--cat-3-nudge)); }
        .cat-item:nth-child(4) .cat-circle { width: var(--cat-4-size); height: var(--cat-4-size); }
        .cat-item:nth-child(4) { transform: translateY(var(--cat-4-nudge)); }
        .cat-item:nth-child(5) .cat-circle { width: var(--cat-5-size); height: var(--cat-5-size); }
        .cat-item:nth-child(5) { transform: translateY(var(--cat-5-nudge)); }

        /* ══════════════════════════════════════
           EXPLORE BY CATEGORY SECTION
        ══════════════════════════════════════ */
        .explore-section {
          width: 100%;
          background: #FCFBF7;
          padding: 80px 32px 80px;
          position: relative;
        }

        /* Small gold diamond decoration (top right) */
        .explore-section::after {
          content: '◆';
          position: absolute;
          top: 88px;
          right: 10%;
          color: #f0bc2e;
          font-size: 14px;
          pointer-events: none;
        }

        .explore-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .explore-title {
          font-family: 'Amaranth', sans-serif;
          font-weight: 700;
          font-size: clamp(22px, 3vw, 30px);
          color: #1c1c1c;
          letter-spacing: -0.5px;
          margin-bottom: 10px;
        }

        .explore-subtitle {
          font-family: 'Arya', sans-serif;
          font-size: 16px;
          color: #888;
          line-height: 1.6;
          max-width: 360px;
          margin: 0 auto;
        }

        /* ── Filter tabs ───────────────────── */
        .filter-tabs {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          border-bottom: 2px solid #e8e4dc;
          max-width: 800px;
          margin: 0 auto 36px;
          overflow-x: auto;
        }

        .filter-tab {
          padding: 10px 28px;
          font-family: 'Afacad', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: #999;
          text-decoration: none;
          position: relative;
          white-space: nowrap;
          transition: color 0.18s;
          cursor: pointer;
          border: none;
          background: none;
          flex-shrink: 0;
        }

        .filter-tab::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0; right: 0;
          height: 2px;
          background: transparent;
          transition: background 0.18s;
        }

        .filter-tab.active {
          color: #1c1c1c;
          font-weight: 600;
        }

        .filter-tab.active::after {
          background: #f0bc2e;
        }

        .filter-tab:hover { color: #1c1c1c; }

        /* ── Product grid ──────────────────── */
        .product-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          max-width: 1100px;
          margin: 0 auto;
        }

        .product-card {
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          gap: 0;
          border-radius: 4px;
          overflow: hidden;
          transition: transform 0.2s;
          background: transparent;
        }

        .product-card:hover { transform: translateY(-4px); }

        /* CTA card - Modern Premium Design */
        .cta-card {
          background: linear-gradient(145deg, #1f1f1f 0%, #151515 100%);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 32px 24px 24px;
          aspect-ratio: 1 / 1;
          text-decoration: none;
          position: relative;
          z-index: 1;
          box-shadow: 0 12px 32px rgba(0,0,0,0.06);
          transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .cta-card::before {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 200px; height: 200px;
          background: radial-gradient(circle at top right, rgba(240,188,46,0.12) 0%, transparent 60%);
          z-index: -1;
          border-radius: 50%;
        }
        .cta-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 48px rgba(0,0,0,0.12);
          border-color: rgba(240,188,46,0.3);
        }
        .cta-card-top {}
        .cta-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(240,188,46,0.12);
          border: 1px solid rgba(240,188,46,0.25);
          border-radius: 100px;
          padding: 5px 14px;
          font-size: 11px;
          font-weight: 700;
          color: #f0bc2e;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 20px;
        }
        .cta-heading {
          font-family: 'Amaranth', sans-serif;
          font-weight: 700;
          font-size: 24px;
          line-height: 1.15;
          color: #fff;
          letter-spacing: -0.5px;
          margin-bottom: 12px;
        }
        .cta-heading span { color: #f0bc2e; }
        .cta-sub {
          font-family: 'Afacad', sans-serif;
          font-size: 13px;
          color: rgba(255,255,255,0.6);
          line-height: 1.5;
        }
        .cta-card-bottom {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 20px;
        }
        .cta-btn-primary {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, #f0bc2e 0%, #dca41b 100%);
          color: #111;
          font-family: 'Afacad', sans-serif;
          font-weight: 700;
          font-size: 14px;
          padding: 12px 16px;
          border-radius: 10px;
          text-decoration: none;
          box-shadow: 0 4px 14px rgba(240,188,46,0.25);
          transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.2s ease;
        }
        .cta-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(240,188,46,0.4);
        }
        .cta-arrow {
          width: 24px; height: 24px;
          background: rgba(0,0,0,0.1);
          border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px;
          transition: background 0.2s;
        }
        .cta-btn-primary:hover .cta-arrow {
          background: rgba(0,0,0,0.15);
        }
        .cta-btn-secondary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: transparent;
          color: rgba(255,255,255,0.5);
          font-family: 'Afacad', sans-serif;
          font-weight: 600;
          font-size: 13px;
          padding: 8px 0;
          border-radius: 8px;
          text-decoration: none;
          transition: color 0.2s, background 0.2s;
        }
        .cta-btn-secondary:hover { color: #fff; background: rgba(255,255,255,0.04); }

        .product-img-wrap {
          width: 100%;
          aspect-ratio: 1 / 1;
          border-radius: 4px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }

        .product-img-wrap img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
        }

        .product-img-placeholder {
          width: 100%; height: 100%;
          display: flex; align-items: center;
          justify-content: center; font-size: 48px;
        }

        .product-name {
          font-family: 'Amaranth', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #1c1c1c;
          margin-bottom: 4px;
          line-height: 1.3;
        }

        .product-desc {
          font-family: 'Afacad', sans-serif;
          font-size: 13px;
          color: #888;
          line-height: 1.55;
        }

        /* empty state */
        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px 0;
          color: #aaa;
          font-size: 15px;
        }

        /* ══════════════════════════════════════
           RESPONSIVE
        ══════════════════════════════════════ */
        @media (max-width: 1024px) {
          .product-grid { grid-template-columns: repeat(3, 1fr); }
        }

        @media (max-width: 900px) {
          :root {
            --cat-1-size: 115px; --cat-2-size: 135px;
            --cat-3-size: 158px; --cat-4-size: 126px; --cat-5-size: 112px;
            --cat-1-nudge: 15px; --cat-2-nudge: -30px;
            --cat-3-nudge: -70px; --cat-4-nudge: -15px; --cat-5-nudge: 8px;
          }
          .product-grid { grid-template-columns: repeat(2, 1fr); }
          .explore-section { padding: 60px 24px; }
        }

        @media (max-width: 640px) {
          .nav-links { display: none; }
          .nav-hamburger { display: flex; }
          .nav-outer { padding: 14px 16px 0; }

          :root {
            --cat-1-size: 88px; --cat-2-size: 88px;
            --cat-3-size: 88px; --cat-4-size: 88px; --cat-5-size: 88px;
            --cat-1-nudge: 0px; --cat-2-nudge: 0px;
            --cat-3-nudge: 0px; --cat-4-nudge: 0px; --cat-5-nudge: 0px;
            --cat-gap: 10px;
          }
          .categories-row { flex-wrap: nowrap; overflow-x: auto; -webkit-overflow-scrolling: touch; justify-content: flex-start; padding-bottom: 12px; align-items: center; }
          .cat-item { flex-shrink: 0; max-width: none; }
          .hero-slot, .hero-placeholder { min-height: 260px; }
          .hero-cta { font-size: 14px; padding: 11px 30px; }
          .categories-section { padding: 48px 16px 44px; }

          .product-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
          .explore-section { padding: 48px 16px; }
          .filter-tabs { gap: 0; overflow-x: auto; justify-content: flex-start; padding-bottom: 0; }
          .filter-tab { padding: 10px 18px; font-size: 13px; flex-shrink: 0; }
        }

        @media (max-width: 400px) {
          .nav-cta { font-size: 13px; padding: 9px 16px; }
          .nav-logo-wordmark { font-size: 18px; }
          .product-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
        }
      `}</style>

      {/* ══ NAVBAR ══════════════════════════════════════ */}
      <div className="nav-outer">
        <nav className="navbar">
          <Link href="/" className="nav-logo">
            <div className="nav-logo-icon">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="38" height="38" rx="9" fill="#F0BC2E"/>
                <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle"
                  fontFamily="Amaranth, sans-serif" fontWeight="700" fontSize="15" fill="#1c1c1c">ops</text>
              </svg>
            </div>
            <span className="nav-logo-wordmark">ops</span>
          </Link>

          <ul className="nav-links">
            <li><Link href="/">Home</Link></li>
            {navCategories.map((cat: any) => (
              <li key={String(cat.id)}>
                <Link href={`/products?category=${String(cat.slug)}`}>
                  {String(cat.title)}
                </Link>
              </li>
            ))}
            <li><Link href="/products">All Products</Link></li>
          </ul>

          <Link href="/quote" className="nav-cta">Get Quote</Link>
          <button className="nav-hamburger" aria-label="Open menu"><span/><span/><span/></button>
        </nav>
      </div>

      {/* ══ HERO ═════════════════════════════════════════════ */}
      <div className="hero-wrap">
        <div className="hero-slot">
          <div className="hero-placeholder">
            <span style={{fontSize:'48px'}}>🖼️</span>
            <span>Your hero image goes here</span>
          </div>
        </div>
        <div className="hero-cta-wrap">
          <Link href="/quote" className="hero-cta">Get Quote</Link>
        </div>
      </div>

      {/* ══ MYLAR PRODUCTS ARC ═══════════════════════════ */}
      {heroProducts.length > 0 && (
        <div className="categories-section">
          <div className="categories-row">
            {heroProducts.slice(0, 5).map((p: any, i: number) => {
              const imgUrl = p.meta?.image?.url || p.gallery?.[0]?.image?.url
              return (
                <Link key={String(p.id)} href={`/products/${String(p.slug)}`} className="cat-item">
                  <div className="cat-circle" style={{ background: imgUrl ? 'transparent' : BG_COLORS[i % BG_COLORS.length] }}>
                    {imgUrl
                      ? <img src={String(imgUrl)} alt={String(p.title)} />
                      : <span className="cat-placeholder">📦</span>
                    }
                  </div>
                  <span className="cat-label">{String(p.title)}</span>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* ══ PRODUCTS SECTION ════════════════════════════ */}
      <section className="explore-section">

        <div className="explore-header">
          <h2 className="explore-title">Our Best Mylar Bags</h2>
          <p className="explore-subtitle">
            Custom-printed, smell-proof packaging crafted<br/>
            to protect your product and elevate your brand.
          </p>
        </div>

        {/* Product grid — CTA cards auto-placed: row1-col4, row2-col1, row3-col4, row4-col1 … */}
        <div className="product-grid">
          {displayProducts.length === 0 ? (
            <div className="empty-state">No products found.</div>
          ) : (
            gridItems.slice(0, 12).map((item) => {
              if (item.type === 'cta') {
                return (
                  <div key={item.key} className="cta-card">
                    <div className="cta-card-top">
                      <div className="cta-badge">✦ Custom Packaging</div>
                      <p className="cta-heading">Want custom packaging for<br/><span>your brand?</span></p>
                      <p className="cta-sub">Low minimums · Fast turnaround · Full customisation</p>
                    </div>
                    <div className="cta-card-bottom">
                      <Link href="/quote" className="cta-btn-primary">
                        <span>Get a Free Quote</span>
                        <span className="cta-arrow">→</span>
                      </Link>
                      <Link href="/contact" className="cta-btn-secondary">
                        ✉ Contact Us
                      </Link>
                    </div>
                  </div>
                )
              }
              const imgUrl = item.data.meta?.image?.url || item.data.gallery?.[0]?.image?.url
              return (
                <Link
                  key={String(item.data.id)}
                  href={`/products/${String(item.data.slug)}`}
                  className="product-card"
                >
                  <div className="product-img-wrap" style={{
                    background: imgUrl ? 'transparent' : BG_COLORS[item.ci]
                  }}>
                    {imgUrl
                      ? <img src={String(imgUrl)} alt={String(item.data.title)} />
                      : <div className="product-img-placeholder">📦</div>
                    }
                  </div>
                  <p className="product-name">{String(item.data.title)}</p>
                  <p className="product-desc">
                    {item.data.meta?.description ||
                     'Premium packaging solution — contact us for a free quote.'}
                  </p>
                </Link>
              )
            })
          )}
        </div>

      </section>

      {/* ══ FACTORY VIDEO SLIDER ════════════════════════ */}
      <FactorySlider />

      {/* ══ CLIENT REVIEWS ══════════════════════════════ */}
      <ReviewSection />

      {/* ══ FAQ ════════════════════════════════════════ */}
      <FAQSection />

      {/* ══ QUOTE FORM ══════════════════════════════════ */}
      <QuoteForm />

    </>
  )
}