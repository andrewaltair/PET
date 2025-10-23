'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Shield, BadgeCheck, Lock, Award, Heart, Verified } from 'lucide-react';

export function TrustBadges() {
  const t = useTranslations('trustBadges');

  const badges = [
    {
      icon: Shield,
      title: t('badge1Title'),
      description: t('badge1Desc'),
      color: 'blue',
    },
    {
      icon: BadgeCheck,
      title: t('badge2Title'),
      description: t('badge2Desc'),
      color: 'blue',
    },
    {
      icon: Lock,
      title: t('badge3Title'),
      description: t('badge3Desc'),
      color: 'green',
    },
    {
      icon: Verified,
      title: t('badge4Title'),
      description: t('badge4Desc'),
      color: 'orange',
    },
  ];

  return (
    <div className="py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('title')}</h3>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            const colorClasses = {
              blue: 'bg-blue-100 text-blue-600',
              green: 'bg-blue-100 text-blue-600',
              green: 'bg-green-100 text-green-600',
              orange: 'bg-orange-100 text-orange-600',
            };

            return (
              <div 
                key={index} 
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all hover:scale-105 border border-gray-100 text-center"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${colorClasses[badge.color as keyof typeof colorClasses]} mb-3 mx-auto`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1 text-sm">{badge.title}</h4>
                <p className="text-xs text-gray-600">{badge.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

