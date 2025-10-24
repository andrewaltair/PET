'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
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
import { ArrowLeft, Edit, Calendar, MessageCircle, LogIn, UserPlus, Star, MapPin, Clock, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { calculateProfileCompleteness, getProviderDisplayName, getProviderInitials } from '@/lib/profileUtils';
import { AuthModal } from '@/components/auth/AuthModal';
import { PetBackerHeader } from '@/components/homepage/PetBackerHeader';
import { PetBackerFooter } from '@/components/homepage/PetBackerFooter';

function ServiceDetail() {
  const t = useTranslations('serviceDetail');
  const tCommon = useTranslations('common');
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const serviceId = params.serviceId as string;
  const { toast } = useToast();

  const { data: service, isLoading, error } = useService(serviceId);
  const { data: reviewsData, isLoading: reviewsLoading } = useServiceReviews(serviceId);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  const getServiceTypeLabel = (serviceType: ServiceType): string => {
    const labels: Record<ServiceType, string> = {
      [ServiceType.WALKING]: t('serviceTypes.walking'),
      [ServiceType.SITTING]: t('serviceTypes.sitting'),
      [ServiceType.GROOMING]: t('serviceTypes.grooming'),
      [ServiceType.VETERINARIAN_VISIT]: t('serviceTypes.vetVisit'),
      [ServiceType.TAXI]: t('serviceTypes.taxi'),
      [ServiceType.TRAINING]: t('serviceTypes.training'),
    };
    return labels[serviceType] || serviceType;
  };

  const formatAvailability = (availability: Record<string, string[]>): JSX.Element => {
    const days = Object.keys(availability);
    if (days.length === 0) {
      return <p className="text-gray-600">{t('noAvailabilityInfo')}</p>;
    }

    const dayNames: Record<string, string> = {
      monday: t('days.monday'),
      tuesday: t('days.tuesday'),
      wednesday: t('days.wednesday'),
      thursday: t('days.thursday'),
      friday: t('days.friday'),
      saturday: t('days.saturday'),
      sunday: t('days.sunday'),
    };

    return (
      <div className="space-y-3">
        {days.map(day => {
          const timeSlots = availability[day];
          // Safety check: ensure timeSlots is an array
          if (!Array.isArray(timeSlots)) {
            return null;
          }
          
          return (
            <div key={day} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <span className="font-medium text-gray-900 capitalize">
                {dayNames[day] || day}
              </span>
              <div className="flex flex-wrap gap-1">
                {timeSlots.map(timeSlot => (
                  <span
                    key={timeSlot}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                  >
                    {timeSlot}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const handleContactProvider = () => {
    // This would typically open a booking modal or contact form
    // For now, we'll show a toast notification
    toast({
      title: t('contactFeatureComingSoon'),
      description: t('contactFeatureDesc'),
      duration: 5000,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <PetBackerHeader />
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">{t('loading')}</p>
          </div>
        </div>
        <PetBackerFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">
            {t('failedToLoad')}
          </div>
          <p className="text-gray-600 mb-4">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </p>
          <Button
            onClick={() => router.push('/services')}
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToServices')}
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('serviceNotFound')}</h1>
          <p className="text-gray-600 mb-6">
            {t('serviceNotFoundDesc')}
          </p>
          <Button
            onClick={() => router.push('/services')}
            variant="outline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToServices')}
          </Button>
        </div>
      </div>
    );
  }

  const canEdit = user?.role === UserRole.PROVIDER && user.id === service.provider.id;

  // Calculate average rating and review count from reviews data
  const averageRating = reviewsData && reviewsData.length > 0
    ? (reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length).toFixed(1)
    : '0.0';
  const reviewCount = reviewsData?.length || 0;

  // Calculate profile completeness
  const profileCompleteness = calculateProfileCompleteness(service.provider as any);
  const providerDisplayName = getProviderDisplayName(service.provider as any);
  const providerInitials = getProviderInitials(service.provider as any);

  // Get default image based on service type
  const getDefaultImage = (serviceType: ServiceType): string => {
    const images: Record<ServiceType, string> = {
      [ServiceType.WALKING]: '/images/dog-walking.svg',
      [ServiceType.SITTING]: '/images/pet-sitting.svg',
      [ServiceType.GROOMING]: '/images/grooming.svg',
      [ServiceType.VETERINARIAN_VISIT]: '/images/vet-visit.svg',
      [ServiceType.TAXI]: '/images/pet-taxi.svg',
      [ServiceType.TRAINING]: '/images/training.svg',
    };
    return images[serviceType] || '/images/default-service.svg';
  };

  const imageUrl = (service as any).imageUrl || getDefaultImage(service.serviceType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <PetBackerHeader />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">{t('home')}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/services">{t('services')}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{service.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Hero Image Section */}
        <div className="mb-8 rounded-xl overflow-hidden shadow-2xl">
          <div className="relative h-96 bg-gradient-to-br from-green-100 to-blue-100">
            <img
              src={imageUrl}
              alt={service.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            {/* Overlay with service info */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-4 py-2 text-sm font-semibold bg-white/20 backdrop-blur-sm rounded-full">
                    {getServiceTypeLabel(service.serviceType)}
                  </span>
                  <span className="text-4xl font-bold">
                    ${Number(service.price).toFixed(2)}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  {service.title}
                </h1>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-semibold">{averageRating}</span>
                    <span className="text-gray-300">({reviewCount} {tCommon('reviews')})</span>
                  </div>
                  {(service.provider as any).location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      <span>{(service.provider as any).location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back button */}
        <div className="mb-6">
          <Button
            onClick={() => router.push('/services')}
            variant="outline"
            className="hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToServices')}
          </Button>
        </div>

        {/* Edit button for provider */}
        {canEdit && (
          <div className="mb-6">
            <Link href={`/dashboard/services/edit/${service.id}`}>
              <Button variant="outline" className="hover:bg-blue-50 hover:border-blue-300 transition-all duration-200">
                <Edit className="mr-2 h-4 w-4" />
                {t('editService')}
              </Button>
            </Link>
          </div>
        )}

        {/* Service Details Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 border-2 border-transparent hover:border-blue-200 transition-all duration-300">
          <div className="p-8">

            {/* Provider Info */}
            <div className={`rounded-lg p-6 mb-6 border-2 transition-all duration-300 ${profileCompleteness.colorClass}`}>
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="text-2xl">👤</span>
                  {t('serviceProvider')}
                </h3>
                <div className="text-sm font-semibold text-gray-700">
                  {t('profileCompleteness')}: <span className="font-bold text-gray-900">{profileCompleteness.percentage}%</span>
                </div>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                {(service.provider as any).avatarUrl ? (
                  <img 
                    src={(service.provider as any).avatarUrl} 
                    alt={providerDisplayName}
                    className="w-16 h-16 rounded-full object-cover shadow-lg"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-xl font-bold">
                      {providerInitials}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-lg">
                    {providerDisplayName}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {service.provider.email}
                  </p>
                  {(service.provider as any).location && (
                    <p className="text-gray-600 text-sm flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {(service.provider as any).location}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Social Media Links */}
              {((service.provider as any).facebookUrl || (service.provider as any).instagramUrl || (service.provider as any).twitterUrl || (service.provider as any).linkedinUrl) && (
                <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                  <span className="text-sm text-gray-600">{t('followUs')}:</span>
                  {(service.provider as any).facebookUrl && (
                    <a 
                      href={(service.provider as any).facebookUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-white rounded-lg transition-colors"
                      aria-label="Facebook"
                    >
                      <Facebook className="w-5 h-5 text-blue-600" />
                    </a>
                  )}
                  {(service.provider as any).instagramUrl && (
                    <a 
                      href={(service.provider as any).instagramUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-white rounded-lg transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-5 h-5 text-pink-600" />
                    </a>
                  )}
                  {(service.provider as any).twitterUrl && (
                    <a 
                      href={(service.provider as any).twitterUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-white rounded-lg transition-colors"
                      aria-label="Twitter"
                    >
                      <Twitter className="w-5 h-5 text-blue-400" />
                    </a>
                  )}
                  {(service.provider as any).linkedinUrl && (
                    <a 
                      href={(service.provider as any).linkedinUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-white rounded-lg transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-5 h-5 text-blue-700" />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">📋</span>
                {t('aboutThisService')}
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                {service.description}
              </p>
            </div>

            {/* Availability */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6" />
                {t('availability')}
              </h3>
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 border-2 border-transparent hover:border-blue-200 transition-all duration-300">
                {formatAvailability(service.availability)}
              </div>
            </div>

            {/* Reviews */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                {t('reviews')}
              </h3>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border-2 border-transparent hover:border-blue-200 transition-all duration-300">
                <ReviewList
                  reviews={reviewsData || []}
                  isLoading={reviewsLoading}
                  emptyMessage={t('noReviewsYet')}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              {user?.role === UserRole.OWNER && (
                <>
                  <Button
                    onClick={() => setShowBookingForm(true)}
                    className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-8 py-6 text-lg font-semibold"
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    {t('bookService')}
                  </Button>
                  <Button
                    onClick={handleContactProvider}
                    variant="outline"
                    className="flex-1 border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 px-8 py-6 text-lg"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    {t('contactProvider')}
                  </Button>
                </>
              )}

              {!user && (
                <>
                  <div className="w-full">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border-2 border-transparent hover:border-blue-200 transition-all duration-300">
                      <p className="text-gray-700 mb-4 text-center text-lg font-semibold">
                        {t('signInToBook')}
                      </p>
                      <div className="flex gap-3">
                        <Button 
                          className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                          onClick={() => {
                            setAuthModalTab('login');
                            setIsAuthModalOpen(true);
                          }}
                        >
                          <LogIn className="mr-2 h-4 w-4" />
                          {t('signIn')}
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1 border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                          onClick={() => {
                            setAuthModalTab('register');
                            setIsAuthModalOpen(true);
                          }}
                        >
                          <UserPlus className="mr-2 h-4 w-4" />
                          {t('signUp')}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <AuthModal 
                    isOpen={isAuthModalOpen} 
                    onClose={() => setIsAuthModalOpen(false)}
                    defaultTab={authModalTab}
                  />
                </>
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
                  <h2 className="text-xl font-semibold text-gray-900">{t('bookService')}</h2>
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
      
      <PetBackerFooter />
    </div>
  );
}

export default function ServiceDetailPage() {
  return <ServiceDetail />;
}
