'use client'

import React, { useState, useEffect } from 'react'
import { User, Ruler, Layers, Upload, Info, CheckCircle2, ArrowRight } from 'lucide-react'

export function QuoteForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formID, setFormID] = useState<string | null>(null)

  // Fetch the Quote Request form ID on mount
  useEffect(() => {
    const fetchFormID = async () => {
      try {
        const response = await fetch('/api/forms?where[title][equals]=Quote%20Request')
        const data = await response.json()
        if (data.docs && data.docs.length > 0) {
          setFormID(data.docs[0].id)
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
          background: #FCFBF7;
          padding: 100px 0;
        }

        .quote-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 5%;
        }

        .quote-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .quote-header h2 {
          font-family: 'Amaranth', sans-serif;
          font-size: clamp(32px, 4vw, 48px);
          font-weight: 700;
          color: #111;
          margin-bottom: 16px;
        }

        .quote-header h2 span {
          color: #0c8a24;
        }

        .quote-header p {
          font-family: 'Afacad', sans-serif;
          font-size: 18px;
          color: #666;
          max-width: 600px;
          margin: 0 auto;
        }

        .form-card {
          background: #fff;
          border-radius: 24px;
          padding: 60px;
          box-shadow: 0 20px 80px rgba(0,0,0,0.05);
          border: 1px solid rgba(0,0,0,0.05);
        }

        .form-section {
          margin-bottom: 40px;
        }

        .form-section-title {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          font-family: 'Amaranth', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #111;
        }

        .section-icon {
          width: 32px;
          height: 32px;
          background: #EFFFE5;
          color: #0c8a24;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-field.full-width {
          grid-column: 1 / -1;
        }

        .form-field input,
        .form-field select,
        .form-field textarea {
          width: 100%;
          padding: 14px 18px;
          border: 1.5px solid #E2E2E2;
          border-radius: 14px;
          font-family: 'Afacad', sans-serif;
          font-size: 16px;
          color: #111;
          background: #fff;
          outline: none;
          transition: all 0.2s;
          box-sizing: border-box;
        }

        .form-field input:focus,
        .form-field select:focus,
        .form-field textarea:focus {
          border-color: #0c8a24;
          box-shadow: 0 0 0 4px rgba(12, 138, 36, 0.1);
        }

        .form-field textarea {
          min-height: 120px;
          resize: vertical;
        }

        .file-upload-wrapper {
          position: relative;
          cursor: pointer;
        }

        .quote-submit-btn {
          width: 100%;
          padding: 18px;
          background: #111;
          color: #fff;
          font-family: 'Afacad', sans-serif;
          font-size: 18px;
          font-weight: 700;
          border: none;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 20px;
        }

        .quote-submit-btn:hover:not(:disabled) {
          background: #0c8a24;
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(12, 138, 36, 0.2);
        }

        .quote-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-message {
          color: #d32f2f;
          font-family: 'Afacad', sans-serif;
          font-size: 14px;
          margin-top: 10px;
          text-align: center;
        }

        .success-card {
          text-align: center;
          padding: 40px;
        }

        .success-icon {
          width: 80px;
          height: 80px;
          background: #EFFFE5;
          color: #0c8a24;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          margin: 0 auto 30px;
        }

        .success-card h3 {
          font-family: 'Amaranth', sans-serif;
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .success-card p {
          font-family: 'Afacad', sans-serif;
          font-size: 18px;
          color: #666;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .form-card {
            padding: 30px;
          }
          .quote-section {
            padding: 60px 0;
          }
        }
      `}</style>

      <div className="quote-container">
        <div className="quote-header">
          <h2>Get Your <span>Custom Quote</span></h2>
          <p>Complete the form below and our specialists will provide a tailored quote for your project within 24 hours.</p>
        </div>

        <div className="form-card">
          {submitted ? (
            <div className="success-card">
              <div className="success-icon">
                <CheckCircle2 size={40} />
              </div>
              <h3>Request Received!</h3>
              <p>Thank you for reaching out. A packaging specialist is reviewing your project details and will be in touch shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Personal Information */}
              <div className="form-section">
                <div className="form-section-title">
                  <div className="section-icon"><User size={20} /></div>
                  Personal Information
                </div>
                <div className="form-grid">
                  <div className="form-field full-width">
                    <input type="text" name="full-name" placeholder="Full Name" required />
                  </div>
                  <div className="form-field">
                    <input type="email" name="email" placeholder="Email Address" required />
                  </div>
                  <div className="form-field">
                    <input type="tel" name="phone" placeholder="Phone Number" />
                  </div>
                </div>
              </div>

              {/* Select Size */}
              <div className="form-section">
                <div className="form-section-title">
                  <div className="section-icon"><Ruler size={20} /></div>
                  Select Size
                </div>
                <div className="form-grid">
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
              </div>

              {/* Choose Materials */}
              <div className="form-section">
                <div className="form-section-title">
                  <div className="section-icon"><Layers size={20} /></div>
                  Choose Materials
                </div>
                <div className="form-grid">
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
              </div>

              {/* Upload Artwork */}
              <div className="form-section">
                <div className="form-section-title">
                  <div className="section-icon"><Upload size={20} /></div>
                  Upload Artwork
                </div>
                <div className="form-field full-width">
                  <input type="text" name="artwork" placeholder="Link to your artwork (or mention if you need help with design)" />
                </div>
              </div>

              {/* Additional Information */}
              <div className="form-section">
                <div className="form-section-title">
                  <div className="section-icon"><Info size={20} /></div>
                  Additional Information
                </div>
                <div className="form-field full-width">
                  <textarea name="message" placeholder="Tell us more about your project requirements..." />
                </div>
              </div>

              <button type="submit" className="quote-submit-btn" disabled={loading}>
                {loading ? 'Submitting...' : (
                  <>
                    Get My Custom Quote <ArrowRight size={20} />
                  </>
                )}
              </button>

              {error && <div className="error-message">{error}</div>}
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
