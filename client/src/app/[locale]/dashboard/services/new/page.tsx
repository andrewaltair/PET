'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateService } from '@/hooks/useServices';
import { CreateServiceRequest, UserRole, ServiceType } from 'petservice-marketplace-shared-types';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LanguageSelector, Language } from '@/components/LanguageSelector';
import { ImageUpload } from '@/components/ImageUpload';

function NewServiceForm() {
  const { user } = useAuth();
  const router = useRouter();
  const createMutation = useCreateService();

  const [selectedLanguages, setSelectedLanguages] = useState<Language[]>([]);
  const [languageData, setLanguageData] = useState<Record<Language, { title: string; description: string }>>({
    geo: { title: '', description: '' },
    eng: { title: '', description: '' },
    rus: { title: '', description: '' },
  });
  const [mainImageUrl, setMainImageUrl] = useState<string>('');
  const [subImages, setSubImages] = useState<string[]>([]);

  const [formData, setFormData] = useState<Partial<CreateServiceRequest>>({
    serviceType: ServiceType.WALKING,
    price: 0,
    availability: {},
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Predefined time slots for convenience
  const timeSlots = [
    '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
    '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00',
    '16:00-17:00', '17:00-18:00', '18:00-19:00', '19:00-20:00',
  ];

  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
  ];

  const serviceTypeOptions = [
    { value: ServiceType.WALKING, label: 'Dog Walking' },
    { value: ServiceType.SITTING, label: 'Pet Sitting' },
    { value: ServiceType.GROOMING, label: 'Grooming' },
    { value: ServiceType.VETERINARIAN_VISIT, label: 'Veterinarian Visit' },
    { value: ServiceType.TAXI, label: 'Pet Taxi' },
    { value: ServiceType.TRAINING, label: 'Training' },
  ];

  const handleLanguageToggle = (lang: Language) => {
    if (selectedLanguages.includes(lang)) {
      setSelectedLanguages(selectedLanguages.filter(l => l !== lang));
      // Clear language data when removed
      setLanguageData(prev => ({
        ...prev,
        [lang]: { title: '', description: '' },
      }));
    } else {
      setSelectedLanguages([...selectedLanguages, lang]);
    }
  };

  const handleLanguageDataChange = (lang: Language, field: 'title' | 'description', value: string) => {
    setLanguageData(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: value,
      },
    }));
  };

  const handleInputChange = (field: 'serviceType' | 'price', value: ServiceType | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAvailabilityChange = (day: string, timeSlots: string[]) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: timeSlots,
      },
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate at least one language is selected
    if (selectedLanguages.length === 0) {
      newErrors.languages = 'Please select at least one language';
    }

    // Validate each selected language has content
    selectedLanguages.forEach(lang => {
      if (!languageData[lang].title.trim()) {
        newErrors[`title_${lang}`] = `Title is required for ${lang}`;
      }
      if (!languageData[lang].description.trim()) {
        newErrors[`description_${lang}`] = `Description is required for ${lang}`;
      }
    });

    // Validate main image
    if (!mainImageUrl) {
      newErrors.mainImage = 'Main image is required';
    }

    // Validate price
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    // Validate availability
    if (!formData.availability || Object.keys(formData.availability).length === 0) {
      newErrors.availability = 'Please select at least one day and time slot';
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
      // Build the multilingual service data
      const serviceData: CreateServiceRequest = {
        providerId: user!.id,
        serviceType: formData.serviceType!,
        price: formData.price!,
        availability: formData.availability!,
        mainImageUrl,
        subImages,
      };

      // Add language-specific fields
      if (selectedLanguages.includes('geo')) {
        serviceData.titleGeo = languageData.geo.title;
        serviceData.descriptionGeo = languageData.geo.description;
      }
      if (selectedLanguages.includes('eng')) {
        serviceData.titleEng = languageData.eng.title;
        serviceData.descriptionEng = languageData.eng.description;
      }
      if (selectedLanguages.includes('rus')) {
        serviceData.titleRus = languageData.rus.title;
        serviceData.descriptionRus = languageData.rus.description;
      }

      await createMutation.mutateAsync(serviceData);
      router.push('/dashboard/services');
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/services');
  };

  if (user?.role !== UserRole.PROVIDER) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Alert variant="destructive" className="max-w-md mb-4">
            <AlertDescription>
              Only service providers can create services.
            </AlertDescription>
          </Alert>
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="mb-4 p-0 h-auto font-normal"
          >
            ← Back to Services
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Create New Service</h1>
          <p className="text-muted-foreground mt-2">
            Add a new pet service to your offerings
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Type */}
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="serviceType">Service Type *</Label>
                <Select
                  value={formData.serviceType}
                  onValueChange={(value) => handleInputChange('serviceType', value as ServiceType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Language Selector */}
              <LanguageSelector
                languages={selectedLanguages}
                onLanguageToggle={handleLanguageToggle}
                languageData={languageData}
                onLanguageDataChange={handleLanguageDataChange}
              />
              {errors.languages && (
                <p className="text-destructive text-sm">{errors.languages}</p>
              )}

              {/* Images */}
              <ImageUpload
                mainImageUrl={mainImageUrl}
                subImages={subImages}
                onMainImageChange={setMainImageUrl}
                onSubImagesChange={setSubImages}
                maxSubImages={10}
              />
              {errors.mainImage && (
                <p className="text-destructive text-sm">{errors.mainImage}</p>
              )}

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">Price per Service ($) *</Label>
                <Input
                  type="number"
                  id="price"
                  value={formData.price || ''}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                  placeholder="25.00"
                  min="0"
                  step="0.01"
                />
                {errors.price && (
                  <p className="text-destructive text-sm">{errors.price}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Availability */}
          <Card>
            <CardHeader>
              <CardTitle>Availability *</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                Select the days and time slots when you're available for this service.
              </p>

              <div className="space-y-4">
                {daysOfWeek.map(day => (
                  <Card key={day.key}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{day.label}</CardTitle>
                        <span className="text-sm text-muted-foreground">
                          {formData.availability?.[day.key]?.length || 0} slots selected
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {timeSlots.map(timeSlot => {
                          const isSelected = formData.availability?.[day.key]?.includes(timeSlot) || false;
                          return (
                            <Button
                              key={timeSlot}
                              type="button"
                              variant={isSelected ? "default" : "outline"}
                              size="sm"
                              onClick={() => {
                                const currentSlots = formData.availability?.[day.key] || [];
                                const newSlots = isSelected
                                  ? currentSlots.filter(slot => slot !== timeSlot)
                                  : [...currentSlots, timeSlot];
                                handleAvailabilityChange(day.key, newSlots);
                              }}
                            >
                              {timeSlot}
                            </Button>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {errors.availability && (
                <p className="text-destructive text-sm mt-4">{errors.availability}</p>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Creating...' : 'Create Service'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NewServicePage() {
  return (
    <ProtectedRoute>
      <NewServiceForm />
    </ProtectedRoute>
  );
}
