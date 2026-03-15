import { getPayload } from 'payload'
import configPromise from './src/payload.config'

async function dumpMedia() {
  const payload = await getPayload({ config: configPromise })
  const media = await payload.find({
    collection: 'media',
    limit: 1000
  })
  
  console.log('--- ALL MEDIA ---')
  media.docs.forEach(doc => {
    console.log(`${doc.filename} | ${(doc as any).url}`)
  })
  process.exit(0)
}

dumpMedia().catch(err => {
  console.error(err)
  process.exit(1)
})
