import { getCachedGlobal } from '@/utilities/getGlobals'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import React from 'react'
import './index.css'
import { HeaderClient } from './index.client'

export async function Header() {
  const header = await getCachedGlobal('header', 1)()
  const payload = await getPayload({ config: configPromise })

  const { docs: navProducts } = await payload.find({
    collection: 'products',
    limit: 3,
    sort: '-createdAt',
    depth: 0,
  })

  return <HeaderClient header={header} navProducts={navProducts as any} />
}
