import { getCachedGlobal } from '@/utilities/getGlobals'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import React from 'react'
import './index.css'
import { HeaderClient } from './index.client'

export async function Header() {
  const header = await getCachedGlobal('header', 1)()
  const headerData = header as any

  let navProducts: any[]

  if (headerData.navProducts?.length > 0) {
    // Admin has manually chosen products — use them directly (already populated at depth 2)
    navProducts = headerData.navProducts
  } else {
    // Fallback: latest 3 products
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'products',
      limit: 3,
      sort: '-createdAt',
      depth: 0,
    })
    navProducts = docs
  }

  return <HeaderClient header={header} navProducts={navProducts} />
}
