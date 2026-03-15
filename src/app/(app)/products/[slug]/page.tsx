import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { PriceCalculator } from '@/components/PriceCalculator'
import { RichText } from '@/components/RichText'
import { generateMeta } from '@/utilities/generateMeta'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  return generateMeta({ doc: result.docs?.[0] as any })
}

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
        @import url('https://fonts.googleapis.com/css2?family=Amaranth:wght@400;700&family=Arya:wght@400;700&family=Afacad:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');

        .pdp-page { background: #F3F3F3; min-height: 100vh; }

        /* ── Breadcrumb ── */
        .pdp-breadcrumb { max-width: 1280px; margin: 0 auto; padding: 32px 32px 0; display: flex; align-items: center; gap: 6px; font-size: 13px; color: #999; font-family: 'Afacad', sans-serif; }
        .pdp-breadcrumb a { color: #999; text-decoration: none; transition: color 0.2s; }
        .pdp-breadcrumb a:hover { color: #8ca62d; }
        .pdp-breadcrumb .sep { color: #ccc; }
        .pdp-breadcrumb .current { color: #1c1c1c; font-weight: 600; }

        /* ── HERO ── */
        .pdp-hero { max-width: 1280px; margin: 28px auto 0; padding: 0 32px; display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; }

        /* Image panel */
        .pdp-image-panel { position: sticky; top: 90px; }
        .pdp-image-main { background: #fff; border-radius: 24px; overflow: hidden; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; border: 1.5px solid #e8e8e0; position: relative; }
        .pdp-image-main::before, .pdp-image-main::after { content: ''; position: absolute; width: 20px; height: 20px; border-color: #8ca62d; border-style: solid; opacity: 0.4; }
        .pdp-image-main::before { top: 12px; left: 12px; border-width: 2px 0 0 2px; }
        .pdp-image-main::after { bottom: 12px; right: 12px; border-width: 0 2px 2px 0; }
        .pdp-image-main img { width: 85%; height: 85%; object-fit: contain; }
        .pdp-image-placeholder { font-size: 80px; }

        /* Trust strip */
        .pdp-trust-strip { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 16px; }
        .pdp-trust-badge { background: #fff; border: 1.5px solid #e8e8e0; border-radius: 12px; padding: 12px 10px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 6px; }
        .pdp-trust-icon { font-size: 20px; line-height: 1; }
        .pdp-trust-label { font-family: 'Afacad', sans-serif; font-size: 11px; font-weight: 600; color: #555; line-height: 1.3; }

        /* Info panel */
        .pdp-info-panel { display: flex; flex-direction: column; gap: 28px; padding-bottom: 60px; }

        .pdp-category-tag { display: inline-flex; align-items: center; gap: 6px; background: #efffe5; border: 1px solid #c8e6a0; border-radius: 100px; padding: 5px 14px; font-family: 'Arya', sans-serif; font-size: 11px; font-weight: 700; color: #5a7a1a; letter-spacing: 0.08em; text-transform: uppercase; width: fit-content; }
        .pdp-category-dot { width: 6px; height: 6px; background: #8ca62d; border-radius: 50%; flex-shrink: 0; }

        .pdp-title { font-family: 'Amaranth', sans-serif; font-weight: 700; font-size: clamp(30px, 3.5vw, 48px); line-height: 1.1; color: #1c1c1c; letter-spacing: -0.02em; }

        .pdp-short-desc { font-family: 'Afacad', sans-serif; font-size: 17px; color: #666; line-height: 1.6; border-left: 3px solid #8ca62d; padding-left: 16px; }

        .pdp-features { display: flex; flex-wrap: wrap; gap: 8px; }
        .pdp-feature-pill { display: inline-flex; align-items: center; gap: 6px; background: #fff; border: 1.5px solid #e8e8e0; border-radius: 100px; padding: 6px 14px; font-family: 'Afacad', sans-serif; font-size: 13px; font-weight: 600; color: #444; }

        /* Calculator */
        .pdp-calculator-wrap { background: #fff; border: 1.5px solid #e8e8e0; border-radius: 20px; overflow: hidden; }
        .pdp-calculator-header { background: #EFFFE5; padding: 16px 24px; display: flex; align-items: center; gap: 10px; border-bottom: 1.5px solid #c8e6a0; }
        .pdp-calculator-header-icon { width: 32px; height: 32px; background: #8ca62d; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .pdp-calculator-header-text h3 { font-family: 'Amaranth', sans-serif; font-size: 16px; font-weight: 700; color: #1c1c1c; margin: 0; }
        .pdp-calculator-header-text p { font-family: 'Afacad', sans-serif; font-size: 12px; color: #5a7a1a; margin: 0; }
        .pdp-calculator-body { padding: 24px; }

        /* CTAs */
        .pdp-cta-group { display: flex; flex-direction: column; gap: 12px; }
        .pdp-btn-primary { display: flex; align-items: center; justify-content: center; gap: 10px; background: #8ca62d; color: #fff; font-family: 'Afacad', sans-serif; font-weight: 700; font-size: 17px; padding: 18px 32px; border-radius: 100px; text-decoration: none; transition: background 0.2s, transform 0.2s; width: 100%; border: none; cursor: pointer; }
        .pdp-btn-primary:hover { background: #7b9426; transform: translateY(-1px); }
        .pdp-btn-secondary { display: flex; align-items: center; justify-content: center; gap: 10px; font-family: 'Afacad', sans-serif; font-weight: 700; font-size: 15px; padding: 15px 24px; border-radius: 100px; text-decoration: none; transition: all 0.2s; }
        .pdp-btn-call { background: #f8f8f4; color: #444; border: 1.5px solid #e0e0d8; }
        .pdp-btn-call:hover { background: #1c1c1c; color: #fff; border-color: #1c1c1c; }
        .pdp-btn-whatsapp { background: #efffe5; color: #2a5c0a; border: 1.5px solid #c8e6a0; }
        .pdp-btn-whatsapp:hover { background: #25D366; color: #fff; border-color: #25D366; }
        .pdp-btn-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

        /* Reassurance */
        .pdp-reassurance { display: flex; align-items: center; justify-content: center; gap: 20px; padding: 16px 20px; background: #f8f8f4; border: 1.5px solid #e8e8e0; border-radius: 14px; flex-wrap: wrap; }
        .pdp-reassurance-item { display: flex; align-items: center; gap: 6px; font-family: 'Afacad', sans-serif; font-size: 13px; font-weight: 600; color: #555; }
        .pdp-reassurance-dot { width: 4px; height: 4px; background: #ccc; border-radius: 50%; flex-shrink: 0; }

        /* ── Process strip ── */
        .pdp-process-strip { max-width: 1280px; margin: 60px auto 0; padding: 0 32px; }
        .pdp-process-inner { background: #EFFFE5; border: 1.5px solid #c8e6a0; border-radius: 24px; padding: 40px 48px; display: grid; grid-template-columns: auto 1fr; gap: 48px; align-items: center; }
        .pdp-process-heading { font-family: 'Amaranth', sans-serif; font-size: 28px; font-weight: 700; color: #1c1c1c; line-height: 1.2; white-space: nowrap; }
        .pdp-process-heading span { color: #8ca62d; }
        .pdp-process-steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; position: relative; }
        .pdp-process-step { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 16px 12px; border-radius: 14px; text-align: center; position: relative; }
        .pdp-process-step-num { width: 36px; height: 36px; background: #8ca62d; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Amaranth', sans-serif; font-size: 16px; font-weight: 700; color: #fff; flex-shrink: 0; }
        .pdp-process-step-title { font-family: 'Afacad', sans-serif; font-size: 13px; font-weight: 700; color: #1c1c1c; line-height: 1.3; }
        .pdp-process-step-desc { font-family: 'Afacad', sans-serif; font-size: 12px; color: #5a7a1a; line-height: 1.4; }
        .pdp-process-step:not(:last-child)::after { content: '→'; position: absolute; right: -10px; top: 24px; color: #8ca62d; font-size: 16px; }

        /* ── Details ── */
        .pdp-details { max-width: 1280px; margin: 60px auto 0; padding: 0 32px; display: grid; grid-template-columns: 1.3fr 0.7fr; gap: 48px; }
        .pdp-section-label { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
        .pdp-section-label-line { width: 32px; height: 3px; background: #8ca62d; border-radius: 2px; flex-shrink: 0; }
        .pdp-section-label h2 { font-family: 'Amaranth', sans-serif; font-size: 22px; font-weight: 700; color: #1c1c1c; margin: 0; }
        .pdp-description-text { font-family: 'Afacad', sans-serif; font-size: 16px; line-height: 1.85; color: #555; }
        .pdp-specs-card { background: #fff; border: 1.5px solid #e8e8e0; border-radius: 20px; overflow: hidden; }
        .pdp-specs-card-header { padding: 16px 20px; background: #f8f8f4; border-bottom: 1.5px solid #e8e8e0; }
        .pdp-specs-card-header h3 { font-family: 'Amaranth', sans-serif; font-size: 16px; font-weight: 700; color: #1c1c1c; margin: 0; }
        .pdp-spec-row { display: flex; align-items: center; padding: 13px 20px; border-bottom: 1px solid #f0f0ea; gap: 12px; }
        .pdp-spec-row:last-child { border-bottom: none; }
        .pdp-spec-label { font-family: 'Arya', sans-serif; font-size: 12px; font-weight: 700; color: #999; text-transform: uppercase; letter-spacing: 0.05em; width: 120px; flex-shrink: 0; }
        .pdp-spec-value { font-family: 'Afacad', sans-serif; font-size: 14px; color: #1c1c1c; font-weight: 600; flex: 1; }

        /* ── Related ── */
        .pdp-related { max-width: 1280px; margin: 60px auto 80px; padding: 0 32px; }
        .pdp-related-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 24px; }
        .pdp-related-card { display: flex; flex-direction: column; text-decoration: none; color: #1c1c1c; border-radius: 16px; overflow: hidden; border: 1.5px solid #e8e8e0; background: #fff; transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s; }
        .pdp-related-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.08); border-color: #8ca62d; }
        .pdp-related-img { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .pdp-related-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
        .pdp-related-card:hover .pdp-related-img img { transform: scale(1.05); }
        .pdp-related-info { padding: 14px 16px 16px; border-top: 1.5px solid #e8e8e0; display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        .pdp-related-name { font-family: 'Amaranth', sans-serif; font-weight: 700; font-size: 14px; line-height: 1.3; color: #1c1c1c; }
        .pdp-related-arrow { width: 28px; height: 28px; background: #f3f3f3; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.2s, color 0.2s; }
        .pdp-related-card:hover .pdp-related-arrow { background: #8ca62d; color: #fff; }

        /* ── Responsive ── */
        @media (max-width: 1100px) {
          .pdp-hero { grid-template-columns: 1fr; gap: 32px; }
          .pdp-image-panel { position: static; }
          .pdp-image-main { max-width: 480px; margin: 0 auto; }
          .pdp-trust-strip { max-width: 480px; margin: 16px auto 0; }
          .pdp-details { grid-template-columns: 1fr; gap: 32px; }
          .pdp-process-inner { grid-template-columns: 1fr; gap: 32px; }
          .pdp-process-heading { white-space: normal; }
          .pdp-process-steps { grid-template-columns: repeat(2, 1fr); }
          .pdp-process-step:not(:last-child)::after { display: none; }
          .pdp-related-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .pdp-hero, .pdp-details, .pdp-process-strip, .pdp-related { padding: 0 16px; }
          .pdp-breadcrumb { padding: 24px 16px 0; }
          .pdp-btn-row { grid-template-columns: 1fr; }
          .pdp-process-inner { padding: 28px 24px; }
        }
      `}</style>

      <div className="pdp-page">

        {/* Breadcrumb */}
        <div className="pdp-breadcrumb">
          <Link href="/">Home</Link>
          <span className="sep">›</span>
          <Link href="/products">Products</Link>
          {product.categories?.[0] && (
            <>
              <span className="sep">›</span>
              <Link href={`/products?category=${typeof product.categories[0] === 'object' ? product.categories[0].slug : ''}`}>
                {typeof product.categories[0] === 'object' ? product.categories[0].title : 'Category'}
              </Link>
            </>
          )}
          <span className="sep">›</span>
          <span className="current">{product.title}</span>
        </div>

        {/* Hero */}
        <div className="pdp-hero">

          {/* Image */}
          <div className="pdp-image-panel">
            <div className="pdp-image-main">
              {imgUrl ? (
                <img src={String(imgUrl)} alt={String(product.title)} />
              ) : (
                <div className="pdp-image-placeholder">📦</div>
              )}
            </div>
            <div className="pdp-trust-strip">
              {[
                { icon: '🎨', label: 'Design Support' },
                { icon: '📦', label: 'Samples' },
                { icon: '⚡', label: 'Fast Turnaround' },
              ].map((b) => (
                <div key={b.label} className="pdp-trust-badge">
                  <span className="pdp-trust-icon">{b.icon}</span>
                  <span className="pdp-trust-label">{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="pdp-info-panel">

            {product.categories?.[0] && (
              <div className="pdp-category-tag">
                <span className="pdp-category-dot" />
                {typeof product.categories[0] === 'object' ? product.categories[0].title : 'Packaging'}
              </div>
            )}

            <h1 className="pdp-title">{product.title}</h1>

            {product.shortDescription && (
              <p className="pdp-short-desc">{product.shortDescription}</p>
            )}

            <div className="pdp-features">
              {['Custom Sizes', 'Full Color Print', 'Low MOQ', 'Bulk Discounts'].map((f) => (
                <span key={f} className="pdp-feature-pill">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="#8ca62d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {f}
                </span>
              ))}
            </div>

            {pricing.length > 0 && (
              <div className="pdp-calculator-wrap">
                <div className="pdp-calculator-header">
                  <div className="pdp-calculator-header-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                      <rect x="4" y="2" width="16" height="20" rx="2"/>
                      <line x1="8" y1="10" x2="16" y2="10"/>
                      <line x1="8" y1="14" x2="16" y2="14"/>
                      <line x1="8" y1="18" x2="12" y2="18"/>
                    </svg>
                  </div>
                  <div className="pdp-calculator-header-text">
                    <h3>Instant Price Calculator</h3>
                    <p>Select quantity &amp; options to get your price</p>
                  </div>
                </div>
                <div className="pdp-calculator-body">
                  <PriceCalculator product={product} quantityPricing={pricing} addons={addons} />
                </div>
              </div>
            )}

            <div className="pdp-cta-group">
              <Link href="/#quote" className="pdp-btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                Get a Free Quote
              </Link>
              <div className="pdp-btn-row">
                <a href="tel:5592057588" className="pdp-btn-secondary pdp-btn-call">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.12 6.12l.87-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  Call Us
                </a>
                <a href="https://wa.me/17737292243" target="_blank" rel="noopener noreferrer" className="pdp-btn-secondary pdp-btn-whatsapp">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.531 5.854L0 24l6.335-1.51C8.055 23.447 9.987 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.859 0-3.587-.5-5.077-1.371l-.361-.214-3.762.897.934-3.658-.235-.374C2.538 15.591 2 13.855 2 12 2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>

            <div className="pdp-reassurance">
              <span className="pdp-reassurance-item">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8ca62d" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                No Hidden Fees
              </span>
              <span className="pdp-reassurance-dot" />
              <span className="pdp-reassurance-item">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8ca62d" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Free Proof Before Print
              </span>
              <span className="pdp-reassurance-dot" />
              <span className="pdp-reassurance-item">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8ca62d" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Ships in 5–8 Days
              </span>
            </div>

          </div>
        </div>

        {/* Process Strip */}
        <div className="pdp-process-strip">
          <div className="pdp-process-inner">
            <div className="pdp-process-heading">How It<br /><span>Works</span></div>
            <div className="pdp-process-steps">
              {[
                { num: '1', title: 'Get a Quote', desc: 'Fill our form or call us' },
                { num: '2', title: 'Approve Design', desc: 'Free digital proof sent' },
                { num: '3', title: 'We Print', desc: 'Production starts immediately' },
                { num: '4', title: 'Fast Delivery', desc: 'Shipped to your door' },
              ].map((step) => (
                <div key={step.num} className="pdp-process-step">
                  <div className="pdp-process-step-num">{step.num}</div>
                  <div className="pdp-process-step-title">{step.title}</div>
                  <div className="pdp-process-step-desc">{step.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description + Specs */}
        <div className="pdp-details">
          <div>
            <div className="pdp-section-label">
              <div className="pdp-section-label-line" />
              <h2>Product Description</h2>
            </div>
            {product.description ? (
              <div className="pdp-description-text"><RichText data={product.description} /></div>
            ) : product.meta?.description ? (
              <p className="pdp-description-text">{product.meta.description}</p>
            ) : null}
          </div>

          {specs.length > 0 && (
            <div>
              <div className="pdp-section-label">
                <div className="pdp-section-label-line" />
                <h2>Specifications</h2>
              </div>
              <div className="pdp-specs-card">
                <div className="pdp-specs-card-header"><h3>Product Details</h3></div>
                {specs.map((spec: any, i: number) => (
                  <div key={i} className="pdp-spec-row">
                    <span className="pdp-spec-label">{spec.label}</span>
                    <span className="pdp-spec-value">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="pdp-related">
            <div className="pdp-section-label">
              <div className="pdp-section-label-line" />
              <h2>Related Products</h2>
            </div>
            <div className="pdp-related-grid">
              {relatedProducts.map((rp: any, i: number) => {
                const rImgUrl = rp.meta?.image?.url
                return (
                  <Link key={String(rp.id)} href={`/products/${String(rp.slug)}`} className="pdp-related-card">
                    <div className="pdp-related-img" style={{ background: rImgUrl ? 'transparent' : BG_COLORS[i % BG_COLORS.length] }}>
                      {rImgUrl ? <img src={String(rImgUrl)} alt={String(rp.title)} /> : <div style={{ fontSize: 36 }}>📦</div>}
                    </div>
                    <div className="pdp-related-info">
                      <p className="pdp-related-name">{rp.title}</p>
                      <div className="pdp-related-arrow">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

      </div>
    </>
  )
}