/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { PriceCalculator } from '@/components/PriceCalculator'
import { RichText } from '@/components/RichText'

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const payload = await getPayload({ config: configPromise })
  const { slug } = await params

  const result = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  if (result.docs.length === 0) notFound()

  const product = result.docs[0] as any
  const imgUrl = product.meta?.image?.url
  const specs: { label: string; value: string }[] = product.specifications || []
  const pricing = product.quantityPricing || []
  const addons = product.addons || []
  const sizes = product.sizes || []

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
        @import url('https://fonts.googleapis.com/css2?family=Amaranth:wght@400;700&family=Arya:wght@400;700&family=Afacad:wght@400;500;600;700&display=swap');

        /* ✅ REMOVED: *, *::before, *::after global reset — was nuking navbar/cart padding */
        /* ✅ REMOVED: body { } override — was fighting globals.css */

        /* ── Breadcrumb ── */
        .breadcrumb { max-width: 1200px; margin: 40px auto 0; padding: 0 24px; display: flex; align-items: center; gap: 8px; font-size: 13px; color: #999; }
        .breadcrumb a { color: #999; text-decoration: none; }
        .breadcrumb a:hover { color: #1c1c1c; }
        .breadcrumb span { color: #1c1c1c; font-weight: 500; }

        /* ── Product Layout ── */
        .product-layout { max-width: 1200px; margin: 32px auto 0; padding: 0 24px; display: flex; flex-direction: column; gap: 60px; }

        /* ── Hero Grid ── */
        .hero-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 40px; align-items: start; }

        /* ── Image Side ── */
        .product-image-wrap { position: sticky; top: 120px; border-radius: 24px; overflow: hidden; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; border: 1.5px solid #e8e4d8; background: #fff; box-shadow: 0 10px 30px rgba(0,0,0,0.03); }
        .product-image-wrap img { width: 100%; height: 100%; object-fit: cover; }
        .product-img-placeholder { font-size: 80px; }

        /* ── Info Side ── */
        .product-info-top { display: flex; flex-direction: column; gap: 24px; }
        .product-category-badge { display: inline-flex; align-items: center; background: #f0f0eb; border-radius: 100px; padding: 5px 14px; font-size: 12px; font-weight: 600; color: #666; letter-spacing: 0.04em; text-transform: uppercase; width: fit-content; font-family: 'Arya', sans-serif; }
        .product-title { font-family: 'Amaranth', sans-serif; font-weight: 700; font-size: clamp(28px, 4vw, 42px); line-height: 1.1; color: #1c1c1c; }
        .product-short-description { font-family: 'Afacad', sans-serif; font-size: 18px; color: #666; line-height: 1.5; margin-top: -10px; max-width: 500px; }

        /* ── Details Grid ── */
        .details-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 60px; padding-top: 40px; border-top: 1.5px solid #eceae0; }
        .section-heading { font-family: 'Amaranth', sans-serif; font-size: 24px; color: #1c1c1c; margin-bottom: 24px; }
        .product-description { font-size: 16px; line-height: 1.8; color: #444; }

        /* ── Specs Table ── */
        .specs-section { background: #fff; border: 1.5px solid #e8e4d8; border-radius: 16px; overflow: hidden; }
        .spec-row { display: flex; padding: 14px 20px; border-bottom: 1px solid #f0ede4; }
        .spec-row:last-child { border-bottom: none; }
        .spec-label { font-family: 'Arya', sans-serif; font-size: 13px; font-weight: 600; color: #888; width: 130px; flex-shrink: 0; }
        .spec-value { font-size: 14px; color: #1c1c1c; flex: 1; }

        /* ── CTA Buttons ── */
        .cta-group { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 8px; }
        .btn-primary { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: #006838; color: #fff; font-family: 'Afacad', sans-serif; font-weight: 700; font-size: 16px; padding: 16px 32px; border-radius: 100px; text-decoration: none; transition: background 0.18s, transform 0.18s; border: none; cursor: pointer; }
        .btn-primary:hover { background: #004d2a; transform: translateY(-2px); }
        .btn-whatsapp { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: #25D366; color: #fff; font-family: 'Afacad', sans-serif; font-weight: 600; font-size: 16px; padding: 15px 28px; border-radius: 100px; text-decoration: none; transition: transform 0.18s; }
        .btn-whatsapp:hover { transform: translateY(-2px); filter: brightness(1.1); }

        /* ── Related Products ── */
        .related-section { max-width: 1200px; margin: 72px auto 80px; padding: 0 24px; }
        .related-title { font-family: 'Amaranth', sans-serif; font-weight: 700; font-size: 28px; margin-bottom: 28px; }
        .related-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .related-card { display: flex; flex-direction: column; text-decoration: none; color: #1c1c1c; border-radius: 16px; overflow: hidden; border: 1.5px solid #e8e4d8; background: #fff; transition: transform 0.2s, box-shadow 0.2s; }
        .related-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.08); }
        .related-img { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .related-img img { width: 100%; height: 100%; object-fit: cover; }
        .related-img-placeholder { font-size: 36px; }
        .related-info { padding: 12px 14px; border-top: 1.5px solid #e8e4d8; }
        .related-name { font-family: 'Amaranth', sans-serif; font-weight: 700; font-size: 14px; line-height: 1.3; }

        @media (max-width: 1000px) {
          .hero-grid, .details-grid { grid-template-columns: 1fr; gap: 32px; }
          .product-image-wrap { position: static; }
          .related-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .related-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .cta-group { flex-direction: column; }
          .btn-primary, .btn-whatsapp { text-align: center; justify-content: center; width: 100%; }
        }
      `}</style>

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

        {/* Top Hero Section: Image + Calculator */}
        <div className="hero-grid">
          {/* Image */}
          <div className="product-image-wrap" style={{ background: imgUrl ? 'transparent' : '#f0eaf5' }}>
            {imgUrl ? (
              <img src={String(imgUrl)} alt={String(product.title)} />
            ) : (
              <div className="product-img-placeholder">📦</div>
            )}
          </div>

          {/* Core Info & Calculator */}
          <div className="product-info-top">
            {product.categories?.[0] && (
              <span className="product-category-badge">
                {typeof product.categories[0] === 'object'
                  ? product.categories[0].title
                  : 'Packaging'}
              </span>
            )}

            <h1 className="product-title">{product.title}</h1>

            {product.shortDescription && (
              <p className="product-short-description">{product.shortDescription}</p>
            )}

            {pricing.length > 0 && (
              <PriceCalculator product={product} quantityPricing={pricing} addons={addons} />
            )}

            <div className="cta-group">
              <Link href="/#quote" className="btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                Get a Free Quote
              </Link>
              <a
                href="https://wa.me/17737292243"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.531 5.854L0 24l6.335-1.51C8.055 23.447 9.987 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.859 0-3.587-.5-5.077-1.371l-.361-.214-3.762.897.934-3.658-.235-.374C2.538 15.591 2 13.855 2 12 2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Details Section: Description + Specs */}
        <div className="details-grid">
          <div className="description-col">
            <h2 className="section-heading">Product Description</h2>
            {product.description ? (
              <div className="product-description">
                <RichText data={product.description} />
              </div>
            ) : product.meta?.description && (
              <p className="product-description">{product.meta.description}</p>
            )}
          </div>

          {specs.length > 0 && (
            <div className="specs-col">
              <h2 className="section-heading">Specifications</h2>
              <div className="specs-section">
                {specs.map((spec: any, i: number) => (
                  <div key={i} className="spec-row">
                    <span className="spec-label">{spec.label}</span>
                    <span className="spec-value">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
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