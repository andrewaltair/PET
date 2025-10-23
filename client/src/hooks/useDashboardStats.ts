import { useQuery } from '@tanstack/react-query';
import { UserRole } from 'petservice-marketplace-shared-types';
import { useOwnerBookings } from './useOwnerBookings';
import { useProviderBookings } from './useProviderBookings';
import { useMyServices } from './useServices';
import { useProfile } from './useProfile';

export interface DashboardStats {
  activeBookings: number;
  completedServices: number;
  totalServices: number;
  totalBookings: number;
  reviews: number;
  favorites: number;
}

/**
 * Hook to get dashboard statistics based on user role
 */
export function useDashboardStats(role: UserRole) {
  const { data: ownerBookings } = useOwnerBookings();
  const { data: providerBookings } = useProviderBookings();
  const { data: myServices } = useMyServices();
  const { data: profile } = useProfile();

  // Get stats based on role
  const stats: DashboardStats = {
    activeBookings: 0,
    completedServices: 0,
    totalServices: 0,
    totalBookings: 0,
    reviews: 0,
    favorites: 0,
  };

  if (role === UserRole.OWNER) {
    const bookings = ownerBookings?.bookings || [];
    stats.activeBookings = bookings.filter(
      (b) => b.status === 'PENDING' || b.status === 'CONFIRMED'
    ).length;
    stats.completedServices = bookings.filter(
      (b) => b.status === 'COMPLETED'
    ).length;
    stats.reviews = profile?.overallAverageRating ? 1 : 0; // Placeholder
    stats.favorites = 0; // Placeholder - would need to implement favorites feature
  } else if (role === UserRole.PROVIDER) {
    const bookings = providerBookings?.bookings || [];
    stats.totalServices = myServices?.length || 0;
    stats.totalBookings = bookings.length;
    stats.reviews = profile?.overallAverageRating ? 1 : 0; // Placeholder
    stats.favorites = 0; // Placeholder
  }

  return {
    data: stats,
    isLoading: false,
  };
}


