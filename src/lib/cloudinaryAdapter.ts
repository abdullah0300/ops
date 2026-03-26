/**
 * Cloudinary storage adapter for @payloadcms/plugin-cloud-storage
 * Handles upload, delete, and URL generation for all media.
 */

import { v2 as cloudinary } from 'cloudinary'
import type { Adapter } from '@payloadcms/plugin-cloud-storage/types'

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

export function cloudinaryAdapter(): Adapter {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'ddgzjzd9q',
    api_key: process.env.CLOUDINARY_API_KEY || '434747626758977',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'Ttl36pnqCiUHI7Zi22afF-a1XVE',
    secure: true,
  })

  return {
    name: 'cloudinary',

    generateURL({ filename, data }) {
      const mimeType = (data as any)?.mimeType || ''
      return buildCloudinaryURL(filename, mimeType)
    },

    async handleUpload({ data, file }) {
      const mimeType = (data as any)?.mimeType || file.mimetype || ''
      const rType = resourceType(mimeType)
      const publicId = toPublicId(file.name || (data as any)?.filename || 'upload')

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
            // Write the Cloudinary URL back so Payload stores it
            ;(data as any).url = result!.secure_url
            resolve()
          },
        )
        const buf = file.buffer instanceof Buffer ? file.buffer : Buffer.from(file.buffer as any)
        stream.end(buf)
      })
    },

    async handleDelete({ filename, doc }) {
      const mimeType = (doc as any)?.mimeType || ''
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
