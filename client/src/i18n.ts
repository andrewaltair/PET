import { getRequestConfig } from 'next-intl/server'
import { routing } from './middleware'

// Pre-load all messages synchronously to prevent hanging
const preloadedMessages = {
  ka: require('./messages/ka.json'),
  en: require('./messages/en.json'),
  ru: require('./messages/ru.json'),
}

export default getRequestConfig(async ({ requestLocale }) => {
  // Use default locale immediately to prevent hanging
  let locale: string = routing.defaultLocale
  
  // Try to get locale but don't wait indefinitely
  const timeoutPromise = new Promise<string>((resolve) => {
    setTimeout(() => resolve(routing.defaultLocale), 100)
  })
  
  try {
    const resolvedLocale = await Promise.race([
      requestLocale,
      timeoutPromise
    ])
    
    // Ensure that a valid locale is used
    if (resolvedLocale && routing.locales.includes(resolvedLocale as 'ka' | 'en' | 'ru')) {
      locale = resolvedLocale
    }
  } catch (error) {
    console.error('Error getting locale:', error)
    locale = routing.defaultLocale
  }

  // Return pre-loaded messages immediately
  const messages = preloadedMessages[locale as keyof typeof preloadedMessages] || preloadedMessages.ka

  return {
    locale,
    messages
  }
})