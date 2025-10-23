'use client';

import React from 'react';
import { Star, MapPin, Award } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { TopRatedProvider } from 'petservice-marketplace-shared-types';
import { useFeaturedProviders } from '../hooks/useFeaturedProviders';
import { ServiceCardSkeleton } from './ServiceCardSkeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';
import Autoplay from 'embla-carousel-autoplay';


export function TopRatedProviders() {
  const { data: providers, isLoading, error } = useFeaturedProviders();
  const t = useTranslations();

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  if (isLoading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('topRatedProviders.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('topRatedProviders.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <ServiceCardSkeleton key={index} />
            ))}
          </div>
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
            {t('topRatedProviders.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('topRatedProviders.subtitle')}
          </p>
        </div>

        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          plugins={[plugin.current]}
          className="w-full"
        >
          <CarouselContent>
            {providers.map((provider: TopRatedProvider) => (
              <CarouselItem key={provider.id} className="md:basis-1/2 lg:basis-1/3">
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
                      {t('common.viewProfile')}
                    </Button>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}
