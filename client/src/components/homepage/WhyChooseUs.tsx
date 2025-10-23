'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Check, Shield, Heart, Users, MessageSquare, Home, Clock, Award } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';

export function WhyChooseUs() {
  const t = useTranslations('whyChooseUs');

  const benefits = [
    {
      icon: Home,
      title: t('benefit1Title'),
      description: t('benefit1Desc'),
      color: 'green',
    },
    {
      icon: Users,
      title: t('benefit2Title'),
      description: t('benefit2Desc'),
      color: 'blue',
    },
    {
      icon: Clock,
      title: t('benefit3Title'),
      description: t('benefit3Desc'),
      color: 'orange',
    },
    {
      icon: Shield,
      title: t('benefit4Title'),
      description: t('benefit4Desc'),
      color: 'blue',
    },
    {
      icon: MessageSquare,
      title: t('benefit5Title'),
      description: t('benefit5Desc'),
      color: 'pink',
    },
    {
      icon: Award,
      title: t('benefit6Title'),
      description: t('benefit6Desc'),
      color: 'blue',
    },
  ];

  return (
    <div className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-green-100 to-blue-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            {t('badge')}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            const colorClasses = {
              green: 'bg-green-100 text-green-600',
              teal: 'bg-blue-100 text-blue-600',
              orange: 'bg-orange-100 text-orange-600',
              blue: 'bg-blue-100 text-blue-600',
              pink: 'bg-pink-100 text-pink-600',
              green: 'bg-blue-100 text-blue-600',
            };

            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100 relative">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${colorClasses[benefit.color as keyof typeof colorClasses]} mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 absolute top-6 right-6">{benefit.title}</h3>
                <p className="text-gray-600 mt-2">{benefit.description}</p>
              </div>
            );
          })}
        </div>

        {/* Trust Stats */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 md:p-12 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <AnimatedCounter 
                value={50000} 
                suffix="+" 
                className="text-4xl md:text-5xl font-bold mb-2"
              />
              <div className="text-sm text-green-100">{t('stat1')}</div>
            </div>
            <div>
              <AnimatedCounter 
                value={10000} 
                suffix="+" 
                className="text-4xl md:text-5xl font-bold mb-2"
              />
              <div className="text-sm text-green-100">{t('stat2')}</div>
            </div>
            <div>
              <AnimatedCounter 
                value={15000} 
                suffix="+" 
                className="text-4xl md:text-5xl font-bold mb-2"
              />
              <div className="text-sm text-green-100">{t('stat3')}</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">4.9★</div>
              <div className="text-sm text-green-100">{t('stat4')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
