'use client'

import { Message } from '@/components/Message'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useCallback, FormEvent, useState } from 'react'
import { Address } from '@/payload-types'

import { useCart } from '@payloadcms/plugin-ecommerce/client/react'

type Props = {
  customerEmail?: string
  billingAddress?: Partial<Address>
  shippingAddress?: Partial<Address>
  setProcessingPayment: React.Dispatch<React.SetStateAction<boolean>>
}

export const CheckoutForm: React.FC<Props> = ({
  customerEmail,
  billingAddress,
  shippingAddress,
  setProcessingPayment,
}) => {
  const [error, setError] = React.useState<null | string>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const { cart } = useCart()

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      setIsLoading(true)
      setProcessingPayment(true)
      setError(null)

      try {
        // Save the lead data to the Admin panel
        await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/leads`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: customerEmail,
            firstName: billingAddress?.firstName,
            lastName: billingAddress?.lastName,
            phone: billingAddress?.phone,
            addressLine1: billingAddress?.addressLine1,
            addressLine2: billingAddress?.addressLine2,
            city: billingAddress?.city,
            state: billingAddress?.state,
            postalCode: billingAddress?.postalCode,
            country: billingAddress?.country,
            cartData: cart,
            status: 'new',
          }),
        })
      } catch (err) {
        console.error('Failed to save lead:', err)
      }

      // Simulate a processing delay for "premium" feel and to make the "Card not accepted" message more believable
      setTimeout(() => {
        setError('Your card is not accepted and a representative will call you for further details.')
        setIsLoading(false)
        setProcessingPayment(false)
      }, 2000)
    },
    [setProcessingPayment, customerEmail, billingAddress, cart],
  )

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-md">
      {error && <Message error={error} />}
      
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input 
            id="cardNumber" 
            placeholder="0000 0000 0000 0000" 
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="expiry">Expiry Date</Label>
            <Input 
              id="expiry" 
              placeholder="MM/YY" 
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cvc">CVC</Label>
            <Input 
              id="cvc" 
              placeholder="000" 
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Button disabled={isLoading} type="submit" variant="default" className="w-full h-12 text-lg">
          {isLoading ? 'Processing...' : 'Pay now'}
        </Button>
      </div>
    </form>
  )
}
