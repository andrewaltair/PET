"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileService = void 0;
const database_1 = __importDefault(require("../config/database"));
const petservice_marketplace_shared_types_1 = require("petservice-marketplace-shared-types");
class ProfileService {
    /**
     * Get profile by user ID
     */
    static async getProfileByUserId(userId) {
        try {
            const profile = await database_1.default.profile.findUnique({
                where: { userId },
            });
            if (!profile) {
                return null;
            }
            return {
                id: profile.id,
                userId: profile.userId,
                firstName: profile.firstName || undefined,
                lastName: profile.lastName || undefined,
                avatarUrl: profile.avatarUrl || undefined,
                bio: profile.bio || undefined,
                location: profile.location || undefined,
                overallAverageRating: profile.overallAverageRating,
                createdAt: profile.createdAt,
                updatedAt: profile.updatedAt,
            };
        }
        catch (error) {
            console.error('Error fetching profile:', error);
            throw new Error('Failed to fetch profile');
        }
    }
    /**
     * Create a new profile for a user
     */
    static async createProfile(profileData) {
        try {
            const profile = await database_1.default.profile.create({
                data: {
                    userId: profileData.userId,
                    firstName: profileData.firstName,
                    lastName: profileData.lastName,
                    avatarUrl: profileData.avatarUrl,
                    bio: profileData.bio,
                    location: profileData.location,
                },
            });
            return {
                id: profile.id,
                userId: profile.userId,
                firstName: profile.firstName || undefined,
                lastName: profile.lastName || undefined,
                avatarUrl: profile.avatarUrl || undefined,
                bio: profile.bio || undefined,
                location: profile.location || undefined,
                overallAverageRating: profile.overallAverageRating,
                createdAt: profile.createdAt,
                updatedAt: profile.updatedAt,
            };
        }
        catch (error) {
            console.error('Error creating profile:', error);
            if (error.code === 'P2002') {
                throw new Error('Profile already exists for this user');
            }
            throw new Error('Failed to create profile');
        }
    }
    /**
     * Update profile for a user
     */
    static async updateProfile(userId, profileData) {
        try {
            // First check if profile exists, if not create it
            let existingProfile = await this.getProfileByUserId(userId);
            if (!existingProfile) {
                return await this.createProfile({ userId, ...profileData });
            }
            // Build dynamic update data
            const updateData = {};
            if (profileData.firstName !== undefined) {
                updateData.firstName = profileData.firstName;
            }
            if (profileData.lastName !== undefined) {
                updateData.lastName = profileData.lastName;
            }
            if (profileData.avatarUrl !== undefined) {
                updateData.avatarUrl = profileData.avatarUrl;
            }
            if (profileData.bio !== undefined) {
                updateData.bio = profileData.bio;
            }
            if (profileData.location !== undefined) {
                updateData.location = profileData.location;
            }
            if (Object.keys(updateData).length === 0) {
                return existingProfile; // Nothing to update
            }
            const profile = await database_1.default.profile.update({
                where: { userId },
                data: updateData,
            });
            return {
                id: profile.id,
                userId: profile.userId,
                firstName: profile.firstName || undefined,
                lastName: profile.lastName || undefined,
                avatarUrl: profile.avatarUrl || undefined,
                bio: profile.bio || undefined,
                location: profile.location || undefined,
                overallAverageRating: profile.overallAverageRating,
                createdAt: profile.createdAt,
                updatedAt: profile.updatedAt,
            };
        }
        catch (error) {
            console.error('Error updating profile:', error);
            throw new Error('Failed to update profile');
        }
    }
    /**
     * Get or create profile for a user (simplified for GET /me only)
     */
    static async getOrCreateProfileByUserId(userId) {
        try {
            const profile = await database_1.default.profile.upsert({
                where: { userId },
                update: {},
                create: {
                    userId,
                },
            });
            return {
                id: profile.id,
                userId: profile.userId,
                firstName: profile.firstName || undefined,
                lastName: profile.lastName || undefined,
                avatarUrl: profile.avatarUrl || undefined,
                bio: profile.bio || undefined,
                location: profile.location || undefined,
                overallAverageRating: profile.overallAverageRating,
                createdAt: profile.createdAt,
                updatedAt: profile.updatedAt,
            };
        }
        catch (error) {
            console.error('Error getting or creating profile:', error);
            throw new Error('Failed to get or create profile');
        }
    }
    /**
     * Get provider profile with all their services (public endpoint)
     */
    static async getProviderProfile(userId) {
        try {
            // First get the profile
            const profile = await this.getProfileByUserId(userId);
            if (!profile) {
                throw new Error('Profile not found');
            }
            // Get all services for this provider
            const services = await database_1.default.service.findMany({
                where: { providerId: userId },
                include: {
                    provider: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });
            const servicesWithProvider = services.map(service => ({
                id: service.id,
                providerId: service.providerId,
                serviceType: service.serviceType,
                title: service.title,
                description: service.description,
                price: service.price,
                availability: service.availability,
                createdAt: service.createdAt,
                updatedAt: service.updatedAt,
                provider: {
                    id: service.provider.id,
                    email: service.provider.email,
                    role: service.provider.role,
                    createdAt: service.provider.createdAt,
                    updatedAt: service.provider.updatedAt,
                },
            }));
            return {
                profile,
                services,
            };
        }
        catch (error) {
            console.error('Error fetching provider profile:', error);
            throw error;
        }
    }
    /**
     * Validate provider-specific fields
     */
    static async validateProviderFields(userId, profileData) {
        try {
            // Check if user is a PROVIDER
            const user = await database_1.default.user.findUnique({
                where: { id: userId },
                select: { role: true },
            });
            if (!user) {
                throw new Error('User not found');
            }
            // If user is not a PROVIDER, they shouldn't have bio or location
            if (user.role !== petservice_marketplace_shared_types_1.UserRole.PROVIDER) {
                if (profileData.bio !== undefined || profileData.location !== undefined) {
                    throw new Error('Only PROVIDER users can have bio and location fields');
                }
            }
        }
        catch (error) {
            console.error('Error validating provider fields:', error);
            throw error;
        }
    }
}
exports.ProfileService = ProfileService;
