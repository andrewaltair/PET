import React from 'react';
import { Card, CardContent } from './ui/card';
import { Skeleton } from './ui/skeleton';

interface ServiceCardSkeletonProps {
  className?: string;
}

export function ServiceCardSkeleton({ className }: ServiceCardSkeletonProps) {
  return (
    <Card className={`overflow-hidden animate-pulse ${className}`}>
      <CardContent className="p-6">
        {/* Service Type Badge and Price Row */}
        <div className="flex justify-between items-start mb-4">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-6 w-16" />
        </div>

        {/* Title */}
        <Skeleton className="h-6 w-3/4 mb-2" />

        {/* Provider Info */}
        <div className="flex items-center space-x-2 mb-3">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-1" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Description - 3 lines */}
        <div className="space-y-2 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>

        {/* Availability */}
        <Skeleton className="h-4 w-28 mb-4" />

        {/* Action Button */}
        <div className="pt-4 border-t border-gray-200">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}
