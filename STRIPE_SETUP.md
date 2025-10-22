# Stripe Payment Integration Setup Guide

This guide explains how to configure Stripe payment integration for the PetService Marketplace.

## Environment Variables

### Server Configuration (server/.env)

Add the following environment variables to your server `.env` file:

```bash
# Stripe API Keys (get these from your Stripe Dashboard -> Developers -> API Keys)
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."

# Stripe Webhook Secret (create webhook endpoint in Stripe Dashboard)
# Webhook URL: https://yourdomain.com/api/v1/stripe/webhook
# Events to listen for: payment_intent.succeeded, account.updated
STRIPE_WEBHOOK_SECRET="whsec_..."

# Platform Commission Rate (10% = 0.10)
PLATFORM_COMMISSION_RATE=0.10
```

### Client Configuration (client/.env.local)

Add the following environment variable to your client `.env.local` file:

```bash
# Stripe Publishable Key for frontend (same as server STRIPE_PUBLISHABLE_KEY)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

## Stripe Dashboard Setup

### 1. Create Stripe Account
- Go to [Stripe Dashboard](https://dashboard.stripe.com/)
- Create a new account or use existing one

### 2. Get API Keys
- Navigate to Developers -> API Keys
- Copy the **Publishable key** and **Secret key**
- Add them to your environment variables

### 3. Enable Connect
- Go to Settings -> Connect settings
- Enable "Express accounts" for providers

### 4. Create Webhook Endpoint
- Go to Developers -> Webhooks
- Click "Add endpoint"
- URL: `https://yourdomain.com/api/v1/stripe/webhook`
- Events to select:
  - `payment_intent.succeeded`
  - `account.updated`
- Copy the webhook secret to `STRIPE_WEBHOOK_SECRET`

## Testing

### Test Cards
Use these test card numbers in Stripe test mode:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Insufficient funds**: `4000 0000 0000 9995`

### Test Flow
1. Provider creates account and completes onboarding
2. Owner books a service
3. Provider confirms the booking
4. Owner clicks "Pay Now" button
5. Payment is processed through Stripe

## Security Notes

- Never commit API keys to version control
- Use test keys for development
- Rotate keys regularly in production
- Enable 2FA on your Stripe account
- Monitor webhook events for suspicious activity

## Platform Commission

The platform takes a 10% commission on all transactions:
- Service price: $100
- Platform fee: $10 (10%)
- Provider receives: $90 (90%)

This rate can be adjusted by changing `PLATFORM_COMMISSION_RATE` in your environment variables.
