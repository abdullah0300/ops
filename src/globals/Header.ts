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
