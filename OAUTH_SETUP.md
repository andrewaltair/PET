# OAuth Authentication Setup Guide

This guide will help you set up OAuth authentication (Google, Facebook, Instagram) for the Pet Service Marketplace application.

## Overview

The application now supports social media login/registration through:
- **Google** - Uses Google OAuth 2.0
- **Facebook** - Uses Facebook OAuth
- **Instagram** - Uses Facebook OAuth (Meta owns Instagram)

## Prerequisites

1. Google Account (for Google OAuth)
2. Facebook Developer Account (for Facebook & Instagram OAuth)
3. Access to environment variable configuration

## Setup Instructions

### 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Configure the OAuth consent screen:
   - User Type: External
   - Fill in required information (App name, User support email, Developer contact)
   - Add scopes: `email`, `profile`
   - Add test users if needed
6. Create OAuth client ID:
   - Application type: **Web application**
   - Name: Pet Service Marketplace
   - Authorized JavaScript origins:
     - `http://localhost:3000` (development)
     - `https://yourdomain.com` (production)
   - Authorized redirect URIs:
     - Not needed for popup-based OAuth
7. Copy the **Client ID**
8. Add to `client/.env.local`:
   ```env
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
   ```

### 2. Facebook OAuth Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **My Apps** > **Create App**
3. Choose app type: **Consumer** or **Business**
4. Fill in app details:
   - App Name: Pet Service Marketplace
   - App Contact Email: your@email.com
5. Navigate to **Settings** > **Basic**
6. Add **Valid OAuth Redirect URIs**:
   - `http://localhost:3000`
   - `https://yourdomain.com`
7. Copy the **App ID**
8. Add to `client/.env.local`:
   ```env
   NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id_here
   ```

### 3. Instagram OAuth Setup

Instagram uses Facebook's OAuth system since Meta owns Instagram.

1. In your Facebook App, go to **Settings** > **Basic**
2. Scroll down to **Add Platform** > Select **Instagram Basic Display**
3. Follow the setup wizard
4. Same App ID from Facebook works for Instagram

## Database Migration

Run the following command to update your database schema:

```bash
cd server
npx prisma migrate dev --name add_oauth_fields
```

This will:
- Make the password field optional
- Add `oauth_provider` column
- Add `oauth_id` column
- Add unique constraint on OAuth provider + ID combination

## Environment Variables

### Client (`client/.env.local`)

```env
# OAuth Providers
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id

# API URL
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

### Server (`server/.env`)

No additional OAuth environment variables needed on the server side. The OAuth flow is handled client-side, and the backend only receives the OAuth profile data.

## Testing OAuth Flow

### 1. Start the Development Servers

```bash
# Terminal 1 - Start backend
cd server
npm run dev

# Terminal 2 - Start frontend
cd client
npm run dev
```

### 2. Test Google Login

1. Navigate to `http://localhost:3000/[locale]/login`
2. Click "Continue with Google"
3. Select your Google account
4. Grant permissions
5. You should be redirected to the dashboard

### 3. Test Facebook Login

1. Navigate to `http://localhost:3000/[locale]/login`
2. Click "Continue with Facebook"
3. Enter Facebook credentials (or select account)
4. Grant permissions
5. You should be redirected to the dashboard

### 4. Test Instagram Login

1. Navigate to `http://localhost:3000/[locale]/login`
2. Click "Continue with Instagram"
3. Enter Instagram credentials
4. Grant permissions
5. You should be redirected to the dashboard

## How It Works

### Flow Diagram

```
User clicks social login button
    ↓
OAuth SDK initiates authentication
    ↓
User grants permissions
    ↓
OAuth SDK returns user profile
    ↓
Frontend sends profile to backend /auth/oauth/callback
    ↓
Backend checks if user exists:
    - By OAuth provider + ID
    - By email
    ↓
If exists: Link OAuth to account or return tokens
If new: Create user + profile + return tokens
    ↓
Frontend stores tokens
    ↓
User redirected to dashboard
```

### Backend OAuth Handler

The OAuth callback endpoint (`POST /auth/oauth/callback`) expects:

```json
{
  "provider": "google|facebook|instagram",
  "email": "user@example.com",
  "id": "oauth_user_id",
  "name": "John Doe",
  "picture": "https://...",
  "firstName": "John",
  "lastName": "Doe"
}
```

### User Account Linking

If a user signs up with OAuth but already has an account with the same email:
- The OAuth credentials are linked to the existing account
- No duplicate accounts are created
- The user can login with either method

## Security Considerations

1. **OAuth tokens**: Never expose OAuth access tokens in the frontend
2. **JWT tokens**: Our backend generates secure JWT tokens
3. **HTTPS**: Always use HTTPS in production
4. **Redirect URIs**: Configure authorized redirect URIs properly
5. **Email verification**: Consider adding email verification for OAuth users

## Troubleshooting

### Google OAuth Not Working

- Check if `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set correctly
- Verify authorized JavaScript origins in Google Console
- Check browser console for errors

### Facebook OAuth Not Working

- Check if `NEXT_PUBLIC_FACEBOOK_APP_ID` is set correctly
- Verify Facebook SDK is loaded (check browser console)
- Ensure app is not in Development mode restrictions

### "Invalid OAuth Data" Error

- Check that all required fields are being sent: `provider`, `email`, `id`
- Verify the backend endpoint is accessible
- Check backend logs for detailed error messages

### Database Migration Fails

- Ensure database connection is working
- Check if Prisma client is generated: `npx prisma generate`
- Verify database credentials in `.env`

## Production Deployment

### Google Cloud Console

1. Add production domain to authorized JavaScript origins
2. Update OAuth consent screen for production
3. Submit for verification if handling sensitive scopes

### Facebook Developers

1. Add production domain to app settings
2. Switch app to Live mode
3. Add privacy policy URL and terms of service

### Environment Variables

Set production environment variables on your hosting platform:
- Vercel: Project Settings > Environment Variables
- Heroku: Config Vars
- AWS: Parameter Store or Secrets Manager

## Support

For issues or questions:
1. Check the `changes.md` file for implementation details
2. Review backend logs: `server/src/services/oauthService.ts`
3. Review frontend logs: `client/src/components/auth/SocialAuthButton.tsx`

## Additional Resources

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login/)
- [React OAuth Google](https://www.npmjs.com/package/@react-oauth/google)
- [Facebook Login React](https://www.npmjs.com/package/react-facebook-login)

