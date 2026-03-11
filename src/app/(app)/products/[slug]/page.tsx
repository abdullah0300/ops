/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const payload = await getPayload({ config: configPromise })
  const { slug } = await params

  // Fetch real categories for navbar
  const categoriesData = await payload.find({
    collection: 'categories',
    limit: 20,
    depth: 0,
  })
  const navCategories = (categoriesData.docs as any[]).slice(0, 4)

  const result = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  if (result.docs.length === 0) notFound()

  const product = result.docs[0] as any
  const imgUrl = product.meta?.image?.url
  const specs: { label: string; value: string }[] = product.specifications || []
  const pricing: { quantity: number; price: number }[] = product.quantityPricing || []

  // Get related products from same category
  const catId = product.categories?.[0]?.id || product.categories?.[0]
  let relatedProducts: any[] = []
  if (catId) {
    const relatedData = await payload.find({
      collection: 'products',
      where: {
        _status: { equals: 'published' },
        categories: { in: [catId] },
        slug: { not_equals: slug },
      },
      limit: 4,
    })
    relatedProducts = relatedData.docs as any[]
  }

  const BG_COLORS = ['#f5dde8','#f0eaf5','#f5f0e0','#f0e8e0','#e0edf5','#e8f0e0','#f5e8e0','#e0e8f5']

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #FCFBF7; font-family: 'DM Sans', sans-serif; color: #1c1c1c; }

        /* ── Navbar ───────────────────── */
        .nav-outer { padding: 20px 24px 0; max-width: 1200px; margin: 0 auto; }
        .navbar { display: flex; align-items: center; gap: 20px; background: #FCFBF7; border: 1.5px solid #1c1c1c; border-radius: 100px; padding: 10px 16px 10px 14px; }
        .nav-logo { display: flex; align-items: center; gap: 6px; text-decoration: none; flex-shrink: 0; }
        .nav-logo-wordmark { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 22px; color: #f0bc2e; letter-spacing: -0.5px; }
        .nav-links { display: flex; align-items: center; gap: 2px; list-style: none; flex: 1; justify-content: center; }
        .nav-links li a { display: block; text-decoration: none; color: #1c1c1c; font-size: 15px; font-weight: 500; padding: 8px 16px; border-radius: 100px; transition: background 0.18s; white-space: nowrap; }
        .nav-links li a:hover { background: rgba(0,0,0,0.07); }
        .nav-cta { flex-shrink: 0; display: inline-flex; align-items: center; background: #f0bc2e; color: #1c1c1c; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 15px; padding: 11px 26px; border-radius: 100px; text-decoration: none; transition: background 0.18s; white-space: nowrap; }
        .nav-cta:hover { background: #e6b020; }

        /* ── Breadcrumb ──────────────── */
        .breadcrumb { max-width: 1200px; margin: 28px auto 0; padding: 0 24px; display: flex; align-items: center; gap: 8px; font-size: 13px; color: #999; }
        .breadcrumb a { color: #999; text-decoration: none; }
        .breadcrumb a:hover { color: #1c1c1c; }
        .breadcrumb span { color: #1c1c1c; font-weight: 500; }

        /* ── Product Layout ──────────── */
        .product-layout { max-width: 1200px; margin: 32px auto 0; padding: 0 24px; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start; }

        /* ── Image Side ──────────────── */
        .product-image-wrap { border-radius: 24px; overflow: hidden; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; border: 1.5px solid #e8e4d8; }
        .product-image-wrap img { width: 100%; height: 100%; object-fit: cover; }
        .product-img-placeholder { font-size: 80px; }

        /* ── Info Side ───────────────── */
        .product-info { display: flex; flex-direction: column; gap: 24px; }
        .product-category-badge { display: inline-flex; align-items: center; background: #f0f0eb; border-radius: 100px; padding: 5px 14px; font-size: 12px; font-weight: 600; color: #666; letter-spacing: 0.04em; text-transform: uppercase; width: fit-content; }
        .product-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: clamp(28px, 4vw, 42px); line-height: 1.1; color: #1c1c1c; }
        .product-description { font-size: 15px; line-height: 1.7; color: #555; }

        /* ── Specs Table ─────────────── */
        .specs-section { background: #fff; border: 1.5px solid #e8e4d8; border-radius: 16px; overflow: hidden; }
        .specs-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: #999; padding: 14px 18px; border-bottom: 1.5px solid #e8e4d8; }
        .spec-row { display: flex; padding: 12px 18px; border-bottom: 1px solid #f0ede4; }
        .spec-row:last-child { border-bottom: none; }
        .spec-label { font-size: 13px; font-weight: 600; color: #888; width: 130px; flex-shrink: 0; }
        .spec-value { font-size: 13px; color: #1c1c1c; flex: 1; }

        /* ── Pricing Table ───────────── */
        .pricing-section { background: #fff; border: 1.5px solid #e8e4d8; border-radius: 16px; overflow: hidden; }
        .pricing-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: #999; padding: 14px 18px; border-bottom: 1.5px solid #e8e4d8; }
        .pricing-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 1px; background: #e8e4d8; }
        .pricing-cell { background: #fff; padding: 14px; text-align: center; }
        .pricing-qty { font-size: 12px; color: #888; font-weight: 600; margin-bottom: 4px; }
        .pricing-price { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: #1c1c1c; }

        /* ── CTA Buttons ─────────────── */
        .cta-group { display: flex; gap: 12px; flex-wrap: wrap; }
        .btn-primary { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: #f0bc2e; color: #1c1c1c; font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 16px; padding: 16px 32px; border-radius: 100px; text-decoration: none; transition: background 0.18s, transform 0.18s; border: none; cursor: pointer; }
        .btn-primary:hover { background: #e6b020; transform: translateY(-2px); }
        .btn-secondary { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: transparent; color: #1c1c1c; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 16px; padding: 15px 28px; border-radius: 100px; text-decoration: none; border: 1.5px solid #1c1c1c; transition: background 0.18s; }
        .btn-secondary:hover { background: rgba(0,0,0,0.05); }

        /* ── Related Products ─────────── */
        .related-section { max-width: 1200px; margin: 72px auto 80px; padding: 0 24px; }
        .related-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 28px; margin-bottom: 28px; }
        .related-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .related-card { display: flex; flex-direction: column; text-decoration: none; color: #1c1c1c; border-radius: 16px; overflow: hidden; border: 1.5px solid #e8e4d8; background: #fff; transition: transform 0.2s, box-shadow 0.2s; }
        .related-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.08); }
        .related-img { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .related-img img { width: 100%; height: 100%; object-fit: cover; }
        .related-img-placeholder { font-size: 36px; }
        .related-info { padding: 12px 14px; border-top: 1.5px solid #e8e4d8; }
        .related-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 13px; line-height: 1.3; }

        @media (max-width: 900px) {
          .product-layout { grid-template-columns: 1fr; gap: 32px; }
          .related-grid { grid-template-columns: repeat(2, 1fr); }
          .nav-links { display: none; }
        }
        @media (max-width: 640px) {
          .related-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .cta-group { flex-direction: column; }
          .btn-primary, .btn-secondary { text-align: center; justify-content: center; }
        }
      `}</style>

      {/* Navbar */}
      <div className="nav-outer">
        <nav className="navbar">
          <Link href="/" className="nav-logo">
            <div style={{width:38,height:38}}>
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="38" height="38">
                <rect x="1" y="1" width="38" height="38" rx="9" fill="#F0BC2E"/>
                <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle"
                  fontFamily="Syne, sans-serif" fontWeight="900" fontSize="15" fill="#1c1c1c">ops</text>
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
        </nav>
      </div>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span>›</span>
        <Link href="/products">Products</Link>
        {product.categories?.[0] && (
          <>
            <span>›</span>
            <Link href={`/products?category=${
              typeof product.categories[0] === 'object'
                ? product.categories[0].slug
                : ''
            }`}>
              {typeof product.categories[0] === 'object'
                ? product.categories[0].title
                : 'Category'}
            </Link>
          </>
        )}
        <span>›</span>
        <span>{product.title}</span>
      </div>

      {/* Product Layout */}
      <div className="product-layout">

        {/* Image */}
        <div className="product-image-wrap" style={{ background: imgUrl ? 'transparent' : '#f0eaf5' }}>
          {imgUrl ? (
            <img src={String(imgUrl)} alt={String(product.title)} />
          ) : (
            <div className="product-img-placeholder">📦</div>
          )}
        </div>

        {/* Info */}
        <div className="product-info">
          {product.categories?.[0] && (
            <span className="product-category-badge">
              {typeof product.categories[0] === 'object'
                ? product.categories[0].title
                : 'Packaging'}
            </span>
          )}

          <h1 className="product-title">{product.title}</h1>

          {product.meta?.description && (
            <p className="product-description">{product.meta.description}</p>
          )}

          {/* Specifications */}
          {specs.length > 0 && (
            <div className="specs-section">
              <p className="specs-title">Specifications</p>
              {specs.map((spec: any, i: number) => (
                <div key={i} className="spec-row">
                  <span className="spec-label">{spec.label}</span>
                  <span className="spec-value">{spec.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Quantity Pricing */}
          {pricing.length > 0 && (
            <div className="pricing-section">
              <p className="pricing-title">Quantity Pricing</p>
              <div className="pricing-grid">
                {pricing.map((row: any, i: number) => (
                  <div key={i} className="pricing-cell">
                    <p className="pricing-qty">{row.quantity}+</p>
                    <p className="pricing-price">${row.price}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="cta-group">
            <a
              href={`mailto:sales@onlinepackagingstore.com?subject=Quote Request: ${encodeURIComponent(product.title)}`}
              className="btn-primary"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              Get a Free Quote
            </a>
            <a
              href="https://wa.me/15592057588"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.531 5.854L0 24l6.335-1.51C8.055 23.447 9.987 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.859 0-3.587-.5-5.077-1.371l-.361-.214-3.762.897.934-3.658-.235-.374C2.538 15.591 2 13.855 2 12 2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              WhatsApp Us
            </a>
          </div>

        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="related-section">
          <h2 className="related-title">Related Products</h2>
          <div className="related-grid">
            {relatedProducts.map((rp: any, i: number) => {
              const rImgUrl = rp.meta?.image?.url
              return (
                <Link
                  key={String(rp.id)}
                  href={`/products/${String(rp.slug)}`}
                  className="related-card"
                >
                  <div className="related-img" style={{ background: rImgUrl ? 'transparent' : BG_COLORS[i % BG_COLORS.length] }}>
                    {rImgUrl ? (
                      <img src={String(rImgUrl)} alt={String(rp.title)} />
                    ) : (
                      <div className="related-img-placeholder">📦</div>
                    )}
                  </div>
                  <div className="related-info">
                    <p className="related-name">{rp.title}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}