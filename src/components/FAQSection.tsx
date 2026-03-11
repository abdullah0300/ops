'use client'

import React, { useState } from 'react'

const FAQS = [
  {
    q: 'What is the minimum order quantity for custom Mylar bags?',
    a: 'Our minimum order quantity starts at just 100 units, making us accessible for small businesses and startups across the US. Larger orders come with volume discounts.',
  },
  {
    q: 'Do you ship to all US states?',
    a: 'Yes! We ship to all 50 US states including Alaska and Hawaii. Most continental US orders arrive within 3–5 business days after production.',
  },
  {
    q: 'Are your Mylar bags smell-proof and food-safe?',
    a: 'Absolutely. All our Mylar bags are made from food-grade materials, are 100% smell-proof, and meet FDA compliance standards. They are perfect for cannabis, herbs, snacks, supplements, and more.',
  },
  {
    q: 'Can I get a custom design and logo printed on my bags?',
    a: 'Yes! We offer full custom printing — you can upload your own artwork, logo, and brand colors. Our design team will review your file and confirm print-readiness before production begins.',
  },
  {
    q: 'What sizes do your Mylar bags come in?',
    a: 'We offer a wide range of sizes from 3.5g gram bags all the way up to 1 lb and bulk options. Custom sizing is also available for large volume orders.',
  },
  {
    q: 'How long does production and shipping take?',
    a: 'Standard production takes 5–7 business days after artwork approval. Rush orders are available. Once shipped, most US addresses receive orders in 3–5 business days.',
  },
  {
    q: 'Do you offer plain (non-custom) Mylar bags in bulk?',
    a: 'Yes, we also carry plain matte black, clear, and silver Mylar bags available for immediate bulk shipment with no design required.',
  },
]

export function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx)
  }

  return (
    <section className="faq-section">
      <style>{`
        .faq-section {
          background: #f5f5f5;
          padding: 80px 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          border-radius: 32px;
          margin: 60px 24px;
          max-width: 1200px;
        }
        @media (min-width: 1248px) {
          .faq-section {
            margin: 60px auto;
          }
        }
        .faq-header {
          text-align: center;
          margin-bottom: 56px;
        }
        .faq-header-sub {
          font-family: 'Arya', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #c48f10;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .faq-header h2 {
          font-family: 'Amaranth', sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: #111;
          line-height: 1.2;
        }
        .faq-list {
          width: 100%;
          max-width: 800px;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .faq-item {
          border-bottom: 1px solid rgba(0,0,0,0.1);
        }
        .faq-item:first-child {
          border-top: 1px solid rgba(0,0,0,0.1);
        }
        .faq-question {
          width: 100%;
          background: none;
          border: none;
          padding: 22px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          cursor: pointer;
          text-align: left;
        }
        .faq-question span {
          font-family: 'Amaranth', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #111;
          line-height: 1.4;
          flex: 1;
        }
        .faq-icon {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1.5px solid #111;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.2s, transform 0.3s;
          background: transparent;
        }
        .faq-item.open .faq-icon {
          background: #f0bc2e;
          border-color: #f0bc2e;
          transform: rotate(45deg);
        }
        .faq-icon svg {
          width: 14px;
          height: 14px;
          color: #111;
        }
        .faq-answer {
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.4s ease, padding 0.3s ease;
          padding: 0;
        }
        .faq-item.open .faq-answer {
          max-height: 300px;
          padding-bottom: 22px;
        }
        .faq-answer p {
          font-family: 'Afacad', sans-serif;
          font-size: 14px;
          color: #666;
          line-height: 1.7;
        }
      `}</style>

      <div className="faq-header">
        <p className="faq-header-sub">FAQ</p>
        <h2>Frequently Asked Questions</h2>
      </div>

      <div className="faq-list">
        {FAQS.map((faq, idx) => (
          <div key={idx} className={`faq-item${openIdx === idx ? ' open' : ''}`}>
            <button className="faq-question" onClick={() => toggle(idx)}>
              <span>{faq.q}</span>
              <div className="faq-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </div>
            </button>
            <div className="faq-answer">
              <p>{faq.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
