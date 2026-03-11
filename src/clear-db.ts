import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

async function clear() {
  const payload = await getPayload({ config: configPromise })
  console.log('\n🗑️  Starting to clear database...\n')

  try {
    const products = await payload.find({ collection: 'products', limit: 1000 })
    console.log(`Found ${products.docs.length} products to delete.`)
    for (const doc of products.docs) {
      try {
        await payload.delete({ collection: 'products', id: doc.id, overrideAccess: true })
        console.log(`✅ Deleted product ${doc.id}`)
      } catch (e) {
        console.error(`❌ Failed to delete product ${doc.id}:`, e)
      }
    }

    const categories = await payload.find({ collection: 'categories', limit: 1000 })
    console.log(`Found ${categories.docs.length} categories to delete.`)
    for (const doc of categories.docs) {
      try {
        await payload.delete({ collection: 'categories', id: doc.id, overrideAccess: true })
        console.log(`✅ Deleted category ${doc.id}`)
      } catch (e) {
        console.error(`❌ Failed to delete category ${doc.id}:`, e)
      }
    }
  } catch (err) {
    console.error('Error finding items to delete:', err)
  }

  console.log('\n✨ Database clearing attempted!\n')
  process.exit(0)
}

clear().catch(err => { 
  console.error('❌ Failed:', err)
  process.exit(1)
})
