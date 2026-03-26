/**
 * Migration script: Vercel Blob → Cloudinary
 *
 * Copies every media item (images AND videos) from Vercel Blob to Cloudinary,
 * then updates the URL stored in the Payload database.
 *
 * Run once with:
 *   npx tsx src/scripts/migrate-to-cloudinary.ts
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

async function main() {
  const payload = await getPayload({ config: configPromise })

  const { docs: allMedia, totalDocs } = await payload.find({
    collection: 'media',
    limit: 1000,
    pagination: false,
    overrideAccess: true,
  })

  console.log(`\nFound ${totalDocs} media items total.\n`)

  let migrated = 0
  let skipped = 0
  let failed = 0

  for (const item of allMedia) {
    const url: string = (item as any).url || ''

    // Only migrate items still on Vercel Blob
    if (!url.includes('blob.vercel-storage.com')) {
      console.log(`⏭  Skipping  [${item.id}] ${(item as any).filename} — not a Vercel Blob URL`)
      skipped++
      continue
    }

    const filename: string = (item as any).filename || `media-${item.id}`
    const mime: string = (item as any).mimeType || ''
    const rType = resourceType(mime)
    const publicId = toPublicId(filename)

    console.log(`⬆  Uploading [${item.id}] ${filename} (${rType}) …`)

    try {
      // Cloudinary fetches directly from the Vercel Blob URL — no download needed
      const result = await cloudinary.uploader.upload(url, {
        public_id: publicId,
        resource_type: rType === 'raw' ? 'auto' : rType,
        overwrite: true,
        // Preserve original quality for product images
        quality: 'auto:best',
      })

      // Build the sizes map — update any nested size URLs too
      const existingSizes: Record<string, any> = (item as any).sizes || {}
      const updatedSizes: Record<string, any> = {}

      for (const [sizeName, sizeData] of Object.entries(existingSizes)) {
        if (sizeData && typeof sizeData === 'object' && (sizeData as any).url?.includes('blob.vercel-storage.com')) {
          const sizeFilename: string = (sizeData as any).filename || filename
          const sizePublicId = toPublicId(sizeFilename)
          try {
            const sizeResult = await cloudinary.uploader.upload((sizeData as any).url, {
              public_id: sizePublicId,
              resource_type: rType === 'raw' ? 'auto' : rType,
              overwrite: true,
            })
            updatedSizes[sizeName] = { ...(sizeData as any), url: sizeResult.secure_url }
          } catch {
            // Keep original if size migration fails
            updatedSizes[sizeName] = sizeData
          }
        } else {
          updatedSizes[sizeName] = sizeData
        }
      }

      // Update the Payload media document with the new Cloudinary URL
      await payload.update({
        collection: 'media',
        id: item.id,
        data: {
          url: result.secure_url,
          ...(Object.keys(updatedSizes).length > 0 ? { sizes: updatedSizes } : {}),
        } as any,
        overrideAccess: true,
      })

      console.log(`   ✓ Done    → ${result.secure_url}`)
      migrated++
    } catch (err: any) {
      console.error(`   ✗ Failed  [${item.id}] ${filename}: ${err?.message || err}`)
      failed++
    }
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`Migration complete!`)
  console.log(`  Migrated : ${migrated}`)
  console.log(`  Skipped  : ${skipped}`)
  console.log(`  Failed   : ${failed}`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)

  process.exit(failed > 0 ? 1 : 0)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
