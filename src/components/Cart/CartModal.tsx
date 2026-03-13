'use client'

import { Price } from '@/components/Price'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { ShoppingCart, X, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Media, Product } from '@/payload-types'
import { DeleteItemButton } from './DeleteItemButton'
import { EditItemQuantityButton } from './EditItemQuantityButton'
import { OpenCartButton } from './OpenCart'
import { cn } from '@/utilities/cn'

export function CartModal() {
  const { cart } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const { totalQuantity, subtotal } = useMemo(() => {
    if (!cart || !cart.items || !cart.items.length) return { totalQuantity: 0, subtotal: 0 }
    
    return cart.items.reduce((acc, item) => {
      const product = item.product as Product
      // Assume priceInUSD is dollars and we want cents for consistency with customPrice
      let price = (product?.priceInUSD || 0) * 100 
      
      // @ts-ignore
      if (item.customPrice) {
        // @ts-ignore
        price = item.customPrice // Already in cents
      }
      
      const qty = item.quantity || 0
      return {
        totalQuantity: acc.totalQuantity + qty,
        subtotal: acc.subtotal + (price * qty)
      }
    }, { totalQuantity: 0, subtotal: 0 })
  }, [cart])

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger asChild>
        <OpenCartButton quantity={totalQuantity > 0 ? totalQuantity : undefined} />
      </SheetTrigger>

      <SheetContent
        className="p-0 flex flex-col gap-0 overflow-hidden border-l border-[#e8e4d8] [&>button]:hidden font-afacad"
        side="right"
      >
        <div className="flex h-full flex-col bg-[#fcfcf9] overflow-hidden">

          {/* ── HEADER ── */}
          <SheetHeader className="shrink-0 px-8 pt-12 pb-8 bg-white border-b border-[#e8e4d8] relative">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <SheetTitle
                  className="text-[34px] font-bold text-[#1c1c1c] leading-[1.1] font-amaranth"
                >
                  Shopping Bag
                </SheetTitle>
                <SheetDescription className="text-[16px] text-[#888] font-medium font-afacad">
                  {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'} ready for checkout
                </SheetDescription>
              </div>
              
              <div className="flex items-center gap-4 pt-1">
                {/* Custom Close Button */}
                <button 
                  onClick={() => setIsOpen(false)}
                  className="group w-11 h-11 flex items-center justify-center rounded-full bg-[#f8f8f5] border border-[#e8e4d8] hover:bg-[#1c1c1c] hover:border-[#1c1c1c] transition-all duration-300 shadow-sm"
                  aria-label="Close cart"
                >
                  <X size={22} className="text-[#1c1c1c] group-hover:text-white transition-colors" />
                </button>
              </div>
            </div>
            
            {/* Minimal progress bar */}
            <div className="absolute bottom-0 left-0 h-[2px] bg-[#f0bc2e] transition-all duration-500" style={{ width: totalQuantity > 0 ? '100%' : '0%' }} />
          </SheetHeader>

          {/* ── MAIN CONTENT ── */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {!cart || !cart.items || cart.items.length === 0 ? (
              /* EMPTY STATE */
              <div className="flex-1 flex flex-col items-center justify-center px-10 text-center bg-[#fcfcf9]">
                <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center mb-8 border border-[#e8e4d8] shadow-[0_10px_30px_rgba(0,0,0,0.04)] relative">
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#e8e4d8] animate-[spin_20s_linear_infinite]" />
                  <ShoppingCart className="h-10 w-10 text-[#cbcbab]" />
                </div>
                <h3
                  className="text-3xl font-bold text-[#1c1c1c] mb-3 font-amaranth"
                >
                  Your bag is empty
                </h3>
                <p className="text-[#888] text-[17px] max-w-[260px] leading-relaxed mb-10 font-afacad">
                  Select your favorite packaging solutions to start your collection.
                </p>
                <Button
                  onClick={() => setIsOpen(false)}
                  className="bg-[#1c1c1c] hover:bg-[#333] text-white rounded-full px-12 h-14 font-bold text-[17px] transition-all duration-300 active:scale-95 shadow-lg shadow-black/10 font-afacad"
                >
                  Explore Products
                </Button>
              </div>
            ) : (
              /* PRODUCT LIST */
              <div className="flex-1 overflow-y-auto px-8 py-10 space-y-8 scrollbar-hide">
                {cart.items.map((item, i) => {
                  const product = item.product as Product
                  if (!product || typeof product !== 'object') return null

                  const metaImage = product.meta?.image as Media
                  const firstGalleryImage = product.gallery?.[0]?.image as Media
                  const image = firstGalleryImage || metaImage

                  let price = (product.priceInUSD || 0) * 100
                  // @ts-ignore
                  if (item.customPrice) price = item.customPrice

                  return (
                    <div
                      key={i}
                      className="group relative flex gap-6 bg-white rounded-[28px] border border-[#e8e4d8] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.06)] hover:border-[#dcd8cc] transition-all duration-500 ease-out"
                    >
                      {/* Image container */}
                      <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-[20px] bg-[#fcfcf9] border border-[#f0f0eb]">
                        {image?.url ? (
                          <Image
                            alt={image?.alt || product?.title || ''}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            height={240}
                            src={image.url}
                            width={240}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-5xl">📦</div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/2 transition-colors duration-500" />
                      </div>

                      {/* Info section */}
                      <div className="flex flex-1 flex-col justify-between min-w-0 py-1">
                        <div className="pr-10">
                          <h3
                            className="text-[22px] font-bold text-[#1c1c1c] leading-tight mb-2 tracking-tight group-hover:text-[#000] transition-colors font-amaranth"
                          >
                            {product?.title}
                          </h3>
                          {/* @ts-ignore */}
                          {item.selectedOptions && (
                            <div className="flex flex-wrap gap-1 mt-1 font-afacad">
                                {/* @ts-ignore */}
                                {item.selectedOptions.split(',').map((opt: string, idx: number) => (
                                    <span key={idx} className="text-[12px] bg-[#f8f8f5] text-[#777] px-2 py-0.5 rounded-md border border-[#f0f0eb]">
                                        {opt.trim()}
                                    </span>
                                ))}
                            </div>
                          )}
                        </div>

                        {/* Controls & Price */}
                        <div className="flex items-center justify-between mt-8">
                          <div className="flex h-11 items-center rounded-full border border-[#e8e4d8] bg-[#fcfcf9] p-1 shadow-sm">
                            <EditItemQuantityButton item={item} type="minus" />
                            <span className="w-12 text-center text-[16px] font-bold text-[#1c1c1c] font-afacad">
                              {item.quantity}
                            </span>
                            <EditItemQuantityButton item={item} type="plus" />
                          </div>

                          <div className="flex flex-col items-end">
                            <Price
                              amount={price * (item.quantity || 1)}
                              className="text-[24px] font-bold text-[#006838] leading-none font-amaranth"
                            />
                            {item.quantity > 1 && (
                                <span className="text-[12px] text-[#aaa] mt-1 font-medium italic font-afacad">
                                    <Price amount={price} /> per unit
                                </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Delete Action */}
                      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                        <DeleteItemButton item={item} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* ── FOOTER ── */}
          {cart?.items && cart.items.length > 0 && (
            <div className="shrink-0 px-8 pb-12 pt-10 bg-white border-t border-[#e8e4d8] shadow-[0_-15px_50px_rgba(0,0,0,0.04)] z-10">
              <div className="flex items-end justify-between mb-8">
                <div className="flex flex-col gap-1">
                  <h4
                    className="text-[22px] font-bold text-[#1c1c1c] font-amaranth"
                  >
                    Est. Subtotal
                  </h4>
                  <p className="text-[14px] text-[#999] font-medium italic font-afacad">
                    Final taxes & shipping calculated at checkout
                  </p>
                </div>
                <Price
                  amount={subtotal}
                  className="text-[38px] font-bold text-[#1c1c1c] leading-none tracking-tight font-amaranth"
                />
              </div>

              <div className="flex flex-col gap-4">
                <Button
                  asChild
                  className="w-full bg-[#1c1c1c] hover:bg-[#333] text-white rounded-full h-18 font-bold text-[20px] transition-all duration-300 active:scale-[0.97] shadow-xl shadow-black/10 group font-afacad"
                >
                  <Link href="/checkout" className="flex items-center justify-center gap-3">
                    Proceed to Delivery Info
                    <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2 text-[15px] text-[#999] hover:text-[#555] transition-colors text-center font-bold tracking-wide uppercase font-afacad"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}