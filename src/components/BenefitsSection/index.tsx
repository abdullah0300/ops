import React from 'react'
import { ShieldCheck, Wallet, PackageOpen, PenTool, Zap } from 'lucide-react'
import './index.css'

const BENEFITS = [
  {
    title: 'High-Barrier Quality',
    icon: ShieldCheck,
  },
  {
    title: 'Wholesale Pricing',
    icon: Wallet,
  },
  {
    title: 'Custom Sizes & Styles',
    icon: PackageOpen,
  },
  {
    title: 'Free Design Support',
    icon: PenTool,
  },
  {
    title: 'Fast Turnaround',
    icon: Zap,
  },
]

export const BenefitsSection = () => {
  return (
    <section className="benefits-section">
      <div className="container">
        <div className="benefits-header">
          <h2>One place to get your custom packaging</h2>
          <p>We offer tailored packaging solutions with expert support, fast 10-11 business day turnaround, and pricing you'll love</p>
        </div>
        <div className="benefits-grid">
          {BENEFITS.map((benefit, index) => (
            <div key={index} className="benefit-item">
              <div className="benefit-icon-wrapper">
                <benefit.icon size={36} strokeWidth={1.5} />
              </div>
              <h3>{benefit.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
