'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Star, MapPin, Award } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { servicesAPI } from '../services/api';
import { TopRatedProvider } from 'petservice-marketplace-shared-types';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function TopRatedProviders() {
  const { data: providers, isLoading, error } = useQuery({
    queryKey: ['top-rated-providers'],
    queryFn: () => servicesAPI.getTopRatedProviders(10),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 3 },
    },
  });

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (isLoading) {
    return (
      <div className="py-16">
        <div className="text-center mb-12">
          <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-300 rounded w-96 mx-auto animate-pulse"></div>
        </div>
        <div className="flex space-x-6 overflow-hidden">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex-shrink-0 w-80">
              <Card className="h-48">
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2 mx-auto"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !providers || providers.length === 0) {
    return null;
  }

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Top-Rated Providers
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Meet our highest-rated pet care professionals trusted by thousands of pet owners
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex space-x-6">
              {providers.map((provider: TopRatedProvider) => (
                <div key={provider.id} className="flex-shrink-0 w-80">
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      {/* Avatar */}
                      <div className="relative mb-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold">
                          {provider.profile?.firstName?.[0] || provider.email[0].toUpperCase()}
                        </div>
                        {provider.profile?.avatarUrl && (
                          <img
                            src={provider.profile.avatarUrl}
                            alt={`${provider.profile.firstName} ${provider.profile.lastName}`}
                            className="w-20 h-20 rounded-full mx-auto absolute top-0 left-1/2 transform -translate-x-1/2 object-cover"
                          />
                        )}
                        <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                          <Award className="w-4 h-4 text-white" />
                        </div>
                      </div>

                      {/* Name */}
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {provider.profile?.firstName && provider.profile?.lastName
                          ? `${provider.profile.firstName} ${provider.profile.lastName}`
                          : provider.email.split('@')[0]
                        }
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center justify-center mb-3">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm font-medium text-gray-900">
                            {provider.stats.averageRating.toFixed(1)}
                          </span>
                        </div>
                        <span className="mx-2 text-gray-400">•</span>
                        <span className="text-sm text-gray-600">
                          {provider.stats.totalReviews} reviews
                        </span>
                      </div>

                      {/* Location */}
                      {provider.profile?.location && (
                        <div className="flex items-center justify-center text-sm text-gray-600 mb-4">
                          <MapPin className="w-4 h-4 mr-1" />
                          {provider.profile.location}
                        </div>
                      )}

                      {/* Services Count */}
                      <Badge variant="secondary" className="mb-4">
                        {provider.stats.serviceCount} service{provider.stats.serviceCount !== 1 ? 's' : ''}
                      </Badge>

                      {/* Bio */}
                      {provider.profile?.bio && (
                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                          {provider.profile.bio}
                        </p>
                      )}

                      {/* Action Button */}
                      <Button variant="outline" className="w-full">
                        View Profile
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow z-10"
            aria-label="Previous providers"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow z-10"
            aria-label="Next providers"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
