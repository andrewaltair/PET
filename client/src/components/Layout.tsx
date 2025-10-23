'use client';

import React from 'react';
import { PetBackerHeader } from './homepage/PetBackerHeader';
import { PetBackerFooter } from './homepage/PetBackerFooter';

interface LayoutProps {
  children: React.ReactNode;
  showBreadcrumbs?: boolean;
  breadcrumbs?: React.ReactNode;
}

export function Layout({ children, showBreadcrumbs = false, breadcrumbs }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <PetBackerHeader />

      {/* Breadcrumbs (optional) */}
      {showBreadcrumbs && breadcrumbs && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-3">
            {breadcrumbs}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <PetBackerFooter />
    </div>
  );
}

