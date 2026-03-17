import type { ReactNode } from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp'
import React from 'react'
import Script from 'next/script'
import './globals.css'

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      className={[GeistSans.variable, GeistMono.variable].filter(Boolean).join(' ')}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <meta name="google-site-verification" content="7f_YVvQqfNTuFRpA8fnyYHgQDHzq8Qlnqd4o21Rw5V8" />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Amaranth:ital,wght@0,400;0,700;1,400;1,700&family=Afacad:ital,wght@0,400..700;1,400..700&family=Outfit:wght@100..900&display=swap" rel="stylesheet" />
        <script id="ze-snippet" src="https://static.zdassets.com/ekr/snippet.js?key=81138e11-2d68-4e7d-8967-6050a14e9bad" async />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-C1MF00750G"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-C1MF00750G');
          `}
        </Script>
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "vwq3cksr8j");
          `}
        </Script>
      </head>
      <body>
        <Providers>
          <AdminBar />
          <LivePreviewListener />

          <Header />

          {/* Pushes page content below the fixed header */}
          <div className="header-spacer" aria-hidden="true" />

          <main>{children}</main>
          <React.Suspense fallback={null}>
            <FloatingWhatsApp />
          </React.Suspense>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}