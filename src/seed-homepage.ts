import * as fs from 'fs'
import * as path from 'path'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

const MEDIA_DIR = path.resolve(process.cwd(), 'public/media')

async function uploadMedia(payload: any, filename: string, alt: string) {
  const filePath = path.join(MEDIA_DIR, filename)
  if (!fs.existsSync(filePath)) {
    console.log(`  ✗ File not found: ${filename}`)
    return null
  }

  // Check if already in DB
  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    console.log(`  ✓ Already exists in DB: ${filename}`)
    return existing.docs[0].id
  }

  console.log(`  ↑ Uploading: ${filename}`)
  const fileBuffer = fs.readFileSync(filePath)
  const result = await payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data: fileBuffer,
      mimetype: filename.endsWith('.mp4') ? 'video/mp4' : 'image/png',
      name: filename,
      size: fileBuffer.length,
    },
  })

  return result.id
}

async function main() {
  console.log('🚀 Starting HomePage seed...\n')
  const payload = await getPayload({ config: configPromise })

  // 1. Upload Media
  console.log('🖼️ Uploading media...')
  const heroId = await uploadMedia(payload, 'hero.png', 'Hero Image')
  const firstVidId = await uploadMedia(payload, 'first.mp4', 'Production Stage 1')
  const secondVidId = await uploadMedia(payload, 'second.mp4', 'Production Stage 2')
  const thirdVidId = await uploadMedia(payload, 'third.mp4', 'Production Stage 3')

  // 2. Update HomePage Global
  console.log('\n🏠 Updating HomePage global...')
  
  await payload.updateGlobal({
    slug: 'home-page',
    data: {
      hero: {
        heroImage: heroId,
      },
      videoSection: {
        slides: [
          {
            video: firstVidId,
            title: 'It All Starts With Quality',
            subtitle: 'Raw Materials & Preparation',
            body: 'Every great print begins long before the ink touches the surface. At our facility, we source only premium-grade raw sheets and blank bags that meet our strict quality standards. Each material is carefully loaded onto our industrial-grade machines, aligned with precision, and inspected before production begins.',
            tagline: 'Premium materials. Precision setup. Zero compromise.',
          },
          {
            video: secondVidId,
            title: 'Where Your Design Comes to Life',
            subtitle: 'High-Precision Printing Technology',
            body: 'This is where your vision transforms into reality. Using advanced printing technology, our machines deliver sharp, vibrant, and consistent results across every single unit. Our operators monitor every run in real time, ensuring colour accuracy, alignment, and ink quality are maintained throughout the entire batch.',
            tagline: 'Your design, perfected at scale.',
          },
          {
            video: thirdVidId,
            title: 'Ready. Packed. Delivered.',
            subtitle: 'Quality-Checked & Ready for Your Brand',
            body: 'The final product speaks for itself. After printing, every item goes through a quality inspection process before being packed and prepared for dispatch. What leaves our factory is exactly what your customers will see — clean edges, vibrant colours, and a finish that reflects the professionalism of your brand.',
            tagline: 'From our floor to your door — built to impress.',
          },
        ],
      },
      factorySlider: {
        slides: [
          {
            video: firstVidId,
            title: 'It All Starts With Quality',
            subtitle: 'Raw Materials & Sheet Preparation',
            desc: 'Every great print begins long before the ink touches the surface. At our facility, we source only premium-grade raw sheets and blank bags that meet our strict quality standards. Each material is carefully loaded onto our industrial-grade machines, aligned with precision, and inspected before production begins. No shortcuts, no compromises — just the right foundation for a flawless final product.',
            highlight: 'Premium materials. Precision setup. Zero compromise.',
            bgLeft: '#f0bc2e',
            bgRight: '#f4f4f4',
            textColor: '#111',
            highlightColor: '#0b5fb0',
            btnBg: '#111',
            btnColor: '#fff',
          },
          {
            video: secondVidId,
            title: 'Where Your Design Comes to Life',
            subtitle: 'High-Speed Printing Technology',
            desc: 'This is where your vision transforms into reality. Using advanced printing technology, our machines deliver sharp, vibrant, and consistent results across every single unit — whether your order is 100 pieces or 100,000. Our operators monitor every run in real-time, ensuring colour accuracy, alignment, and ink quality are maintained throughout the entire batch. Every print is an exact match to what you approved.',
            highlight: 'Your design, perfected at scale.',
            video: secondVidId,
            bgLeft: '#000000',
            bgRight: '#957cd7',
            textColor: '#111',
            highlightColor: '#ffffff',
            btnBg: '#ffffff',
            btnColor: '#111',
          },
          {
            video: thirdVidId,
            title: 'Ready, Packed, Delivered',
            subtitle: 'Quality-Checked & Ready for Your Brand',
            desc: 'The final product speaks for itself. After printing, every item goes through a quality inspection process before being packed and prepared for dispatch. What leaves our factory is exactly what your customers will see — clean edges, vibrant colours, and a finish that reflects the professionalism of your brand. From a single custom order to bulk production, the result is always something you\'re proud to put your name on.',
            highlight: 'From our floor to your door — built to impress.',
            bgLeft: '#eba273',
            bgRight: '#f4f4f4',
            textColor: '#111',
            highlightColor: '#957cd7',
            btnBg: '#111',
            btnColor: '#fff',
          },
        ],
      },
    },
  })

  console.log('✅ HomePage seeded successfully!')
  process.exit(0)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
