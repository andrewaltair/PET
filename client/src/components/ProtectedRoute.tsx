'use client';

import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  console.log('[ProtectedRoute DEBUG] Render - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);

  useEffect(() => {
    console.log('[ProtectedRoute DEBUG] useEffect triggered - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated);

    if (!isLoading && !isAuthenticated) {
      console.log('[ProtectedRoute DEBUG] Not authenticated, redirecting to /login');
      // Redirect to login if not authenticated
      window.location.href = '/login';
    } else if (!isLoading && isAuthenticated) {
      console.log('[ProtectedRoute DEBUG] User is authenticated, allowing access');
    }
  }, [isAuthenticated, isLoading]);

  // Show loading while initializing - use consistent wrapper
  if (isLoading) {
    console.log('[ProtectedRoute DEBUG] Still loading, showing loading spinner');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show loading placeholder if not authenticated (prevents hydration mismatch)
  if (!isAuthenticated) {
    console.log('[ProtectedRoute DEBUG] Not authenticated, showing placeholder');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  console.log('[ProtectedRoute DEBUG] Rendering protected content');
  return <div className="py-8">{children}</div>;
}
