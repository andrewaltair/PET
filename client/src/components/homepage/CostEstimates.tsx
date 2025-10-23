'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel';

export function CostEstimates() {
  const t = useTranslations('costEstimates');

  const estimates = [
    {
      title: t('service1Title'),
      image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400',
      description: t('service1Desc'),
    },
    {
      title: t('service2Title'),
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
      description: t('service2Desc'),
    },
    {
      title: t('service3Title'),
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
      description: t('service3Desc'),
    },
  ];

  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {estimates.map((estimate, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gray-200 relative overflow-hidden">
                    <img
                      src={estimate.image}
                      alt={estimate.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{estimate.title}</h3>
                    <p className="text-gray-600 mb-4">{estimate.description}</p>
                    <a href="/services" className="text-green-600 hover:text-green-700 font-semibold inline-flex items-center gap-2">
                      {t('seePrices')}
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        <div className="text-center mt-12">
          <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-6 text-lg font-semibold">
            {t('ctaButton')}
          </Button>
        </div>
      </div>
    </div>
  );
}

