'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useService } from '@/hooks/useServices';
import { useServiceReviews } from '@/hooks/useReviews';
import { UserRole, ServiceType } from 'petservice-marketplace-shared-types';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { BookingForm } from '@/components/BookingForm';
import { StarRating } from '@/components/ui/star-rating';
import { ReviewList } from '@/components/ReviewList';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Edit, Calendar, MessageCircle, LogIn, UserPlus } from 'lucide-react';

function ServiceDetail() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const serviceId = params.serviceId as string;
  const { toast } = useToast();

  const { data: service, isLoading, error } = useService(serviceId);
  const { data: reviewsData, isLoading: reviewsLoading } = useServiceReviews(serviceId);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const getServiceTypeLabel = (serviceType: ServiceType): string => {
    const labels: Record<ServiceType, string> = {
      [ServiceType.WALKING]: 'Dog Walking',
      [ServiceType.SITTING]: 'Pet Sitting',
      [ServiceType.GROOMING]: 'Grooming',
      [ServiceType.VETERINARIAN_VISIT]: 'Vet Visit',
      [ServiceType.TAXI]: 'Pet Taxi',
      [ServiceType.TRAINING]: 'Training',
    };
    return labels[serviceType] || serviceType;
  };

  const formatAvailability = (availability: Record<string, string[]>): JSX.Element => {
    const days = Object.keys(availability);
    if (days.length === 0) {
      return <p className="text-gray-600">No availability information provided</p>;
    }

    const dayNames: Record<string, string> = {
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday',
    };

    return (
      <div className="space-y-3">
        {days.map(day => (
          <div key={day} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
            <span className="font-medium text-gray-900 capitalize">
              {dayNames[day] || day}
            </span>
            <div className="flex flex-wrap gap-1">
              {availability[day].map(timeSlot => (
                <span
                  key={timeSlot}
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                >
                  {timeSlot}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleContactProvider = () => {
    // This would typically open a booking modal or contact form
    // For now, we'll show a toast notification
    toast({
      title: "Contact Feature Coming Soon",
      description: "The contact feature will be implemented in the booking system. Please use the booking form to get in touch with the provider.",
      duration: 5000,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">
            Failed to load service
          </div>
          <p className="text-gray-600 mb-4">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </p>
          <Button
            onClick={() => router.push('/services')}
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
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
            The service you're looking for doesn't exist or has been removed.
          </p>
          <Button
            onClick={() => router.push('/services')}
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Services
          </Button>
        </div>
      </div>
    );
  }

  const canEdit = user?.role === UserRole.PROVIDER && user.id === service.provider.id;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/services">Services</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{service.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/services')}
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Back to Services
          </button>
        </div>

        {/* Service Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            {/* Service Header */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                    {getServiceTypeLabel(service.serviceType)}
                  </span>
                  <span className="text-3xl font-bold text-blue-600">
                    ${Number(service.price).toFixed(2)}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {service.title}
                </h1>
              </div>

              {/* Edit button for provider */}
              {canEdit && (
                <Link href={`/dashboard/services/edit/${service.id}`}>
                  <Button variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Service
                  </Button>
                </Link>
              )}
            </div>

            {/* Provider Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Provider</h3>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    {service.provider.email?.[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Provider
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">About This Service</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {service.description}
              </p>
            </div>

            {/* Availability */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Availability</h3>
              {formatAvailability(service.availability)}
            </div>

            {/* Reviews */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Reviews</h3>
              <ReviewList
                reviews={reviewsData || []}
                isLoading={reviewsLoading}
                emptyMessage="No reviews yet for this service"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              {user?.role === UserRole.OWNER && (
                <>
                  <Button
                    onClick={() => setShowBookingForm(true)}
                    variant="default"
                    className="flex-1"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Service
                  </Button>
                  <Button
                    onClick={handleContactProvider}
                    variant="outline"
                    className="flex-1"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Contact Provider
                  </Button>
                </>
              )}

              {!user && (
                <div className="w-full text-center">
                  <p className="text-gray-600 mb-3">
                    Sign in to book this service
                  </p>
                  <div className="flex gap-3">
                    <Link href="/login" className="flex-1">
                      <Button variant="default" className="w-full">
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register" className="flex-1">
                      <Button variant="outline" className="w-full">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Booking Form Modal */}
        {showBookingForm && service && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Book Service</h2>
                  <button
                    onClick={() => setShowBookingForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="text-2xl">×</span>
                  </button>
                </div>
                <BookingForm
                  isOpen={showBookingForm}
                  service={service}
                  onSuccess={() => {
                    setShowBookingForm(false);
                    router.push('/dashboard/my-bookings');
                  }}
                  onCancel={() => setShowBookingForm(false)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ServiceDetailPage() {
  return <ServiceDetail />;
}
