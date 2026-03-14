'use client'

import React from 'react'
import { MessageSquare, ShoppingCart, ArrowRight, ShieldAlert } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Props {
  isOpen: boolean
  message: string
}

export const CheckoutErrorModal: React.FC<Props> = ({ isOpen, message }) => {
  const router = useRouter()
  if (!isOpen) return null

  const handleChatWithAgent = () => {
    // Redirect to homepage and signal to open chat
    router.push('/?openChat=true')
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#1c1c1c]/60 backdrop-blur-md" />

      {/* Modal Content */}
      <div className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-[#e8e4d8] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in duration-300">
        {/* Top Accent */}
        <div className="h-2 w-full bg-[#f0bc2e]" />

        <div className="p-8 pt-10">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f0bc2e]/10">
            <ShieldAlert size={32} className="text-[#f0bc2e]" />
          </div>

          <h2 className="mb-4 font-amaranth text-3xl font-bold leading-tight text-[#1c1c1c]">
            Transaction Error
          </h2>
          
          <p className="mb-8 font-afacad text-lg leading-relaxed text-[#555]">
            {message}
          </p>

          <div className="space-y-4">
            <button
              onClick={handleChatWithAgent}
              className="group flex w-full items-center justify-between rounded-full bg-[#1c1c1c] px-6 py-4 text-white transition-all hover:bg-[#333] active:scale-95 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <MessageSquare size={20} className="text-[#f0bc2e]" />
                <span className="font-afacad text-[16px] font-bold">Chat with Agent</span>
              </div>
              <ArrowRight size={20} className="opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
            </button>

            <Link
              href="/products"
              className="group flex w-full items-center justify-between rounded-full border-2 border-[#1c1c1c] px-6 py-4 text-[#1c1c1c] transition-all hover:bg-[#1c1c1c] hover:text-white active:scale-95"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart size={20} />
                <span className="font-afacad text-[16px] font-bold">Go back to shopping</span>
              </div>
              <ArrowRight size={20} className="opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
