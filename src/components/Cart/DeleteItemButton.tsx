'use client'

import type { CartItem } from '@/components/Cart'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import clsx from 'clsx'
import { XIcon } from 'lucide-react'
import React from 'react'

export function DeleteItemButton({ item }: { item: CartItem }) {
  const { isLoading, removeItem } = useCart()
  const itemId = item.id

  return (
    <form>
      <button
        aria-label="Remove cart item"
        className={clsx(
          'ease hover:cursor-pointer flex h-9 w-9 items-center justify-center rounded-full bg-white border border-[#e8e4d8] shadow-sm transition-all duration-300 hover:bg-[#fff5f5] hover:border-[#ffcccc] group active:scale-90',
          {
            'cursor-not-allowed opacity-50': !itemId || isLoading,
          },
        )}
        disabled={!itemId || isLoading}
        onClick={(e: React.FormEvent<HTMLButtonElement>) => {
          e.preventDefault()
          if (itemId) removeItem(itemId)
        }}
        type="button"
      >
        <XIcon className="h-4 w-4 text-[#888] group-hover:text-[#ff4444] transition-colors" />
      </button>
    </form>
  )
}
