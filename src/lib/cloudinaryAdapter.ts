/**
 * Cloudinary storage adapter for @payloadcms/plugin-cloud-storage
 * Handles upload, delete, and URL generation for all media.
 */

import { v2 as cloudinary } from 'cloudinary'

const FOLDER = 'payload-media'

function toPublicId(filename: string): string {
  return `${FOLDER}/${filename.replace(/\.[^/.]+$/, '')}`
}

function resourceType(mimeType: string): 'image' | 'video' | 'auto' {
  if (mimeType?.startsWith('image/')) return 'image'
  if (mimeType?.startsWith('video/')) return 'video'
  return 'auto'
}

function buildCloudinaryURL(filename: string, mimeType = ''): string {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'ddgzjzd9q'
  const rType = mimeType.startsWith('video/') ? 'video' : 'image'
  const publicId = toPublicId(filename)
  return `https://res.cloudinary.com/${cloudName}/${rType}/upload/${publicId}`
}

/**
 * cloudinaryAdapter() returns a factory function.
 * @payloadcms/plugin-cloud-storage calls adapter({ collection, prefix }) to
 * get the actual adapter object — so we return a function, not an object.
 */
export function cloudinaryAdapter() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'ddgzjzd9q',
    api_key: process.env.CLOUDINARY_API_KEY || '434747626758977',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'Ttl36pnqCiUHI7Zi22afF-a1XVE',
    secure: true,
  })

  // The plugin calls this factory with { collection, prefix }
  return function adapterFactory(_args: any) {
    return {
      name: 'cloudinary',

      generateURL({ filename, data }: any) {
        const mimeType = data?.mimeType || ''
        return buildCloudinaryURL(filename, mimeType)
      },

      async handleUpload({ data, file }: any) {
        const mimeType = data?.mimeType || file?.mimetype || ''
        const rType = resourceType(mimeType)
        const publicId = toPublicId(file?.name || data?.filename || 'upload')

        await new Promise<void>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              public_id: publicId,
              resource_type: rType,
              overwrite: true,
              quality: 'auto:best',
            },
            (error, result) => {
              if (error) return reject(error)
              data.url = result!.secure_url
              resolve()
            },
          )
          const buf = file.buffer instanceof Buffer ? file.buffer : Buffer.from(file.buffer)
          stream.end(buf)
        })
      },

      async handleDelete({ filename, doc }: any) {
        const mimeType = doc?.mimeType || ''
        const rType = resourceType(mimeType)
        const publicId = toPublicId(filename)
        try {
          await cloudinary.uploader.destroy(publicId, {
            resource_type: rType === 'auto' ? 'image' : rType,
          })
        } catch {
          // Non-fatal — file may already be gone
        }
      },
    }
  }
}
