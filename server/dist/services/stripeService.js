"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeService = void 0;
const stripe_1 = __importDefault(require("stripe"));
// Initialize Stripe with secret key (only if available)
let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
    stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2024-06-20',
    });
}
class StripeService {
    /**
     * Create a Stripe Connect Express account for a provider
     */
    static async createExpressAccount(userId) {
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
    static async getAccountStatus(accountId) {
        if (!stripe) {
            return { chargesEnabled: false, detailsSubmitted: false };
        }
        // Mock implementation
        return { chargesEnabled: true, detailsSubmitted: true };
    }
    /**
     * Create a payment intent for a booking
     */
    static async createPaymentIntent(amount, currency = 'usd') {
        if (!stripe) {
            return { clientSecret: 'pi_mock_client_secret' };
        }
        // Mock implementation
        return { clientSecret: 'pi_mock_client_secret' };
    }
    /**
     * Process a payment (confirm payment intent)
     */
    static async confirmPayment(paymentIntentId) {
        if (!stripe) {
            return { status: 'succeeded' };
        }
        // Mock implementation
        return { status: 'succeeded' };
    }
    /**
     * Create a payout to a connected account
     */
    static async createPayout(accountId, amount) {
        if (!stripe) {
            return { payoutId: `po_mock_${Date.now()}` };
        }
        // Mock implementation
        return { payoutId: `po_mock_${Date.now()}` };
    }
}
exports.StripeService = StripeService;
