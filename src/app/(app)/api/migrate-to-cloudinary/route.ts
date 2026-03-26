/**
 * One-time migration endpoint: Vercel Blob → Cloudinary
 *
 * Runs server-side ON VERCEL so it can access Vercel Blob files
 * (external machines get 403 due to Vercel's access control).
 *
 * Protected by MIGRATION_SECRET env var.
 *
 * Usage (run once from browser or curl):
 *   GET https://onlinepackagingstore.com/api/migrate-to-cloudinary?secret=YOUR_SECRET
 *
 * Add to Vercel env vars:
 *   MIGRATION_SECRET=any-long-random-string
 */

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { v2 as cloudinary } from 'cloudinary'
import { list } from '@vercel/blob'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
})

const FOLDER = 'payload-media'
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || ''

function toPublicId(filename: string) {
  return `${FOLDER}/${filename.replace(/\.[^/.]+$/, '')}`
}

function resourceType(mimeType: string): 'image' | 'video' | 'auto' {
  if (mimeType?.startsWith('image/')) return 'image'
  if (mimeType?.startsWith('video/')) return 'video'
  return 'auto'
}

export const maxDuration = 300 // 5 min timeout (Vercel Pro)

export async function GET(req: NextRequest) {
  // Auth check
  const secret = req.nextUrl.searchParams.get('secret')
  if (!secret || secret !== process.env.MIGRATION_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results = { uploaded: 0, alreadyExists: 0, notInBlob: 0, failed: 0, errors: [] as string[] }

  try {
    // 1. Get all real blob URLs
    const blobMap = new Map<string, string>()
    let cursor: string | undefined
    do {
      const page = await list({ token: BLOB_TOKEN, limit: 1000, ...(cursor ? { cursor } : {}) })
      for (const blob of page.blobs) {
        const filename = blob.pathname.split('/').pop()!
        blobMap.set(filename, blob.url)
      }
      cursor = page.hasMore ? page.cursor : undefined
    } while (cursor)

    // 2. Get all media items
    const payload = await getPayload({ config: configPromise })
    const { docs: allMedia } = await payload.find({
      collection: 'media',
      limit: 1000,
      pagination: false,
      overrideAccess: true,
    })

    // 3. Migrate each file
    for (const item of allMedia) {
      const filename: string = (item as any).filename || ''
      const mime: string = (item as any).mimeType || ''
      if (!filename) continue

      const blobUrl = blobMap.get(filename)
      if (!blobUrl) { results.notInBlob++; continue }

      const publicId = toPublicId(filename)
      const rType = resourceType(mime)

      // Skip if already on Cloudinary
      try {
        await cloudinary.api.resource(publicId, { resource_type: rType })
        results.alreadyExists++
        continue
      } catch { /* not there yet */ }

      try {
        // Download from Vercel Blob (works on Vercel's own network)
        const res = await fetch(blobUrl)
        if (!res.ok) throw new Error(`Blob fetch ${res.status}: ${blobUrl}`)
        const buffer = Buffer.from(await res.arrayBuffer())

        // Upload to Cloudinary
        await new Promise<void>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { public_id: publicId, resource_type: rType, overwrite: true, quality: 'auto:best' },
            (err) => (err ? reject(err) : resolve()),
          )
          stream.end(buffer)
        })

        results.uploaded++
      } catch (err: any) {
        results.failed++
        results.errors.push(`${filename}: ${err?.message}`)
      }
    }
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, ...results })
}
