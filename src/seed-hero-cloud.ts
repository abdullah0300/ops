/**
 * HERO IMAGES CLOUD SEED SCRIPT
 * 
 * What it does:
 * 1. Initializes Payload CMS
 * 2. Checks if the 5 hero-specific images exist in the Media collection
 * 3. If missing, uploads them from public/media
 * 4. This automatically triggers Vercel Blob storage sync
 * 
 * Run:  npx tsx src/seed-hero-cloud.ts
 */

import * as fs from 'fs'
import * as path from 'path'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

const IMAGES_TO_SEED = [
  { filename: 'cannabis.jpg', alt: 'Cannabis Packaging' },
  { filename: 'nuts.jpg', alt: 'Nuts & Dried Fruit Packaging' },
  { filename: 'tea.jpg', alt: 'Premium Tea Packaging' },
  { filename: 'coffee.jpg', alt: 'Roasted Coffee Packaging' },
  { filename: 'candy.jpg', alt: 'Candy & Sweets Packaging' },
]

async function seedHeroCloud() {
  const payload = await getPayload({ config: configPromise })
  const publicMediaPath = path.resolve(process.cwd(), 'public/media')

  console.log('\n☁️  Starting Hero Image Cloud Sync...\n')

  for (const img of IMAGES_TO_SEED) {
    const localPath = path.join(publicMediaPath, img.filename)

    // Check if file exists locally
    if (!fs.existsSync(localPath)) {
      console.log(`  ❌ Local file not found: ${img.filename} (checked ${localPath})`)
      continue
    }

    // Check if already in Payload DB
    const existing = await payload.find({
      collection: 'media',
      where: {
        filename: { equals: img.filename },
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`  ✓ Already in Cloud: ${img.filename}`)
      continue
    }

    // If not in DB, upload it
    try {
      console.log(`  ↑ Uploading to Cloud: ${img.filename}...`)
      const fileBuffer = fs.readFileSync(localPath)
      
      await payload.create({
        collection: 'media',
        data: {
          alt: img.alt,
        },
        file: {
          data: fileBuffer,
          mimetype: 'image/jpeg',
          name: img.filename,
          size: fileBuffer.length,
        },
      })
      console.log(`  ✅ Success: ${img.filename}`)
    } catch (err: any) {
      console.log(`  ❌ Failed to upload ${img.filename}: ${err.message}`)
    }
  }

  console.log('\n✨ Cloud Sync Task Finished.\n')
  process.exit(0)
}

seedHeroCloud().catch((err) => {
  console.error('❌ Fatal error:', err)
  process.exit(1)
})
