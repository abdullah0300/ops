'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export const ZendeskTracker: React.FC = () => {
  const pathname = usePathname()

  useEffect(() => {
    const win = window as any
    if (!win.zE) return

    try {
      win.zE('webWidget', 'updatePath', {
        url: window.location.href,
        title: document.title,
      })
    } catch (_) {
      // widget not ready yet — no-op
    }
  }, [pathname])

  return null
}
