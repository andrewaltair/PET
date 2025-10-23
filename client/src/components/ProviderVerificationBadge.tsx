'use client';

import React from 'react';
import { Shield, CheckCircle, Star, Award } from 'lucide-react';
import { Badge } from './ui/badge';

interface ProviderVerificationBadgeProps {
  verified?: boolean;
  rating?: number;
  reviewCount?: number;
  badgeType?: 'default' | 'premium' | 'top-rated';
  showRating?: boolean;
}

export function ProviderVerificationBadge({
  verified = true,
  rating = 0,
  reviewCount = 0,
  badgeType = 'default',
  showRating = true,
}: ProviderVerificationBadgeProps) {
  const badgeConfig = {
    default: {
      icon: CheckCircle,
      label: 'Verified',
      className: 'bg-blue-50 text-blue-700 border-blue-200',
      iconClassName: 'text-blue-600',
    },
    premium: {
      icon: Shield,
      label: 'Premium',
      className: 'bg-purple-50 text-purple-700 border-purple-200',
      iconClassName: 'text-purple-600',
    },
    'top-rated': {
      icon: Award,
      label: 'Top Rated',
      className: 'bg-orange-50 text-orange-700 border-orange-200',
      iconClassName: 'text-orange-600',
    },
  };

  const config = badgeConfig[badgeType];
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Verification Badge */}
      {verified && (
        <Badge className={`flex items-center gap-1 ${config.className}`}>
          <Icon className={`w-3 h-3 ${config.iconClassName}`} />
          {config.label}
        </Badge>
      )}

      {/* Rating Display */}
      {showRating && rating > 0 && (
        <div className="flex items-center gap-1 text-sm">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold text-gray-900">{rating.toFixed(1)}</span>
          {reviewCount > 0 && (
            <span className="text-gray-500">({reviewCount})</span>
          )}
        </div>
      )}
    </div>
  );
}

