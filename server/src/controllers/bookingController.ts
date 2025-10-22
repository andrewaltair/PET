import { Request, Response } from 'express';
import { BookingService } from '../services/bookingService';
import { CreateBookingRequest, UpdateBookingStatusRequest, ApiResponse, BookingWithDetails } from 'petservice-marketplace-shared-types';

export class BookingController {
  /**
   * POST /api/v1/bookings/service/:serviceId
   * Create a new booking (OWNER only)
   */
  static async createBooking(req: Request, res: Response): Promise<void> {
    try {
      const ownerId = req.user!.id;
      const serviceId = req.params.serviceId;
      const bookingData: CreateBookingRequest = {
        ...req.body,
        bookingTime: new Date(req.body.bookingTime), // Convert string to Date
      };

      const booking = await BookingService.createBooking(ownerId, serviceId, bookingData);

      const response: ApiResponse<{ booking: BookingWithDetails }> = {
        success: true,
        data: { booking },
        message: 'Booking created successfully',
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Create booking error:', error);

      const errorMessage = error instanceof Error ? error.message : 'Failed to create booking';

      let statusCode = 500;
      if (errorMessage.includes('Only OWNER users can create bookings')) {
        statusCode = 403;
      } else if (errorMessage.includes('Service not found')) {
        statusCode = 404;
      } else if (errorMessage.includes('must be in the future') || errorMessage.includes('already booked')) {
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
   * GET /api/v1/bookings/my-as-owner
   * Get bookings created by current user (OWNER only)
   */
  static async getMyBookingsAsOwner(req: Request, res: Response): Promise<void> {
    try {
      const ownerId = req.user!.id;

      const bookings = await BookingService.getBookingsByOwnerId(ownerId);

      const response: ApiResponse<{ bookings: BookingWithDetails[] }> = {
        success: true,
        data: { bookings },
        message: 'Bookings retrieved successfully',
      };

      res.json(response);
    } catch (error) {
      console.error('Get my bookings as owner error:', error);

      const errorMessage = error instanceof Error ? error.message : 'Failed to get bookings';

      const response: ApiResponse = {
        success: false,
        error: errorMessage,
      };

      res.status(500).json(response);
    }
  }

  /**
   * GET /api/v1/bookings/my-as-provider
   * Get bookings for services provided by current user (PROVIDER only)
   */
  static async getMyBookingsAsProvider(req: Request, res: Response): Promise<void> {
    try {
      const providerId = req.user!.id;

      const bookings = await BookingService.getBookingsByProviderId(providerId);

      const response: ApiResponse<{ bookings: BookingWithDetails[] }> = {
        success: true,
        data: { bookings },
        message: 'Bookings retrieved successfully',
      };

      res.json(response);
    } catch (error) {
      console.error('Get my bookings as provider error:', error);

      const errorMessage = error instanceof Error ? error.message : 'Failed to get bookings';

      const response: ApiResponse = {
        success: false,
        error: errorMessage,
      };

      res.status(500).json(response);
    }
  }

  /**
   * PUT /api/v1/bookings/:bookingId/status
   * Update booking status with proper authorization
   */
  static async updateBookingStatus(req: Request, res: Response): Promise<void> {
    try {
      const bookingId = req.params.bookingId;
      const userId = req.user!.id;
      const userRole = req.user!.role;
      const statusUpdate: UpdateBookingStatusRequest = req.body;

      const updatedBooking = await BookingService.updateBookingStatus(
        bookingId,
        userId,
        userRole,
        statusUpdate
      );

      const response: ApiResponse<{ booking: BookingWithDetails }> = {
        success: true,
        data: { booking: updatedBooking },
        message: 'Booking status updated successfully',
      };

      res.json(response);
    } catch (error) {
      console.error('Update booking status error:', error);

      const errorMessage = error instanceof Error ? error.message : 'Failed to update booking status';

      let statusCode = 500;
      if (errorMessage.includes('not found')) {
        statusCode = 404;
      } else if (errorMessage.includes('Only') || errorMessage.includes('cannot')) {
        statusCode = 403;
      } else if (errorMessage.includes('Invalid status transition')) {
        statusCode = 400;
      }

      const response: ApiResponse = {
        success: false,
        error: errorMessage,
      };

      res.status(statusCode).json(response);
    }
  }
}
