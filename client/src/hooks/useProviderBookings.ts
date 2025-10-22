import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsAPI } from '../services/api';
import { BookingWithDetails, UpdateBookingStatusRequest, BookingStatus } from 'petservice-marketplace-shared-types';
import toast from 'react-hot-toast';

// Query keys for provider bookings
export const providerBookingsKeys = {
  all: ['provider-bookings'] as const,
  lists: () => [...providerBookingsKeys.all, 'list'] as const,
  list: () => [...providerBookingsKeys.lists()] as const,
};

/**
 * Hook to get bookings for services provided by current provider user
 */
export function useProviderBookings() {
  return useQuery({
    queryKey: providerBookingsKeys.list(),
    queryFn: () => bookingsAPI.getMyBookingsAsProvider(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401, 403 (not authorized)
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

/**
 * Hook to confirm a booking (PROVIDER only)
 */
export function useConfirmBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) =>
      bookingsAPI.updateBookingStatus(bookingId, { status: BookingStatus.CONFIRMED }),
    onSuccess: (data) => {
      // Update the booking in the provider bookings list
      queryClient.setQueryData(providerBookingsKeys.list(), (oldData: { bookings: BookingWithDetails[] } | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          bookings: oldData.bookings.map(booking =>
            booking.id === data.booking.id ? data.booking : booking
          ),
        };
      });

      // Also invalidate owner bookings to reflect the status change
      queryClient.invalidateQueries({ queryKey: ['owner-bookings'] });

      toast.success('Booking confirmed successfully');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error || 'Failed to confirm booking';
      toast.error(errorMessage);
    },
  });
}

/**
 * Hook to reject/cancel a booking (PROVIDER only)
 */
export function useRejectBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) =>
      bookingsAPI.updateBookingStatus(bookingId, { status: BookingStatus.CANCELLED }),
    onSuccess: (data) => {
      // Update the booking in the provider bookings list
      queryClient.setQueryData(providerBookingsKeys.list(), (oldData: { bookings: BookingWithDetails[] } | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          bookings: oldData.bookings.map(booking =>
            booking.id === data.booking.id ? data.booking : booking
          ),
        };
      });

      // Also invalidate owner bookings to reflect the status change
      queryClient.invalidateQueries({ queryKey: ['owner-bookings'] });

      toast.success('Booking rejected successfully');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error || 'Failed to reject booking';
      toast.error(errorMessage);
    },
  });
}

/**
 * Hook to mark a booking as completed (PROVIDER only)
 */
export function useCompleteBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) =>
      bookingsAPI.updateBookingStatus(bookingId, { status: BookingStatus.COMPLETED }),
    onSuccess: (data) => {
      // Update the booking in the provider bookings list
      queryClient.setQueryData(providerBookingsKeys.list(), (oldData: { bookings: BookingWithDetails[] } | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          bookings: oldData.bookings.map(booking =>
            booking.id === data.booking.id ? data.booking : booking
          ),
        };
      });

      // Also invalidate owner bookings to reflect the status change
      queryClient.invalidateQueries({ queryKey: ['owner-bookings'] });

      toast.success('Booking marked as completed');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error || 'Failed to complete booking';
      toast.error(errorMessage);
    },
  });
}
