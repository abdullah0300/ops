'use client'

import React, { useState, useMemo } from 'react'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { toast } from 'sonner'
import type { Product } from '@/payload-types'
import { ShoppingBag } from 'lucide-react'

interface Addon {
  label: string
  price: number
}

interface PricingTier {
  quantity: number
  price: number
}

interface PriceCalculatorProps {
  product: Product
  quantityPricing: PricingTier[]
  addons: Addon[]
}

export const PriceCalculator: React.FC<PriceCalculatorProps> = ({ product, quantityPricing, addons }) => {
  const { cart, addItem, incrementItem } = useCart()
  const [selectedQty, setSelectedQty] = useState<number>(
    quantityPricing.length > 0 ? quantityPricing[0].quantity : 100
  )
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])
  const [isAdding, setIsAdding] = useState(false)

  const currentTier = useMemo(() => {
    return quantityPricing.find((p) => p.quantity === selectedQty) || quantityPricing[0]
  }, [selectedQty, quantityPricing])

  const totalAddonsPrice = useMemo(() => {
    return selectedAddons.reduce((sum, label) => {
      const addon = addons.find((a) => a.label === label)
      return sum + (addon?.price || 0)
    }, 0)
  }, [selectedAddons, addons])

  const totalPrice = useMemo(() => {
    if (!currentTier) return 0
    return currentTier.price + totalAddonsPrice
  }, [currentTier, totalAddonsPrice])

  const toggleAddon = (label: string) => {
    setSelectedAddons((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    )
  }

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      // Find if this exact item (same product AND same options) is already in cart
      const existingItem = (cart?.items || []).find((item: any) => {
        const itemProductId = typeof item.product === 'object' ? item.product.id : item.product
        return itemProductId === product.id && item.selectedOptions === (selectedAddons.length > 0 ? selectedAddons.join(', ') : 'No special add-ons')
      })

      if (existingItem) {
        // If it exists, we just increment quantity by 1 set
        await incrementItem(existingItem.id)
      } else {
        await addItem({
            product: product.id,
            // @ts-ignore - custom fields added via plugin
            customPrice: Math.round(totalPrice * 100),
            // @ts-ignore - custom fields added via plugin
            selectedOptions: selectedAddons.length > 0 ? selectedAddons.join(', ') : 'No special add-ons',
        }, 1)
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
    <div className="calculator-card">
      <style jsx>{`
        .calculator-card {
          background: #fff;
          border: 1.5px solid #e8e4d8;
          border-radius: 20px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          font-family: 'Afacad', sans-serif;
        }
        .calc-header {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .calc-title {
          font-family: 'Amaranth', sans-serif;
          font-size: 20px;
          color: #1c1c1c;
        }
        .calc-subtitle {
          font-family: 'Arya', sans-serif;
          font-size: 14px;
          color: #888;
        }
        .calc-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .calc-label {
          font-family: 'Arya', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #1c1c1c;
        }
        .qty-select {
          width: 100%;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1.5px solid #e8e4d8;
          background: #fcfbf7;
          font-family: 'Afacad', sans-serif;
          font-size: 16px;
          outline: none;
          cursor: pointer;
        }
        .addons-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .addon-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 12px;
          border: 1.5px solid #f0f0eb;
          cursor: pointer;
          transition: all 0.2s;
        }
        .addon-item:hover {
          background: #fcfbf7;
        }
        .addon-item.selected {
          border-color: #f0bc2e;
          background: #fffcf5;
        }
        .addon-checkbox {
          width: 18px;
          height: 18px;
          accent-color: #f0bc2e;
        }
        .addon-label {
          flex: 1;
          font-size: 14px;
          color: #444;
        }
        .addon-price {
          font-weight: 700;
          color: #1c1c1c;
        }
        .summary-section {
          margin-top: 10px;
          padding: 20px;
          background: #fcfbf7;
          border-radius: 16px;
          border: 1.5px solid #e8e4d8;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .total-display {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .total-label {
          font-family: 'Arya', sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #666;
        }
        .total-value {
          font-family: 'Amaranth', sans-serif;
          font-size: 32px;
          color: #1c1c1c;
          line-height: 1;
        }
        .unit-note {
          font-size: 13px;
          color: #999;
          margin-top: -8px;
        }
        .btn-add-to-cart {
          width: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: #1c1c1c;
          color: #fff;
          font-family: 'Afacad', sans-serif;
          font-weight: 700;
          font-size: 16px;
          padding: 16px;
          border-radius: 100px;
          border: none;
          cursor: pointer;
          transition: transform 0.2s, background 0.2s;
        }
        .btn-add-to-cart:hover {
          background: #333;
          transform: translateY(-2px);
        }
        .btn-add-to-cart svg {
          stroke: #fff;
        }
      `}</style>
      
      <div className="calc-header">
        <h3 className="calc-title">Price Calculator</h3>
        <p className="calc-subtitle">Select quantity and options</p>
      </div>

      <div className="calc-group">
        <label className="calc-label">Select Quantity</label>
        <select 
          className="qty-select"
          value={selectedQty}
          onChange={(e) => setSelectedQty(Number(e.target.value))}
        >
          {quantityPricing.map((tier) => (
            <option key={tier.quantity} value={tier.quantity}>
              {tier.quantity.toLocaleString()}+ Units
            </option>
          ))}
        </select>
      </div>

      <div className="calc-group">
        <label className="calc-label">Add-ons & Extras</label>
        <div className="addons-list">
          {addons.map((addon) => (
            <div 
              key={addon.label}
              className={`addon-item ${selectedAddons.includes(addon.label) ? 'selected' : ''}`}
              onClick={() => toggleAddon(addon.label)}
            >
              <input 
                type="checkbox" 
                className="addon-checkbox"
                checked={selectedAddons.includes(addon.label)}
                readOnly
              />
              <span className="addon-label">{addon.label}</span>
              <span className="addon-price">
                {addon.price > 0 ? `+$${addon.price}` : 'Free'}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Total Section */}
      <div className="summary-section">
        <div className="total-display">
          <div className="total-label">Estimated Total:</div>
          <div className="total-value">${totalPrice.toLocaleString()}</div>
        </div>
        <div className="unit-note">Based on {selectedQty.toLocaleString()} units</div>

        <div className="action-buttons">
          <button 
            className="btn-add-to-cart"
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            {isAdding ? (
               <div className="spinner" />
            ) : (
              <ShoppingBag size={20} />
            )}
            {isAdding ? 'Adding...' : 'Add to Cart / Buy Now'}
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .spinner {
          width: 20px;
          height: 20px;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-top: 2.5px solid #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
