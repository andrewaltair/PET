'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useStripeAccountStatus, useCreateStripeOnboarding } from '@/hooks/useStripe';
import { UserRole } from 'petservice-marketplace-shared-types';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, CreditCard, AlertTriangle, ExternalLink } from 'lucide-react';

function ProviderPaymentsContent() {
  const { user } = useAuth();
  const router = useRouter();

  const { data: accountStatus, isPending: statusLoading, error: statusError } = useStripeAccountStatus();
  const createOnboardingMutation = useCreateStripeOnboarding();

  const handleConnectStripe = async () => {
    try {
      const result = await createOnboardingMutation.mutateAsync();
      // Redirect to Stripe onboarding URL
      window.location.href = result.onboardingUrl;
    } catch (error) {
      console.error('Failed to create Stripe onboarding:', error);
    }
  };

  if (user?.role !== UserRole.PROVIDER) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            Only service providers can manage payment settings.
          </p>
          <Button onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (statusLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (statusError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Payment Settings</h1>
          <p className="text-gray-600 mb-6">
            {statusError instanceof Error ? statusError.message : 'Failed to load payment settings'}
          </p>
          <Button onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const isOnboarded = accountStatus?.data?.onboardingComplete ?? false;
  const hasStripeAccount = !!accountStatus?.data?.stripeAccountId;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Payment Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your Stripe account and payment preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Stripe Account Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Stripe Account Status
              </CardTitle>
              <CardDescription>
                Connect your Stripe account to receive payments from customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isOnboarded ? (
                <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">Stripe Account Connected</p>
                    <p className="text-sm text-blue-700">
                      Your account is fully set up and ready to receive payments.
                    </p>
                  </div>
                </div>
              ) : hasStripeAccount ? (
                <div className="space-y-4">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Your Stripe account is created but onboarding is not complete.
                      Please complete the onboarding process to start receiving payments.
                    </AlertDescription>
                  </Alert>
                  <Button
                    onClick={handleConnectStripe}
                    disabled={createOnboardingMutation.isPending}
                    className="w-full"
                  >
                    {createOnboardingMutation.isPending ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Setting up...
                      </>
                    ) : (
                      <>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Complete Stripe Onboarding
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      You need to connect your Stripe account to receive payments from customers.
                      This is required to accept bookings and get paid.
                    </AlertDescription>
                  </Alert>
                  <Button
                    onClick={handleConnectStripe}
                    disabled={createOnboardingMutation.isPending}
                    className="w-full"
                  >
                    {createOnboardingMutation.isPending ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Connect Stripe Account
                      </>
                    )}
                  </Button>
                </div>
              )}

              {createOnboardingMutation.error && (
                <Alert className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-red-600">
                    Failed to connect Stripe account: {createOnboardingMutation.error.message}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Payment Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>
                How payments work on our platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm font-medium">Platform Commission</span>
                  <span className="text-sm text-gray-600">10%</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm font-medium">Provider Receives</span>
                  <span className="text-sm text-gray-600">90%</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-medium">Payout Schedule</span>
                  <span className="text-sm text-gray-600">Daily</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Payments are processed securely through Stripe. Funds are transferred to your connected bank account
                according to your payout schedule.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function ProviderPaymentsPage() {
  return (
    <ProtectedRoute>
      <ProviderPaymentsContent />
    </ProtectedRoute>
  );
}
