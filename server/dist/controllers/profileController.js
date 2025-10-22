"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
const profileService_1 = require("../services/profileService");
class ProfileController {
    /**
     * GET /api/v1/profiles/me
     * Get current user's profile
     */
    static async getMyProfile(req, res) {
        try {
            const userId = req.user.id;
            if (!userId) {
                const response = {
                    success: false,
                    error: 'User not authenticated',
                };
                res.status(401).json(response);
                return;
            }
            const profile = await profileService_1.ProfileService.getOrCreateProfileByUserId(userId);
            const response = {
                success: true,
                data: profile,
                message: 'Profile retrieved successfully',
            };
            res.json(response);
        }
        catch (error) {
            console.error('Get profile error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to get profile';
            const response = {
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
    static async updateMyProfile(req, res) {
        try {
            const userId = req.user.id;
            const profileData = req.body;
            // Validate provider-specific fields
            await profileService_1.ProfileService.validateProviderFields(userId, profileData);
            const updatedProfile = await profileService_1.ProfileService.updateProfile(userId, profileData);
            const response = {
                success: true,
                data: updatedProfile,
                message: 'Profile updated successfully',
            };
            res.json(response);
        }
        catch (error) {
            console.error('Update profile error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
            // Return appropriate status code based on error type
            let statusCode = 500;
            if (errorMessage.includes('Only PROVIDER users can have bio and location')) {
                statusCode = 403;
            }
            else if (errorMessage.includes('Validation failed')) {
                statusCode = 400;
            }
            const response = {
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
    static async createMyProfile(req, res) {
        try {
            const userId = req.user.id;
            const profileData = req.body;
            // Validate provider-specific fields
            await profileService_1.ProfileService.validateProviderFields(userId, profileData);
            const profile = await profileService_1.ProfileService.createProfile({
                userId,
                ...profileData,
            });
            const response = {
                success: true,
                data: profile,
                message: 'Profile created successfully',
            };
            res.status(201).json(response);
        }
        catch (error) {
            console.error('Create profile error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to create profile';
            let statusCode = 500;
            if (errorMessage.includes('Profile already exists')) {
                statusCode = 409;
            }
            else if (errorMessage.includes('Only PROVIDER users can have bio and location')) {
                statusCode = 403;
            }
            else if (errorMessage.includes('Validation failed')) {
                statusCode = 400;
            }
            const response = {
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
    static async getProviderProfile(req, res) {
        try {
            const { userId } = req.params;
            if (!userId) {
                const response = {
                    success: false,
                    error: 'User ID is required',
                };
                res.status(400).json(response);
                return;
            }
            const providerData = await profileService_1.ProfileService.getProviderProfile(userId);
            const response = {
                success: true,
                data: providerData,
                message: 'Provider profile retrieved successfully',
            };
            res.json(response);
        }
        catch (error) {
            console.error('Get provider profile error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to get provider profile';
            let statusCode = 500;
            if (errorMessage.includes('Profile not found')) {
                statusCode = 404;
            }
            else if (errorMessage.includes('User not found')) {
                statusCode = 404;
            }
            const response = {
                success: false,
                error: errorMessage,
            };
            res.status(statusCode).json(response);
        }
    }
}
exports.ProfileController = ProfileController;
