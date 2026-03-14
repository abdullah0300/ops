'use client'

import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useState } from 'react'

export const HeaderSearch: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentQuery = searchParams.get('q') || ''
  const [value, setValue] = useState(currentQuery)

  const onSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (value.trim()) {
        router.push(`/products?q=${encodeURIComponent(value.trim())}`)
      } else {
        router.push('/products')
      }
    },
    [value, router],
  )

  return (
    <form className="header-search" onSubmit={onSearch}>
      <button type="submit" className="header-search-button">
        <Search className="header-search-icon" />
      </button>
      <input
        type="text"
        placeholder="Search products..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="header-search-input"
      />
    </form>
  )
}
