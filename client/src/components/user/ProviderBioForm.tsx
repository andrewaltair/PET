'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Image } from 'lucide-react';
import { User } from 'petservice-marketplace-shared-types';

interface ProviderBioFormProps {
  user: User;
}

export function ProviderBioForm({ user }: ProviderBioFormProps) {
  const t = useTranslations('providerProfile');
  const { data: profile } = useProfile();
  const updateMutation = useUpdateProfile();

  const [formData, setFormData] = useState({
    bio: '',
    location: '',
    animalTypes: 'ALL_ANIMALS' as 'DOGS_ONLY' | 'ALL_ANIMALS',
    servicesProvided: [] as string[],
    gallery: [] as string[],
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        bio: profile.bio || '',
        location: profile.location || '',
        animalTypes: profile.animalTypes || 'ALL_ANIMALS',
        servicesProvided: profile.servicesProvided || [],
        gallery: [],
      });
    }
  }, [profile]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      servicesProvided: prev.servicesProvided.includes(service)
        ? prev.servicesProvided.filter(s => s !== service)
        : [...prev.servicesProvided, service]
    }));
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // TODO: Implement image upload
      console.log('Uploading gallery images:', files);
    }
  };

  const handleSave = async () => {
    await updateMutation.mutateAsync({
      bio: formData.bio,
      location: formData.location,
      animalTypes: formData.animalTypes,
      servicesProvided: formData.servicesProvided,
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="bio">{t('bio')}</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              placeholder={t('bioPlaceholder')}
              rows={6}
            />
            <p className="text-sm text-gray-500">
              {formData.bio.length}/500 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">{t('location')}</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder={t('locationPlaceholder')}
            />
          </div>

          <div className="space-y-4">
            <Label>{t('animalTypes')}</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={formData.animalTypes === 'DOGS_ONLY'}
                  onChange={() => handleChange('animalTypes', 'DOGS_ONLY')}
                />
                {t('dogsOnly')}
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={formData.animalTypes === 'ALL_ANIMALS'}
                  onChange={() => handleChange('animalTypes', 'ALL_ANIMALS')}
                />
                {t('allAnimals')}
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <Label>{t('servicesProvided')}</Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'WALKING', tKey: 'serviceWalking' },
                { key: 'SITTING', tKey: 'serviceSitting' },
                { key: 'GROOMING', tKey: 'serviceGrooming' },
                { key: 'VETERINARIAN_VISIT', tKey: 'serviceVeterinarian' },
                { key: 'TAXI', tKey: 'serviceTaxi' },
                { key: 'TRAINING', tKey: 'serviceTraining' }
              ].map(({ key, tKey }) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer p-2 border rounded hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.servicesProvided.includes(key)}
                    onChange={() => handleServiceToggle(key)}
                  />
                  {t(tKey as any)}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label>Gallery</Label>
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Image className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-500 mb-2">Upload photos to showcase your work</p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryUpload}
                className="hidden"
                id="gallery-upload"
              />
              <label htmlFor="gallery-upload">
                <Button variant="outline" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Images
                  </span>
                </Button>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={updateMutation.isPending} variant="success">
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

