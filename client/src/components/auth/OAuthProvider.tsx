'use client';

import { useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

interface OAuthProviderProps {
  children: React.ReactNode;
}

export function OAuthProvider({ children }: OAuthProviderProps) {
  useEffect(() => {
    // Load Facebook SDK only if App ID is configured
    const facebookAppId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
    if (typeof window !== 'undefined' && !window.FB && facebookAppId) {
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      document.body.appendChild(script);

      script.onload = () => {
        window.FB.init({
          appId: facebookAppId,
          cookie: true,
          xfbml: true,
          version: 'v18.0',
        });
      };
    }
  }, []);

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  // Provide a valid fallback for Google OAuth Provider
  // The provider requires a non-empty string, so we use a placeholder
  const validClientId = googleClientId || 'placeholder-for-development';

  return (
    <GoogleOAuthProvider clientId={validClientId}>
      {children}
    </GoogleOAuthProvider>
  );
}

