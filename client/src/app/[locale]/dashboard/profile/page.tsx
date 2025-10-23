'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { UpdateProfileRequest, UserRole } from 'petservice-marketplace-shared-types';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Save } from 'lucide-react';

function ProfileForm() {
  const t = useTranslations();
  const { user } = useAuth();
  const router = useRouter();
  const { data: profile, isPending: profileLoading, error: profileError } = useProfile();
  const updateMutation = useUpdateProfile();

  const [formData, setFormData] = useState<UpdateProfileRequest>({
    firstName: '',
    lastName: '',
    avatarUrl: '',
    bio: '',
    location: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form when profile data loads
  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        avatarUrl: profile.avatarUrl || '',
        bio: profile.bio || '',
        location: profile.location || '',
      });
    }
  }, [profile]);

  const handleInputChange = (field: keyof UpdateProfileRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.firstName && formData.firstName.length < 1) {
      newErrors.firstName = t('profile.errors.firstNameMin');
    }

    if (formData.lastName && formData.lastName.length < 1) {
      newErrors.lastName = t('profile.errors.lastNameMin');
    }

    if (formData.avatarUrl && !formData.avatarUrl.match(/^https?:\/\/.+/)) {
      newErrors.avatarUrl = t('profile.errors.avatarUrlInvalid');
    }

    if (user?.role === UserRole.PROVIDER) {
      if (formData.bio && formData.bio.length > 500) {
        newErrors.bio = t('profile.errors.bioMax');
      }

      if (formData.location && formData.location.length > 100) {
        newErrors.location = t('profile.errors.locationMax');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await updateMutation.mutateAsync(formData);
      // Success is handled in the mutation
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  const handleCancel = () => {
    router.push('/dashboard');
  };

  if (profileLoading) {
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

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-2xl mx-auto px-4">
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

        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="mb-4 p-0 h-auto font-normal"
          >
            {t('profile.backToDashboard')}
          </Button>
          <h1 className="text-3xl font-bold text-foreground">{t('profile.title')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('profile.subtitle')}
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>{t('profile.profileInformation')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t('profile.firstName')}</Label>
                  <Input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder={t('profile.firstNamePlaceholder')}
                  />
                  {errors.firstName && (
                    <p className="text-destructive text-sm">{errors.firstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">{t('profile.lastName')}</Label>
                  <Input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder={t('profile.lastNamePlaceholder')}
                  />
                  {errors.lastName && (
                    <p className="text-destructive text-sm">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Avatar URL */}
              <div className="space-y-2">
                <Label htmlFor="avatarUrl">{t('profile.avatarUrl')}</Label>
                <Input
                  type="url"
                  id="avatarUrl"
                  value={formData.avatarUrl}
                  onChange={(e) => handleInputChange('avatarUrl', e.target.value)}
                  placeholder={t('profile.avatarUrlPlaceholder')}
                />
                {errors.avatarUrl && (
                  <p className="text-destructive text-sm">{errors.avatarUrl}</p>
                )}
                <p className="text-muted-foreground text-sm">
                  {t('profile.avatarUrlHint')}
                </p>
              </div>

              {/* Provider-only fields */}
              {user?.role === UserRole.PROVIDER && (
                <>
                  {/* Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="bio">{t('profile.bio')}</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder={t('profile.bioPlaceholder')}
                      rows={4}
                    />
                    {errors.bio && (
                      <p className="text-destructive text-sm">{errors.bio}</p>
                    )}
                    <p className="text-muted-foreground text-sm">
                      {formData.bio?.length || 0}{t('profile.bioCharacterCount')}
                    </p>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location">{t('profile.location')}</Label>
                    <Input
                      type="text"
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder={t('profile.locationPlaceholder')}
                    />
                    {errors.location && (
                      <p className="text-destructive text-sm">{errors.location}</p>
                    )}
                    <p className="text-muted-foreground text-sm">
                      {t('profile.locationHint')}
                    </p>
                  </div>
                </>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={updateMutation.isPending}
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  disabled={updateMutation.isPending}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {updateMutation.isPending ? t('profile.saving') : t('profile.saveChanges')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
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
