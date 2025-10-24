'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { useInfinitePublicServices, useAllLoadedServices } from '@/hooks/usePublicServices';
import { UserRole, ServiceType } from 'petservice-marketplace-shared-types';
import { ServiceCardSkeleton } from '@/components/ServiceCardSkeleton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Search, X, Eye, Filter, SlidersHorizontal, CheckCircle, Star, Calendar } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { ProviderVerificationBadge } from '@/components/ProviderVerificationBadge';
import { LiveChat } from '@/components/homepage/LiveChat';
import { AuthModal } from '@/components/auth/AuthModal';

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

function ServiceCard({ service }: { service: any }) {
  const t = useTranslations('servicesPage');

  const formatAvailability = (availability: Record<string, string[]>): string => {
    const days = Object.keys(availability);
    if (days.length === 0) return 'No availability';

    return `${days.length} days available`;
  };

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

  const imageUrl = service.imageUrl || getDefaultImage(service.serviceType);

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border-2 border-transparent hover:border-blue-200 bg-white">
      {/* Service Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-green-100 to-blue-100">
        <img
          src={imageUrl}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            // Fallback to gradient if image fails to load
            e.currentTarget.style.display = 'none';
          }}
        />
        {/* Overlay badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 text-xs font-semibold bg-white/90 backdrop-blur-sm text-blue-800 rounded-full shadow-md">
            {getServiceTypeLabel(service.serviceType)}
          </span>
        </div>
        {/* Price badge */}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 text-lg font-bold bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-full shadow-lg">
            ${Number(service.price).toFixed(2)}
          </span>
        </div>
      </div>

      <CardContent className="p-6">
        {/* Trust Indicators */}
        <div className="mb-3">
          <ProviderVerificationBadge 
            verified={true}
            rating={4.8}
            reviewCount={12}
            badgeType="default"
            showRating={true}
          />
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
          <Link
            href={`/services/${service.id}`}
            className="hover:text-blue-600 transition-colors"
          >
            {service.title}
          </Link>
        </h3>

        {/* Provider Info */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
          <span>by </span>
          <Link
            href={`/provider/${service.providerId}`}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {service.provider.firstName} {service.provider.lastName}
          </Link>
          {service.provider.role === UserRole.PROVIDER && service.provider.location && (
            <>
              <span>•</span>
              <span>{service.provider.location}</span>
            </>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {service.description}
        </p>

        {/* Availability */}
        <div className="text-sm text-gray-500 mb-4 flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {formatAvailability(service.availability)}
        </div>

        {/* Action */}
        <div className="pt-4 border-t border-gray-200">
          <Button asChild className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            <Link href={`/services/${service.id}`}>
              <Eye className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              {t('viewDetails')}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ServicesList() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('servicesPage');

  // Prevent hydration mismatch by tracking mount state
  const [mounted, setMounted] = useState(false);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceType | 'all'>('all');
  const [locationQuery, setLocationQuery] = useState('');
  const [dateQuery, setDateQuery] = useState('');

  // Auth modal state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  // Initialize filters from URL parameters
  useEffect(() => {
    const search = searchParams.get('search') || '';
    const serviceType = searchParams.get('serviceType') || 'all';
    const location = searchParams.get('location') || '';
    const date = searchParams.get('date') || '';

    setSearchQuery(search);
    setSelectedServiceType(serviceType as ServiceType | 'all');
    setLocationQuery(location);
    setDateQuery(date);
  }, [searchParams]);

  // Set mounted flag after component mounts to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Debounced search query (simple implementation)
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Get final filter values
  const finalSearchQuery = debouncedSearchQuery.trim();
  const finalServiceType = selectedServiceType === 'all' ? undefined : selectedServiceType;
  const finalLocationQuery = locationQuery.trim();
  const finalDateQuery = dateQuery.trim();

  const infiniteQueryResult = useInfinitePublicServices(
    12,
    finalSearchQuery,
    finalServiceType,
    finalLocationQuery,
    finalDateQuery
  ); // Load 12 services at a time
  const { isLoading, error } = infiniteQueryResult;

  const { services, hasMore, loadMore, isLoadingMore } = useAllLoadedServices(infiniteQueryResult);

  // Clear filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedServiceType('all');
    setLocationQuery('');
    setDateQuery('');
  };

  // Check if any filters are active
  const hasActiveFilters = finalSearchQuery || finalServiceType || finalLocationQuery || finalDateQuery;

  const handleLoadMore = () => {
    if (hasMore && !isLoadingMore) {
      loadMore();
    }
  };

  // CRITICAL: Check mounted FIRST to prevent hydration mismatch
  // Server will never render this skeleton, client will on first render
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header skeleton */}
          <div className="text-center mb-12">
            <div className="h-10 bg-gray-300 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-300 rounded w-96 mx-auto animate-pulse"></div>
          </div>

          {/* Filters skeleton */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1 min-w-0">
                <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
              </div>
              <div className="w-full lg:w-64">
                <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Services Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <ServiceCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header skeleton */}
          <div className="text-center mb-12">
            <div className="h-10 bg-gray-300 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-300 rounded w-96 mx-auto animate-pulse"></div>
          </div>

          {/* Filters skeleton */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1 min-w-0">
                <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
              </div>
              <div className="w-full lg:w-64">
                <div className="h-10 bg-gray-300 rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Services Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <ServiceCardSkeleton key={index} />
            ))}
          </div>
        </div>
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
            onClick={() => router.refresh()}
            variant="outline"
            className="hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {t('tryAgain')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Layout showBreadcrumbs={true} breadcrumbs={
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t('breadcrumb')}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }>
        <div className="bg-gradient-to-br from-green-50 via-white to-blue-50 py-8" suppressHydrationWarning>
          <div className="max-w-7xl mx-auto px-4">
            {/* Hero Header Section */}
            <div className="mb-12">
              <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-200">
                <div className="text-center">
                  <div className="inline-block bg-gradient-to-r from-green-100 to-blue-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                    🐾 {t('title')}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    {t('title')}
                  </h1>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    {t('subtitle')}
                  </p>

                  {/* User-specific actions */}
                  <div className="mt-6">
                    {mounted && user && (
                      <>
                        {user.role === UserRole.PROVIDER ? (
                          <Button asChild className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold px-8 py-6 text-lg">
                            <Link href="/dashboard/services">
                              {t('manageMyServices')} →
                            </Link>
                          </Button>
                        ) : (
                          <Button asChild variant="outline" className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow-md border-2">
                            <Link href="/dashboard">
                              {t('goToDashboard')} →
                            </Link>
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-lg border-2 border-transparent hover:border-blue-200 p-6 mb-8 transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-r from-green-100 to-blue-100 p-2 rounded-lg">
                  <SlidersHorizontal className="w-5 h-5 text-gray-700" />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg">{t('filters')}</h3>
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors">
                    {hasActiveFilters ? 1 + (finalServiceType ? 1 : 0) : 0} {t('activeFilters')}
                  </Badge>
                )}
              </div>

              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                {/* Search Input */}
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4"
                  />
                </div>

                {/* Service Type Filter */}
                <div className="w-full lg:w-64">
                  <Select
                    value={selectedServiceType}
                    onValueChange={(value) => setSelectedServiceType(value as ServiceType | 'all')}
                  >
                    <SelectTrigger>
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        <SelectValue placeholder={t('allServiceTypes')} />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('allServiceTypes')}</SelectItem>
                      <SelectItem value={ServiceType.WALKING}>🐕 Dog Walking</SelectItem>
                      <SelectItem value={ServiceType.SITTING}>🏡 Pet Sitting</SelectItem>
                      <SelectItem value={ServiceType.GROOMING}>✂️ Grooming</SelectItem>
                      <SelectItem value={ServiceType.VETERINARIAN_VISIT}>🏥 Vet Visit</SelectItem>
                      <SelectItem value={ServiceType.TAXI}>🚗 Pet Taxi</SelectItem>
                      <SelectItem value={ServiceType.TRAINING}>🎾 Training</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    size="sm"
                    className="flex items-center gap-2 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all duration-200 border-2"
                  >
                    <X className="w-4 h-4" />
                    {t('clearAll')}
                  </Button>
                )}
              </div>

              {/* Active Filter Chips */}
              {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-sm font-semibold text-gray-700 mr-2">{t('activeFiltersLabel')}</span>
                    {finalSearchQuery && (
                      <Badge variant="default" className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 transition-colors">
                        <Search className="w-3 h-3" />
                        "{finalSearchQuery}"
                        <button
                          onClick={() => setSearchQuery('')}
                          className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                          aria-label={`Remove search filter: ${finalSearchQuery}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    )}
                    {finalServiceType && (
                      <Badge variant="secondary" className="flex items-center gap-1 bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors">
                        <Filter className="w-3 h-3" />
                        {getServiceTypeLabel(finalServiceType)}
                        <button
                          onClick={() => setSelectedServiceType('all')}
                          className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                          aria-label={`Remove service type filter: ${getServiceTypeLabel(finalServiceType)}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>

        {/* Services Grid */}
        {!services || services.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-12 border-2 border-transparent hover:border-blue-200 transition-all duration-300">
              <div className="text-8xl mb-6 transform transition-transform duration-300 hover:scale-110 hover:rotate-12">
                {hasActiveFilters ? '🔍' : '🏠'}
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {hasActiveFilters ? t('noServicesMatch') : t('noServicesAvailable')}
              </h2>

              <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                {hasActiveFilters
                  ? t('noServicesMatchDesc')
                  : t('noServicesAvailableDesc')
                }
              </p>

              {/* Popular Searches Suggestion */}
              {hasActiveFilters && (
                <div className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
                  <p className="text-sm font-semibold text-gray-700 mb-3">{t('tryPopularSearches')}</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {['Dog Walking', 'Pet Sitting', 'Grooming', 'Training'].map((term) => (
                          <Button
                            key={term}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSearchQuery(term);
                              setSelectedServiceType('all');
                            }}
                            className="hover:bg-blue-100 hover:border-blue-300 border-2 transition-all duration-200"
                          >
                            {term}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {hasActiveFilters ? (
                      <>
                        <Button
                          onClick={clearFilters}
                          variant="default"
                          className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl"
                        >
                          <SlidersHorizontal className="w-4 h-4" />
                          {t('clearAllFilters')}
                        </Button>
                        <Button
                          onClick={() => setSearchQuery('')}
                          variant="outline"
                          className="flex items-center gap-2 border-2 hover:bg-blue-50 transition-all duration-200"
                        >
                          <Search className="w-4 h-4" />
                          {t('clearSearch')}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => window.location.reload()}
                          variant="outline"
                          className="flex items-center gap-2 border-2 hover:bg-blue-50 transition-all duration-200"
                        >
                          {t('refreshPage')}
                        </Button>
                        {mounted && !user && (
                          <Link href="/register">
                            <Button className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl">
                              {t('becomeProvider')}
                            </Button>
                          </Link>
                        )}
                      </>
                    )}
                  </div>

                  {/* Become Provider CTA for Empty State */}
                  {!hasActiveFilters && mounted && !user && (
                    <div className="mt-12 p-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-lg border-2 border-purple-200 hover:border-purple-300 transition-all duration-300">
                      <p className="text-gray-700 mb-4 font-semibold text-lg">
                        {t('wantToOffer')}
                      </p>
                      <p className="text-sm text-gray-600 mb-6">
                        {t('joinProviders')}
                      </p>
                      <Button asChild className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                        <Link href="/register?role=provider">
                          {t('becomeProviderFree')} →
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {services.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="text-center">
                    <Button
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      variant="outline"
                      className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow-md border-2 transform hover:scale-105 px-8 py-6"
                    >
                      {isLoadingMore ? t('loading') : `${t('loadMore')} →`}
                    </Button>
                  </div>
                )}

                {/* End of results message */}
                {!hasMore && services.length > 0 && (
                  <div className="text-center text-gray-600 py-8">
                    <p>{t('seenAllServices')}</p>
                  </div>
                )}
              </>
            )}

            {/* Call to action for providers */}
            {mounted && !user && (
              <div className="mt-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg p-12 text-center border-2 border-transparent hover:border-blue-200 transition-all duration-300">
                <div className="text-6xl mb-6 transform transition-transform duration-300 hover:scale-110 hover:rotate-12">
                  🚀
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {t('areYouProvider')}
                </h2>
                <p className="text-gray-600 mb-8 text-lg">
                  {t('becomeProviderCta')}
                </p>
                <div className="space-x-4">
                  <Button 
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold px-8 py-6 text-lg"
                    onClick={() => {
                      setAuthModalTab('register');
                      setIsAuthModalOpen(true);
                    }}
                  >
                    {t('signUpAsProvider')} →
                  </Button>
                  <Button 
                    variant="outline" 
                    className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow-md border-2 px-8 py-6"
                    onClick={() => {
                      setAuthModalTab('login');
                      setIsAuthModalOpen(true);
                    }}
                  >
                    {t('signIn')} →
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
      <LiveChat />
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
    </>
  );
}

export default function ServicesPage() {
  return <ServicesList />;
}
