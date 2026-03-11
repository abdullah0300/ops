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
          width: 100%;
          display: flex;
        }

        .quote-container {
          width: 100%;
          display: flex;
          flex-direction: row;
        }

        /* Left Side: Details */
        .quote-left {
          flex: 1;
          padding: 100px 8%;
          background: #f0bc2e; /* Brand Gold */
          color: #1c1c1c;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
        }
        
        .quote-left::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(circle at top right, rgba(255,255,255,0.15) 0%, transparent 60%);
          pointer-events: none;
        }

        .quote-left-badge {
          display: inline-block;
          background: rgba(28, 28, 28, 0.08); /* slight dark tint */
          color: #1c1c1c;
          font-family: 'Arya', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 6px 14px;
          border-radius: 20px;
          margin-bottom: 24px;
          align-self: flex-start;
          border: 1px solid rgba(28, 28, 28, 0.1);
        }

        .quote-left h2 {
          font-family: 'Amaranth', sans-serif;
          font-size: clamp(36px, 4vw, 52px);
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 20px;
          color: #1c1c1c;
        }
        
        .quote-left h2 span {
          color: #fff;
        }

        .quote-left p {
          font-family: 'Afacad', sans-serif;
          font-size: 18px;
          color: rgba(28, 28, 28, 0.8);
          line-height: 1.6;
          margin-bottom: 40px;
          max-width: 480px;
        }

        .quote-perks {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .quote-perk {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: 'Afacad', sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #1c1c1c;
        }

        .quote-perk-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #1c1c1c;
          color: #f0bc2e;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          flex-shrink: 0;
        }

        /* Right Side: Form */
        .quote-right {
          flex: 1;
          padding: 100px 8%;
          background: #FCFBF7;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .quote-right-inner {
          max-width: 600px;
          width: 100%;
          margin: 0 auto;
        }

        .quote-right-header {
          margin-bottom: 30px;
        }

        .quote-right-header h3 {
          font-family: 'Amaranth', sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: #1c1c1c;
          margin-bottom: 8px;
        }

        .quote-right-header p {
          font-family: 'Afacad', sans-serif;
          font-size: 15px;
          color: #666;
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }

        .form-field.full-width {
          grid-column: 1 / -1;
        }

        .form-field label {
          font-family: 'Afacad', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: #333;
        }

        .form-field input,
        .form-field select,
        .form-field textarea {
          width: 100%;
          padding: 14px 16px;
          border: 1.5px solid #e2e2e2;
          border-radius: 12px;
          font-family: 'Afacad', sans-serif;
          font-size: 15px;
          color: #1c1c1c;
          background: #fff;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
          appearance: none;
        }

        .form-field input:focus,
        .form-field select:focus,
        .form-field textarea:focus {
          border-color: #f0bc2e;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(240,188,46,0.1);
        }

        .form-field textarea {
          resize: none;
          min-height: 120px;
        }

        .quote-submit-btn {
          width: 100%;
          padding: 16px;
          background: #1c1c1c;
          color: #fff;
          font-family: 'Afacad', sans-serif;
          font-size: 17px;
          font-weight: 700;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
          margin-top: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .quote-submit-btn:hover:not(:disabled) {
          background: #333;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }

        .quote-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .quote-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          height: 100%;
          min-height: 400px;
          gap: 20px;
        }

        .quote-success-icon {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: rgba(240, 188, 46, 0.15);
          color: #f0bc2e;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          border: 2px solid #f0bc2e;
        }

        .quote-success h3 {
          font-family: 'Amaranth', sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: #1c1c1c;
        }

        .quote-success p {
          font-family: 'Afacad', sans-serif;
          font-size: 16px;
          color: #666;
          line-height: 1.6;
          max-width: 380px;
        }

        /* Responsive */
        @media (max-width: 960px) {
          .quote-container {
            flex-direction: column;
          }
          .quote-left, .quote-right {
            padding: 60px 5%;
          }
        }

        @media (max-width: 600px) {
          .form-grid-2 {
            grid-template-columns: 1fr;
            gap: 0;
          }
          .quote-left h2 {
            font-size: 32px;
          }
        }
      `}</style>

      <div className="quote-container">
        {/* Left Side: Details */}
        <div className="quote-left">
          <div className="quote-left-badge">✦ Custom Packaging</div>
          <h2>Let&apos;s Build Your<br/><span>Perfect Packaging</span></h2>
          <p>Partner with us for premium, brand-elevating custom Mylar bags. Low minimums, exceptional print quality, and fast turnaround.</p>
          
          <div className="quote-perks">
            {[
              'No hidden mold or setup fees',
              'Minimum order from 100 units',
              '5–7 day rapid production turnaround',
              'Free expert design & artwork review',
              'FDA compliant & child-resistant options'
            ].map((perk, i) => (
              <div className="quote-perk" key={i}>
                <div className="quote-perk-icon">✓</div>
                {perk}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="quote-right">
          <div className="quote-right-inner">
            {submitted ? (
              <div className="quote-success">
                <div className="quote-success-icon">✓</div>
                <h3>Request Received!</h3>
                <p>Thank you for reaching out. One of our packaging specialists will review your details and send your custom quote within 24 hours.</p>
              </div>
            ) : (
              <>
                <div className="quote-right-header">
                  <h3>Request a Free Quote</h3>
                  <p>Fill out the form below and we&apos;ll get right back to you.</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="form-grid-2">
                    <div className="form-field">
                      <label>First Name*</label>
                      <input type="text" name="firstName" placeholder="John" required />
                    </div>
                    <div className="form-field">
                      <label>Last Name*</label>
                      <input type="text" name="lastName" placeholder="Smith" required />
                    </div>
                    <div className="form-field full-width">
                      <label>Business Email*</label>
                      <input type="email" name="email" placeholder="john@yourbrand.com" required />
                    </div>
                    <div className="form-field">
                      <label>Phone Number</label>
                      <input type="tel" name="phone" placeholder="+1 (555) 000-0000" />
                    </div>
                    <div className="form-field">
                      <label>Order Size</label>
                      <select name="quantity" required>
                        <option value="">Select quantity…</option>
                        <option>100 - 499 units</option>
                        <option>500 - 999 units</option>
                        <option>1,000 - 4,999 units</option>
                        <option>5,000+ units</option>
                      </select>
                    </div>
                    <div className="form-field full-width">
                      <label>Project Details</label>
                      <textarea
                        name="message"
                        placeholder="Tell us about the bag type, sizes, finishes (matte/gloss/holographic), and any special features you need..."
                      />
                    </div>
                  </div>
                  <button type="submit" className="quote-submit-btn" disabled={loading}>
                    {loading ? 'Sending Request...' : 'Get My Custom Quote ➔'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
