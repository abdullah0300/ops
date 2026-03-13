import { getPayload } from 'payload'
import config from '@payload-config'
import { quoteFormData } from '@/endpoints/seed/quote-form'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    
    // Check if form already exists
    const existing = await payload.find({
      collection: 'forms',
      where: {
        title: {
          equals: 'Quote Request',
        },
      },
    })

    if (existing.docs.length > 0) {
      return Response.json({ 
        success: true, 
        message: 'Form already exists', 
        id: existing.docs[0].id 
      })
    }

    // Create the form
    const newForm = await payload.create({
      collection: 'forms',
      data: quoteFormData(),
    })

    return Response.json({ 
      success: true, 
      message: 'Form created successfully', 
      id: newForm.id 
    })
  } catch (err) {
    console.error('Error ensuring quote form:', err)
    return Response.json({ success: false, error: String(err) }, { status: 500 })
  }
}
