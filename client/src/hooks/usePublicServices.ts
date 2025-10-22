import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { servicesAPI, profileAPI } from '../services/api';
import { PaginatedServicesResponse, ProviderProfileWithServices } from 'petservice-marketplace-shared-types';

// Query keys for public services
export const publicServiceKeys = {
  all: ['public-services'] as const,
  lists: () => [...publicServiceKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...publicServiceKeys.lists(), filters] as const,
};

/**
 * Hook for infinite scrolling public services
 * Loads services in pages for OWNER users to browse
 */
export function useInfinitePublicServices(
  limit: number = 12,
  search?: string,
  serviceType?: string,
  location?: string,
  date?: string
) {
  return useInfiniteQuery({
    queryKey: publicServiceKeys.list({ limit, search, serviceType, location, date }),
    queryFn: ({ pageParam = 1 }) =>
      servicesAPI.getServices(pageParam as number, limit, search, serviceType, location, date),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage as PaginatedServicesResponse;
      // Return next page number if there are more pages, undefined otherwise
      return pagination.page < pagination.totalPages ? pagination.page + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - services don't change that frequently
    gcTime: 10 * 60 * 1000, // 10 minutes cache
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors (client errors)
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 3;
    },
    enabled: typeof window !== 'undefined', // Only run on client side
  });
}

/**
 * Hook for paginated public services (alternative to infinite scroll)
 */
export function usePublicServices(page: number = 1, limit: number = 12) {
  return useQuery({
    queryKey: publicServiceKeys.list({ page, limit }),
    queryFn: () => servicesAPI.getServices(page, limit),
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 3;
    },
    enabled: typeof window !== 'undefined', // Only run on client side
  });
}

/**
 * Utility hook to get all loaded services from infinite query
 */
export function useAllLoadedServices(infiniteQueryResult: ReturnType<typeof useInfinitePublicServices>) {
  const { data, isLoading, error, hasNextPage, fetchNextPage, isFetchingNextPage } = infiniteQueryResult;

  // Flatten all pages into a single array
  const allServices = data?.pages.flatMap(page => page.data) ?? [];

  // Calculate total services loaded
  const totalLoaded = allServices.length;

  // Get pagination info from last page
  const lastPage = data?.pages[data.pages.length - 1];
  const totalAvailable = lastPage?.pagination.total ?? 0;

  return {
    services: allServices,
    totalLoaded,
    totalAvailable,
    hasMore: hasNextPage,
    loadMore: fetchNextPage,
    isLoadingMore: isFetchingNextPage,
    isLoading,
    error,
  };
}

/**
 * Hook for fetching provider profile with services
 */
export function useProviderProfile(userId: string) {
  return useQuery({
    queryKey: ['provider-profile', userId],
    queryFn: () => profileAPI.getProviderProfile(userId),
    staleTime: 10 * 60 * 1000, // 10 minutes - profile data doesn't change frequently
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors (client errors like user not found)
      if (error?.response?.status >= 400 && error?.response?.status < 500) {
        return false;
      }
      return failureCount < 3;
    },
    enabled: !!userId && typeof window !== 'undefined', // Only run on client side
  });
}
