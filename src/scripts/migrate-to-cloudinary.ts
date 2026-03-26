/**
 * Migration script: Vercel Blob → Cloudinary
 *
 * HOW PAYLOAD STORAGE WORKS:
 * - The `url` field in media documents is NOT stored in the DB.
 * - It is regenerated dynamically on every read by the active storage plugin.
 * - After switching to Cloudinary, Payload generates Cloudinary URLs from filenames,
 *   but the actual files are still only on Vercel Blob.
 * - This script copies every file from Vercel Blob to Cloudinary using the correct
 *   public_id so the dynamically generated URLs resolve correctly.
 * - No database updates are needed.
 *
 * Run once with:
 *   npx dotenv-cli -e .env -- npm run migrate:cloudinary
 */

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { v2 as cloudinary } from 'cloudinary'

// ─── Cloudinary config ─────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'ddgzjzd9q',
  api_key: process.env.CLOUDINARY_API_KEY || '434747626758977',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'Ttl36pnqCiUHI7Zi22afF-a1XVE',
  secure: true,
})

// ─── Vercel Blob config ─────────────────────────────────────────────────────
// Extract store ID from token: vercel_blob_rw_<storeId>_<random>
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || ''
const storeId = BLOB_TOKEN.match(/^vercel_blob_rw_([a-z\d]+)_[a-z\d]+$/i)?.[1]?.toLowerCase()

if (!storeId) {
  console.error('ERROR: Cannot extract store ID from BLOB_READ_WRITE_TOKEN.')
  console.error(`Token value: "${BLOB_TOKEN}"`)
  console.error('Make sure BLOB_READ_WRITE_TOKEN is set in your .env file.')
  process.exit(1)
}

const VERCEL_BLOB_BASE = `https://${storeId}.public.blob.vercel-storage.com`
const CLOUDINARY_FOLDER = 'payload-media'

console.log(`Vercel Blob base URL: ${VERCEL_BLOB_BASE}`)

/** The same public_id formula used in cloudinaryAdapter.ts */
function toPublicId(filename: string): string {
  return `${CLOUDINARY_FOLDER}/${filename.replace(/\.[^/.]+$/, '')}`
}

/** Detect Cloudinary resource type from mime type */
function resourceType(mimeType: string): 'image' | 'video' | 'raw' {
  if (mimeType?.startsWith('image/')) return 'image'
  if (mimeType?.startsWith('video/')) return 'video'
  return 'raw'
}

async function main() {
  const payload = await getPayload({ config: configPromise })

  const { docs: allMedia, totalDocs } = await payload.find({
    collection: 'media',
    limit: 1000,
    pagination: false,
    overrideAccess: true,
  })

  console.log(`\nFound ${totalDocs} media items.\n`)

  let uploaded = 0
  let alreadyExists = 0
  let failed = 0

  for (const item of allMedia) {
    const filename: string = (item as any).filename || ''
    const mime: string = (item as any).mimeType || ''

    if (!filename) {
      console.log(`⏭  Skipping [${item.id}] — no filename`)
      continue
    }

    const rType = resourceType(mime)
    const publicId = toPublicId(filename)

    // The Vercel Blob plugin stores files at: {base}/{prefix}/{filename}
    // Default prefix for the media collection is 'media'
    const vercelUrl = `${VERCEL_BLOB_BASE}/media/${encodeURIComponent(filename)}`

    console.log(`⬆  [${item.id}] ${filename} (${rType})`)
    console.log(`   From: ${vercelUrl}`)
    console.log(`   To:   ${publicId}`)

    try {
      // Check if already uploaded to Cloudinary
      try {
        await cloudinary.api.resource(publicId, { resource_type: rType === 'raw' ? 'auto' : rType })
        console.log(`   ✓ Already on Cloudinary — skipping\n`)
        alreadyExists++
        continue
      } catch {
        // Not found on Cloudinary — proceed with upload
      }

      // Download from Vercel Blob locally using the token
      // (Cloudinary can't fetch directly — Vercel Blob CDN returns 403 to external servers)
      const fetchRes = await fetch(vercelUrl, {
        headers: { Authorization: `Bearer ${BLOB_TOKEN}` },
      })

      if (!fetchRes.ok) {
        throw new Error(`Vercel Blob fetch failed: ${fetchRes.status} ${fetchRes.statusText} — ${vercelUrl}`)
      }

      const arrayBuffer = await fetchRes.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // Upload buffer to Cloudinary via stream
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
  console.log(`  Failed          : ${failed}`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)

  process.exit(failed > 0 ? 1 : 0)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
