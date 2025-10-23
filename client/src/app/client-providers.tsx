'use client'

// Client-side providers wrapper
import { LanguageProvider } from '../contexts/LanguageProvider'
import { ErrorBoundary } from '../components/ui/error-boundary'
import { Providers } from './providers'
import { AppLoader } from '../components/AppLoader'

export default function ClientProviders({ 
  children
}: { 
  children: React.ReactNode
}) {
  return (
    <LanguageProvider>
      <div key="providers" suppressHydrationWarning>
        <ErrorBoundary>
          <Providers>
            <AppLoader>
              <div key="children" suppressHydrationWarning>
                {children}
              </div>
            </AppLoader>
          </Providers>
        </ErrorBoundary>
      </div>
    </LanguageProvider>
  )
}

