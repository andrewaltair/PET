'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'petservice-marketplace-shared-types';
import { ProviderServiceManagement } from './ProviderServiceManagement';
import { ProviderAvailabilityForm } from './ProviderAvailabilityForm';
import { ProviderBioForm } from './ProviderBioForm';
import { ProviderVerificationForm } from './ProviderVerificationForm';

interface ProviderProfileTabsProps {
  user: User;
}

export function ProviderProfileTabs({ user }: ProviderProfileTabsProps) {
  const t = useTranslations('providerProfile');
  
  return (
    <Card className="mt-6 hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardTitle className="flex items-center gap-2 text-xl">
          <span className="text-2xl">🏢</span>
          {t('title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="services" className="w-full">
          <TabsList className="inline-flex h-auto w-full items-center justify-start gap-1 bg-transparent p-0">
            <TabsTrigger value="services" className="flex-1 py-3 px-4 text-sm">{t('tabMyServices')}</TabsTrigger>
            <TabsTrigger value="availability" className="flex-1 py-3 px-4 text-sm">{t('tabAvailability')}</TabsTrigger>
            <TabsTrigger value="bio" className="flex-1 py-3 px-4 text-sm">{t('tabBioGallery')}</TabsTrigger>
            <TabsTrigger value="trust" className="flex-1 py-3 px-4 text-sm">{t('tabTrustSafety')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="services" className="mt-6">
            <ProviderServiceManagement user={user} />
          </TabsContent>
          
          <TabsContent value="availability" className="mt-6">
            <ProviderAvailabilityForm user={user} />
          </TabsContent>
          
          <TabsContent value="bio" className="mt-6">
            <ProviderBioForm user={user} />
          </TabsContent>
          
          <TabsContent value="trust" className="mt-6">
            <ProviderVerificationForm user={user} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

