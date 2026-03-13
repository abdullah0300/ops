'use client'

import Link from 'next/link'

export function CustomPrintSection() {
  return (
    <section className="print-section">
      <style>{`
        .print-section {
          width: 100%;
          background: #B35656; /* Brand Yellow */
          padding: 100px 5%;
          display: flex;
          justify-content: center;
          position: relative;
        }

        .print-container {
          width: 100%;
          max-width: 1200px;
          display: flex;
          align-items: center;
          gap: 60px;
          position: relative;
          z-index: 2;
        }

        /* Left Content */
        .print-content {
          flex: 1.2;
        }

        .print-badge {
          display: inline-block;
          background: #fff;
          color: #1c1c1c;
          font-family: 'Arya', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 6px 16px;
          border-radius: 20px;
          margin-bottom: 24px;
        }

        .print-content h2 {
          font-family: 'Amaranth', sans-serif;
          font-size: clamp(36px, 4vw, 52px);
          font-weight: 700;
          color: #1c1c1c; /* Black font */
          line-height: 1.1;
          margin-bottom: 20px;
        }

        .print-content h2 span {
          color: #fff; /* White font accent */
        }

        .print-content p {
          font-family: 'Afacad', sans-serif;
          font-size: 18px;
          color: #1c1c1c;
          line-height: 1.6;
          margin-bottom: 32px;
          max-width: 500px;
        }

        .print-perks {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .print-perk {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: 'Afacad', sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #1c1c1c;
        }

        .print-perk-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #1c1c1c;
          color: #B35656;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          flex-shrink: 0;
        }

        /* Right Content (Text and Buttons) */
        .print-actions {
          flex: 0.8;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          background: #fff;
          padding: 48px;
          border-radius: 24px;
          box-shadow: 0 16px 40px rgba(0,0,0,0.08);
        }

        .print-actions h3 {
          font-family: 'Amaranth', sans-serif;
          font-size: 28px;
          font-weight: 700;
          color: #1c1c1c;
          margin-bottom: 12px;
        }

        .print-actions p {
          font-family: 'Afacad', sans-serif;
          font-size: 16px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 32px;
        }

        .action-btns {
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #1c1c1c;
          color: #fff;
          font-family: 'Afacad', sans-serif;
          font-size: 16px;
          font-weight: 700;
          padding: 16px 24px;
          border-radius: 12px;
          text-decoration: none;
          transition: transform 0.2s, background 0.2s;
          width: 100%;
        }

        .btn-primary:hover {
          background: #333;
          transform: translateY(-2px);
        }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          color: #1c1c1c;
          border: 2px solid #1c1c1c;
          font-family: 'Afacad', sans-serif;
          font-size: 16px;
          font-weight: 700;
          padding: 14px 24px;
          border-radius: 12px;
          text-decoration: none;
          transition: transform 0.2s, background 0.2s, color 0.2s;
          width: 100%;
        }

        .btn-secondary:hover {
          background: #1c1c1c;
          color: #fff;
          transform: translateY(-2px);
        }

        /* Responsive */
        @media (max-width: 960px) {
          .print-container {
            flex-direction: column;
            gap: 40px;
          }
          .print-content {
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .print-perks {
            align-items: flex-start;
            text-align: left;
          }
          .print-actions {
            width: 100%;
            align-items: center;
            text-align: center;
          }
        }
      `}</style>

      <div className="print-container">
        {/* Left Content */}
        <div className="print-content">
          <div className="print-badge">✦ Unlimited Possibilities</div>
          <h2>Print Your Own Design.<br /><span>Elevate Your Brand.</span></h2>
          <p>Don&apos;t settle for plain packaging. Upload your artwork, logo, and brand colors to create stunning, shelf-ready Mylar bags that captivate your customers.</p>

          <div className="print-perks">
            {[
              'Vibrant, edge-to-edge HD printing',
              'Matte, High-Gloss, & Metallic Holographic Finishes',
              'Free digital proofs before production begins'
            ].map((perk, i) => (
              <div className="print-perk" key={i}>
                <div className="print-perk-icon">✓</div>
                {perk}
              </div>
            ))}
          </div>
        </div>

        {/* Right Content (Text and Buttons instead of shapes) */}
        <div className="print-actions">
          <h3>Ready to Get Started?</h3>
          <p>Our packaging specialists are here to help you bring your vision to life. Request a quote or speak with an agent right now.</p>

          <div className="action-btns">
            <Link href="/#quote" className="btn-primary">
              Get a Custom Quote ➔
            </Link>
            <Link href="/contact" className="btn-secondary">
              Chat With an Agent
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
