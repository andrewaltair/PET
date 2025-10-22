import { Router } from 'express';
import { StripeController } from '../controllers/stripeController';
import { authenticateToken, requireProviderRole, requireOwnerRole } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /stripe/connect/onboard:
 *   post:
 *     tags:
 *       - Stripe
 *     summary: Create Stripe Connect onboarding
 *     description: Create a Stripe Connect Express account for the provider and initiate the onboarding process
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Onboarding initiated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     accountId:
 *                       type: string
 *                       description: Stripe account ID
 *                       example: "acct_1234567890"
 *                     onboardingUrl:
 *                       type: string
 *                       format: uri
 *                       description: URL for provider to complete onboarding
 *                       example: "https://connect.stripe.com/setup/..."
 *                 message:
 *                   type: string
 *                   example: "Stripe Connect onboarding initiated"
 *       400:
 *         description: Provider already has a Stripe account
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Provider already has a Stripe account"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Access token is required"
 *       403:
 *         description: Forbidden - Provider role required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Provider role required"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.post(
  '/connect/onboard',
  authenticateToken,
  requireProviderRole,
  StripeController.createOnboarding
);

/**
 * @swagger
 * /stripe/connect/account-status:
 *   get:
 *     tags:
 *       - Stripe
 *     summary: Get Stripe account status
 *     description: Retrieve the onboarding status of the provider's Stripe Connect account
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     accountId:
 *                       type: string
 *                       description: Stripe account ID
 *                       example: "acct_1234567890"
 *                     chargesEnabled:
 *                       type: boolean
 *                       description: Whether the account can accept charges
 *                       example: true
 *                     payoutsEnabled:
 *                       type: boolean
 *                       description: Whether payouts are enabled
 *                       example: true
 *                     detailsSubmitted:
 *                       type: boolean
 *                       description: Whether account details have been submitted
 *                       example: true
 *                     requirements:
 *                       type: object
 *                       description: Account requirements information
 *                       properties:
 *                         currently_due:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example: []
 *                         eventually_due:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example: []
 *                         pending_verification:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example: []
 *                 message:
 *                   type: string
 *                   example: "Stripe account status retrieved"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Access token is required"
 *       403:
 *         description: Forbidden - Provider role required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Provider role required"
 *       404:
 *         description: Stripe account not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Stripe account not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get(
  '/connect/account-status',
  authenticateToken,
  requireProviderRole,
  StripeController.getAccountStatus
);

/**
 * @swagger
 * /stripe/bookings/{bookingId}/create-payment-intent:
 *   post:
 *     tags:
 *       - Stripe
 *     summary: Create payment intent for booking
 *     description: Create a Stripe PaymentIntent for paying for a confirmed booking
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the booking to pay for
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Payment intent created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     paymentIntentId:
 *                       type: string
 *                       description: Stripe PaymentIntent ID
 *                       example: "pi_1234567890"
 *                     clientSecret:
 *                       type: string
 *                       description: Client secret for the PaymentIntent
 *                       example: "pi_1234567890_secret_..."
 *                     amount:
 *                       type: integer
 *                       description: Amount in cents
 *                       example: 2500
 *                     currency:
 *                       type: string
 *                       example: "usd"
 *                     bookingId:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                 message:
 *                   type: string
 *                   example: "Payment intent created successfully"
 *       400:
 *         description: Invalid booking status or payment already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Booking is not confirmed or payment already exists"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Access token is required"
 *       403:
 *         description: Forbidden - Not the booking owner
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "You can only pay for your own bookings"
 *       404:
 *         description: Booking not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Booking not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.post(
  '/bookings/:bookingId/create-payment-intent',
  authenticateToken,
  requireOwnerRole,
  StripeController.createPaymentIntent
);

/**
 * @swagger
 * /stripe/webhook:
 *   post:
 *     tags:
 *       - Stripe
 *     summary: Handle Stripe webhook
 *     description: Handle incoming webhook events from Stripe (public endpoint for Stripe servers)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Raw webhook payload from Stripe
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 received:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid webhook signature or payload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid webhook signature"
 *       500:
 *         description: Internal server error processing webhook
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Webhook processing failed"
 */
router.post(
  '/webhook',
  StripeController.handleWebhook
);

export { router as stripeRouter };
