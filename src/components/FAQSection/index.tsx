import React from 'react'
import { AccordionItem } from './AccordionItem'
import './index.css'

const FAQ_DATA = [
  {
    question: 'What is the minimum order quantity for custom Mylar bags?',
    answer: 'Our minimum order quantity for custom printed Mylar bags starts at 500 units. This allows us to maintain high print quality while keeping costs competitive for growing brands.'
  },
  {
    question: 'Do you ship to all US states?',
    answer: 'Yes, we provide nationwide shipping across all 50 US states. Standard shipping times typically range from 3-5 business days depending on your location.'
  },
  {
    question: 'Are your Mylar bags smell-proof and food-safe?',
    answer: 'Absolutely. All our Mylar bags are manufactured using FDA-certified food-grade materials and feature high-barrier construction that is 100% smell-proof and moisture-resistant.'
  },
  {
    question: 'Can I get a custom design and logo printed on my bags?',
    answer: 'Yes! We specialize in full-color, edge-to-edge custom printing. You can provide your own artwork, or work with our design team to create a professional look for your brand.'
  },
  {
    question: 'What sizes do your Mylar bags come in?',
    answer: 'We offer a wide range of standard sizes from 1g to 1lb, including stand-up pouches, flat bags, and die-cut shapes. We can also create custom dimensions tailored to your specific product.'
  },
  {
    question: 'How long does production and shipping take?',
    answer: 'Standard production time is 10-12 business days after artwork approval. With shipping, most customers receive their custom orders within 3 weeks.'
  },
  {
    question: 'Do you offer plain (non-custom) Mylar bags in bulk?',
    answer: 'Yes, we maintain a large inventory of blank Mylar bags in various colors and sizes available for immediate wholesale purchase.'
  }
]

export const FAQSection = () => {
  return (
    <section className="faq-section">
      <div className="container">
        <div className="faq-header">
          <span className="faq-label">FAQ</span>
          <h2>Frequently Asked Questions</h2>
        </div>
        <div className="faq-list">
          {FAQ_DATA.map((item, index) => (
            <AccordionItem key={index} {...item} />
          ))}
        </div>
      </div>
    </section>
  )
}
