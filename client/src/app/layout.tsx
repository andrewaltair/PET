'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { ErrorBoundary } from '../components/ui/error-boundary'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Pet Service Marketplace</title>
        <meta name="description" content="Connect pet owners with trusted service providers" />
      </head>
      <body className={`${inter.className} antialiased`} key="body">
        <div key="providers">
          <ErrorBoundary>
            <Providers>
              <div key="children">
                {children}
              </div>
            </Providers>
          </ErrorBoundary>
        </div>
      </body>
    </html>
  )
}

