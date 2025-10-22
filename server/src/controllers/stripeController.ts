import { Request, Response } from 'express';
import { StripeService } from '../services/stripeService';
import { ApiResponse } from 'petservice-marketplace-shared-types';

export class StripeController {
  /**
   * POST /api/v1/stripe/connect/onboard
   * Create Stripe Connect Express account and return onboarding URL (PROVIDER only)
   */
  static async createOnboarding(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const result = await StripeService.createExpressAccount(userId);

      const response: ApiResponse<{ onboardingUrl: string }> = {
        success: true,
        data: { onboardingUrl: result.onboardingUrl },
        message: 'Stripe onboarding initiated successfully',
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Create onboarding error:', error);

      const errorMessage = error instanceof Error ? error.message : 'Failed to create onboarding';

      let statusCode = 500;
      if (errorMessage.includes('Only PROVIDER users') || errorMessage.includes('already has')) {
        statusCode = 403;
      }

      const response: ApiResponse = {
        success: false,
        error: errorMessage,
      };

      res.status(statusCode).json(response);
    }
  }

  /**
   * GET /api/v1/stripe/connect/account-status
   * Get Stripe account onboarding status (PROVIDER only)
   */
  static async getAccountStatus(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const status = await StripeService.getAccountStatus(userId);

      const response: ApiResponse<{
        stripeAccountId: string | null;
        onboardingComplete: boolean;
      }> = {
        success: true,
        data: status,
        message: 'Account status retrieved successfully',
      };

      res.json(response);
    } catch (error) {
      console.error('Get account status error:', error);

      const errorMessage = error instanceof Error ? error.message : 'Failed to get account status';

      const response: ApiResponse = {
        success: false,
        error: errorMessage,
      };

      res.status(500).json(response);
    }
  }

  /**
   * POST /api/v1/bookings/:bookingId/create-payment-intent
   * Create PaymentIntent for booking payment (OWNER only)
   */
  static async createPaymentIntent(req: Request, res: Response): Promise<void> {
    try {
      const bookingId = req.params.bookingId;
      const ownerId = req.user!.id;

      const result = await StripeService.createPaymentIntent(bookingId, ownerId);

      const response: ApiResponse<{
        clientSecret: string;
        paymentIntentId: string;
        amount: number;
        platformFee: number;
        providerAmount: number;
      }> = {
        success: true,
        data: result,
        message: 'Payment intent created successfully',
      };

      res.json(response);
    } catch (error) {
      console.error('Create payment intent error:', error);

      const errorMessage = error instanceof Error ? error.message : 'Failed to create payment intent';

      let statusCode = 500;
      if (errorMessage.includes('Unauthorized') || errorMessage.includes('Only')) {
        statusCode = 403;
      } else if (errorMessage.includes('not found')) {
        statusCode = 404;
      } else if (errorMessage.includes('must be confirmed') || errorMessage.includes('already processed') ||
                 errorMessage.includes('not completed')) {
        statusCode = 400;
      }

      const response: ApiResponse = {
        success: false,
        error: errorMessage,
      };

      res.status(statusCode).json(response);
    }
  }

  /**
   * POST /api/v1/stripe/webhook
   * Handle Stripe webhook events (Public endpoint)
   */
  static async handleWebhook(req: Request, res: Response): Promise<void> {
    try {
      const rawBody = req.body;
      const signature = req.headers['stripe-signature'] as string;

      if (!signature) {
        res.status(400).json({ error: 'Missing Stripe signature' });
        return;
      }

      await StripeService.handleWebhook(rawBody, signature);

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook processing error:', error);

      const errorMessage = error instanceof Error ? error.message : 'Webhook processing failed';

      let statusCode = 500;
      if (errorMessage.includes('Invalid webhook signature')) {
        statusCode = 400;
      }

      res.status(statusCode).json({ error: errorMessage });
    }
  }
}
