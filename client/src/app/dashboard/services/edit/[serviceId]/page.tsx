'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../../../contexts/AuthContext';
import { useService, useUpdateService } from '../../../../../hooks/useServices';
import { UpdateServiceRequest, UserRole, ServiceType } from 'petservice-marketplace-shared-types';
import { ProtectedRoute } from '../../../../../components/ProtectedRoute';
import { LoadingSpinner } from '../../../../../components/LoadingSpinner';
import { Button } from '../../../../../components/ui/button';
import { Input } from '../../../../../components/ui/input';
import { Label } from '../../../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../../components/ui/select';

function EditServiceForm() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const serviceId = params.serviceId as string;

  const { data: service, isPending: serviceLoading, error: serviceError } = useService(serviceId);
  const updateMutation = useUpdateService();

  const [formData, setFormData] = useState<UpdateServiceRequest>({
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

  // Populate form when service data loads
  useEffect(() => {
    if (service) {
      setFormData({
        serviceType: service.serviceType,
        title: service.title,
        description: service.description,
        price: service.price,
        availability: service.availability,
      });
    }
  }, [service]);

  const handleInputChange = (field: keyof UpdateServiceRequest, value: string | number) => {
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

    if (formData.title !== undefined && !formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title !== undefined && formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (formData.description !== undefined && !formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description !== undefined && formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (formData.price !== undefined && formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
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
      await updateMutation.mutateAsync({ serviceId, serviceData: formData });
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
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            Only service providers can edit services.
          </p>
          <Button
            onClick={() => router.push('/dashboard')}
            variant="outline"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (serviceLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (serviceError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">
            Failed to load service
          </div>
          <p className="text-gray-600 mb-4">
            {serviceError instanceof Error ? serviceError.message : 'Unknown error occurred'}
          </p>
          <Button
            onClick={() => router.push('/dashboard/services')}
            variant="outline"
          >
            Back to Services
          </Button>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Service Not Found</h1>
          <p className="text-gray-600 mb-6">
            The service you're trying to edit doesn't exist.
          </p>
          <Button
            onClick={() => router.push('/dashboard/services')}
            variant="outline"
          >
            Back to Services
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Back to Services
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Service</h1>
          <p className="text-gray-600 mt-2">
            Update your service details and availability
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Type */}
            <div className="space-y-2">
              <Label htmlFor="serviceType">
                Service Type
              </Label>
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
              <Label htmlFor="title">
                Service Title
              </Label>
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
              <Label htmlFor="description">
                Description
              </Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Describe your service in detail..."
                rows={5}
              />
              {errors.description && (
                <p className="text-destructive text-sm">{errors.description}</p>
              )}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">
                Price per Service ($)
              </Label>
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
                <Label>
                  Availability
                </Label>
                <p className="text-gray-600 text-sm mb-4">
                  Select the days and time slots when you're available for this service.
                </p>
              </div>

              <div className="space-y-4">
                {daysOfWeek.map(day => (
                  <div key={day.key} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-gray-900">{day.label}</span>
                      <span className="text-sm text-gray-500">
                        {formData.availability?.[day.key]?.length || 0} slots selected
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {timeSlots.map(timeSlot => {
                        const isSelected = formData.availability?.[day.key]?.includes(timeSlot) || false;
                        return (
                          <button
                            key={timeSlot}
                            type="button"
                            onClick={() => {
                              const currentSlots = formData.availability?.[day.key] || [];
                              const newSlots = isSelected
                                ? currentSlots.filter(slot => slot !== timeSlot)
                                : [...currentSlots, timeSlot];
                              handleAvailabilityChange(day.key, newSlots);
                            }}
                            className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                              isSelected
                                ? 'bg-blue-100 border-blue-300 text-blue-800'
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {timeSlot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                onClick={handleCancel}
                variant="outline"
                disabled={updateMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function EditServicePage() {
  return (
    <ProtectedRoute>
      <EditServiceForm />
    </ProtectedRoute>
  );
}
