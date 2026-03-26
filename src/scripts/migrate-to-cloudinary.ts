/**
 * Migration script: Any storage → Cloudinary
 *
 * Copies every media item (images AND videos) to Cloudinary,
 * then updates the URL stored in the Payload database.
 *
 * Run once with:
 *   npx dotenv-cli -e .env -- npm run migrate:cloudinary
 */

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { v2 as cloudinary } from 'cloudinary'

// ─── Cloudinary config ────────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'ddgzjzd9q',
  api_key: process.env.CLOUDINARY_API_KEY || '434747626758977',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'Ttl36pnqCiUHI7Zi22afF-a1XVE',
  secure: true,
})

const FOLDER = 'payload-media'

// The production site URL — used to build full URLs for locally-stored files
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://onlinepackagingstore.com'

/** Strip file extension to get a clean Cloudinary public_id */
function toPublicId(filename: string): string {
  return `${FOLDER}/${filename.replace(/\.[^/.]+$/, '')}`
}

/** Detect resource type from mime type */
function resourceType(mimeType: string): 'image' | 'video' | 'raw' {
  if (mimeType?.startsWith('image/')) return 'image'
  if (mimeType?.startsWith('video/')) return 'video'
  return 'raw'
}

/** Build the full URL to fetch a media item from */
function resolveUrl(item: any): string | null {
  const url: string = item.url || ''

  // Already on Cloudinary — nothing to do
  if (url.includes('res.cloudinary.com')) return null

  // Full URL (Vercel Blob, S3, CDN, external, etc.)
  if (url.startsWith('http://') || url.startsWith('https://')) return url

  // Relative path  e.g.  /media/filename.jpg  or  /api/media/file/filename.jpg
  if (url.startsWith('/')) return `${SERVER_URL}${url}`

  // No URL at all — try to build from filename
  const filename: string = item.filename || ''
  if (filename) return `${SERVER_URL}/api/media/file/${encodeURIComponent(filename)}`

  return null
}

async function main() {
  const payload = await getPayload({ config: configPromise })

  const { docs: allMedia, totalDocs } = await payload.find({
    collection: 'media',
    limit: 1000,
    pagination: false,
    overrideAccess: true,
  })

  console.log(`\nFound ${totalDocs} media items total.\n`)

  // Print first 3 URLs so we can confirm the format
  console.log('Sample URLs from your database:')
  allMedia.slice(0, 3).forEach((item: any) => {
    console.log(`  [${item.id}] url="${item.url}" filename="${item.filename}"`)
  })
  console.log('')

  let migrated = 0
  let skipped = 0
  let failed = 0

  for (const item of allMedia) {
    const sourceUrl = resolveUrl(item as any)

    if (!sourceUrl) {
      console.log(`⏭  Already on Cloudinary [${item.id}] ${(item as any).filename}`)
      skipped++
      continue
    }

    const filename: string = (item as any).filename || `media-${item.id}`
    const mime: string = (item as any).mimeType || ''
    const rType = resourceType(mime)
    const publicId = toPublicId(filename)

    console.log(`⬆  Uploading [${item.id}] ${filename} (${rType}) from ${sourceUrl}`)

    try {
      const result = await cloudinary.uploader.upload(sourceUrl, {
        public_id: publicId,
        resource_type: rType === 'raw' ? 'auto' : rType,
        overwrite: true,
        quality: 'auto:best',
      })

      await payload.update({
        collection: 'media',
        id: item.id,
        data: { url: result.secure_url } as any,
        overrideAccess: true,
      })

      console.log(`   ✓ Done → ${result.secure_url}`)
      migrated++
    } catch (err: any) {
      console.error(`   ✗ Failed [${item.id}] ${filename}: ${err?.message || err}`)
      failed++
    }
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`Migration complete!`)
  console.log(`  Migrated : ${migrated}`)
  console.log(`  Skipped  : ${skipped} (already on Cloudinary)`)
  console.log(`  Failed   : ${failed}`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)

  process.exit(failed > 0 ? 1 : 0)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
