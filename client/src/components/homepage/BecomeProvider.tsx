'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '../ui/button';
import Link from 'next/link';

export function BecomeProvider() {
  const t = useTranslations('becomeProvider');

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Image */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-2xl p-12 text-center">
                <div className="text-5xl md:text-6xl font-bold text-white mb-4">{t('openText')}</div>
                <div className="w-full h-2 bg-white rounded"></div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              {t('title')}
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              {t('subtitle')}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link href="/register?role=provider">
                <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-6 text-lg font-semibold">
                  {t('ctaButton1')}
                </Button>
              </Link>
              <Link href="/register?role=provider">
                <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-6 text-lg font-semibold">
                  {t('ctaButton2')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

