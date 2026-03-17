import type { GlobalConfig } from 'payload'
import { adminOnly } from '@/access/adminOnly'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { revalidateHomePage } from '@/hooks/revalidateGlobal'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  admin: {
    group: 'Content',
  },
  access: {
    read: () => true,
    update: adminOnly,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'hero',
              type: 'group',
              fields: [
                {
                  name: 'heroImage',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'showcase',
                  type: 'array',
                  fields: [
                    {
                      name: 'image',
                      type: 'upload',
                      relationTo: 'media',
                      required: true,
                    },
                    {
                      name: 'title',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'tag',
                      type: 'text',
                    },
                    {
                      name: 'chips',
                      type: 'array',
                      fields: [
                        {
                          name: 'chip',
                          type: 'text',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: 'videoSection',
              type: 'group',
              fields: [
                {
                  name: 'slides',
                  type: 'array',
                  fields: [
                    {
                      name: 'video',
                      type: 'upload',
                      relationTo: 'media',
                      required: true,
                    },
                    {
                      name: 'title',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'subtitle',
                      type: 'text',
                    },
                    {
                      name: 'body',
                      type: 'textarea',
                    },
                    {
                      name: 'tagline',
                      type: 'text',
                    },
                  ],
                },
              ],
            },
            {
              name: 'factorySlider',
              type: 'group',
              fields: [
                {
                  name: 'slides',
                  type: 'array',
                  fields: [
                    {
                      name: 'video',
                      type: 'upload',
                      relationTo: 'media',
                      required: true,
                    },
                    {
                      name: 'title',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'subtitle',
                      type: 'text',
                    },
                    {
                      name: 'desc',
                      type: 'textarea',
                    },
                    {
                      name: 'highlight',
                      type: 'text',
                    },
                    {
                      name: 'bgLeft',
                      type: 'text',
                    },
                    {
                      name: 'bgRight',
                      type: 'text',
                    },
                    {
                      name: 'textColor',
                      type: 'text',
                    },
                    {
                      name: 'highlightColor',
                      type: 'text',
                    },
                    {
                      name: 'btnBg',
                      type: 'text',
                    },
                    {
                      name: 'btnColor',
                      type: 'text',
                    }
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateHomePage],
  },
}
