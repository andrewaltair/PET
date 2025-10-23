'use client'

// Client-side providers wrapper
import { LanguageProvider } from '../contexts/LanguageProvider'
import { ErrorBoundary } from '../components/ui/error-boundary'
import { Providers } from './providers'

export default function ClientProviders({ 
  children
}: { 
  children: React.ReactNode
}) {
  return (
    <LanguageProvider>
      <div key="providers">
        <ErrorBoundary>
          <Providers>
            <div key="children">
              {children}
            </div>
          </Providers>
        </ErrorBoundary>
      </div>
    </LanguageProvider>
  )
}

