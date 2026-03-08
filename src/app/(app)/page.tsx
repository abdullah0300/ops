import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })

  const categoriesData = await payload.find({
    collection: 'categories',
    limit: 6,
  })

  const productsData = await payload.find({
    collection: 'products',
    limit: 8,
    where: { _status: { equals: 'published' } },
  })

  const categories = categoriesData.docs
  const products = productsData.docs

  return (
    <main style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", color: '#1a1a2e' }}>

      {/* ─── HEADER ─────────────────────────────────────────── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e8e8f0',
        padding: '0 5%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '72px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', background: '#1a1a2e',
            borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <span style={{ color: '#c8a96e', fontSize: '18px', fontWeight: 800 }}>P</span>
          </div>
          <span style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.5px' }}>PrintCo</span>
        </div>
        <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          {['Products', 'Categories', 'About', 'Blog'].map(item => (
            <Link key={item} href={`/${item.toLowerCase()}`} style={{
              textDecoration: 'none', color: '#444', fontSize: '15px',
              fontWeight: 500, transition: 'color 0.2s',
            }}>{item}</Link>
          ))}
        </nav>
        <Link href="/quote" style={{
          background: '#1a1a2e', color: '#fff', padding: '10px 24px',
          borderRadius: '8px', textDecoration: 'none', fontSize: '14px',
          fontWeight: 600, letterSpacing: '0.3px',
          transition: 'background 0.2s',
        }}>Get a Quote</Link>
      </header>

      {/* ─── HERO ────────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
        padding: '100px 5% 80px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: '-100px', right: '-100px',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(200,169,110,0.12) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '10%',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(200,169,110,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />

        <div style={{ maxWidth: '680px', position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(200,169,110,0.15)', border: '1px solid rgba(200,169,110,0.3)',
            padding: '6px 16px', borderRadius: '100px', marginBottom: '28px',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#c8a96e', display: 'block' }} />
            <span style={{ color: '#c8a96e', fontSize: '13px', fontWeight: 600, letterSpacing: '0.5px' }}>
              PREMIUM CUSTOM PRINTING
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(38px, 5vw, 62px)', fontWeight: 800,
            color: '#ffffff', lineHeight: 1.1, marginBottom: '24px',
            letterSpacing: '-1.5px',
          }}>
            Custom Packaging<br />
            <span style={{ color: '#c8a96e' }}>That Tells Your Story</span>
          </h1>

          <p style={{
            color: 'rgba(255,255,255,0.65)', fontSize: '18px',
            lineHeight: 1.7, marginBottom: '40px', maxWidth: '520px',
          }}>
            From 200 to 100,000 units — premium printed packaging and marketing materials
            crafted to elevate your brand at every scale.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link href="/quote" style={{
              background: '#c8a96e', color: '#1a1a2e', padding: '15px 36px',
              borderRadius: '8px', textDecoration: 'none', fontSize: '16px',
              fontWeight: 700, letterSpacing: '0.2px',
            }}>Request a Quote</Link>
            <Link href="/products" style={{
              background: 'transparent', color: '#fff',
              border: '1px solid rgba(255,255,255,0.25)',
              padding: '15px 36px', borderRadius: '8px',
              textDecoration: 'none', fontSize: '16px', fontWeight: 600,
            }}>View Products</Link>
          </div>

          {/* Stats row */}
          <div style={{
            display: 'flex', gap: '40px', marginTop: '60px',
            paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.1)',
            flexWrap: 'wrap',
          }}>
            {[['500+', 'Happy Clients'], ['10M+', 'Units Printed'], ['48hr', 'Turnaround'], ['15+', 'Years Experience']].map(([num, label]) => (
              <div key={label}>
                <div style={{ color: '#c8a96e', fontSize: '28px', fontWeight: 800, letterSpacing: '-1px' }}>{num}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '2px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORIES ─────────────────────────────────────── */}
      <section style={{ padding: '80px 5%', background: '#f8f8fc' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ color: '#c8a96e', fontSize: '13px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
            WHAT WE OFFER
          </p>
          <h2 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-1px', color: '#1a1a2e' }}>
            Browse by Category
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '20px', maxWidth: '1200px', margin: '0 auto',
        }}>
          {categories.length > 0 ? categories.map((cat: { id: string; slug: string; title: string }) => (
            <Link key={cat.id} href={`/products?category=${cat.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#fff', borderRadius: '12px',
                padding: '32px 24px', textAlign: 'center',
                border: '1px solid #e8e8f0',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(0,0,0,0.08)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
                }}
              >
                <div style={{
                  width: '56px', height: '56px', background: '#f0f0f8',
                  borderRadius: '12px', margin: '0 auto 16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '24px',
                }}>📦</div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a2e', marginBottom: '6px' }}>{cat.title}</h3>
                <span style={{ color: '#c8a96e', fontSize: '13px', fontWeight: 600 }}>Explore →</span>
              </div>
            </Link>
          )) : (
            // Placeholder categories when none exist yet
            ['Custom Boxes', 'Labels & Stickers', 'Bags & Pouches', 'Mailers', 'Tissue Paper', 'Tape & Seals'].map(name => (
              <div key={name} style={{
                background: '#fff', borderRadius: '12px',
                padding: '32px 24px', textAlign: 'center',
                border: '1px solid #e8e8f0',
              }}>
                <div style={{
                  width: '56px', height: '56px', background: '#f0f0f8',
                  borderRadius: '12px', margin: '0 auto 16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '24px',
                }}>📦</div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a2e', marginBottom: '6px' }}>{name}</h3>
                <span style={{ color: '#c8a96e', fontSize: '13px', fontWeight: 600 }}>Explore →</span>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ─── HOW IT WORKS ───────────────────────────────────── */}
      <section style={{ padding: '80px 5%', background: '#fff' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p style={{ color: '#c8a96e', fontSize: '13px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
            SIMPLE PROCESS
          </p>
          <h2 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-1px', color: '#1a1a2e' }}>
            How It Works
          </h2>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '32px', maxWidth: '1000px', margin: '0 auto',
        }}>
          {[
            { step: '01', title: 'Browse & Select', desc: 'Choose from our range of packaging and print products, select your quantity and specifications.' },
            { step: '02', title: 'Request a Quote', desc: 'Fill in your requirements and receive a detailed quote within 24 hours from our team.' },
            { step: '03', title: 'Approve & Print', desc: 'Approve your artwork proof, and we handle the rest — printing and delivery to your door.' },
          ].map(({ step, title, desc }) => (
            <div key={step} style={{ position: 'relative', padding: '32px', background: '#f8f8fc', borderRadius: '16px' }}>
              <div style={{
                fontSize: '48px', fontWeight: 900, color: '#e8e8f0',
                lineHeight: 1, marginBottom: '16px', letterSpacing: '-2px',
              }}>{step}</div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a2e', marginBottom: '12px' }}>{title}</h3>
              <p style={{ color: '#666', fontSize: '15px', lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ──────────────────────────────── */}
      <section style={{ padding: '80px 5%', background: '#f8f8fc' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', maxWidth: '1200px', margin: '0 auto 40px' }}>
          <div>
            <p style={{ color: '#c8a96e', fontSize: '13px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
              OUR PRODUCTS
            </p>
            <h2 style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-1px', color: '#1a1a2e' }}>
              Popular Products
            </h2>
          </div>
          <Link href="/products" style={{
            color: '#1a1a2e', textDecoration: 'none', fontSize: '14px',
            fontWeight: 600, borderBottom: '2px solid #c8a96e', paddingBottom: '2px',
          }}>View All Products →</Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '24px', maxWidth: '1200px', margin: '0 auto',
        }}>
          {products.length > 0 ? products.map((product: { id: string; slug: string; title?: string; price?: number }) => (
            <Link key={product.id} href={`/products/${product.slug}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: '#fff', borderRadius: '12px',
                overflow: 'hidden', border: '1px solid #e8e8f0',
              }}>
                <div style={{
                  height: '200px', background: 'linear-gradient(135deg, #f0f0f8, #e8e8f0)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px',
                }}>📦</div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a2e', marginBottom: '8px' }}>{product.title}</h3>
                  {product.quantityPricing?.length > 0 && (
                    <p style={{ color: '#c8a96e', fontSize: '14px', fontWeight: 600 }}>
                      From £{product.quantityPricing[0].price} / {product.quantityPricing[0].quantity} units
                    </p>
                  )}
                  <div style={{
                    marginTop: '16px', padding: '10px 16px',
                    background: '#1a1a2e', color: '#fff',
                    borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                    textAlign: 'center',
                  }}>Request Quote</div>
                </div>
              </div>
            </Link>
          )) : (
            // Placeholders
            ['Custom Kraft Box', 'Matte Laminate Bag', 'Tissue Paper Roll', 'Branded Mailer Box'].map(name => (
              <div key={name} style={{
                background: '#fff', borderRadius: '12px',
                overflow: 'hidden', border: '1px solid #e8e8f0',
              }}>
                <div style={{
                  height: '200px', background: 'linear-gradient(135deg, #f0f0f8, #e8e8f0)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px',
                }}>📦</div>
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1a1a2e', marginBottom: '8px' }}>{name}</h3>
                  <p style={{ color: '#c8a96e', fontSize: '14px', fontWeight: 600 }}>From £45 / 200 units</p>
                  <div style={{
                    marginTop: '16px', padding: '10px 16px',
                    background: '#1a1a2e', color: '#fff',
                    borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                    textAlign: 'center',
                  }}>Request Quote</div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ─── QUOTE CTA BANNER ───────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)',
        padding: '80px 5%', textAlign: 'center',
      }}>
        <p style={{ color: '#c8a96e', fontSize: '13px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>
          READY TO START?
        </p>
        <h2 style={{
          color: '#fff', fontSize: 'clamp(28px, 4vw, 48px)',
          fontWeight: 800, letterSpacing: '-1px', marginBottom: '16px',
        }}>
          Get a Custom Quote Today
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '18px', marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px' }}>
          Tell us what you need and we&apos;ll get back to you within 24 hours with a detailed quote.
        </p>
        <Link href="/quote" style={{
          background: '#c8a96e', color: '#1a1a2e',
          padding: '16px 48px', borderRadius: '8px',
          textDecoration: 'none', fontSize: '16px', fontWeight: 700,
        }}>Request a Free Quote</Link>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────── */}
      <footer style={{
        background: '#111', color: 'rgba(255,255,255,0.5)',
        padding: '48px 5%',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', background: '#1a1a2e',
            border: '1px solid #333', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#c8a96e', fontSize: '16px', fontWeight: 800 }}>P</span>
          </div>
          <span style={{ color: '#fff', fontWeight: 600 }}>PrintCo</span>
        </div>
        <p style={{ fontSize: '14px' }}>© 2026 PrintCo. All rights reserved.</p>
        <div style={{ display: 'flex', gap: '24px' }}>
          {['Privacy', 'Terms', 'Contact'].map(item => (
            <Link key={item} href={`/${item.toLowerCase()}`} style={{
              color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '14px',
            }}>{item}</Link>
          ))}
        </div>
      </footer>

    </main>
  )
}