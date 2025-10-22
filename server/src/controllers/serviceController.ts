import { Request, Response } from 'express';
import { ServiceService } from '../services/serviceService';
import { CreateServiceRequest, UpdateServiceRequest, ApiResponse, Service, ServiceWithProvider, PaginatedServicesResponse, TopRatedProvider } from 'petservice-marketplace-shared-types';

export class ServiceController {
  /**
   * POST /api/v1/services
   * Create a new service (PROVIDER only)
   */
  static async createService(req: Request, res: Response): Promise<void> {
    try {
      const providerId = req.user!.id;
      const serviceData: CreateServiceRequest = req.body;

      const service = await ServiceService.createService(providerId, serviceData);

      const response: ApiResponse<Service> = {
        success: true,
        data: service,
        message: 'Service created successfully',
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Create service error:', error);

      const errorMessage = error instanceof Error ? error.message : 'Failed to create service';

      let statusCode = 500;
      if (errorMessage.includes('Only PROVIDER users can manage services')) {
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
   * GET /api/v1/services/my
   * Get services created by current user (PROVIDER only)
   */
  static async getMyServices(req: Request, res: Response): Promise<void> {
    try {
      const providerId = req.user!.id;

      // Validate that user is a PROVIDER (this will throw if not)
      await ServiceService.validateProviderRole(providerId);

      const services = await ServiceService.getServicesByProviderId(providerId);

      const response: ApiResponse<Service[]> = {
        success: true,
        data: services,
        message: 'Services retrieved successfully',
      };

      res.json(response);
    } catch (error) {
      console.error('Get my services error:', error);

      const errorMessage = error instanceof Error ? error.message : 'Failed to get services';

      let statusCode = 500;
      if (errorMessage.includes('Only PROVIDER users can manage services')) {
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
   * PUT /api/v1/services/:serviceId
   * Update a service (PROVIDER and owner only)
   */
  static async updateService(req: Request, res: Response): Promise<void> {
    try {
      const providerId = req.user!.id;
      const serviceId = req.params.serviceId;
      const serviceData: UpdateServiceRequest = req.body;

      const updatedService = await ServiceService.updateService(serviceId, providerId, serviceData);

      const response: ApiResponse<Service> = {
        success: true,
        data: updatedService,
        message: 'Service updated successfully',
      };

      res.json(response);
    } catch (error) {
      console.error('Update service error:', error);

      const errorMessage = error instanceof Error ? error.message : 'Failed to update service';

      let statusCode = 500;
      if (errorMessage.includes('You do not own this service') || errorMessage.includes('Only PROVIDER users')) {
        statusCode = 403;
      } else if (errorMessage.includes('Service not found')) {
        statusCode = 404;
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
   * DELETE /api/v1/services/:serviceId
   * Delete a service (PROVIDER and owner only)
   */
  static async deleteService(req: Request, res: Response): Promise<void> {
    try {
      const providerId = req.user!.id;
      const serviceId = req.params.serviceId;

      await ServiceService.deleteService(serviceId, providerId);

      const response: ApiResponse = {
        success: true,
        message: 'Service deleted successfully',
      };

      res.json(response);
    } catch (error) {
      console.error('Delete service error:', error);

      const errorMessage = error instanceof Error ? error.message : 'Failed to delete service';

      let statusCode = 500;
      if (errorMessage.includes('You do not own this service') || errorMessage.includes('Only PROVIDER users')) {
        statusCode = 403;
      } else if (errorMessage.includes('Service not found')) {
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
   * GET /api/v1/services
   * Get paginated list of all services with optional search, serviceType, location, and date filters (Public)
   */
  static async getServices(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string | undefined;
      const serviceType = req.query.serviceType as string | undefined;
      const location = req.query.location as string | undefined;
      const date = req.query.date as string | undefined;

      // Validate pagination parameters
      if (page < 1 || limit < 1 || limit > 100) {
        const response: ApiResponse = {
          success: false,
          error: 'Invalid pagination parameters. Page must be >= 1, limit must be 1-100.',
        };
        res.status(400).json(response);
        return;
      }

      const result = await ServiceService.getPublicServices(page, limit, search, serviceType, location, date);

      const response: ApiResponse<PaginatedServicesResponse> = {
        success: true,
        data: result,
        message: 'Services retrieved successfully',
      };

      res.json(response);
    } catch (error) {
      console.error('Get services error:', error);

      const errorMessage = error instanceof Error ? error.message : 'Failed to get services';

      const response: ApiResponse = {
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
  static async getService(req: Request, res: Response): Promise<void> {
    try {
      const serviceId = req.params.serviceId;

      const service = await ServiceService.getServiceById(serviceId);

      if (!service) {
        const response: ApiResponse = {
          success: false,
          error: 'Service not found',
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<ServiceWithProvider> = {
        success: true,
        data: service,
        message: 'Service retrieved successfully',
      };

      res.json(response);
    } catch (error) {
      console.error('Get service error:', error);

      const errorMessage = error instanceof Error ? error.message : 'Failed to get service';

      const response: ApiResponse = {
        success: false,
        error: errorMessage,
      };

      res.status(500).json(response);
    }
  }

  /**
   * GET /api/v1/services/top-rated-providers
   * Get top-rated providers for homepage carousel (Public)
   */
  static async getTopRatedProviders(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;

      // Validate limit parameter
      if (limit < 1 || limit > 50) {
        const response: ApiResponse = {
          success: false,
          error: 'Invalid limit parameter. Must be between 1 and 50.',
        };
        res.status(400).json(response);
        return;
      }

      const providers = await ServiceService.getTopRatedProviders(limit);

      const response: ApiResponse<TopRatedProvider[]> = {
        success: true,
        data: providers,
        message: 'Top-rated providers retrieved successfully',
      };

      res.json(response);
    } catch (error) {
      console.error('Get top-rated providers error:', error);

      const errorMessage = error instanceof Error ? error.message : 'Failed to get top-rated providers';

      const response: ApiResponse = {
        success: false,
        error: errorMessage,
      };

      res.status(500).json(response);
    }
  }
}
