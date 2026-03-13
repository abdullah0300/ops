'use client'

import React, { useState, useEffect } from 'react'

export function QuoteForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formID, setFormID] = useState<string | null>(null)

  // Fetch the Quote Request form ID on mount
  useEffect(() => {
    const fetchFormID = async () => {
      try {
        // First, ensure the form exists (auto-fix)
        const ensureResponse = await fetch('/api/ensure-quote-form')
        const ensureData = await ensureResponse.json()
        
        if (ensureData.success && ensureData.id) {
          setFormID(ensureData.id)
        } else {
          // Fallback search if ensure fails
          const response = await fetch('/api/forms?where[title][equals]=Quote%20Request')
          const data = await response.json()
          if (data.docs && data.docs.length > 0) {
            setFormID(data.docs[0].id)
          }
        }
      } catch (err) {
        console.error('Failed to fetch form ID:', err)
      }
    }
    fetchFormID()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!formID) {
      setError('Form system is still initializing. Please try again in a moment.')
      return
    }

    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const dataToSend = Array.from(formData.entries()).map(([name, value]) => ({
      field: name,
      value: value.toString(),
    }))

    try {
      const response = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          form: formID,
          submissionData: dataToSend,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      setSubmitted(true)
    } catch (err) {
      console.error('Submission error:', err)
      setError('Something went wrong. Please try again or contact us directly.')
    } finally {
      setLoading(false)
    }
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
          background: #EFFFE5; /* Light Green */
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
          background: radial-gradient(circle at top right, rgba(255,255,255,0.4) 0%, transparent 60%);
          pointer-events: none;
        }

        .quote-left-badge {
          display: inline-block;
          background: rgba(12, 138, 36, 0.1); /* light green tint */
          color: #0c8a24;
          font-family: 'Arya', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 6px 14px;
          border-radius: 20px;
          margin-bottom: 24px;
          align-self: flex-start;
          border: 1px solid rgba(12, 138, 36, 0.2);
        }

        .quote-left h2 {
          font-family: 'Amaranth', sans-serif;
          font-size: clamp(36px, 4vw, 52px);
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 20px;
          color: #111;
        }
        
        .quote-left h2 span {
          color: #0c8a24;
        }

        .quote-left p {
          font-family: 'Afacad', sans-serif;
          font-size: 18px;
          color: #444;
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
          color: #111;
        }

        .quote-perk-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #0c8a24;
          color: #fff;
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

        .form-section-label {
          font-family: 'Amaranth', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #111;
          margin: 24px 0 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .form-grid-4 {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
        }

        .form-grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 15px;
        }

        .form-field.full-width {
          grid-column: 1 / -1;
        }

        .form-field input,
        .form-field select,
        .form-field textarea {
          width: 100%;
          padding: 12px 14px;
          border: 1.5px solid #e2e2e2;
          border-radius: 10px;
          font-family: 'Afacad', sans-serif;
          font-size: 15px;
          color: #1c1c1c;
          background: #fff;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }

        .form-field input:focus,
        .form-field select:focus,
        .form-field textarea:focus {
          border-color: #0c8a24;
          box-shadow: 0 0 0 3px rgba(12, 138, 36, 0.1);
        }

        .form-field textarea {
          min-height: 100px;
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
          transition: all 0.2s;
          margin-top: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .quote-submit-btn:hover:not(:disabled) {
          background: #0c8a24;
          transform: translateY(-2px);
        }

        .quote-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        .quote-success {
          text-align: center;
          padding: 40px;
        }

        .quote-success-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: #EFFFE5;
          color: #0c8a24;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          margin: 0 auto 20px;
        }

        .error-msg {
          color: #ff4d4d;
          font-size: 14px;
          margin-top: 10px;
          text-align: center;
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
          .form-grid-4, .form-grid-3, .form-grid-2 {
            grid-template-columns: 1fr;
            gap: 0;
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
                <h3 style={{ fontFamily: 'Amaranth', fontSize: '24px', marginBottom: '10px' }}>Request Received!</h3>
                <p style={{ fontFamily: 'Afacad', color: '#666' }}>Thank you for reaching out. One of our packaging specialists will review your details and send your custom quote within 24 hours.</p>
              </div>
            ) : (
              <>
                <div className="quote-right-header">
                  <h3>Request a Free Quote</h3>
                  <p>Fill out the form below and we&apos;ll get right back to you.</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                  {/* Personal Information */}
                  <div className="form-section-label">Personal Information</div>
                  <div className="form-grid-3">
                    <div className="form-field">
                      <input type="text" name="full-name" placeholder="Full Name" required />
                    </div>
                    <div className="form-field">
                      <input type="email" name="email" placeholder="Email" required />
                    </div>
                    <div className="form-field">
                      <input type="tel" name="phone" placeholder="Phone" />
                    </div>
                  </div>

                  {/* Select Size */}
                  <div className="form-section-label">Select Size</div>
                  <div className="form-grid-4">
                    <div className="form-field">
                      <input type="text" name="length" placeholder="Length" />
                    </div>
                    <div className="form-field">
                      <input type="text" name="width" placeholder="Width" />
                    </div>
                    <div className="form-field">
                      <input type="text" name="height" placeholder="Height" />
                    </div>
                    <div className="form-field">
                      <select name="unit">
                        <option value="cm">cm</option>
                        <option value="inch">inch</option>
                        <option value="mm">mm</option>
                      </select>
                    </div>
                  </div>

                  {/* Choose Materials */}
                  <div className="form-section-label">Choose Materials</div>
                  <div className="form-grid-3">
                    <div className="form-field">
                      <select name="stock">
                        <option value="">Stock</option>
                        <option value="cardstock">Cardstock</option>
                        <option value="kraft">Kraft</option>
                        <option value="corrugated">Corrugated</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                    <div className="form-field">
                      <select name="colors">
                        <option value="">Colors</option>
                        <option value="1">1 Color</option>
                        <option value="2">2 Colors</option>
                        <option value="4">4 Colors</option>
                        <option value="full">Full Color</option>
                      </select>
                    </div>
                    <div className="form-field">
                      <input type="text" name="quantity" placeholder="Quantity" />
                    </div>
                  </div>

                  {/* Upload Artwork */}
                  <div className="form-section-label">Upload Artwork</div>
                  <div className="form-field full-width">
                    <input type="text" name="artwork" placeholder="Link to your artwork or design info" />
                  </div>

                  {/* Additional Information */}
                  <div className="form-section-label">Additional Information</div>
                  <div className="form-field full-width">
                    <textarea name="message" placeholder="Message" />
                  </div>

                  <button type="submit" className="quote-submit-btn" disabled={loading}>
                    {loading ? 'Submitting...' : 'Get My Custom Quote ➔'}
                  </button>

                  {error && <div className="error-msg">{error}</div>}
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
