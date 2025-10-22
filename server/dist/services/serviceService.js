"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceService = void 0;
const database_1 = __importDefault(require("../config/database"));
const petservice_marketplace_shared_types_1 = require("petservice-marketplace-shared-types");
class ServiceService {
    /**
     * Get service by ID with provider information
     */
    static async getServiceById(serviceId) {
        try {
            const service = await database_1.default.service.findUnique({
                where: { id: serviceId },
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
            });
            if (!service) {
                return null;
            }
            return {
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
            };
        }
        catch (error) {
            console.error('Error fetching service:', error);
            throw new Error('Failed to fetch service');
        }
    }
    /**
     * Get all services by provider ID
     */
    static async getServicesByProviderId(providerId) {
        try {
            const services = await database_1.default.service.findMany({
                where: { providerId },
                orderBy: { createdAt: 'desc' },
            });
            return services.map(service => ({
                id: service.id,
                providerId: service.providerId,
                serviceType: service.serviceType,
                title: service.title,
                description: service.description,
                price: service.price,
                availability: service.availability,
                createdAt: service.createdAt,
                updatedAt: service.updatedAt,
            }));
        }
        catch (error) {
            console.error('Error fetching services by provider:', error);
            throw new Error('Failed to fetch services');
        }
    }
    /**
     * Get paginated public services with optional search and serviceType filters
     */
    static async getPublicServices(page = 1, limit = 10, search, serviceType) {
        try {
            const skip = (page - 1) * limit;
            // Build WHERE conditions dynamically
            const where = {};
            if (search) {
                where.OR = [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                ];
            }
            if (serviceType) {
                where.serviceType = serviceType;
            }
            // Get services with provider info and total count
            const [services, total] = await Promise.all([
                database_1.default.service.findMany({
                    where,
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
                    skip,
                    take: limit,
                }),
                database_1.default.service.count({ where }),
            ]);
            const totalPages = Math.ceil(total / limit);
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
                data: servicesWithProvider,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                },
            };
        }
        catch (error) {
            console.error('Error fetching public services:', error);
            throw new Error('Failed to fetch services');
        }
    }
    /**
     * Create a new service
     */
    static async createService(providerId, serviceData) {
        try {
            // Validate that the user is a PROVIDER
            await this.validateProviderRole(providerId);
            const service = await database_1.default.service.create({
                data: {
                    providerId,
                    serviceType: serviceData.serviceType,
                    title: serviceData.title,
                    description: serviceData.description,
                    price: serviceData.price,
                    availability: serviceData.availability,
                },
            });
            return {
                id: service.id,
                providerId: service.providerId,
                serviceType: service.serviceType,
                title: service.title,
                description: service.description,
                price: service.price,
                availability: service.availability,
                createdAt: service.createdAt,
                updatedAt: service.updatedAt,
            };
        }
        catch (error) {
            console.error('Error creating service:', error);
            throw error;
        }
    }
    /**
     * Update an existing service
     */
    static async updateService(serviceId, providerId, serviceData) {
        try {
            // First verify ownership
            await this.validateServiceOwnership(serviceId, providerId);
            // Build dynamic update data
            const updateData = {};
            if (serviceData.serviceType !== undefined) {
                updateData.serviceType = serviceData.serviceType;
            }
            if (serviceData.title !== undefined) {
                updateData.title = serviceData.title;
            }
            if (serviceData.description !== undefined) {
                updateData.description = serviceData.description;
            }
            if (serviceData.price !== undefined) {
                updateData.price = serviceData.price;
            }
            if (serviceData.availability !== undefined) {
                updateData.availability = serviceData.availability;
            }
            if (Object.keys(updateData).length === 0) {
                // Nothing to update, return current service
                const service = await this.getServiceById(serviceId);
                if (!service) {
                    throw new Error('Service not found');
                }
                return service;
            }
            const service = await database_1.default.service.update({
                where: { id: serviceId },
                data: updateData,
            });
            return {
                id: service.id,
                providerId: service.providerId,
                serviceType: service.serviceType,
                title: service.title,
                description: service.description,
                price: service.price,
                availability: service.availability,
                createdAt: service.createdAt,
                updatedAt: service.updatedAt,
            };
        }
        catch (error) {
            console.error('Error updating service:', error);
            throw error;
        }
    }
    /**
     * Delete a service
     */
    static async deleteService(serviceId, providerId) {
        try {
            // Verify ownership
            await this.validateServiceOwnership(serviceId, providerId);
            await database_1.default.service.delete({
                where: { id: serviceId },
            });
        }
        catch (error) {
            console.error('Error deleting service:', error);
            throw error;
        }
    }
    /**
     * Validate that a user is a PROVIDER
     */
    static async validateProviderRole(userId) {
        try {
            const user = await database_1.default.user.findUnique({
                where: { id: userId },
                select: { role: true },
            });
            if (!user) {
                throw new Error('User not found');
            }
            if (user.role !== petservice_marketplace_shared_types_1.UserRole.PROVIDER) {
                throw new Error('Only PROVIDER users can manage services');
            }
        }
        catch (error) {
            console.error('Error validating provider role:', error);
            throw error;
        }
    }
    /**
     * Validate that a user owns a specific service
     */
    static async validateServiceOwnership(serviceId, providerId) {
        try {
            const service = await database_1.default.service.findUnique({
                where: { id: serviceId },
                select: { providerId: true },
            });
            if (!service) {
                throw new Error('Service not found');
            }
            if (service.providerId !== providerId) {
                throw new Error('You do not own this service');
            }
        }
        catch (error) {
            console.error('Error validating service ownership:', error);
            throw error;
        }
    }
}
exports.ServiceService = ServiceService;
