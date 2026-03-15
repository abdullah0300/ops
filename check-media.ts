import { getPayload } from 'payload'
import configPromise from './src/payload.config'

async function checkMedia() {
  const payload = await getPayload({ config: configPromise })
  const media = await payload.find({
    collection: 'media',
    where: {
      filename: { in: ['cannabis.jpg', 'nuts.jpg', 'tea.jpg', 'coffee.jpg', 'candy.jpg'] }
    }
  })
  
  console.log('--- MEDIA RECORDS ---')
  media.docs.forEach(doc => {
    console.log(`Filename: ${doc.filename}`)
    console.log(`URL: ${(doc as any).url}`)
    console.log(`ID: ${doc.id}`)
    console.log('-------------------')
  })
  process.exit(0)
}

checkMedia().catch(err => {
  console.error(err)
  process.exit(1)
})
