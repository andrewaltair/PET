'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Clipboard, MessageSquare, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';

export function HowItWorks() {
  const t = useTranslations('howItWorks');

  const steps = [
    {
      number: 1,
      icon: Clipboard,
      emoji: '📝',
      title: t('step1Title'),
      description: t('step1Desc'),
      color: 'from-green-500 to-green-600',
    },
    {
      number: 2,
      icon: MessageSquare,
      emoji: '⚡',
      title: t('step2Title'),
      description: t('step2Desc'),
      color: 'from-blue-500 to-blue-600',
    },
    {
      number: 3,
      icon: Calendar,
      emoji: '✅',
      title: t('step3Title'),
      description: t('step3Desc'),
      color: 'from-orange-500 to-orange-600',
    },
    {
      number: 4,
      icon: CheckCircle,
      emoji: '🎉',
      title: t('step4Title'),
      description: t('step4Desc'),
      color: 'from-blue-500 to-blue-600',
    },
  ];

  return (
    <div className="py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <div className="inline-block bg-gradient-to-r from-green-100 to-blue-100 text-green-700 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold mb-3 md:mb-4">
            {t('badge')}
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4 px-2">
            {t('title')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
            {t('subtitle')}
          </p>
        </div>

        {/* Steps */}
        <div className="flex flex-col md:flex-row items-stretch gap-6 md:gap-8 mb-10 md:mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <React.Fragment key={step.number}>
                {/* Step Card */}
                <div className="relative bg-white rounded-xl md:rounded-2xl shadow-lg p-5 md:p-6 hover:shadow-xl transition-all border border-gray-100 w-full md:flex-1 overflow-visible">
                  {/* Number Badge - positioned at top-left corner */}
                  <div className={`absolute -top-3 md:-top-4 -left-3 md:-left-4 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r ${step.color} text-white text-lg md:text-xl font-bold flex items-center justify-center shadow-lg z-10`}>
                    {step.number}
                  </div>

                  {/* Icon and Title Side by Side */}
                  <div className="flex items-start gap-2 md:gap-3 mb-3 md:mb-4 mt-2">
                    {/* Icon with Emoji */}
                    <div className={`inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-r ${step.color} bg-opacity-10 flex-shrink-0`}>
                      <span className="text-2xl md:text-3xl">{step.emoji}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 leading-tight">{step.title}</h3>
                  </div>

                  {/* Description */}
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">{step.description}</p>
                </div>

                {/* Connector Arrow (hidden on last item and mobile) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center px-2">
          <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-4 md:px-8 md:py-6 text-base md:text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all w-full sm:w-auto">
            {t('ctaButton')}
          </Button>
          <p className="text-xs md:text-sm text-gray-500 mt-3 md:mt-4">{t('ctaSubtitle')}</p>
        </div>
      </div>
    </div>
  );
}
