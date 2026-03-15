import { getPayload } from 'payload'
import configPromise from './src/payload.config'

const SHOWCASE_DATA = [
  { filename: 'cannabis-1.jpg', title: 'Cannabis Packaging', tag: 'Best Seller', chips: ['Smell Proof', 'Custom Print', 'Child Resistant'] },
  { filename: 'nuts-1.jpg', title: 'Nuts & Dried Fruit', tag: 'Freshness Seal', chips: ['Oxygen Barrier', 'Moisture Proof', 'Clear Window'] },
  { filename: 'tea-1.jpg', title: 'Premium Tea Bags', tag: 'Lux Design', chips: ['Aroma Seal', 'Eco-Friendly', 'Luxury Finish'] },
  { filename: 'coffee-1.jpg', title: 'Roasted Coffee', tag: 'Degassing Valve', chips: ['Valve Support', 'Block Bottom', 'Foil Lined'] },
  { filename: 'candy-1.jpg', title: 'Candy & Sweets', tag: 'Vibrant Print', chips: ['Gloss Finish', 'Tear Notch', 'Food Grade'] },
]

async function seedShowcase() {
  const payload = await getPayload({ config: configPromise })

  console.log('\n🌟 Seeding Hero Showcase into HomePage global...\n')

  const showcaseItems = []

  for (const item of SHOWCASE_DATA) {
    const media = await payload.find({
      collection: 'media',
      where: {
        filename: { equals: item.filename }
      },
      limit: 1
    })

    if (media.docs.length > 0) {
      showcaseItems.push({
        image: media.docs[0].id,
        title: item.title,
        tag: item.tag,
        chips: item.chips.map(c => ({ chip: c }))
      })
      console.log(`  ✅ Added to showcase: ${item.filename}`)
    } else {
      console.log(`  ❌ Media not found: ${item.filename}`)
    }
  }

  if (showcaseItems.length > 0) {
    const homePage = await payload.findGlobal({
      slug: 'home-page'
    })

    await payload.updateGlobal({
      slug: 'home-page',
      data: {
        ...homePage,
        hero: {
          ...homePage.hero,
          showcase: showcaseItems
        }
      } as any
    })
    console.log('\n✨ HomePage global updated with Hero Showcase!')
  } else {
    console.log('\n⚠️ No items were added to the showcase.')
  }

  process.exit(0)
}

seedShowcase().catch(err => {
  console.error(err)
  process.exit(1)
})
