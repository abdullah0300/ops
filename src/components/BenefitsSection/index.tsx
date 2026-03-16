import React from 'react'
import { ShieldCheck, Wallet, PackageOpen, PenTool, Zap } from 'lucide-react'
import './index.css'

const BENEFITS = [
  {
    title: 'High-Barrier Quality',
    desc: 'Premium materials built to last',
    icon: ShieldCheck,
  },
  {
    title: 'Wholesale Pricing',
    desc: 'Competitive rates at any volume',
    icon: Wallet,
  },
  {
    title: 'Custom Sizes & Styles',
    desc: 'Tailored to your exact needs',
    icon: PackageOpen,
  },
  {
    title: 'Free Design Support',
    desc: 'Expert help from our team',
    icon: PenTool,
  },
  {
    title: 'Fast Turnaround',
    desc: '8–12 business days to your door',
    icon: Zap,
  },
]

export const BenefitsSection = () => {
  return (
    <section className="benefits-section">
      <div className="container">

        <div className="benefits-header">
          <span className="benefits-eyebrow">Why Choose Us</span>
          <h2>One place for all your <span>custom packaging</span></h2>
          <p>Expert support, fast 10–11 business day turnaround, and pricing built for brands that want to grow.</p>
        </div>

        <div className="benefits-grid">
          {BENEFITS.map((benefit, index) => (
            <div key={index} className="benefit-item">
              <div className="benefit-icon-wrapper">
                <benefit.icon size={28} strokeWidth={1.5} />
              </div>
              <h3>{benefit.title}</h3>
              <p>{benefit.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}