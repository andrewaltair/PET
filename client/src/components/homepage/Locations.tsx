'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Globe } from 'lucide-react';

const countries = [
  'Australia', 'Canada', 'France', 'Germany', 'Italy', 'Spain', 'United Kingdom', 'United States',
  'Brazil', 'Mexico', 'Argentina', 'Japan', 'South Korea', 'Singapore', 'Hong Kong', 'India',
];

export function Locations() {
  const t = useTranslations('locations');

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

        {/* World Map Illustration */}
        <div className="mb-12 flex justify-center">
          <div className="relative w-full max-w-4xl h-96 bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl overflow-hidden flex items-center justify-center">
            <Globe className="w-64 h-64 text-green-300" />
            <div className="absolute top-10 left-10">
              <div className="w-8 h-8 bg-green-600 rounded-full border-4 border-white shadow-lg"></div>
            </div>
            <div className="absolute bottom-20 right-20">
              <div className="w-8 h-8 bg-green-600 rounded-full border-4 border-white shadow-lg"></div>
            </div>
            <div className="absolute top-32 right-32">
              <div className="w-8 h-8 bg-green-600 rounded-full border-4 border-white shadow-lg"></div>
            </div>
          </div>
        </div>

        {/* Country List */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {countries.map((country, index) => (
            <a
              key={index}
              href={`/services?location=${country}`}
              className="text-green-600 hover:text-green-700 hover:underline text-sm font-medium"
            >
              {t('linkText', { country })}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

