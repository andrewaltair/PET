'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface PremiumLoadingIndicatorProps {
  isLoading?: boolean;
  className?: string;
}

export function PremiumLoadingIndicator({ isLoading = true, className }: PremiumLoadingIndicatorProps) {
  const t = useTranslations('hero');
  
  if (!isLoading) return null;

  return (
    <div className={cn("fixed inset-0 z-[9999] bg-white/80 backdrop-blur-sm flex items-center justify-center", className)} suppressHydrationWarning>
      <div className="relative" suppressHydrationWarning>
        {/* Outer rotating ring */}
        <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        
        {/* Middle rotating ring */}
        <div className="absolute top-2 left-2 w-16 h-16 border-4 border-green-200 border-r-green-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
        
        {/* Inner pulsing circle */}
        <div className="absolute top-6 left-6 w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-full animate-pulse" />
        
        {/* Pet paw mark in center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl" suppressHydrationWarning>🐾</div>
      </div>
      
      {/* Loading text */}
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 text-center" suppressHydrationWarning>
        <p className="text-gray-600 font-medium animate-pulse">{t('loading')}</p>
      </div>
    </div>
  );
}

