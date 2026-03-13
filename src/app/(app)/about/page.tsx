import React from 'react'
import Link from 'next/link'

export const metadata = {
  title: 'About Us | Online Packaging Store',
  description: 'Who we are, what we do, and why Online Packaging Store is your best marketing partner for premium packaging and printing solutions.',
}

export default function AboutPage() {
  return (
    <div className="about-page">
      <style>{`
        .about-page {
          background-color: #F3F3F3;
          min-height: 100vh;
          font-family: 'Afacad', sans-serif;
          color: #1c1c1c;
        }

        /* Hero Section */
        .about-hero {
          position: relative;
          background-color: #1c1c1c;
          padding: 120px 0 80px;
          color: #fff;
          text-align: center;
          overflow: hidden;
        }

        .about-hero::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(240, 188, 46, 0.1) 0%, rgba(0,0,0,0) 100%);
          pointer-events: none;
        }

        .hero-title {
          font-family: 'Amaranth', sans-serif;
          font-size: clamp(32px, 5vw, 56px);
          font-weight: 700;
          margin-bottom: 20px;
        }

        .hero-subtitle {
          font-size: 20px;
          color: #ccc;
          max-width: 700px;
          margin: 0 auto;
        }

        /* Content Sections */
        .section {
          padding: 100px 0;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .section-tag {
          font-family: 'Arya', sans-serif;
          color: #f0bc2e;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 16px;
          display: block;
        }

        .section-title {
          font-family: 'Amaranth', sans-serif;
          font-size: 36px;
          line-height: 1.2;
          margin-bottom: 24px;
        }

        .section-text {
          font-size: 18px;
          line-height: 1.8;
          color: #555;
          margin-bottom: 24px;
        }

        /* Highlight Cards */
        .highlights-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
          margin-top: 60px;
        }

        .highlight-card {
          background: #fff;
          padding: 40px;
          border-radius: 24px;
          border: 1px solid #e8e4d8;
          transition: transform 0.3s ease;
        }

        .highlight-card:hover {
          transform: translateY(-10px);
        }

        .highlight-icon {
          width: 60px;
          height: 60px;
          background: #f0bc2e;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          font-size: 32px;
        }

        .highlight-title {
          font-family: 'Amaranth', sans-serif;
          font-size: 20px;
          margin-bottom: 16px;
        }

        .highlight-desc {
          font-size: 16px;
          color: #666;
          line-height: 1.6;
        }

        /* Add-ons List */
        .addons-box {
          background: #1c1c1c;
          padding: 60px;
          border-radius: 32px;
          color: #fff;
          margin-top: 60px;
        }

        .addons-list {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          list-style: none;
          padding: 0;
        }

        .addon-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 500;
        }

        .addon-check {
          color: #f0bc2e;
        }

        /* Image Placeholder Style */
        .image-placeholder {
          background: #fff;
          border-radius: 32px;
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 100px;
          border: 1.5px solid #e8e4d8;
          overflow: hidden;
        }

        .image-placeholder img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        @media (max-width: 1024px) {
          .content-grid { grid-template-columns: 1fr; gap: 40px; }
          .highlights-grid { grid-template-columns: 1fr; }
          .addons-list { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      {/* Hero */}
      <section className="about-hero">
        <div className="container">
          <h1 className="hero-title">Who We Are?</h1>
          <p className="hero-subtitle">All About Online Packaging Store - Your Marketing Partner for Success</p>
        </div>
      </section>

      {/* Vision Section */}
      <section className="section">
        <div className="container">
          <div className="content-grid">
            <div className="image-placeholder">
              <img src="https://images.unsplash.com/photo-1503694978374-8a2fa686963a?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Premium Packaging Design" />
            </div>
            <div className="content-text">
              <span className="section-tag">Our Vision</span>
              <h2 className="section-title">Find the Best Packaging Solutions</h2>
              <p className="section-text">
                Whenever you launched a new product or being sick of with the old and frustrated packaging 
                of your hot selling product just come to Online Packaging Store and find the best packaging solutions. 
                We provide you the best of the best for your product’s promotion and success.
              </p>
              <p className="section-text">
                Change is need of time, people get bored when they see same packaging boxes for some time, 
                to keep your product always in the first row and maintain its attraction for the viewer 
                it is mandatory to provide them quality along with the tempting graphics and color scheming.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div className="content-grid" style={{ direction: 'rtl' }}>
             <div className="image-placeholder">
               <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200" alt="Professional Design Expert Team" />
             </div>
             <div className="content-text" style={{ direction: 'ltr' }}>
                <span className="section-tag">Expertise</span>
                <h2 className="section-title">Professionally Trained & Highly Experienced</h2>
                <p className="section-text">
                  At Online Packaging Store you will find that all staff members are expert and well mannered, 
                  either you contact with our sales representative or arrange a meeting with our designers, 
                  you will find all of them professionally trained and highly experienced.
                </p>
                <p className="section-text">
                  Uniqueness is our specialty, customization on the extended level makes your packaging boxes matchless, 
                  you can come up with our designs we will arrange your meeting with our designer and 
                  you can convey your requirements in the best and comfortable environment.
                </p>
             </div>
          </div>

          <div className="highlights-grid">
            <div className="highlight-card">
              <div className="highlight-icon">💰</div>
              <h3 className="highlight-title">Reasonable Prices</h3>
              <p className="highlight-desc">We charge very reasonable prices for the packaging boxes without compromising on quality.</p>
            </div>
            <div className="highlight-card">
              <div className="highlight-icon">🚚</div>
              <h3 className="highlight-title">Free Shipment</h3>
              <p className="highlight-desc">Enjoy Free Designing Services, Free Quotation, Free Lamination and Free Shipment on your orders.</p>
            </div>
            <div className="highlight-card">
              <div className="highlight-icon">📅</div>
              <h3 className="highlight-title">24/7 Support</h3>
              <p className="highlight-desc">Our all-time active and hassle-free staff members are always available for you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="container text-center">
          <span className="section-tag" style={{ margin: '0 auto 16px' }}>What We Offer</span>
          <h2 className="section-title" style={{ maxWidth: '800px', margin: '0 auto 40px' }}>
            Facilitating our customers with premium add-ons
          </h2>
          
          <div className="addons-box">
            <ul className="addons-list">
              <li className="addon-item"><span className="addon-check">✓</span> Multiple Foil Stamping</li>
              <li className="addon-item"><span className="addon-check">✓</span> Spot UV</li>
              <li className="addon-item"><span className="addon-check">✓</span> Embossing & Debossing</li>
              <li className="addon-item"><span className="addon-check">✓</span> Letterpress</li>
              <li className="addon-item"><span className="addon-check">✓</span> CMYK or RGB color</li>
              <li className="addon-item"><span className="addon-check">✓</span> Custom Shape Die Cutting</li>
              <li className="addon-item"><span className="addon-check">✓</span> Window Die Cut</li>
              <li className="addon-item"><span className="addon-check">✓</span> Kraft Die Cutting</li>
              <li className="addon-item"><span className="addon-check">✓</span> Fancy Sheets</li>
            </ul>
          </div>

          <div className="text-center" style={{ marginTop: '60px' }}>
            <Link href="/#quote" className="btn-get-quote" style={{ padding: '18px 48px', fontSize: '18px', background: '#f0bc2e', color: '#111', borderRadius: '100px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block' }}>
              Start Your Project Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
