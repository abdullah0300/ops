import { RequiredDataFromCollectionSlug } from 'payload'

export const quoteFormData: () => RequiredDataFromCollectionSlug<'forms'> = () => {
  return {
    confirmationMessage: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Your quote request has been received!',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h2',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Thank you for reaching out. One of our packaging specialists will review your details and send your custom quote within 24 hours.',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    confirmationType: 'message',
    createdAt: new Date().toISOString(),
    emails: [],
    fields: [
      // Personal Information
      {
        name: 'full-name',
        blockName: 'full-name',
        blockType: 'text',
        label: 'Full Name',
        required: true,
        width: 100,
      },
      {
        name: 'email',
        blockName: 'email',
        blockType: 'email',
        label: 'Email',
        required: true,
        width: 50,
      },
      {
        name: 'phone',
        blockName: 'phone',
        blockType: 'text',
        label: 'Phone',
        required: false,
        width: 50,
      },
      // Select Size
      {
        name: 'length',
        blockName: 'length',
        blockType: 'text',
        label: 'Length',
        required: false,
        width: 25,
      },
      {
        name: 'width',
        blockName: 'width',
        blockType: 'text',
        label: 'Width',
        required: false,
        width: 25,
      },
      {
        name: 'height',
        blockName: 'height',
        blockType: 'text',
        label: 'Height',
        required: false,
        width: 25,
      },
      {
        name: 'unit',
        blockName: 'unit',
        blockType: 'select',
        label: 'Unit',
        options: [
          { label: 'cm', value: 'cm' },
          { label: 'inch', value: 'inch' },
          { label: 'mm', value: 'mm' },
        ],
        required: false,
        width: 25,
      },
      // Choose Materials
      {
        name: 'stock',
        blockName: 'stock',
        blockType: 'select',
        label: 'Stock',
        options: [
          { label: 'Cardstock', value: 'cardstock' },
          { label: 'Kraft', value: 'kraft' },
          { label: 'Corrugated', value: 'corrugated' },
          { label: 'Custom', value: 'custom' },
        ],
        required: false,
        width: 33,
      },
      {
        name: 'colors',
        blockName: 'colors',
        blockType: 'select',
        label: 'Colors',
        options: [
          { label: '1 Color', value: '1' },
          { label: '2 Colors', value: '2' },
          { label: '4 Colors', value: '4' },
          { label: 'Full Color', value: 'full' },
        ],
        required: false,
        width: 33,
      },
      {
        name: 'quantity',
        blockName: 'quantity',
        blockType: 'text',
        label: 'Quantity',
        required: false,
        width: 33,
      },
      // Upload Artwork (Using text for now, can be an upload link or similar)
      {
        name: 'artwork',
        blockName: 'artwork',
        blockType: 'text',
        label: 'Artwork (Link or Info)',
        required: false,
        width: 100,
      },
      // Additional Information
      {
        name: 'message',
        blockName: 'message',
        blockType: 'textarea',
        label: 'Message',
        required: false,
        width: 100,
      },
    ],
    submitButtonLabel: 'Get My Custom Quote',
    title: 'Quote Request',
    updatedAt: new Date().toISOString(),
  }
}
