import Stripe from 'stripe';

// Initialize Stripe with secret key (only if available)
let stripe: Stripe | null = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-09-30.clover',
  });
}

export class StripeService {
  /**
   * Create a Stripe Connect Express account for a provider
   */
  static async createExpressAccount(userId: string): Promise<{ accountId: string; onboardingUrl: string }> {
    if (!stripe) {
      // Mock implementation for testing when Stripe is not configured
      return {
        accountId: `acct_mock_${userId}`,
        onboardingUrl: `https://mock-stripe.com/onboarding/${userId}`,
      };
    }

    // Real Stripe implementation would go here
    return {
      accountId: `acct_mock_${userId}`,
      onboardingUrl: `https://mock-stripe.com/onboarding/${userId}`,
    };
  }

  /**
   * Get account onboarding status
   */
  static async getAccountStatus(accountId: string): Promise<{ chargesEnabled: boolean; detailsSubmitted: boolean }> {
    if (!stripe) {
      return { chargesEnabled: false, detailsSubmitted: false };
    }

    // Mock implementation
    return { chargesEnabled: true, detailsSubmitted: true };
  }

  /**
   * Create a payment intent for a booking
   */
  static async createPaymentIntent(amount: number, currency: string = 'usd'): Promise<{ clientSecret: string }> {
    if (!stripe) {
      return { clientSecret: 'pi_mock_client_secret' };
    }

    // Mock implementation
    return { clientSecret: 'pi_mock_client_secret' };
  }

  /**
   * Process a payment (confirm payment intent)
   */
  static async confirmPayment(paymentIntentId: string): Promise<{ status: string }> {
    if (!stripe) {
      return { status: 'succeeded' };
    }

    // Mock implementation
    return { status: 'succeeded' };
  }

  /**
   * Create a payout to a connected account
   */
  static async createPayout(accountId: string, amount: number): Promise<{ payoutId: string }> {
    if (!stripe) {
      return { payoutId: `po_mock_${Date.now()}` };
    }

    // Mock implementation
    return { payoutId: `po_mock_${Date.now()}` };
  }
}
