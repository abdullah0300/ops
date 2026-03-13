'use client'

import React, { useState, useEffect } from 'react'
import { X, MessageSquare, FileText, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/utilities/cn'
import './index.css'

export const PromoBannerModal: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (isDismissed) return

      // Show after scrolling 600px (past hero)
      if (window.scrollY > 600) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isDismissed])

  if (isDismissed) return null

  return (
    <div
      className={cn(
        'promo-banner-modal fixed right-6 top-1/2 z-[400] -translate-y-1/2 transition-all duration-700 ease-out',
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[150%] opacity-0'
      )}
    >
      <div className="promo-banner-content relative flex h-[580px] w-[280px] flex-col overflow-hidden rounded-[40px] border border-[#e8e4d8] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
        {/* Background Accent */}
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[#f0bc2e]/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-[#006838]/5 blur-3xl" />

        {/* Close Button */}
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute right-5 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#f8f8f5] transition-colors hover:bg-[#eceae0]"
        >
          <X size={16} className="text-[#1c1c1c]" />
        </button>

        {/* Content Area */}
        <div className="flex flex-1 flex-col px-8 pt-16">
          <span className="mb-4 inline-block text-[12px] font-bold uppercase tracking-[0.2em] text-[#006838] font-afacad">
            Custom Packaging
          </span>
          <h2 className="mb-6 text-[38px] font-bold leading-[1.1] text-[#1c1c1c] font-amaranth">
            Create Your <br />
            <span className="text-[#f0bc2e]">Custom</span> <br />
            Mailer.
          </h2>
          <p className="mb-10 text-[17px] leading-relaxed text-[#666] font-afacad">
            Elevate your brand with premium, eco-friendly custom mailers tailored to your needs.
          </p>

          <div className="mt-auto space-y-4 pb-10">
            <a
              href="https://wa.me/17737292243"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex w-full items-center justify-between rounded-full bg-[#1c1c1c] px-6 py-4 text-white transition-all hover:bg-[#333] active:scale-95"
            >
              <div className="flex items-center gap-3">
                <MessageSquare size={18} className="text-[#f0bc2e]" />
                <span className="font-bold text-[15px] font-afacad">Talk to Agent</span>
              </div>
              <ArrowRight size={18} className="opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
            </a>

            <Link
              href="/#quote"
              className="group flex w-full items-center justify-between rounded-full border-2 border-[#1c1c1c] px-6 py-4 text-[#1c1c1c] transition-all hover:bg-[#1c1c1c] hover:text-white active:scale-95"
            >
              <div className="flex items-center gap-3">
                <FileText size={18} />
                <span className="font-bold text-[15px] font-afacad">Get a Quote</span>
              </div>
              <ArrowRight size={18} className="opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
