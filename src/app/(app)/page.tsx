/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export default async function HomePage({ searchParams }: { searchParams?: Promise<{ tab?: string }> }) {
  const payload = await getPayload({ config: configPromise })
  const resolvedParams = await (searchParams || Promise.resolve({}))
  const activeTab = resolvedParams?.tab || 'All Products'

  const categoriesData = await payload.find({ collection: 'categories', limit: 10 })
  const productsData = await payload.find({
    collection: 'products',
    limit: 16,
    where: { _status: { equals: 'published' } },
  })

  const categories = categoriesData.docs as any[]
  const products = productsData.docs as any[]

  // Group products by category slug for tab filtering
  const productsByCategory: Record<string, any[]> = { 'All Products': products }
  for (const cat of categories) {
    const catProducts = products.filter((p: any) =>
      p.categories?.some((c: any) =>
        (typeof c === 'object' ? c.slug : '') === cat.slug
      )
    )
    if (catProducts.length > 0) productsByCategory[cat.title] = catProducts
  }

  const placeholderCategories = [
    { id: 'p1', title: 'Custom Boxes', slug: 'custom-boxes' },
    { id: 'p2', title: 'Mylar Bags', slug: 'mylar-bags' },
    { id: 'p3', title: 'Kratom', slug: 'kratom' },
    { id: 'p4', title: 'Eco Packaging', slug: 'eco-packaging' },
    { id: 'p5', title: 'Dog Chews', slug: 'dog-chews' },
  ]

  const placeholderProducts = [
    { id: 'pp1', title: 'Ziplock Mylar Bags', slug: 'ziplock-mylar-bags', description: 'Premium mylar bags with a resealable zipper for secure and fresh storage.', bg: '#f5dde8' },
    { id: 'pp2', title: 'Display Boxes', slug: 'display-boxes', description: 'Premium mylar bags with a resealable zipper for secure and fresh storage.', bg: '#f0eaf5' },
    { id: 'pp3', title: 'Card Boxes', slug: 'card-boxes', description: 'Premium mylar bags with a resealable zipper for secure and fresh storage.', bg: '#f5f0e0' },
    { id: 'pp4', title: 'Ziplock Mylar Bags', slug: 'ziplock-mylar-bags-2', description: 'Premium mylar bags with a resealable zipper for secure and fresh storage.', bg: '#f0e8e0' },
    { id: 'pp5', title: 'Ziplock Mylar Bags', slug: 'ziplock-mylar-bags-3', description: 'Premium mylar bags with a resealable zipper for secure and fresh storage.', bg: '#e0edf5' },
    { id: 'pp6', title: 'Ziplock Mylar Bags', slug: 'ziplock-mylar-bags-4', description: 'Premium mylar bags with a resealable zipper for secure and fresh storage.', bg: '#e0edf5' },
    { id: 'pp7', title: 'Ziplock Mylar Bags', slug: 'ziplock-mylar-bags-5', description: 'Premium mylar bags with a resealable zipper for secure and fresh storage.', bg: '#e0edf5' },
    { id: 'pp8', title: 'Ziplock Mylar Bags', slug: 'ziplock-mylar-bags-6', description: 'Premium mylar bags with a resealable zipper for secure and fresh storage.', bg: '#e0edf5' },
  ]

  const displayCategories = categories.length > 0 ? categories : placeholderCategories
  const displayProducts = products.length > 0 ? products : placeholderProducts

  const tabFilters = ["All Products", "Mylar Bags", "CBD Packaging Boxes", "Food Boxes", "Retail Packaging Boxes", "Display Packaging Boxes", "Vape Boxes"]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html, body {
          font-family: 'DM Sans', sans-serif;
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
        .nav-logo-wordmark { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 22px; color: #f0bc2e; letter-spacing: -0.5px; line-height: 1; }
        .nav-links { display: flex; align-items: center; gap: 2px; list-style: none; flex: 1; justify-content: center; }
        .nav-links li a { display: block; text-decoration: none; color: #1c1c1c; font-size: 15px; font-weight: 500; padding: 8px 16px; border-radius: 100px; transition: background 0.18s; white-space: nowrap; }
        .nav-links li a:hover { background: rgba(0,0,0,0.05); }
        .nav-cta { flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; background: #f0bc2e; color: #1c1c1c; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 15px; padding: 11px 26px; border-radius: 100px; text-decoration: none; transition: background 0.18s, transform 0.18s; white-space: nowrap; }
        .nav-cta:hover { background: #e6b020; transform: translateY(-1px); }
        .nav-hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 6px; border: none; background: none; }
        .nav-hamburger span { display: block; width: 22px; height: 2px; background: #1c1c1c; border-radius: 2px; }

        /* ══════════════════════════════════════
           HERO SLOT
        ══════════════════════════════════════ */
        .hero-wrap { position: relative; width: 100%; margin-top: 24px; }
        .hero-slot { width: 100%; min-height: 420px; background: #FCFBF7; overflow: hidden; }
        .hero-slot img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .hero-placeholder { min-height: 420px; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 12px; color: #bbb; font-size: 15px; }
        .hero-cta-wrap { position: absolute; bottom: -22px; left: 50%; transform: translateX(-50%); z-index: 10; }
        .hero-cta { display: inline-flex; align-items: center; justify-content: center; background: #f0bc2e; color: #1c1c1c; font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 16px; padding: 14px 44px; border-radius: 100px; text-decoration: none; box-shadow: 0 6px 24px rgba(240,188,46,0.4); transition: background 0.18s, transform 0.2s; white-space: nowrap; }
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
        .cat-label { font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; color: #1c1c1c; text-align: center; }
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
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(22px, 3vw, 30px);
          color: #1c1c1c;
          letter-spacing: -0.5px;
          margin-bottom: 10px;
        }

        .explore-subtitle {
          font-size: 14px;
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
          margin-bottom: 36px;
          border-bottom: 2px solid #e8e4dc;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          margin-bottom: 36px;
        }

        .filter-tab {
          padding: 10px 28px;
          font-family: 'DM Sans', sans-serif;
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
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #1c1c1c;
          margin-bottom: 6px;
          line-height: 1.3;
        }

        .product-desc {
          font-size: 13px;
          color: #888;
          line-height: 1.55;
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
                  fontFamily="Syne, sans-serif" fontWeight="900" fontSize="15" fill="#1c1c1c">ops</text>
              </svg>
            </div>
            <span className="nav-logo-wordmark">ops</span>
          </Link>

          <ul className="nav-links">
            {[
              ['Home','/'],
              ['Custom Boxes','/products?category=retail-packaging-boxes'],
              ['Mylar Bags','/products?category=mylar-bags'],
              ['Vape Boxes','/products?category=vape-packaging-boxes'],
              ['All Products','/products'],
            ].map(([label,href])=>(
              <li key={label}><Link href={href}>{label}</Link></li>
            ))}
          </ul>

          <Link href="/quote" className="nav-cta">Get Quote</Link>
          <button className="nav-hamburger" aria-label="Open menu"><span/><span/><span/></button>
        </nav>
      </div>

      {/* ══ HERO IMAGE SLOT ═════════════════════════════ */}
      <div className="hero-wrap">
        <div className="hero-slot">
          {/* Replace with: <img src="/images/hero.jpg" alt="hero" /> */}
          <div className="hero-placeholder">
            <span style={{fontSize:'48px'}}>🖼️</span>
            <span>Your hero image goes here</span>
          </div>
        </div>
        <div className="hero-cta-wrap">
          <Link href="/quote" className="hero-cta">Get Quote</Link>
        </div>
      </div>

      {/* ══ CATEGORIES ARC ══════════════════════════════ */}
      <div className="categories-section">
        <div className="categories-row">
          {displayCategories.slice(0,5).map((cat:any)=>(
            <Link key={String(cat.id)} href={`/products?category=${String(cat.slug)}`} className="cat-item">
              <div className="cat-circle">
                {cat.image?.url ? <img src={String(cat.image.url)} alt={String(cat.title)}/> :
                 cat.img ? <img src={String(cat.img)} alt={String(cat.title)}/> :
                 <span className="cat-placeholder">📦</span>}
              </div>
              <span className="cat-label">{String(cat.title)}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ══ EXPLORE BY CATEGORY ═════════════════════════ */}
      <section className="explore-section">

        <div className="explore-header">
          <h2 className="explore-title">Explore By Category</h2>
          <p className="explore-subtitle">
            Find the perfect packaging solution designed to protect<br/>
            your product and elevate your brand.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="filter-tabs">
          {tabFilters.map((tab) => (
            <Link
              key={tab}
              href={tab === 'All Products' ? '/' : `/?tab=${encodeURIComponent(tab)}`}
              className={`filter-tab${activeTab === tab ? ' active' : ''}`}
            >
              {tab}
            </Link>
          ))}
        </div>

        {/* Product grid */}
        <div className="product-grid">
          {(productsByCategory[activeTab] || productsByCategory['All Products']).map((product: any) => (
            <Link
              key={String(product.id)}
              href={`/products/${String(product.slug)}`}
              className="product-card"
            >
              <div className="product-img-wrap" style={{
                background: product.bg || (
                  product.meta?.image?.url ? 'transparent' :
                  ['#f5dde8','#f0eaf5','#f5f0e0','#f0e8e0','#e0edf5','#e8f0e0','#f5e8e0','#e0e8f5'][
                    Math.abs(String(product.id).charCodeAt(0)) % 8
                  ]
                )
              }}>
                {product.meta?.image?.url ? (
                  <img src={String(product.meta.image.url)} alt={String(product.title)} />
                ) : (
                  <div className="product-img-placeholder">📦</div>
                )}
              </div>
              <p className="product-name">{String(product.title)}</p>
              <p className="product-desc">
                {product.meta?.description ||
                 'Premium packaging with a resealable zipper for secure and fresh storage.'}
              </p>
            </Link>
          ))}
        </div>

      </section>

    </>
  )
}