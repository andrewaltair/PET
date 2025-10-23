'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCreatePaymentIntent } from '@/hooks/useStripe';
import { UserRole } from 'petservice-marketplace-shared-types';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { PaymentForm } from '@/components/PaymentForm';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function PaymentPageContent() {
  const { bookingId } = useParams();
  const { user } = useAuth();
  const router = useRouter();

  const [clientSecret, setClientSecret] = useState<string>('');
  const [paymentIntentData, setPaymentIntentData] = useState<any>(null);

  const createPaymentIntentMutation = useCreatePaymentIntent();

  useEffect(() => {
    const createPaymentIntent = async () => {
      if (!bookingId || typeof bookingId !== 'string') return;

      try {
        const result = await createPaymentIntentMutation.mutateAsync(bookingId);
        setClientSecret(result.clientSecret);
        setPaymentIntentData(result);
      } catch (error) {
        console.error('Failed to create payment intent:', error);
      }
    };

    createPaymentIntent();
  }, [bookingId]);

  if (user?.role !== UserRole.OWNER) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            Only pet owners can make payments for bookings.
          </p>
          <Button onClick={() => router.push('/dashboard/my-bookings')}>
            Back to My Bookings
          </Button>
        </div>
      </div>
    );
  }

  if (createPaymentIntentMutation.isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-gray-600">Preparing payment...</p>
        </div>
      </div>
    );
  }

  if (createPaymentIntentMutation.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Setup Failed</h1>
          <p className="text-gray-600 mb-6">
            {createPaymentIntentMutation.error instanceof Error
              ? createPaymentIntentMutation.error.message
              : 'Failed to setup payment. Please try again.'}
          </p>
          <Button onClick={() => router.push('/dashboard/my-bookings')}>
            Back to My Bookings
          </Button>
        </div>
      </div>
    );
  }

  if (!clientSecret || !paymentIntentData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
    },
  };

  const handlePaymentSuccess = () => {
    router.push('/dashboard/my-bookings');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard/my-bookings')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Bookings
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Complete Payment</h1>
          <p className="text-gray-600 mt-2">
            Secure payment processing powered by Stripe
          </p>
        </div>

        <div className="space-y-6">
          {/* Payment Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Summary
              </CardTitle>
              <CardDescription>
                Review your booking details before completing payment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium">Service Amount</span>
                  <span className="text-sm">${paymentIntentData.amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm font-medium">Platform Fee (10%)</span>
                  <span className="text-sm text-gray-600">${paymentIntentData.platformFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-2 text-lg font-semibold">
                  <span>Total Amount</span>
                  <span>${paymentIntentData.amount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form Card */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>
                Your payment information is secure and encrypted
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Elements options={options} stripe={stripePromise}>
                <PaymentForm
                  onSuccess={handlePaymentSuccess}
                  amount={paymentIntentData.amount}
                />
              </Elements>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Your payment is secured by Stripe's industry-leading security measures.
              We do not store your payment information on our servers.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <ProtectedRoute>
      <PaymentPageContent />
    </ProtectedRoute>
  );
}
