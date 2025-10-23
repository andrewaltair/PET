import { Request, Response } from 'express';
import { ProfileService } from '../services/profileService';
import { UpdateProfileRequest, ApiResponse, Profile, ProviderProfileWithServices, TopRatedProvider } from 'petservice-marketplace-shared-types';
import { validateRequest } from '../middleware/validation';
import { updateProfileSchema } from 'petservice-marketplace-shared-types';

export class ProfileController {
  /**
   * GET /api/v1/profiles/me
   * Get current user's profile
   */
  static async getMyProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;

      if (!userId) {
        const response: ApiResponse = {
          success: false,
          error: 'User not authenticated',
        };
        res.status(401).json(response);
        return;
      }

      const profile = await ProfileService.getOrCreateProfileByUserId(userId);

      const response: ApiResponse<Profile> = {
        success: true,
        data: profile,
        message: 'Profile retrieved successfully',
      };

      res.json(response);
    } catch (error) {
      console.error('Get profile error:', error);

      const errorMessage = error instanceof Error ? error.message : 'Failed to get profile';

      const response: ApiResponse = {
        success: false,
        error: errorMessage,
      };

      res.status(500).json(response);
    }
  }

  /**
   * PUT /api/v1/profiles/me
   * Update current user's profile
   */
  static async updateMyProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const profileData: UpdateProfileRequest = req.body;

      // Validate provider-specific fields
      await ProfileService.validateProviderFields(userId, profileData);

      const updatedProfile = await ProfileService.updateProfile(userId, profileData);

      const response: ApiResponse<Profile> = {
        success: true,
        data: updatedProfile,
        message: 'Profile updated successfully',
      };

      res.json(response);
    } catch (error) {
      console.error('Update profile error:', error);

      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';

      // Return appropriate status code based on error type
      let statusCode = 500;
      if (errorMessage.includes('Only PROVIDER users can have bio and location')) {
        statusCode = 403;
      } else if (errorMessage.includes('Validation failed')) {
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
   * POST /api/v1/profiles/me
   * Create profile for current user (alternative to PUT for initial creation)
   */
  static async createMyProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const profileData: UpdateProfileRequest = req.body;

      // Validate provider-specific fields
      await ProfileService.validateProviderFields(userId, profileData);

      const profile = await ProfileService.createProfile({
        userId,
        ...profileData,
      });

      const response: ApiResponse<Profile> = {
        success: true,
        data: profile,
        message: 'Profile created successfully',
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Create profile error:', error);

      const errorMessage = error instanceof Error ? error.message : 'Failed to create profile';

      let statusCode = 500;
      if (errorMessage.includes('Profile already exists')) {
        statusCode = 409;
      } else if (errorMessage.includes('Only PROVIDER users can have bio and location')) {
        statusCode = 403;
      } else if (errorMessage.includes('Validation failed')) {
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
   * GET /api/v1/profiles/provider/:userId
   * Get public provider profile with all their services (Public)
   */
  static async getProviderProfile(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      if (!userId) {
        const response: ApiResponse = {
          success: false,
          error: 'User ID is required',
        };
        res.status(400).json(response);
        return;
      }

      const providerData = await ProfileService.getProviderProfile(userId);

      const response: ApiResponse<ProviderProfileWithServices> = {
        success: true,
        data: providerData,
        message: 'Provider profile retrieved successfully',
      };

      res.json(response);
    } catch (error) {
      console.error('Get provider profile error:', error);

      const errorMessage = error instanceof Error ? error.message : 'Failed to get provider profile';

      let statusCode = 500;
      if (errorMessage.includes('Profile not found')) {
        statusCode = 404;
      } else if (errorMessage.includes('User not found')) {
        statusCode = 404;
      }

      const response: ApiResponse = {
        success: false,
        error: errorMessage,
      };

      res.status(statusCode).json(response);
    }
  }

  /**
   * GET /api/v1/profiles/featured-providers
   * Get top 5 rated service providers for homepage (Public)
   */
  static async getFeaturedProviders(req: Request, res: Response): Promise<void> {
    try {
      const providers = await ProfileService.findFeatured();

      const response: ApiResponse<TopRatedProvider[]> = {
        success: true,
        data: providers,
        message: 'Featured providers retrieved successfully',
      };

      res.json(response);
    } catch (error) {
      console.error('Get featured providers error:', error);

      const errorMessage = error instanceof Error ? error.message : 'Failed to get featured providers';

      const response: ApiResponse = {
        success: false,
        error: errorMessage,
      };

      res.status(500).json(response);
    }
  }
}
