'use client'

import React, { useState } from 'react'

export function QuoteForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <section className="quote-section" id="quote">
      <style>{`
        .quote-section {
          background: #FCFBF7;
          padding: 80px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          border-top: 1px solid rgba(0,0,0,0.07);
        }

        .quote-header {
          text-align: center;
          margin-bottom: 56px;
          max-width: 600px;
        }
        .quote-header-badge {
          display: inline-block;
          background: rgba(240, 188, 46, 0.12);
          color: #c48f10;
          font-family: 'Arya', sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 6px 14px;
          border-radius: 20px;
          margin-bottom: 18px;
        }
        .quote-header h2 {
          font-family: 'Amaranth', sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: #111;
          line-height: 1.2;
          margin-bottom: 12px;
        }
        .quote-header h2 span { color: #c48f10; }
        .quote-header p {
          font-family: 'Arya', sans-serif;
          font-size: 16px;
          color: #888;
          line-height: 1.7;
        }

        /* Card */
        .quote-card {
          width: 100%;
          max-width: 860px;
          background: #fff;
          border-radius: 20px;
          border: 1px solid rgba(0,0,0,0.08);
          box-shadow: 0 8px 40px rgba(0,0,0,0.04);
          padding: 48px;
          box-sizing: border-box;
        }

        /* Perks Row */
        .quote-perks-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 40px;
        }
        .quote-perk {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: 'Afacad', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #444;
        }
        .quote-perk-dot {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: rgba(240, 188, 46, 0.15);
          color: #c48f10;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          flex-shrink: 0;
        }

        /* Form */
        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .form-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 20px;
        }
        .form-field.full-width {
          grid-column: 1 / -1;
        }
        .form-field label {
          font-family: 'Arya', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #555;
          text-transform: uppercase;
          letter-spacing: 0.07em;
        }
        .form-field input,
        .form-field select,
        .form-field textarea {
          width: 100%;
          padding: 12px 14px;
          border: 1.5px solid #e8e8e8;
          border-radius: 10px;
          font-family: 'Afacad', sans-serif;
          font-size: 14px;
          color: #111;
          background: #fafafa;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          box-sizing: border-box;
          appearance: none;
        }
        .form-field input:focus,
        .form-field select:focus,
        .form-field textarea:focus {
          border-color: #f0bc2e;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(240,188,46,0.08);
        }
        .form-field textarea {
          resize: none;
          min-height: 100px;
        }

        .quote-submit-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #f0bc2e 0%, #dca41b 100%);
          color: #111;
          font-family: 'Afacad', sans-serif;
          font-size: 16px;
          font-weight: 700;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
          margin-top: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .quote-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(240,188,46,0.35);
        }
        .quote-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* Success */
        .quote-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 16px;
          padding: 48px 0;
        }
        .quote-success-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f0bc2e 0%, #dca41b 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
        }
        .quote-success h3 {
          font-family: 'Amaranth', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #111;
        }
        .quote-success p {
          font-family: 'Afacad', sans-serif;
          font-size: 14px;
          color: #888;
          line-height: 1.6;
          max-width: 400px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .quote-card {
            padding: 32px 24px;
          }
          .form-grid-2 {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 480px) {
          .quote-header h2 { font-size: 22px; }
          .quote-card { padding: 24px 16px; }
          .quote-perks-row { gap: 8px; }
        }
      `}</style>

      {/* Header */}
      <div className="quote-header">
        <div className="quote-header-badge">✦ Free Quote</div>
        <h2>Let&apos;s Build Your <span>Perfect Packaging</span></h2>
        <p>Fill in your details and our team will respond within 24 hours with a custom quote tailored to your brand.</p>
      </div>

      {/* Card */}
      <div className="quote-card">

        {/* Perks Row */}
        <div className="quote-perks-row">
          {[
            'No hidden fees',
            'From 100 units MOQ',
            '5–7 day turnaround',
            'Ships to all 50 US states',
            'Full custom design support',
          ].map((perk, i) => (
            <div className="quote-perk" key={i}>
              <div className="quote-perk-dot">✓</div>
              {perk}
            </div>
          ))}
        </div>

        {submitted ? (
          <div className="quote-success">
            <div className="quote-success-icon">✓</div>
            <h3>Quote Request Sent!</h3>
            <p>Thank you! Our team will review your details and get back to you within 24 hours with a custom quote.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-grid-2">
              <div className="form-field">
                <label>First Name</label>
                <input type="text" name="firstName" placeholder="John" required />
              </div>
              <div className="form-field">
                <label>Last Name</label>
                <input type="text" name="lastName" placeholder="Smith" required />
              </div>
              <div className="form-field">
                <label>Business Email</label>
                <input type="email" name="email" placeholder="john@yourbrand.com" required />
              </div>
              <div className="form-field">
                <label>Phone Number</label>
                <input type="tel" name="phone" placeholder="+1 (555) 000-0000" />
              </div>
              <div className="form-field">
                <label>Bag Type</label>
                <select name="bagType">
                  <option value="">Select a type…</option>
                  <option>Stand-Up Pouch</option>
                  <option>Flat Zipper Bag</option>
                  <option>Child-Resistant Bag</option>
                  <option>Window Bag</option>
                  <option>Custom Size</option>
                </select>
              </div>
              <div className="form-field">
                <label>Order Quantity</label>
                <select name="quantity">
                  <option value="">Select a range…</option>
                  <option>100–499 units</option>
                  <option>500–999 units</option>
                  <option>1,000–4,999 units</option>
                  <option>5,000+ units</option>
                </select>
              </div>
              <div className="form-field full-width">
                <label>Tell Us About Your Project</label>
                <textarea
                  name="message"
                  placeholder="Describe your product, sizes needed, preferred colors, or any special requirements…"
                />
              </div>
            </div>
            <button type="submit" className="quote-submit-btn" disabled={loading}>
              {loading ? 'Sending your request…' : '✦ Send My Quote Request →'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
