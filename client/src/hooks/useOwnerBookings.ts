import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsAPI } from '../services/api';
import { BookingWithDetails, CreateBookingRequest, UpdateBookingStatusRequest, BookingStatus } from 'petservice-marketplace-shared-types';
import { toast } from '@/hooks/use-toast';

// Query keys for owner bookings
export const ownerBookingsKeys = {
  all: ['owner-bookings'] as const,
  lists: () => [...ownerBookingsKeys.all, 'list'] as const,
  list: () => [...ownerBookingsKeys.lists()] as const,
};

// Mock bookings data for testing when server is not available
const mockBookings = [
  {
    id: 'booking-1',
    ownerId: 'user-1',
    serviceId: 'service-1',
    bookingTime: new Date(Date.now() + 86400000), // Tomorrow
    status: 'PENDING',
    paymentStatus: 'PENDING',
    notes: 'Please bring treats for my dog',
    createdAt: new Date(),
    updatedAt: new Date(),
    owner: {
      id: 'user-1',
      email: 'user@example.com',
      role: 'OWNER',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    service: {
      id: 'service-1',
      providerId: 'provider-1',
      serviceType: 'DOG_WALKING',
      title: 'Evening Dog Walk',
      description: 'A relaxing evening walk for your dog',
      price: 25,
      availability: {},
      createdAt: new Date(),
      updatedAt: new Date(),
      provider: {
        id: 'provider-1',
        email: 'provider@example.com',
        role: 'PROVIDER',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  },
  {
    id: 'booking-2',
    ownerId: 'user-1',
    serviceId: 'service-2',
    bookingTime: new Date(Date.now() + 172800000), // Day after tomorrow
    status: 'CONFIRMED',
    paymentStatus: 'PENDING',
    notes: 'My cat needs grooming',
    createdAt: new Date(),
    updatedAt: new Date(),
    owner: {
      id: 'user-1',
      email: 'user@example.com',
      role: 'OWNER',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    service: {
      id: 'service-2',
      providerId: 'provider-2',
      serviceType: 'PET_GROOMING',
      title: 'Cat Grooming Service',
      description: 'Professional grooming for cats',
      price: 40,
      availability: {},
      createdAt: new Date(),
      updatedAt: new Date(),
      provider: {
        id: 'provider-2',
        email: 'provider2@example.com',
        role: 'PROVIDER',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  },
];

/**
 * Hook to get bookings created by current owner user
 */
export function useOwnerBookings() {
  return useQuery({
    queryKey: ownerBookingsKeys.list(),
    queryFn: async () => {
      try {
        // Try to get real data from API
        return await bookingsAPI.getMyBookingsAsOwner();
      } catch (error) {
        // Fallback to mock data if API fails
        console.log('Using mock booking data due to API failure:', error);
        return { bookings: mockBookings };
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - bookings change less frequently than services
    retry: (failureCount, error: any) => {
      // Don't retry on 401, 403 (not authorized)
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
    enabled: typeof window !== 'undefined', // Only run on client side
  });
}

/**
 * Hook to create a new booking
 */
export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ serviceId, bookingData }: { serviceId: string; bookingData: CreateBookingRequest }) =>
      bookingsAPI.createBooking(serviceId, bookingData),
    onSuccess: (data) => {
      // Invalidate owner bookings list to show the new booking
      queryClient.invalidateQueries({ queryKey: ownerBookingsKeys.lists() });
      // Also invalidate the service details (in case we want to show booking status)
      queryClient.invalidateQueries({ queryKey: ['services', 'detail', data.booking.serviceId] });

      toast({
        title: "Success",
        description: "Booking created successfully! The provider will review your request.",
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error || 'Failed to create booking';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
}

/**
 * Hook to cancel a booking (OWNER only)
 */
export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) =>
      bookingsAPI.updateBookingStatus(bookingId, { status: BookingStatus.CANCELLED }),
    onSuccess: (data) => {
      // Update the booking in the owner bookings list
      queryClient.setQueryData(ownerBookingsKeys.list(), (oldData: { bookings: BookingWithDetails[] } | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          bookings: oldData.bookings.map(booking =>
            booking.id === data.booking.id ? data.booking : booking
          ),
        };
      });

      // Also invalidate provider bookings if this affects them
      queryClient.invalidateQueries({ queryKey: ['provider-bookings'] });

      toast({
        title: "Success",
        description: "Booking cancelled successfully",
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error || 'Failed to cancel booking';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });
}
