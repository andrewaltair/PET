'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { StarRating } from '@/components/ui/star-rating';
import { useTranslations } from 'next-intl';
import { ReviewResponse } from 'petservice-marketplace-shared-types';
import { format } from 'date-fns';

interface ReviewListProps {
  reviews: ReviewResponse[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function ReviewList({
  reviews,
  isLoading = false,
  emptyMessage = 'No reviews yet'
}: ReviewListProps) {
  const t = useTranslations('reviews');
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }, (_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="space-y-1">
                  <div className="w-24 h-4 bg-gray-200 rounded"></div>
                  <div className="w-16 h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="w-20 h-4 bg-gray-200 rounded"></div>
                <div className="w-full h-16 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">⭐</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {emptyMessage}
        </h3>
        <p className="text-gray-500">
          {t('beFirstToReview')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-sm">
                    {review.owner.firstName?.[0]}{review.owner.lastName?.[0]}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {review.owner.firstName} {review.owner.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(review.createdAt), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
              <StarRating value={review.rating} readonly size="sm" />
            </div>
          </CardHeader>

          <CardContent>
            {review.comment && (
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {review.comment}
              </p>
            )}
            <div className="mt-3 text-xs text-gray-500">
              {t('serviceLabel')}: {review.service.title}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
