import React from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Logo } from '@/components/Logo/Logo'
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Send } from 'lucide-react'
import './index.css'

export async function Footer() {
  const payload = await getPayload({ config: configPromise })
  
  const { docs: products } = await payload.find({
    collection: 'products',
    limit: 5,
    sort: '-createdAt',
  })

  return (
    <footer className="footer">
      {/* Top Contact Bar */}
      <div className="footer-top">
        <div className="container footer-contact-grid">
          <div className="footer-brand">
            <Logo />
          </div>
          
          <div className="contact-item">
            <div className="contact-icon">
              <Phone size={20} />
            </div>
            <div className="contact-info">
              <span className="contact-label">24/7 Support</span>
              <a href="tel:5592057588" className="contact-value">559-205-7588</a>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon">
              <Mail size={20} />
            </div>
            <div className="contact-info">
              <span className="contact-label">Mail at</span>
              <a href="mailto:sales@onlinepackagingstore.com" className="contact-value">sales@onlinepackagingstore.com</a>
            </div>
          </div>

          <div className="contact-item">
            <div className="contact-icon">
              <MapPin size={20} />
            </div>
            <div className="contact-info">
              <span className="contact-label">Find Us</span>
              <span className="contact-value">1385 Keating Ave Chicago, IL 60651, USA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Grid Section */}
      <div className="footer-mid">
        <div className="container footer-links-grid">
          {/* Column 1: Our Products */}
          <div className="footer-col">
            <h4 className="footer-title">Our Products</h4>
            <ul className="footer-links">
              {products.map((product) => (
                <li key={product.id}>
                  <Link href={`/products/${product.slug}`}>{product.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Informative Pages */}
          <div className="footer-col">
            <h4 className="footer-title">Informative Pages</h4>
            <ul className="footer-links">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/privacy">Privacy & Security</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/contact">Need a Support?</Link></li>
            </ul>
          </div>

          {/* Column 3: Social & Payments */}
          <div className="footer-col">
            <h4 className="footer-title">Follow us on:</h4>
            <div className="social-links">
              <a href="#" className="social-icon"><Facebook size={18} /></a>
              <a href="#" className="social-icon"><Instagram size={18} /></a>
              <a href="#" className="social-icon"><Twitter size={18} /></a>
            </div>

            <div className="payment-icons">
               {/* Real SVG Path for PayPal */}
               <svg className="pm-icon" viewBox="0 0 24 24" width="32" height="32"><path fill="#003087" d="M20.067 8.178c-.622 3.125-2.73 4.54-5.525 4.54H12.33l-.8 4.02h-3.03l1.52-7.6h3.6c2.422 0 3.844-1.01 4.253-3.13.155-.83.053-1.465-.415-1.928-.276-.277-.694-.492-1.292-.58a9.498 9.498 0 0 0-1.458-.1h-5.46L7.41 11.23h1.77L10.66 4.3h3.58c.28 0 .524.015.74.043.19.023.36.06.5.114.3.11.527.315.65.615l.083.21.03.113c.067.318.067.665.01 1.05a4.42 4.42 0 0 1-.39 1.453l-.128.283c-.15.315-.357.575-.62.78l-.16.12c-.224.162-.48.288-.748.375-.24.08-.503.132-.786.155a8.7 8.7 0 0 1-.86.03h-.62l-.37 1.83z"/></svg>
               {/* MasterCard */}
               <svg className="pm-icon" viewBox="0 0 24 24" width="32" height="32"><circle fill="#EB001B" cx="9" cy="12" r="7" opacity=".8"/><circle fill="#F79E1B" cx="15" cy="12" r="7" opacity=".8"/></svg>
               {/* AE */}
               <div className="pm-text">AMEX</div>
               {/* Visa */}
               <div className="pm-text visa">VISA</div>
            </div>

            <div className="country-flags">
              <span title="UK">🇬🇧</span>
              <span title="USA">🇺🇸</span>
              <span title="Australia">🇦🇺</span>
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div className="footer-col newsletter-col">
            <h4 className="footer-title">Newsletter</h4>
            <p>Sign up for exclusive offers and updates!</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Enter Your Email" required />
              <button type="submit" className="btn-subscribe">Subscribe</button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="footer-bottom">
        <div className="container">
          <p>
            &copy; 2026 All Right Reserved <strong>Online Packaging Store</strong>. 
            Design and Developed by <a href="https://webcraftio.com" target="_blank" rel="noopener noreferrer">WebCraftio</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
