import prisma from '../config/database';
import { Service, ServiceWithProvider, CreateServiceRequest, UpdateServiceRequest, PaginatedServicesResponse, User, UserRole } from 'petservice-marketplace-shared-types';

export class ServiceService {
  /**
   * Get service by ID with provider information
   */
  static async getServiceById(serviceId: string): Promise<ServiceWithProvider | null> {
    try {
      const service = await prisma.service.findUnique({
        where: { id: serviceId },
        include: {
          provider: true,
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
        availability: service.availability as Record<string, string[]>,
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
    } catch (error) {
      console.error('Error fetching service:', error);
      throw new Error('Failed to fetch service');
    }
  }

  /**
   * Get all services by provider ID
   */
  static async getServicesByProviderId(providerId: string): Promise<Service[]> {
    try {
      const services = await prisma.service.findMany({
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
        availability: service.availability as Record<string, string[]>,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt,
      }));
    } catch (error) {
      console.error('Error fetching services by provider:', error);
      throw new Error('Failed to fetch services');
    }
  }

  /**
   * Get paginated public services with optional search and serviceType filters
   */
  static async getPublicServices(
    page: number = 1,
    limit: number = 10,
    search?: string,
    serviceType?: string
  ): Promise<PaginatedServicesResponse> {
    try {
      const skip = (page - 1) * limit;

      // Build WHERE conditions dynamically
      const where: any = {};

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
        prisma.service.findMany({
          where,
          include: {
            provider: true,
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.service.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limit);

      const servicesWithProvider: ServiceWithProvider[] = services.map(service => ({
        id: service.id,
        providerId: service.providerId,
        serviceType: service.serviceType,
        title: service.title,
        description: service.description,
        price: service.price,
        availability: service.availability as Record<string, string[]>,
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
    } catch (error) {
      console.error('Error fetching public services:', error);
      throw new Error('Failed to fetch services');
    }
  }

  /**
   * Create a new service
   */
  static async createService(providerId: string, serviceData: CreateServiceRequest): Promise<Service> {
    try {
      // Validate that the user is a PROVIDER
      await this.validateProviderRole(providerId);

      const service = await prisma.service.create({
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
        availability: service.availability as Record<string, string[]>,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt,
      };
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  }

  /**
   * Update an existing service
   */
  static async updateService(serviceId: string, providerId: string, serviceData: UpdateServiceRequest): Promise<Service> {
    try {
      // First verify ownership
      await this.validateServiceOwnership(serviceId, providerId);

      // Build dynamic update data
      const updateData: any = {};

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

      const service = await prisma.service.update({
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
        availability: service.availability as Record<string, string[]>,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt,
      };
    } catch (error) {
      console.error('Error updating service:', error);
      throw error;
    }
  }

  /**
   * Delete a service
   */
  static async deleteService(serviceId: string, providerId: string): Promise<void> {
    try {
      // Verify ownership
      await this.validateServiceOwnership(serviceId, providerId);

      await prisma.service.delete({
        where: { id: serviceId },
      });
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  }

  /**
   * Validate that a user is a PROVIDER
   */
  static async validateProviderRole(userId: string): Promise<void> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      if (!user) {
        throw new Error('User not found');
      }

      if (user.role !== UserRole.PROVIDER) {
        throw new Error('Only PROVIDER users can manage services');
      }
    } catch (error) {
      console.error('Error validating provider role:', error);
      throw error;
    }
  }

  /**
   * Validate that a user owns a specific service
   */
  static async validateServiceOwnership(serviceId: string, providerId: string): Promise<void> {
    try {
      const service = await prisma.service.findUnique({
        where: { id: serviceId },
        select: { providerId: true },
      });

      if (!service) {
        throw new Error('Service not found');
      }

      if (service.providerId !== providerId) {
        throw new Error('You do not own this service');
      }
    } catch (error) {
      console.error('Error validating service ownership:', error);
      throw error;
    }
  }
}
