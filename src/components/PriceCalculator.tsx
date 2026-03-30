'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { toast } from 'sonner'
import type { Product } from '@/payload-types'
import { ShoppingBag } from 'lucide-react'

interface PricingTier {
  quantity: number
  price: number
  id?: string | null
}

interface TieredAddon {
  label: string
  price?: number | null
  tieredPricing?: PricingTier[] | null
  id?: string | null
}

interface SizePricing {
  label: string
  quantityPricing: PricingTier[]
  id?: string | null
}

interface PriceCalculatorProps {
  product: Product
  quantityPricing?: PricingTier[] | null
  addons?: TieredAddon[] | null
}

export const PriceCalculator: React.FC<PriceCalculatorProps> = ({
  product,
  quantityPricing: defaultQuantityPricing,
  addons: productAddons,
}) => {
  const { cart, addItem, incrementItem } = useCart()

  const sizes = (product as any).sizes as SizePricing[] | undefined
  const hasSizes = sizes && sizes.length > 0

  const [selectedSizeIndex, setSelectedSizeIndex] = useState<number>(0)

  const currentPricingTable = useMemo(() => {
    if (hasSizes) return sizes[selectedSizeIndex].quantityPricing
    return defaultQuantityPricing || []
  }, [hasSizes, sizes, selectedSizeIndex, defaultQuantityPricing])

  const [selectedQty, setSelectedQty] = useState<number>(100)

  useEffect(() => {
    if (currentPricingTable.length > 0) {
      const exists = currentPricingTable.some((p) => p.quantity === selectedQty)
      if (!exists) setSelectedQty(currentPricingTable[0].quantity)
    }
  }, [currentPricingTable])

  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [isAdding, setIsAdding] = useState(false)

  const currentTier = useMemo(
    () => currentPricingTable.find((p) => p.quantity === selectedQty) || currentPricingTable[0],
    [selectedQty, currentPricingTable],
  )

  const getAddonPrice = (addon: TieredAddon, qty: number): number => {
    if (addon.tieredPricing && addon.tieredPricing.length > 0) {
      const sortedTiers = [...addon.tieredPricing].sort((a, b) => b.quantity - a.quantity)
      const tier = sortedTiers.find((t) => qty >= t.quantity) || sortedTiers[sortedTiers.length - 1]
      return tier.price
    }
    return addon.price || 0
  }

  const totalAddonsPrice = useMemo(
    () =>
      selectedAddons.reduce((sum, label) => {
        const addon = (productAddons || []).find((a) => a.label === label)
        if (!addon) return sum
        return sum + getAddonPrice(addon, selectedQty)
      }, 0),
    [selectedAddons, productAddons, selectedQty],
  )

  const totalPrice = useMemo(() => {
    if (!currentTier) return 0
    return currentTier.price + totalAddonsPrice
  }, [currentTier, totalAddonsPrice])

  const toggleAddon = (label: string) => {
    setSelectedAddons((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    )
  }

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      const sizeLabel = hasSizes ? ` (${sizes[selectedSizeIndex].label})` : ''
      const optionsString =
        selectedAddons.length > 0 ? selectedAddons.join(', ') : 'No special add-ons'
      const finalOptions = `${optionsString}${sizeLabel}`

      const existingItem = (cart?.items || []).find((item: any) => {
        const itemProductId = typeof item.product === 'object' ? item.product.id : item.product
        return itemProductId === product.id && item.selectedOptions === finalOptions
      })

      if (existingItem) {
        await incrementItem(existingItem.id)
      } else {
        await addItem(
          {
            product: product.id,
            // @ts-ignore
            customPrice: Math.round(totalPrice * 100),
            // @ts-ignore
            selectedOptions: finalOptions,
          },
          1,
        )
      }
      toast.success('Added to cart!')
    } catch (error) {
      console.error(error)
      toast.error('Failed to add to cart')
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="pc-wrap">
      <style jsx>{`
        .pc-wrap {
          display: flex;
          flex-direction: column;
          gap: 18px;
          font-family: 'Afacad', sans-serif;
        }

        /* ── Group ── */
        .pc-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .pc-label {
          font-family: 'Arya', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #1c1c1c;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        /* ── Select ── */
        .pc-select-wrap {
          position: relative;
          width: 100%;
        }

        .pc-select {
          width: 100%;
          padding: 12px 42px 12px 16px;
          border-radius: 12px;
          border: 1.5px solid #e8e8e0;
          background: #f8f8f4;
          font-family: 'Afacad', sans-serif;
          font-size: 15px;
          font-weight: 600;
          color: #1c1c1c;
          outline: none;
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          transition: border-color 0.2s;
        }

        .pc-select:focus {
          border-color: #8ca62d;
          background: #fff;
        }

        /* Arrow — absolutely positioned INSIDE the wrapper, overlapping the select */
        .pc-select-arrow {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          width: 18px;
          height: 18px;
          pointer-events: none;
          color: #8ca62d;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ── Addons ── */
        .pc-addons {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .pc-addon {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 10px;
          border: 1.5px solid #e8e8e0;
          background: #fafaf8;
          cursor: pointer;
          transition: all 0.2s;
          user-select: none;
        }

        .pc-addon:hover {
          border-color: #c8e6a0;
          background: #f5fff0;
        }

        .pc-addon.active {
          border-color: #8ca62d;
          background: #efffe5;
        }

        .pc-addon-check {
          width: 18px;
          height: 18px;
          border-radius: 5px;
          border: 1.5px solid #ccc;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s;
        }

        .pc-addon.active .pc-addon-check {
          background: #8ca62d;
          border-color: #8ca62d;
        }

        .pc-addon-label {
          flex: 1;
          font-size: 14px;
          font-weight: 600;
          color: #444;
        }

        .pc-addon-price {
          font-size: 13px;
          font-weight: 700;
          color: #8ca62d;
        }

        /* ── Summary ── */
        .pc-summary {
          background: #efffe5;
          border: 1.5px solid #c8e6a0;
          border-radius: 16px;
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .pc-total-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 8px;
        }

        .pc-total-left {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .pc-total-label {
          font-family: 'Arya', sans-serif;
          font-size: 12px;
          font-weight: 700;
          color: #5a7a1a;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .pc-unit-note {
          font-size: 12px;
          color: #6a8a2a;
          font-style: italic;
        }

        .pc-total-price {
          font-family: 'Amaranth', sans-serif;
          font-size: 38px;
          font-weight: 700;
          color: #1c1c1c;
          line-height: 1;
          letter-spacing: -0.02em;
        }

        /* ── Add to Cart button — only one allowed to be black ── */
        .pc-btn-cart {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: #1c1c1c;
          color: #fff;
          font-family: 'Afacad', sans-serif;
          font-weight: 700;
          font-size: 16px;
          padding: 15px 24px;
          border-radius: 100px;
          border: none;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
        }

        .pc-btn-cart:hover:not(:disabled) {
          background: #333;
          transform: translateY(-1px);
        }

        .pc-btn-cart:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .pc-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: pc-spin 0.7s linear infinite;
          flex-shrink: 0;
        }

        @keyframes pc-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Size selector */}
      {hasSizes && (
        <div className="pc-group">
          <label className="pc-label">Select Size</label>
          <div className="pc-select-wrap">
            <select
              className="pc-select"
              value={selectedSizeIndex}
              onChange={(e) => setSelectedSizeIndex(Number(e.target.value))}
            >
              {sizes.map((size, idx) => (
                <option key={idx} value={idx}>
                  {size.label}
                </option>
              ))}
            </select>
            {/* Arrow SVG — always inside wrapper, always correctly positioned */}
            <span className="pc-select-arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </div>
        </div>
      )}

      {/* Quantity selector */}
      <div className="pc-group">
        <label className="pc-label">Select Quantity</label>
        <div className="pc-select-wrap">
          <select
            className="pc-select"
            value={selectedQty}
            onChange={(e) => setSelectedQty(Number(e.target.value))}
          >
            {[...currentPricingTable]
  .sort((a, b) => b.quantity - a.quantity)
  .map((tier) => (
    <option key={tier.quantity} value={tier.quantity}>
      {tier.quantity.toLocaleString()} Units
    </option>
))}
          </select>
          <span className="pc-select-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>
      </div>

      {/* Addons */}
      {productAddons && productAddons.length > 0 && (
        <div className="pc-group">
          <label className="pc-label">Add-ons & Options</label>
          <div className="pc-addons">
            {productAddons.map((addon) => {
              const addonPrice = getAddonPrice(addon, selectedQty)
              const isActive = selectedAddons.includes(addon.label)
              return (
                <div
                  key={addon.label}
                  className={`pc-addon${isActive ? ' active' : ''}`}
                  onClick={() => toggleAddon(addon.label)}
                >
                  <div className="pc-addon-check">
                    {isActive && (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className="pc-addon-label">{addon.label}</span>
                  <span className="pc-addon-price">
                    {addonPrice > 0 ? `+$${addonPrice}` : 'Free'}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Summary + CTA */}
      <div className="pc-summary">
        <div className="pc-total-row">
          <div className="pc-total-left">
            <span className="pc-total-label">Estimated Total</span>
            <span className="pc-unit-note">
              {selectedQty.toLocaleString()} units
              {hasSizes ? ` · ${sizes[selectedSizeIndex].label}` : ''}
            </span>
          </div>
          <div className="pc-total-price">${totalPrice.toLocaleString()}</div>
        </div>

        <button
          className="pc-btn-cart"
          onClick={handleAddToCart}
          disabled={isAdding || currentPricingTable.length === 0}
        >
          {isAdding ? (
            <div className="pc-spinner" />
          ) : (
            <ShoppingBag size={18} />
          )}
          {isAdding ? 'Adding to Cart...' : 'Add to Cart / Buy Now'}
        </button>
      </div>
    </div>
  )
}