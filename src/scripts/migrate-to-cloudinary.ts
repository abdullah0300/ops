/**
 * Migration script: Vercel Blob → Cloudinary
 *
 * Uses @vercel/blob list() to get the REAL stored URLs for every blob,
 * downloads each file locally using the token, then uploads to Cloudinary.
 * No database updates needed — the url field is generated dynamically by
 * the active storage plugin on every read.
 *
 * Run once with:
 *   npx dotenv-cli -e .env -- npm run migrate:cloudinary
 */

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { v2 as cloudinary } from 'cloudinary'
import { list } from '@vercel/blob'

// ─── Cloudinary config ─────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'ddgzjzd9q',
  api_key: process.env.CLOUDINARY_API_KEY || '434747626758977',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'Ttl36pnqCiUHI7Zi22afF-a1XVE',
  secure: true,
})

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || ''
const CLOUDINARY_FOLDER = 'payload-media'

if (!BLOB_TOKEN) {
  console.error('ERROR: BLOB_READ_WRITE_TOKEN is not set in .env')
  process.exit(1)
}

function toPublicId(filename: string): string {
  return `${CLOUDINARY_FOLDER}/${filename.replace(/\.[^/.]+$/, '')}`
}

function resourceType(mimeType: string): 'image' | 'video' | 'raw' {
  if (mimeType?.startsWith('image/')) return 'image'
  if (mimeType?.startsWith('video/')) return 'video'
  return 'raw'
}

/** Fetch all blobs from Vercel Blob store using list() — handles pagination */
async function getAllBlobs(): Promise<Map<string, string>> {
  const map = new Map<string, string>() // filename → actual blob URL
  let cursor: string | undefined
  let page = 1

  console.log('Fetching blob list from Vercel Blob store...')

  do {
    const result = await list({
      token: BLOB_TOKEN,
      limit: 1000,
      ...(cursor ? { cursor } : {}),
    })

    for (const blob of result.blobs) {
      // pathname is e.g. "media/filename.jpg" — extract just the filename
      const parts = blob.pathname.split('/')
      const filename = parts[parts.length - 1]
      map.set(filename, blob.url)
    }

    console.log(`  Page ${page}: ${result.blobs.length} blobs (total so far: ${map.size})`)
    cursor = result.hasMore ? result.cursor : undefined
    page++
  } while (cursor)

  console.log(`Total blobs found in Vercel Blob store: ${map.size}\n`)
  return map
}

async function main() {
  // Step 1: Get all real blob URLs from Vercel Blob
  const blobMap = await getAllBlobs()

  if (blobMap.size === 0) {
    console.log('No blobs found in Vercel Blob store. Nothing to migrate.')
    process.exit(0)
  }

  // Step 2: Get all media items from Payload DB
  const payload = await getPayload({ config: configPromise })

  const { docs: allMedia, totalDocs } = await payload.find({
    collection: 'media',
    limit: 1000,
    pagination: false,
    overrideAccess: true,
  })

  console.log(`Found ${totalDocs} media items in database.\n`)

  let uploaded = 0
  let alreadyExists = 0
  let notFound = 0
  let failed = 0

  for (const item of allMedia) {
    const filename: string = (item as any).filename || ''
    const mime: string = (item as any).mimeType || ''

    if (!filename) {
      console.log(`⏭  Skipping [${item.id}] — no filename`)
      continue
    }

    const blobUrl = blobMap.get(filename)
    const rType = resourceType(mime)
    const publicId = toPublicId(filename)

    if (!blobUrl) {
      console.log(`⚠  Not in Vercel Blob [${item.id}] ${filename}`)
      notFound++
      continue
    }

    console.log(`⬆  [${item.id}] ${filename}`)
    console.log(`   From: ${blobUrl}`)
    console.log(`   To:   ${publicId}`)

    try {
      // Check if already on Cloudinary
      try {
        await cloudinary.api.resource(publicId, { resource_type: rType === 'raw' ? 'auto' : rType })
        console.log(`   ✓ Already on Cloudinary — skipping\n`)
        alreadyExists++
        continue
      } catch {
        // Not on Cloudinary yet — proceed
      }

      // Download from Vercel Blob using the real URL + token
      const fetchRes = await fetch(blobUrl, {
        headers: { authorization: `Bearer ${BLOB_TOKEN}` },
      })

      if (!fetchRes.ok) {
        throw new Error(`Download failed: ${fetchRes.status} ${fetchRes.statusText}`)
      }

      const buffer = Buffer.from(await fetchRes.arrayBuffer())

      // Upload buffer to Cloudinary
      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            public_id: publicId,
            resource_type: rType === 'raw' ? 'auto' : rType,
            overwrite: true,
            quality: 'auto:best',
          },
          (error, res) => {
            if (error) return reject(error)
            resolve(res)
          },
        )
        stream.end(buffer)
      })

      console.log(`   ✓ Uploaded → ${result.secure_url}\n`)
      uploaded++
    } catch (err: any) {
      console.error(`   ✗ Failed: ${err?.message || err}\n`)
      failed++
    }
  }

  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`Migration complete!`)
  console.log(`  Uploaded        : ${uploaded}`)
  console.log(`  Already existed : ${alreadyExists}`)
  console.log(`  Not in Blob     : ${notFound}`)
  console.log(`  Failed          : ${failed}`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)

  process.exit(failed > 0 ? 1 : 0)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
