import { Inter, Noto_Sans_Georgian, Roboto, Open_Sans, Righteous } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import '../globals.css'
import ClientProviders from '../client-providers'
import type { Metadata } from 'next'

// Font definitions for different languages
const inter = Inter({ subsets: ['latin'] })
const notoSansGeorgian = Noto_Sans_Georgian({
  subsets: ['georgian'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-georgian'
})
const roboto = Roboto({
  subsets: ['cyrillic', 'latin'],
  weight: ['300', '400', '500', '700', '900'],
  variable: '--font-russian'
})
const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-english'
})
const righteous = Righteous({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-logo'
})

export const metadata: Metadata = {
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export function generateStaticParams() {
  return ['ka', 'en', 'ru'].map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  // Await params for Next.js 15 compatibility
  const { locale } = await params

  // Validate locale
  if (!['ka', 'en', 'ru'].includes(locale)) {
    notFound()
  }

  // Load messages for the current locale
  const messages = await getMessages()

  // Determine font class based on locale
  const getFontClass = (locale: string) => {
    switch (locale) {
      case 'ka':
        return notoSansGeorgian.className
      case 'ru':
        return roboto.className
      case 'en':
      default:
        return openSans.className
    }
  }

  return (
    <html lang={locale} className={`${notoSansGeorgian.variable} ${roboto.variable} ${openSans.variable} ${righteous.variable}`}>
      <head>
        <title>Pet Service Marketplace</title>
        <meta name="description" content="Connect pet owners with trusted service providers" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
      </head>
      <body className={`${getFontClass(locale)} antialiased`} key="body">
        <NextIntlClientProvider messages={messages}>
          <ClientProviders>
            {children}
          </ClientProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

