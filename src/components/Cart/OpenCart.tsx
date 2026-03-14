import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import React from 'react'

export function OpenCartButton({
  className,
  quantity,
  ...rest
}: {
  className?: string
  quantity?: number
}) {
  return (
    <button
      className="relative flex items-center justify-center w-11 h-11 rounded-full hover:bg-black/5 transition-colors cursor-pointer border-none bg-transparent"
      aria-label={`Open cart${quantity ? `, ${quantity} items` : ''}`}
      {...rest}
    >
      {/* Icon */}
      <ShoppingCart size={26} className="text-[#1c1c1c]" strokeWidth={1.8} />

      {/* Badge — positioned relative to button, never clipped */}
      {quantity ? (
        <span
          style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            zIndex: 9999,
          }}
          className="bg-[#f0bc2e] text-[#1c1c1c] text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white leading-none"
        >
          {quantity > 99 ? '99+' : quantity}
        </span>
      ) : null}
    </button>
  )
}