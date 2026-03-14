'use client'
import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import React, { Suspense } from 'react'

import { MobileMenu } from './MobileMenu'
import type { Header as HeaderType } from 'src/payload-types'

import { usePathname } from 'next/navigation'
import { Logo } from '@/components/Logo/Logo'
import { Mail, Phone } from 'lucide-react'
import { Cart } from '@/components/Cart'
import { HeaderSearch } from './HeaderSearch'

type Props = {
  header: HeaderType
  navProducts?: any[]
}

export function HeaderClient({ header, navProducts }: Props) {
  const pathname = usePathname()

  // Use actual data if present, otherwise build dynamic fallback
  const menu = header.navItems?.length
    ? header.navItems
    : [
        { id: 'all', link: { type: 'custom', url: '/products', label: 'All Products' } },
        ...(navProducts?.map((p) => ({
          id: p.id,
          link: { type: 'custom', url: `/products/${p.slug}`, label: p.title },
        })) || []),
      ]

  return (
    <div className="header-outer">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="container top-bar-container">
          <Suspense fallback={null}>
            <HeaderSearch />
          </Suspense>
          
          <div className="top-bar-details">
            <div className="top-bar-item">
              <Mail className="top-bar-icon" />
              <span>{header.topBarEmail || 'sales@onlinepackagingstore.com'}</span>
            </div>
            <div className="top-bar-item">
              <Phone className="top-bar-icon" />
              <div className="phone-details">
                <span className="phone-label">{header.topBarPhoneLabel || '24/7 Support'}</span>
                <span className="phone-number">{header.topBarPhone || 'Call: 559-205-7588'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="navbar">
        <div className="container navbar-container">
          <Link href="/" className="nav-logo">
            <Logo />
          </Link>

          <ul className="nav-links">
            {menu.map((item: any) => (
              <li key={item.id}>
                <CMSLink {...item.link} className="nav-link" label={item.link.label} />
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <Link href="/#quote" className="btn-get-quote">
              Get Quote
            </Link>
            <Link href="/#quote" className="btn-beat-quote">
              Beat My Quote
            </Link>

            <div className="cart-wrapper">
              <Cart />
            </div>

            {/* Mobile menu toggle — controlled purely by CSS (.mobile-menu-toggle) */}
            <div className="mobile-menu-toggle">
              <Suspense fallback={null}>
                <MobileMenu menu={menu as any} />
              </Suspense>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}