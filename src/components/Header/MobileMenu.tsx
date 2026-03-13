'use client'

import type { Header } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useAuth } from '@/providers/Auth'
import * as Icons from 'lucide-react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface Props {
  menu: Header['navItems']
}

export function MobileMenu({ menu }: Props) {
  const { user } = useAuth()

  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  const closeMobileMenu = () => setIsOpen(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname, searchParams])

  return (
    <Sheet onOpenChange={setIsOpen} open={isOpen}>
      <SheetTrigger className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:bg-black dark:text-white">
        <Icons.MenuIcon className="h-4" />
      </SheetTrigger>

      <SheetContent side="left" className="px-4 flex flex-col">
        <SheetHeader className="px-0 pt-4 pb-0">
          <SheetTitle>
            <Link href="/" onClick={closeMobileMenu}>
              <Logo />
            </Link>
          </SheetTitle>

          <SheetDescription />
        </SheetHeader>

        <div className="flex-1 py-4 overflow-y-auto">
          {menu?.length ? (
            <ul className="flex w-full flex-col">
              {menu.map((item) => (
                <li className="py-2" key={item.id}>
                  <CMSLink
                    {...item.link}
                    appearance="link"
                    className="text-lg font-medium"
                    onClick={closeMobileMenu}
                  />
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-6 flex flex-col gap-3">
            <Button asChild className="w-full bg-[#1c1c1c] hover:bg-[#0c8a24] text-white py-6 text-lg rounded-xl">
              <Link href="/#quote" onClick={closeMobileMenu}>
                Get Quote
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full border-2 border-[#8ca62d] text-[#8ca62d] hover:bg-[#8ca62d] hover:text-white py-6 text-lg rounded-xl"
            >
              <Link href="/#quote" onClick={closeMobileMenu}>
                Beat My Quote
              </Link>
            </Button>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">My account</h2>
            {user ? (
              <ul className="flex flex-col gap-3">
                <li>
                  <Link href="/orders" onClick={closeMobileMenu} className="text-muted-foreground hover:text-black">
                    Orders
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account/addresses"
                    onClick={closeMobileMenu}
                    className="text-muted-foreground hover:text-black"
                  >
                    Addresses
                  </Link>
                </li>
                <li>
                  <Link href="/account" onClick={closeMobileMenu} className="text-muted-foreground hover:text-black">
                    Manage account
                  </Link>
                </li>
                <li className="mt-4">
                  <Button asChild variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50 p-0">
                    <Link href="/logout">Log out</Link>
                  </Button>
                </li>
              </ul>
            ) : (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Button asChild className="w-full sm:flex-1" variant="outline">
                  <Link href="/login" onClick={closeMobileMenu}>
                    Log in
                  </Link>
                </Button>
                <Button asChild className="w-full sm:flex-1">
                  <Link href="/create-account" onClick={closeMobileMenu}>
                    Create an account
                  </Link>
                </Button>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-neutral-100">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-neutral-600">
                <Icons.Mail size={18} className="text-[#0c8a24]" />
                <span className="text-sm font-medium">sales@onlinepackagingstore.com</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-600">
                <Icons.Phone size={18} className="text-[#0c8a24]" />
                <div className="flex flex-col">
                  <span className="text-xs text-neutral-400">24/7 Support</span>
                  <span className="text-sm font-medium">Call: 559-205-7588</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
