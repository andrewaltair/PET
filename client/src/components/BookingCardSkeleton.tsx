import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Skeleton } from './ui/skeleton';

interface BookingCardSkeletonProps {
  className?: string;
}

export function BookingCardSkeleton({ className }: BookingCardSkeletonProps) {
  return (
    <Card className={`hover:shadow-lg transition-shadow animate-pulse ${className}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {/* Service title */}
            <Skeleton className="h-6 w-3/4 mb-2" />
            <div className="flex items-center space-x-2">
              {/* Status badge */}
              <Skeleton className="h-5 w-20 rounded-full" />
              {/* Price */}
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Booking Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm">
            <Skeleton className="h-4 w-12 mr-2" />
            <Skeleton className="h-4 w-48" />
          </div>

          <div className="flex items-center text-sm">
            <Skeleton className="h-4 w-14 mr-2" />
            <Skeleton className="h-4 w-24" />
          </div>

          <div className="flex items-center text-sm">
            <Skeleton className="h-4 w-16 mr-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        {/* Optional notes section (sometimes present) */}
        <div className="bg-muted rounded-lg p-3 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5 mt-1" />
        </div>
      </CardContent>

      <CardFooter>
        <div className="flex justify-between items-center w-full">
          {/* Booking date */}
          <Skeleton className="h-3 w-24" />

          {/* Action buttons */}
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-16 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-md" />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
