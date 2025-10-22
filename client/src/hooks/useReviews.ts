import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ReviewResponse, CreateReviewRequest } from 'petservice-marketplace-shared-types';
import { reviewsAPI } from '../services/api';
import { toast } from '@/hooks/use-toast';

// Query keys for reviews
export const reviewKeys = {
  all: ['reviews'] as const,
  service: (serviceId: string) => [...reviewKeys.all, 'service', serviceId] as const,
  provider: (providerId: string) => [...reviewKeys.all, 'provider', providerId] as const,
  canReview: (bookingId: string) => [...reviewKeys.all, 'can-review', bookingId] as const,
};

/**
 * Hook to get reviews for a specific service
 */
export function useServiceReviews(serviceId: string) {
  return useQuery({
    queryKey: reviewKeys.service(serviceId),
    queryFn: () => reviewsAPI.getServiceReviews(serviceId),
    staleTime: 5 * 60 * 1000, // 5 minutes - reviews don't change frequently
    enabled: !!serviceId && typeof window !== 'undefined', // Only run on client side
  });
}

/**
 * Hook to get reviews for a specific provider
 */
export function useProviderReviews(providerId: string) {
  return useQuery({
    queryKey: reviewKeys.provider(providerId),
    queryFn: () => reviewsAPI.getProviderReviews(providerId),
    staleTime: 5 * 60 * 1000, // 5 minutes - reviews don't change frequently
    enabled: !!providerId && typeof window !== 'undefined', // Only run on client side
  });
}

/**
 * Hook to check if user can review a specific booking
 */
export function useCanReviewBooking(bookingId: string) {
  return useQuery({
    queryKey: reviewKeys.canReview(bookingId),
    queryFn: () => reviewsAPI.canReviewBooking(bookingId),
    staleTime: 1 * 60 * 1000, // 1 minute - this can change after review creation
    enabled: !!bookingId && typeof window !== 'undefined', // Only run on client side
  });
}

/**
 * Hook to create a new review
 */
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, reviewData }: { bookingId: string; reviewData: CreateReviewRequest }) =>
      reviewsAPI.createReview(bookingId, reviewData),
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: reviewKeys.service(data.serviceId)
      });
      queryClient.invalidateQueries({
        queryKey: reviewKeys.provider(data.providerId)
      });
      queryClient.invalidateQueries({
        queryKey: reviewKeys.canReview(variables.bookingId)
      });

      // Also invalidate services and profiles to get updated ratings
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });

      toast({
        title: 'Review submitted',
        description: 'Thank you for your feedback!',
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error || 'Failed to submit review';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });
}
