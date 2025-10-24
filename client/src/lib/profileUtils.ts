import { UserWithProfile } from 'petservice-marketplace-shared-types';

export interface ProfileCompleteness {
  score: number;
  maxScore: number;
  percentage: number;
  level: 'basic' | 'good' | 'excellent';
  colorClass: string;
}

/**
 * Calculate profile completeness score based on filled fields
 * Each filled parameter gives one point:
 * - firstName (1 point)
 * - lastName (1 point)
 * - avatarUrl (1 point)
 * - bio (1 point)
 * - location (1 point)
 * - facebookUrl (1 point)
 * - instagramUrl (1 point)
 * - twitterUrl (1 point)
 * - linkedinUrl (1 point)
 * Max score: 9 points
 */
export function calculateProfileCompleteness(provider: any): ProfileCompleteness {
  let score = 0;
  const maxScore = 9;

  // Count filled fields
  if (provider.firstName) score++;
  if (provider.lastName) score++;
  if (provider.avatarUrl) score++;
  if (provider.bio) score++;
  if (provider.location) score++;
  if (provider.facebookUrl) score++;
  if (provider.instagramUrl) score++;
  if (provider.twitterUrl) score++;
  if (provider.linkedinUrl) score++;

  const percentage = Math.round((score / maxScore) * 100);

  // Determine level and color based on percentage
  let level: 'basic' | 'good' | 'excellent';
  let colorClass: string;

  if (percentage >= 70) {
    level = 'excellent';
    colorClass = 'border-yellow-500 bg-yellow-50'; // Gold
  } else if (percentage >= 50) {
    level = 'good';
    colorClass = 'border-green-500 bg-green-50'; // Green
  } else {
    level = 'basic';
    colorClass = 'border-gray-300 bg-gray-50'; // Gray
  }

  return {
    score,
    maxScore,
    percentage,
    level,
    colorClass,
  };
}

/**
 * Get the provider's display name
 */
export function getProviderDisplayName(provider: any): string {
  if (provider.firstName && provider.lastName) {
    return `${provider.firstName} ${provider.lastName}`;
  }
  if (provider.firstName) {
    return provider.firstName;
  }
  if (provider.lastName) {
    return provider.lastName;
  }
  return provider.email.split('@')[0];
}

/**
 * Get initials for avatar display
 */
export function getProviderInitials(provider: any): string {
  if (provider.firstName && provider.lastName) {
    return `${provider.firstName[0]}${provider.lastName[0]}`.toUpperCase();
  }
  if (provider.firstName) {
    return provider.firstName[0].toUpperCase();
  }
  if (provider.lastName) {
    return provider.lastName[0].toUpperCase();
  }
  return provider.email[0].toUpperCase();
}

