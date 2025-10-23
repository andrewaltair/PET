'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingProgressBarProps {
  isLoading?: boolean;
  className?: string;
}

export function LoadingProgressBar({ isLoading = true, className }: LoadingProgressBarProps) {
  if (!isLoading) return null;

  return (
    <div className={cn("fixed top-0 left-0 right-0 z-50 h-1", className)}>
      <div className="progress-bar w-full" />
    </div>
  );
}

