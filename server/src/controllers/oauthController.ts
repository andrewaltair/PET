import { Request, Response } from 'express';
import { OAuthService, OAuthProvider, OAuthProfile } from '../services/oauthService';

export class OAuthController {
  /**
   * Handle OAuth callback
   */
  static async handleCallback(req: Request, res: Response): Promise<void> {
    try {
      const { provider, email, id, name, picture, firstName, lastName } = req.body;

      if (!provider || !email || !id) {
        res.status(400).json({
          success: false,
          error: 'Missing required OAuth data',
        });
        return;
      }

      const oauthProfile: OAuthProfile = {
        id,
        email,
        name,
        picture,
        firstName,
        lastName,
      };

      const result = await OAuthService.handleOAuth(provider as OAuthProvider, oauthProfile);

      res.json({
        success: true,
        data: result,
        message: 'OAuth authentication successful',
      });
    } catch (error: any) {
      console.error('OAuth callback error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'OAuth authentication failed',
      });
    }
  }

  /**
   * Get OAuth URL for a provider
   */
  static async getAuthUrl(req: Request, res: Response): Promise<void> {
    try {
      const { provider } = req.params;

      // These URLs will be handled by the frontend's OAuth SDKs
      // This endpoint is just for consistency
      res.json({
        success: true,
        data: {
          provider,
          message: 'Please use the frontend OAuth buttons',
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to get OAuth URL',
      });
    }
  }
}

