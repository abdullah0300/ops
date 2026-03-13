import { Button } from '@/components/ui/button'
import clsx from 'clsx'
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
    <Button
      variant="nav"
      size="clear"
      className="navLink relative items-end hover:cursor-pointer"
      {...rest}
    >
      <div className="relative">
        <ShoppingCart size={24} className="text-[#1c1c1c]" strokeWidth={2} />
        {quantity ? (
          <span className="absolute -top-2 -right-2 bg-[#f0bc2e] text-[#1c1c1c] text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white">
            {quantity}
          </span>
        ) : null}
      </div>
    </Button>
  )
}
