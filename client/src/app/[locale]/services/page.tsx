'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { Search, X, Eye, Filter, SlidersHorizontal, CheckCircle, Star } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { ProviderVerificationBadge } from '@/components/ProviderVerificationBadge';
import { LiveChat } from '@/components/homepage/LiveChat';

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

  const formatAvailability = (availability: Record<string, string[]>): string => {
    const days = Object.keys(availability);
    if (days.length === 0) return 'No availability';

    return `${days.length} days available`;
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
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
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
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
        <div className="text-sm text-gray-500 mb-4">
          {formatAvailability(service.availability)}
        </div>

        {/* Action */}
        <div className="pt-4 border-t border-gray-200">
          <Button asChild variant="outline" className="w-full hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow-md">
            <Link href={`/services/${service.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
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

  // Prevent hydration mismatch by tracking mount state
  const [mounted, setMounted] = useState(false);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceType | 'all'>('all');
  const [locationQuery, setLocationQuery] = useState('');
  const [dateQuery, setDateQuery] = useState('');

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
            Failed to load services
          </div>
          <p className="text-gray-600 mb-4">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </p>
          <Button
            onClick={() => router.refresh()}
            variant="outline"
            className="hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Try Again
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
              <BreadcrumbPage>Services</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }>
        <div className="bg-gray-50 py-8" suppressHydrationWarning>
          <div className="max-w-7xl mx-auto px-4" suppressHydrationWarning>
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Pet Services
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Find trusted pet care providers for walking, sitting, grooming, and more
              </p>

              {/* User-specific actions */}
              {mounted && user && (
                <div className="mt-6">
                  {user.role === UserRole.PROVIDER ? (
                    <Button asChild className="shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 font-semibold">
                      <Link href="/dashboard/services">
                        Manage My Services
                      </Link>
                    </Button>
                  ) : (
                    <Button asChild variant="outline" className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow-md">
                      <Link href="/dashboard">
                        Go to Dashboard
                      </Link>
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                <h3 className="font-medium text-gray-900">Filters</h3>
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2">
                    {hasActiveFilters ? 1 + (finalServiceType ? 1 : 0) : 0} active
                  </Badge>
                )}
              </div>

              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                {/* Search Input */}
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search services..."
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
                        <SelectValue placeholder="All service types" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All service types</SelectItem>
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
                    className="flex items-center gap-2 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all duration-200"
                  >
                    <X className="w-4 h-4" />
                    Clear all
                  </Button>
                )}
              </div>

              {/* Active Filter Chips */}
              {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-sm font-medium text-gray-600 mr-2">Active filters:</span>
                    {finalSearchQuery && (
                      <Badge variant="default" className="flex items-center gap-1">
                        <Search className="w-3 h-3" />
                        "{finalSearchQuery}"
                        <button
                          onClick={() => setSearchQuery('')}
                          className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                          aria-label={`Remove search filter: ${finalSearchQuery}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    )}
                    {finalServiceType && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Filter className="w-3 h-3" />
                        {getServiceTypeLabel(finalServiceType)}
                        <button
                          onClick={() => setSelectedServiceType('all')}
                          className="ml-1 hover:bg-white/20 rounded-full p-0.5"
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
                <div className="max-w-2xl mx-auto">
                  <div className="text-8xl mb-6">
                    {hasActiveFilters ? '🔍' : '🏠'}
                  </div>

                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                    {hasActiveFilters ? 'No services match your filters' : 'No services available yet'}
                  </h2>

                  <p className="text-gray-600 mb-8 leading-relaxed">
                    {hasActiveFilters
                      ? 'We couldn\'t find any services matching your current search criteria. Try adjusting your filters or search terms to discover more options.'
                      : 'We\'re working hard to connect pet owners with trusted service providers in your area. Check back soon for new services!'
                    }
                  </p>

                  {/* Popular Searches Suggestion */}
                  {hasActiveFilters && (
                    <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-sm font-semibold text-gray-700 mb-3">💡 Try these popular searches:</p>
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
                            className="hover:bg-blue-100 hover:border-blue-300"
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
                          className="flex items-center gap-2"
                        >
                          <SlidersHorizontal className="w-4 h-4" />
                          Clear all filters
                        </Button>
                        <Button
                          onClick={() => setSearchQuery('')}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <Search className="w-4 h-4" />
                          Clear search
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => window.location.reload()}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          🔄 Refresh page
                        </Button>
                        {mounted && !user && (
                          <Link href="/register">
                            <Button className="flex items-center gap-2">
                              🏪 Become a provider
                            </Button>
                          </Link>
                        )}
                      </>
                    )}
                  </div>

                  {/* Become Provider CTA for Empty State */}
                  {!hasActiveFilters && mounted && !user && (
                    <div className="mt-12 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
                      <p className="text-gray-700 mb-4 font-medium">
                        Want to offer pet services in this area?
                      </p>
                      <p className="text-sm text-gray-600 mb-4">
                        Join hundreds of pet care providers earning extra income while helping pets!
                      </p>
                      <Button asChild className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                        <Link href="/register?role=provider">
                          Become a Provider - It's Free
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
                      className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      {isLoadingMore ? 'Loading...' : 'Load More Services'}
                    </Button>
                  </div>
                )}

                {/* End of results message */}
                {!hasMore && services.length > 0 && (
                  <div className="text-center text-gray-600 py-8">
                    <p>You've seen all available services!</p>
                  </div>
                )}
              </>
            )}

            {/* Call to action for providers */}
            {mounted && !user && (
              <div className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Are you a pet care provider?
                </h2>
                <p className="text-gray-600 mb-6">
                  Join our platform to offer your services and connect with pet owners.
                </p>
                <div className="space-x-4">
                  <Button asChild className="shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 font-semibold">
                    <Link href="/register">
                      Sign Up as Provider
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow-md">
                    <Link href="/login">
                      Sign In
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
      <LiveChat />
    </>
  );
}

export default function ServicesPage() {
  return <ServicesList />;
}
