'use client';

import { useGoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Button } from '../ui/button';
import { authAPI } from '../../api/auth';
import { toast } from '@/hooks/use-toast';

interface SocialAuthButtonProps {
  provider: 'google' | 'facebook' | 'instagram';
  onSuccess?: () => void;
  className?: string;
}

export function SocialAuthButton({ provider, onSuccess, className }: SocialAuthButtonProps) {
  const t = useTranslations('auth');
  const router = useRouter();
  const queryClient = useQueryClient();

  // Check if OAuth is configured
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const facebookAppId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;

  // Check if this provider is configured
  const isConfigured = 
    (provider === 'google' && googleClientId) || 
    ((provider === 'facebook' || provider === 'instagram') && facebookAppId);

  const handleDisabledClick = () => {
    toast({
      title: t('oauthNotConfigured'),
      description: t('oauthNotConfiguredDesc'),
      variant: 'destructive',
    });
  };

  // Initialize Google OAuth hook (always call hooks unconditionally)
  const googleLoginHook = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Get user info from Google
        const googleResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });

        const googleUser = await googleResponse.json();

        // Send to backend
        const authResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/auth/oauth/callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            provider: 'google',
            email: googleUser.email,
            id: googleUser.id,
            name: googleUser.name,
            picture: googleUser.picture,
            firstName: googleUser.given_name,
            lastName: googleUser.family_name,
          }),
        });

        const result = await authResponse.json();

        if (result.success) {
          // Store tokens
          localStorage.setItem('auth_token', result.data.token);
          localStorage.setItem('refresh_token', result.data.refreshToken);
          
          // Invalidate auth query to trigger re-fetch
          queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
          
          toast({
            title: t('loginSuccess'),
            description: t('loginSuccessDesc'),
          });

          onSuccess?.();
          router.push('/dashboard');
        } else {
          throw new Error(result.error || 'OAuth failed');
        }
      } catch (error: any) {
        console.error('Google OAuth error:', error);
        toast({
          title: t('oauthError'),
          description: error.message || t('oauthErrorDesc'),
          variant: 'destructive',
        });
      }
    },
    onError: () => {
      toast({
        title: t('oauthError'),
        description: t('oauthErrorDesc'),
        variant: 'destructive',
      });
    },
  });

  // Create conditional wrapper for Google login
  const handleGoogleSuccess = () => {
    if (!googleClientId || googleClientId === 'placeholder-for-development') {
      handleDisabledClick();
      return;
    }
    googleLoginHook();
  };

  const handleFacebookLogin = async () => {
    try {
      // Facebook SDK will be loaded via script tag
      // For now, we'll use a simplified approach
      window.FB.login(
        async (response: any) => {
          if (response.authResponse) {
            try {
              // Get user info from Facebook
              window.FB.api('/me', { fields: 'id,name,email,picture' }, async (userInfo: any) => {
                const authResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/auth/oauth/callback`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    provider: 'facebook',
                    email: userInfo.email,
                    id: userInfo.id,
                    name: userInfo.name,
                    picture: userInfo.picture?.data?.url,
                    firstName: userInfo.name?.split(' ')[0],
                    lastName: userInfo.name?.split(' ').slice(1).join(' '),
                  }),
                });

                const result = await authResponse.json();

                if (result.success) {
                  localStorage.setItem('auth_token', result.data.token);
                  localStorage.setItem('refresh_token', result.data.refreshToken);
                  
                  // Invalidate auth query to trigger re-fetch
                  queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
                  
                  toast({
                    title: t('loginSuccess'),
                    description: t('loginSuccessDesc'),
                  });

                  onSuccess?.();
                  router.push('/dashboard');
                } else {
                  throw new Error(result.error || 'OAuth failed');
                }
              });
            } catch (error: any) {
              console.error('Facebook OAuth error:', error);
              toast({
                title: t('oauthError'),
                description: error.message || t('oauthErrorDesc'),
                variant: 'destructive',
              });
            }
          }
        },
        { scope: 'email,public_profile' }
      );
    } catch (error: any) {
      toast({
        title: t('oauthError'),
        description: t('oauthErrorDesc'),
        variant: 'destructive',
      });
    }
  };

  const handleInstagramLogin = async () => {
    // Instagram uses Facebook OAuth under the hood
    toast({
      title: t('oauthNotConfigured'),
      description: t('oauthNotConfiguredDesc'),
    });
    handleFacebookLogin();
  };

  const handleClick = () => {
    switch (provider) {
      case 'google':
        handleGoogleSuccess();
        break;
      case 'facebook':
        if (facebookAppId) {
          handleFacebookLogin();
        } else {
          handleDisabledClick();
        }
        break;
      case 'instagram':
        if (facebookAppId) {
          handleInstagramLogin();
        } else {
          handleDisabledClick();
        }
        break;
    }
  };

  const getButtonProps = () => {
    switch (provider) {
      case 'google':
        return {
          children: (
            <>
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {t('continueWithGoogle')}
            </>
          ),
          className: 'w-full bg-white text-gray-900 border border-gray-300 hover:bg-gray-50',
        };
      case 'facebook':
        return {
          children: (
            <>
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              {t('continueWithFacebook')}
            </>
          ),
          className: 'w-full bg-[#1877F2] text-white hover:bg-[#166FE5]',
        };
      case 'instagram':
        return {
          children: (
            <>
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-8.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              {t('continueWithInstagram')}
            </>
          ),
          className: 'w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600',
        };
    }
  };

  return (
    <Button
      type="button"
      onClick={isConfigured ? handleClick : handleDisabledClick}
      disabled={!isConfigured}
      className={`flex items-center justify-center ${getButtonProps().className} ${className || ''} ${!isConfigured ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {getButtonProps().children}
    </Button>
  );
}

// Extend Window interface for Facebook SDK
declare global {
  interface Window {
    FB: any;
  }
}

