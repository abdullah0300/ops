import Link from 'next/link'
import React from 'react'

const MYLAR_LINKS = [
  { label: 'Stand-Up Pouches', href: '/products' },
  { label: 'Flat Zipper Bags', href: '/products' },
  { label: 'Child-Resistant Bags', href: '/products' },
  { label: 'Window Mylar Bags', href: '/products' },
  { label: 'Custom Printed Bags', href: '/products' },
  { label: 'Bulk Plain Bags', href: '/products' },
]

const COMPANY_LINKS = [
  { label: 'About Us', href: '/' },
  { label: 'Our Factory', href: '/' },
  { label: 'Get a Quote', href: '/quote' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Privacy Policy', href: '/' },
  { label: 'Terms of Service', href: '/' },
]

export async function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <style>{`
        .site-footer {
          background: #fff;
          color: #111;
          padding: 64px 24px 0;
          font-family: 'Afacad', sans-serif;
          border-top: 1px solid rgba(0,0,0,0.08);
        }

        .footer-inner {
          max-width: 1100px;
          margin: 0 auto;
        }

        /* Top Grid */
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.4fr;
          gap: 48px;
          padding-bottom: 48px;
          border-bottom: 1px solid rgba(0,0,0,0.08);
        }
        @media (max-width: 960px) {
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 36px; }
        }
        @media (max-width: 600px) {
          .footer-grid { grid-template-columns: 1fr; gap: 32px; }
        }

        /* Brand Column */
        .footer-brand-logo {
          font-family: 'Amaranth', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #111;
          text-decoration: none;
          margin-bottom: 14px;
          display: block;
        }
        .footer-brand-logo span { color: #c48f10; }
        .footer-brand-desc {
          font-family: 'Afacad', sans-serif;
          font-size: 13px;
          color: #888;
          line-height: 1.7;
          margin-bottom: 24px;
        }

        /* Contact Info */
        .footer-contact-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .footer-contact-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .fci-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(240, 188, 46, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .fci-text {
          display: flex;
          flex-direction: column;
        }
        .fci-label {
          font-family: 'Arya', sans-serif;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: #aaa;
          margin-bottom: 2px;
        }
        .fci-value {
          font-family: 'Afacad', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #333;
          line-height: 1.5;
          text-decoration: none;
        }
        .fci-value:hover { color: #c48f10; }

        /* Link Columns */
        .footer-col-title {
          font-family: 'Amaranth', sans-serif;
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #111;
          margin-bottom: 20px;
        }
        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .footer-links a {
          font-family: 'Afacad', sans-serif;
          font-size: 13px;
          color: #888;
          text-decoration: none;
          transition: color 0.2s;
          font-weight: 500;
        }
        .footer-links a:hover { color: #c48f10; }

        /* Bottom Bar */
        .footer-bottom {
          background: #FCFBF7;
          margin: 0 -24px;
          padding: 20px 24px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .footer-copyright {
          font-family: 'Afacad', sans-serif;
          font-size: 12px;
          color: #aaa;
        }

        /* Payment Icons */
        .footer-payments {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .pay-badge {
          background: #f4f4f4;
          border: 1px solid #e0e0e0;
          border-radius: 6px;
          padding: 5px 10px;
          font-family: 'Afacad', sans-serif;
          font-size: 12px;
          font-weight: 700;
          color: #555;
          white-space: nowrap;
        }
        .pay-badge.paypal { color: #009cde; }
        .pay-badge.visa { color: #1a1f71; }
        .pay-badge.amex { color: #2e77bc; }

        /* Country Flags */
        .footer-flags {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .flag-badge {
          font-size: 22px;
          line-height: 1;
        }

        @media (max-width: 600px) {
          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>

      <div className="footer-inner">

        {/* Top Section Grid */}
        <div className="footer-grid">

          {/* Brand + Contact */}
          <div>
            <Link href="/" className="footer-brand-logo">
              Online<span>Packaging</span>Store
            </Link>
            <p className="footer-brand-desc">
              Premium custom Mylar bags and flexible packaging solutions for brands across the United States. Low minimums, fast turnaround, full custom print support.
            </p>
            <ul className="footer-contact-list">
              <li className="footer-contact-item">
                <div className="fci-icon">📞</div>
                <div className="fci-text">
                  <span className="fci-label">24/7 Support</span>
                  <a href="tel:5592057588" className="fci-value">559-205-7588</a>
                </div>
              </li>
              <li className="footer-contact-item">
                <div className="fci-icon">✉️</div>
                <div className="fci-text">
                  <span className="fci-label">Mail at</span>
                  <a href="mailto:sales@onlinepackagingstore.com" className="fci-value">sales@onlinepackagingstore.com</a>
                </div>
              </li>
              <li className="footer-contact-item">
                <div className="fci-icon">📍</div>
                <div className="fci-text">
                  <span className="fci-label">Find Us</span>
                  <span className="fci-value">1385 Keating Ave<br />Chicago, IL 60651, USA</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Mylar Products */}
          <div>
            <p className="footer-col-title">Our Products</p>
            <ul className="footer-links">
              {MYLAR_LINKS.map((link, i) => (
                <li key={i}><Link href={link.href}>{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="footer-col-title">Company</p>
            <ul className="footer-links">
              {COMPANY_LINKS.map((link, i) => (
                <li key={i}><Link href={link.href}>{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Trust & Shipping */}
          <div>
            <p className="footer-col-title">We Ship To</p>
            <div className="footer-flags" style={{ marginBottom: 24 }}>
              <span className="flag-badge">🇺🇸</span>
              <span style={{ fontSize: 12, color: '#aaa', fontWeight: 600 }}>United States</span>
            </div>
            <div className="footer-flags" style={{ marginBottom: 24 }}>
              <span className="flag-badge">🇬🇧</span>
              <span style={{ fontSize: 12, color: '#aaa', fontWeight: 600 }}>United Kingdom</span>
            </div>
            <div className="footer-flags" style={{ marginBottom: 36 }}>
              <span className="flag-badge">🇦🇺</span>
              <span style={{ fontSize: 12, color: '#aaa', fontWeight: 600 }}>Australia</span>
            </div>

            <p className="footer-col-title" style={{ marginBottom: 14 }}>We Accept</p>
            <div className="footer-payments">
              <span className="pay-badge paypal">PayPal</span>
              <span className="pay-badge">Mastercard</span>
              <span className="pay-badge visa">VISA</span>
              <span className="pay-badge amex">Amex</span>
              <span className="pay-badge">Cash App</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} OnlinePackagingStore. All rights reserved.
          </p>
          <p className="footer-copyright" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            Designed &amp; Developed by{' '}
            <a href="https://webcraftio.com" target="_blank" rel="noopener noreferrer" style={{ color: '#c48f10', fontWeight: 700, textDecoration: 'none' }}>
              WebCraftio
            </a>
          </p>
        </div>

      </div>
    </footer>
  )
}
