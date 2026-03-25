import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { link } from '@/fields/link'
import { revalidateHeader } from '@/hooks/revalidateGlobal'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
    update: adminOnly,
  },
  fields: [
    {
      name: 'topBarEmail',
      type: 'text',
      label: 'Top Bar Email',
    },
    {
      name: 'topBarPhone',
      type: 'text',
      label: 'Top Bar Phone',
    },
    {
      name: 'topBarPhoneLabel',
      type: 'text',
      label: 'Top Bar Phone Label',
      defaultValue: '24/7 Support',
    },
    {
      name: 'navProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      maxRows: 6,
      label: 'Nav Products',
      admin: {
        description: 'Pick exactly which products appear in the navigation bar (up to 6). If left empty, the 3 most recently created products are shown automatically.',
      },
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
