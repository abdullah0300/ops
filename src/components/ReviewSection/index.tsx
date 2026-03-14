import React from 'react'
import { Star, Phone } from 'lucide-react'
import './index.css'

const TESTIMONIALS = [
  {
    id: 1,
    text: 'Yes, at OPS, we offer free samples for you to evaluate the quality and designs before you order anything in bulk. You only need to contact us, and our team will guide you',
    author: 'Ely James',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&auto=format&fit=crop'
  },
  {
    id: 2,
    text: 'Yes, at OPS, we offer free samples for you to evaluate the quality and designs before you order anything in bulk. You only need to contact us, and our team will guide you',
    author: 'Sarah Chen',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop'
  },
  {
    id: 3,
    text: 'Yes, at OPS, we offer free samples for you to evaluate the quality and designs before you order anything in bulk. You only need to contact us, and our team will guide you',
    author: 'Marcus Reed',
    img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=150&h=150&auto=format&fit=crop'
  },
  {
    id: 4,
    text: 'Yes, at OPS, we offer free samples for you to evaluate the quality and designs before you order anything in bulk. You only need to contact us, and our team will guide you',
    author: 'David Wilson',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&h=150&auto=format&fit=crop'
  }
]

export const ReviewSection = () => {
  return (
    <section className="review-section">
      <div className="container review-container">
        {/* Left Side: Header & CTA */}
        <div className="review-intro">
          <h2>Hear What <br /> They're Saying</h2>
          
          <div className="review-stats">
            <div className="stat-avatars">
              <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&h=100&auto=format&fit=crop" alt="user" />
              <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&h=100&auto=format&fit=crop" alt="user" />
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&h=100&auto=format&fit=crop" alt="user" />
            </div>
            <div className="stat-content">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="#F0BC2E" color="#F0BC2E" />
                ))}
              </div>
              <p>4M+ trusted Customers</p>
            </div>
          </div>

          <div className="review-actions">
            {/* ✅ Updated className from btn-get-quote to review-btn-quote */}
            <a href="/#quote" className="review-btn-quote">Get your Quote</a>
            <a href="tel:5592057588" className="phone-link">
              <Phone size={16} />
              <span>Call Now: 559-205-7588</span>
            </a>
          </div>
        </div>

        {/* Right Side: Staggered Cards */}
        <div className="review-grid">
          <div className="review-col col-1">
            {TESTIMONIALS.slice(0, 2).map((item) => (
              <div key={item.id} className="testimonial-card">
                <p className="card-text">{item.text}</p>
                <div className="card-author">
                  <img src={item.img} alt={item.author} />
                  <span>{item.author}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="review-col col-2">
            {TESTIMONIALS.slice(2, 4).map((item) => (
              <div key={item.id} className="testimonial-card">
                <p className="card-text">{item.text}</p>
                <div className="card-author">
                  <img src={item.img} alt={item.author} />
                  <span>{item.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}