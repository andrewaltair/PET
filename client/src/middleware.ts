import createMiddleware from 'next-intl/middleware';

// Export routing configuration for use in i18n.ts
export const routing = {
  // A list of all locales that are supported
  locales: ['ka', 'en', 'ru'],

  // Used when no locale matches
  defaultLocale: 'ka',

  // Disable automatic locale detection to prevent hanging
  localeDetection: false,
  
  // Use pathname-based routing only
  localePrefix: 'always',
} as const;

const middleware = createMiddleware(routing);

export default middleware;

export const config = {
  // Match all pathnames except for static files and API routes
  matcher: [
    '/',
    '/(ka|en|ru)/:path*',
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};