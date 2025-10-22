import React from 'react';
import { Skeleton } from './ui/skeleton';

interface ServiceManagementCardSkeletonProps {
  className?: string;
}

export function ServiceManagementCardSkeleton({ className }: ServiceManagementCardSkeletonProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden animate-pulse hover:shadow-lg transition-shadow ${className}`}>
      <div className="p-6">
        {/* Service Type Badge and Price Row */}
        <div className="flex justify-between items-start mb-4">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-6 w-16" />
        </div>

        {/* Title */}
        <Skeleton className="h-6 w-3/4 mb-2" />

        {/* Description - 3 lines */}
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>

        {/* Availability */}
        <Skeleton className="h-4 w-40 mb-4" />

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200 gap-2">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
}
