'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { UserRole } from 'petservice-marketplace-shared-types';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { BaseProfileForm } from '@/components/user/BaseProfileForm';
import { SeekerProfileExtras } from '@/components/user/SeekerProfileExtras';
import { ProviderProfileTabs } from '@/components/user/ProviderProfileTabs';

function ProfileForm() {
  const t = useTranslations();
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { data: profile, isPending: profileLoading, error: profileError } = useProfile();

  const handleCancel = () => {
    router.push('/dashboard');
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Alert variant="destructive" className="max-w-md">
            <AlertDescription>
              {t('profile.failedToLoad')} {profileError instanceof Error ? profileError.message : t('profile.unknownError')}
            </AlertDescription>
          </Alert>
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard')}
            className="mt-4"
          >
            {t('profile.backToDashboardButton')}
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">{t('dashboard.breadcrumbs.home')}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">{t('dashboard.breadcrumbs.dashboard')}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{t('dashboard.nav.profile')}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Hero Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <Button
                  variant="ghost"
                  onClick={handleCancel}
                  className="mb-4 p-0 h-auto font-normal text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {t('profile.backToDashboard')}
                </Button>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {t('profile.title')} 👤
                </h1>
                <p className="text-gray-600 text-lg">
                  {t('profile.subtitle')}
                </p>
              </div>
              <div className="text-6xl transform transition-transform duration-300 hover:scale-110 hover:rotate-12">
                ✏️
              </div>
            </div>
          </div>
        </div>

        {/* Base Profile Form - Shown to everyone */}
        <BaseProfileForm user={user} />

        {/* Role-specific modules */}
        {user.role === UserRole.OWNER && <SeekerProfileExtras user={user} />}
        {user.role === UserRole.PROVIDER && <ProviderProfileTabs user={user} />}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileForm />
    </ProtectedRoute>
  );
}
