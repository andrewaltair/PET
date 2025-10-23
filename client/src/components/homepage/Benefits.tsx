'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Shield, Heart, Users } from 'lucide-react';

export function Benefits() {
  const t = useTranslations('benefits');

  const benefits = [
    {
      icon: Shield,
      title: t('benefit1Title'),
      description: t('benefit1Desc'),
    },
    {
      icon: Heart,
      title: t('benefit2Title'),
      description: t('benefit2Desc'),
    },
    {
      icon: Users,
      title: t('benefit3Title'),
      description: t('benefit3Desc'),
    },
  ];

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
          {t('title')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 mx-auto">
                  <Icon className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

