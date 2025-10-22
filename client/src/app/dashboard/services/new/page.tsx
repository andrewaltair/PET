'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../contexts/AuthContext';
import { useCreateService } from '../../../../hooks/useServices';
import { CreateServiceRequest, UserRole, ServiceType } from 'petservice-marketplace-shared-types';
import { ProtectedRoute } from '../../../../components/ProtectedRoute';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

function NewServiceForm() {
  const { user } = useAuth();
  const router = useRouter();
  const createMutation = useCreateService();

  const [formData, setFormData] = useState<CreateServiceRequest>({
    serviceType: ServiceType.WALKING,
    title: '',
    description: '',
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

  const handleInputChange = (field: keyof CreateServiceRequest, value: string | number | ServiceType) => {
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

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (Object.keys(formData.availability).length === 0) {
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
      await createMutation.mutateAsync(formData);
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
        <Card>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Type */}
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

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Service Title *</Label>
                <Input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Premium Dog Walking Service"
                />
                {errors.title && (
                  <p className="text-destructive text-sm">{errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your service in detail..."
                  rows={5}
                />
                {errors.description && (
                  <p className="text-destructive text-sm">{errors.description}</p>
                )}
              </div>

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

              {/* Availability */}
              <div className="space-y-4">
                <div>
                  <Label>Availability *</Label>
                  <p className="text-muted-foreground text-sm mb-4">
                    Select the days and time slots when you're available for this service.
                  </p>
                </div>

                <div className="space-y-4">
                  {daysOfWeek.map(day => (
                    <Card key={day.key}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{day.label}</CardTitle>
                          <span className="text-sm text-muted-foreground">
                            {formData.availability[day.key]?.length || 0} slots selected
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                          {timeSlots.map(timeSlot => {
                            const isSelected = formData.availability[day.key]?.includes(timeSlot) || false;
                            return (
                              <Button
                                key={timeSlot}
                                type="button"
                                variant={isSelected ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                  const currentSlots = formData.availability[day.key] || [];
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
                  <p className="text-destructive text-sm">{errors.availability}</p>
                )}
              </div>

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
          </CardContent>
        </Card>
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
