'use client'

import { CartItem } from '@/components/Cart'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import clsx from 'clsx'
import { MinusIcon, PlusIcon } from 'lucide-react'
import React, { useMemo } from 'react'

export function EditItemQuantityButton({ type, item }: { item: CartItem; type: 'minus' | 'plus' }) {
  const { decrementItem, incrementItem, isLoading } = useCart()

  const disabled = useMemo(() => {
    if (!item.id) return true

    const target =
      item.variant && typeof item.variant === 'object'
        ? item.variant
        : item.product && typeof item.product === 'object'
          ? item.product
          : null

    if (
      target &&
      typeof target === 'object' &&
      target.inventory !== undefined &&
      target.inventory !== null
    ) {
      if (type === 'plus' && item.quantity !== undefined && item.quantity !== null) {
        return item.quantity >= target.inventory
      }
    }

    return false
  }, [item, type])

  return (
    <form>
      <button
        aria-label={type === 'plus' ? 'Increase quantity' : 'Decrease quantity'}
        className={clsx(
          'ease flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 hover:bg-[#1c1c1c] hover:text-white active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit',
          {
            'cursor-not-allowed': isLoading,
          },
        )}
        disabled={isLoading || (type === 'minus' && item.quantity === 1)}
        onClick={(e: React.FormEvent<HTMLButtonElement>) => {
          e.preventDefault()
          if (!item.id) return
          if (type === 'plus') {
            incrementItem(item.id)
          } else {
            decrementItem(item.id)
          }
        }}
        type="button"
      >
        {type === 'plus' ? (
          <PlusIcon className="h-4 w-4" />
        ) : (
          <MinusIcon className="h-4 w-4" />
        )}
      </button>
    </form>
  )
}
