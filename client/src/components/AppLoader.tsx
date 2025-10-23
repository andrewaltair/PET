'use client';

import React, { useState, useEffect } from 'react';
import { PremiumLoadingIndicator } from './PremiumLoadingIndicator';

export function AppLoader({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return null;
  }

  return (
    <>
      <PremiumLoadingIndicator isLoading={isLoading} />
      <div className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'} suppressHydrationWarning>
        {children}
      </div>
    </>
  );
}

