'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useProviderProfile } from '@/hooks/usePublicServices';
import { useProviderReviews } from '@/hooks/useReviews';
import { UserRole, ServiceType } from 'petservice-marketplace-shared-types';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StarRating } from '@/components/ui/star-rating';
import { ReviewList } from '@/components/ReviewList';
import { conversationsAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, MapPin, User, MessageCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

function ProviderProfilePage({ params }: { params: { userId: string } }) {
  const router = useRouter();
  const { user: currentUser, isAuthenticated } = useAuth();
  const { userId } = params;

  const {
    data: providerData,
    error,
    isPending,
  } = useProviderProfile(userId);

  const { data: reviewsData, isPending: reviewsLoading } = useProviderReviews(userId);

  // Mutation for creating conversation with provider
  const createConversationMutation = useMutation({
    mutationFn: (providerId: string) => conversationsAPI.createConversationWithProvider(providerId),
    onSuccess: (data) => {
      toast.success('Starting conversation...');
      router.push(`/dashboard/messages?conversationId=${data.conversation.id}`);
    },
    onError: (error) => {
      console.error('Failed to create conversation:', error);
      toast.error('Failed to start conversation. Please try again.');
    },
  });

  const handleMessageProvider = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to send messages');
      router.push('/login');
      return;
    }

    if (currentUser?.role !== 'OWNER') {
      toast.error('Only pet owners can send messages to providers');
      return;
    }

    createConversationMutation.mutate(userId);
  };

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

  const formatAvailability = (availability: Record<string, string[]>): string => {
    const days = Object.keys(availability);
    if (days.length === 0) return 'No availability';

    return `${days.length} days available`;
  };

  if (isPending) {
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
            Failed to load provider profile
          </div>
          <p className="text-gray-600 mb-4">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </p>
          <div className="space-x-4">
            <Button onClick={() => router.back()} variant="outline">
              Go Back
            </Button>
            <Link href="/services">
              <Button>Browse Services</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!providerData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Provider not found
          </h2>
          <p className="text-gray-600 mb-4">
            The provider you're looking for doesn't exist or may have been removed.
          </p>
          <Link href="/services">
            <Button>Browse Services</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { profile, services } = providerData;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        {/* Provider Profile Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    {profile.firstName} {profile.lastName}
                  </CardTitle>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">
                      {UserRole.PROVIDER}
                    </span>
                    {profile.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-1">
                    {services.length} service{services.length !== 1 ? 's' : ''} offered
                  </div>
                  {profile.overallAverageRating > 0 ? (
                    <div className="flex items-center space-x-1">
                      <StarRating value={profile.overallAverageRating} readonly size="sm" />
                      <span className="text-xs text-gray-500">
                        ({reviewsData?.length || 0} reviews)
                      </span>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500">
                      No reviews yet
                    </div>
                  )}
                </div>
                {/* Message Button */}
                <Button
                  onClick={handleMessageProvider}
                  disabled={createConversationMutation.isPending}
                  className="flex items-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>
                    {createConversationMutation.isPending ? 'Starting Chat...' : 'Написать сообщение'}
                  </span>
                </Button>
              </div>
            </div>
          </CardHeader>

          {profile.bio && (
            <CardContent>
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-2">About</h3>
                <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Services Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Services by {profile.firstName}
            </h2>
            <Link href="/services">
              <Button variant="outline">
                View All Services
              </Button>
            </Link>
          </div>

          {services.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <div className="text-4xl mb-4">🛍️</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No services available
                  </h3>
                  <p className="text-gray-600">
                    This provider hasn't listed any services yet.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    {/* Service Type Badge */}
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {getServiceTypeLabel(service.serviceType)}
                      </span>
                      <span className="text-lg font-bold text-blue-600">
                        ${Number(service.price).toFixed(2)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      <Link
                        href={`/services/${service.id}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {service.title}
                      </Link>
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {service.description}
                    </p>

                    {/* Availability */}
                    <div className="text-sm text-gray-500 mb-4">
                      {formatAvailability(service.availability)}
                    </div>

                    {/* Action */}
                    <div className="pt-4 border-t border-gray-200">
                      <Link href={`/services/${service.id}`}>
                        <Button className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Reviews</span>
                {reviewsData && reviewsData.length > 0 && (
                  <span className="text-sm font-normal text-gray-500">
                    ({reviewsData.length})
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReviewList
                reviews={reviewsData || []}
                isLoading={reviewsLoading}
                emptyMessage="No reviews yet for this provider"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ProviderProfilePage;
