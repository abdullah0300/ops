'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { cn } from '@/utilities/cn'

export const FloatingWhatsApp: React.FC = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const whatsappNumber = '17737292243'
  const whatsappUrl = `https://wa.me/${whatsappNumber}`

  useEffect(() => {
    const openChat = searchParams.get('openChat')
    if (openChat === 'true') {
      // @ts-ignore
      if (typeof window !== 'undefined' && window.zE) {
        // @ts-ignore
        window.zE('messenger', 'open')
        
        // Clear the param after opening to avoid re-triggering on reload
        const newParams = new URLSearchParams(searchParams.toString())
        newParams.delete('openChat')
        router.replace(`?${newParams.toString()}`)
      } else {
        // Fallback to WhatsApp if Zendesk is not loaded
        window.open(whatsappUrl, '_blank')
      }
    }
  }, [searchParams, router, whatsappUrl])

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group fixed bottom-6 left-8 z-[300] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95'
      )}
      aria-label="Contact us on WhatsApp"
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="drop-shadow-sm"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.531 5.854L0 24l6.335-1.51C8.055 23.447 9.987 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.859 0-3.587-.5-5.077-1.371l-.361-.214-3.762.897.934-3.658-.235-.374C2.538 15.591 2 13.855 2 12 2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
      </svg>
      
      {/* Tooltip */}
      <span className="absolute bottom-full right-0 mb-3 whitespace-nowrap rounded-lg bg-[#1c1c1c] px-3 py-1.5 text-[13px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100 font-afacad shadow-lg">
        Chat on WhatsApp
        <span className="absolute top-full right-5 h-2 w-2 -translate-y-1 rotate-45 bg-[#1c1c1c]" />
      </span>
    </a>
  )
}
