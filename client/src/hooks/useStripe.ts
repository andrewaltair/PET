import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export interface StripeAccountStatus {
  stripeAccountId: string | null;
  onboardingComplete: boolean;
}

export interface CreateOnboardingResponse {
  onboardingUrl: string;
}

export interface CreatePaymentIntentRequest {
  bookingId: string;
}

export interface CreatePaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  platformFee: number;
  providerAmount: number;
}

// Query hook for getting Stripe account status
export function useStripeAccountStatus() {
  return useQuery({
    queryKey: ['stripe', 'account-status'],
    queryFn: async (): Promise<{ data: StripeAccountStatus }> => {
      const response = await api.get('/stripe/connect/account-status');
      return response.data;
    },
    enabled: typeof window !== 'undefined', // Only run on client side
  });
}

// Mutation hook for creating Stripe onboarding
export function useCreateStripeOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<CreateOnboardingResponse> => {
      const response = await api.post('/stripe/connect/onboard');
      return response.data.data;
    },
    onSuccess: () => {
      // Invalidate and refetch account status
      queryClient.invalidateQueries({ queryKey: ['stripe', 'account-status'] });
    },
  });
}

// Mutation hook for creating payment intent
export function useCreatePaymentIntent() {
  return useMutation({
    mutationFn: async (bookingId: string): Promise<CreatePaymentIntentResponse> => {
      const response = await api.post(`/bookings/${bookingId}/create-payment-intent`);
      return response.data.data;
    },
  });
}
