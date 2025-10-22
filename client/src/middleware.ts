import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('[Middleware DEBUG] Processing request:', request.nextUrl.pathname);

  // Only run on client-side routes that need authentication
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    console.log('[Middleware DEBUG] Dashboard route detected');

    // For now, let the component handle authentication
    // In production, you might want to check tokens server-side

    // DEBUG: Log cookies and headers for auth debugging
    const authCookie = request.cookies.get('auth_token');
    const refreshCookie = request.cookies.get('refresh_token');
    console.log('[Middleware DEBUG] Auth cookie present:', !!authCookie);
    console.log('[Middleware DEBUG] Refresh cookie present:', !!refreshCookie);

    // Note: Middleware cannot access localStorage directly
    // Authentication is handled by ProtectedRoute component

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
