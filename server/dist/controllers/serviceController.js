"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceController = void 0;
const serviceService_1 = require("../services/serviceService");
class ServiceController {
    /**
     * POST /api/v1/services
     * Create a new service (PROVIDER only)
     */
    static async createService(req, res) {
        try {
            const providerId = req.user.id;
            const serviceData = req.body;
            const service = await serviceService_1.ServiceService.createService(providerId, serviceData);
            const response = {
                success: true,
                data: service,
                message: 'Service created successfully',
            };
            res.status(201).json(response);
        }
        catch (error) {
            console.error('Create service error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to create service';
            let statusCode = 500;
            if (errorMessage.includes('Only PROVIDER users can manage services')) {
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
     * GET /api/v1/services/my
     * Get services created by current user (PROVIDER only)
     */
    static async getMyServices(req, res) {
        try {
            const providerId = req.user.id;
            // Validate that user is a PROVIDER (this will throw if not)
            await serviceService_1.ServiceService.validateProviderRole(providerId);
            const services = await serviceService_1.ServiceService.getServicesByProviderId(providerId);
            const response = {
                success: true,
                data: services,
                message: 'Services retrieved successfully',
            };
            res.json(response);
        }
        catch (error) {
            console.error('Get my services error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to get services';
            let statusCode = 500;
            if (errorMessage.includes('Only PROVIDER users can manage services')) {
                statusCode = 403;
            }
            const response = {
                success: false,
                error: errorMessage,
            };
            res.status(statusCode).json(response);
        }
    }
    /**
     * PUT /api/v1/services/:serviceId
     * Update a service (PROVIDER and owner only)
     */
    static async updateService(req, res) {
        try {
            const providerId = req.user.id;
            const serviceId = req.params.serviceId;
            const serviceData = req.body;
            const updatedService = await serviceService_1.ServiceService.updateService(serviceId, providerId, serviceData);
            const response = {
                success: true,
                data: updatedService,
                message: 'Service updated successfully',
            };
            res.json(response);
        }
        catch (error) {
            console.error('Update service error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to update service';
            let statusCode = 500;
            if (errorMessage.includes('You do not own this service') || errorMessage.includes('Only PROVIDER users')) {
                statusCode = 403;
            }
            else if (errorMessage.includes('Service not found')) {
                statusCode = 404;
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
     * DELETE /api/v1/services/:serviceId
     * Delete a service (PROVIDER and owner only)
     */
    static async deleteService(req, res) {
        try {
            const providerId = req.user.id;
            const serviceId = req.params.serviceId;
            await serviceService_1.ServiceService.deleteService(serviceId, providerId);
            const response = {
                success: true,
                message: 'Service deleted successfully',
            };
            res.json(response);
        }
        catch (error) {
            console.error('Delete service error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete service';
            let statusCode = 500;
            if (errorMessage.includes('You do not own this service') || errorMessage.includes('Only PROVIDER users')) {
                statusCode = 403;
            }
            else if (errorMessage.includes('Service not found')) {
                statusCode = 404;
            }
            const response = {
                success: false,
                error: errorMessage,
            };
            res.status(statusCode).json(response);
        }
    }
    /**
     * GET /api/v1/services
     * Get paginated list of all services with optional search and serviceType filters (Public)
     */
    static async getServices(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search;
            const serviceType = req.query.serviceType;
            // Validate pagination parameters
            if (page < 1 || limit < 1 || limit > 100) {
                const response = {
                    success: false,
                    error: 'Invalid pagination parameters. Page must be >= 1, limit must be 1-100.',
                };
                res.status(400).json(response);
                return;
            }
            const result = await serviceService_1.ServiceService.getPublicServices(page, limit, search, serviceType);
            const response = {
                success: true,
                data: result,
                message: 'Services retrieved successfully',
            };
            res.json(response);
        }
        catch (error) {
            console.error('Get services error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to get services';
            const response = {
                success: false,
                error: errorMessage,
            };
            res.status(500).json(response);
        }
    }
    /**
     * GET /api/v1/services/:serviceId
     * Get detailed information about a specific service (Public)
     */
    static async getService(req, res) {
        try {
            const serviceId = req.params.serviceId;
            const service = await serviceService_1.ServiceService.getServiceById(serviceId);
            if (!service) {
                const response = {
                    success: false,
                    error: 'Service not found',
                };
                res.status(404).json(response);
                return;
            }
            const response = {
                success: true,
                data: service,
                message: 'Service retrieved successfully',
            };
            res.json(response);
        }
        catch (error) {
            console.error('Get service error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to get service';
            const response = {
                success: false,
                error: errorMessage,
            };
            res.status(500).json(response);
        }
    }
}
exports.ServiceController = ServiceController;
