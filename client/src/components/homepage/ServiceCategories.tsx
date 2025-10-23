'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Home, Heart, Scissors, Dog, Car, GraduationCap } from 'lucide-react';
import { ServiceType } from 'petservice-marketplace-shared-types';

export function ServiceCategories() {
  const router = useRouter();
  const t = useTranslations('services');

  const services = [
    { icon: Home, label: t('dogBoarding'), serviceType: ServiceType.SITTING, color: 'from-green-500 to-green-600', hoverColor: 'hover:from-green-600 hover:to-green-700' },
    { icon: Heart, label: t('petSitting'), serviceType: ServiceType.SITTING, color: 'from-pink-500 to-pink-600', hoverColor: 'hover:from-pink-600 hover:to-pink-700' },
    { icon: Scissors, label: t('petGrooming'), serviceType: ServiceType.GROOMING, color: 'from-blue-500 to-blue-600', hoverColor: 'hover:from-blue-600 hover:to-blue-700' },
    { icon: Dog, label: t('dogWalking'), serviceType: ServiceType.WALKING, color: 'from-orange-500 to-orange-600', hoverColor: 'hover:from-orange-600 hover:to-orange-700' },
    { icon: Car, label: t('petTaxi'), serviceType: ServiceType.TAXI, color: 'from-blue-500 to-blue-600', hoverColor: 'hover:from-blue-600 hover:to-blue-700' },
    { icon: GraduationCap, label: t('training'), serviceType: ServiceType.TRAINING, color: 'from-blue-500 to-blue-600', hoverColor: 'hover:from-blue-600 hover:to-blue-700' },
  ];

  const handleCategoryClick = (serviceType: ServiceType) => {
    router.push(`/services?serviceType=${serviceType}`);
  };

  return (
    <div className="bg-white py-12 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center gap-6 overflow-x-auto pb-2 scrollbar-hide">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center gap-3 min-w-[100px] cursor-pointer group"
                onClick={() => handleCategoryClick(service.serviceType)}
                onKeyPress={(e) => e.key === 'Enter' && handleCategoryClick(service.serviceType)}
                role="button"
                tabIndex={0}
                aria-label={`View ${service.label} services`}
              >
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${service.color} ${service.hoverColor} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all transform group-hover:scale-105`}>
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-700 text-center group-hover:text-gray-900 transition-colors">{service.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
