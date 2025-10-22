import { Request, Response } from 'express';
import { ReviewService } from '../services/reviewService';
import { CreateReviewRequest, ApiResponse } from 'petservice-marketplace-shared-types';

export class ReviewController {
  /**
   * POST /api/v1/reviews/booking/:bookingId
   * Create a new review for a completed booking
   */
  static async createReview(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId } = req.params;
      const reviewData: CreateReviewRequest = {
        bookingId,
        ...req.body,
      };

      if (!req.user?.id) {
        const response: ApiResponse = {
          success: false,
          error: 'Authentication required',
        };
        res.status(401).json(response);
        return;
      }

      const review = await ReviewService.createReview(req.user.id, reviewData);

      const response: ApiResponse<typeof review> = {
        success: true,
        data: review,
        message: 'Review created successfully',
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Create review error:', error);

      const errorMessage = error instanceof Error ? error.message : 'Failed to create review';

      let statusCode = 500;
      if (errorMessage.includes('not found') || errorMessage.includes('already exists')) {
        statusCode = 400;
      } else if (errorMessage.includes('Only the booking owner') || errorMessage.includes('Only owners can leave reviews')) {
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
   * GET /api/v1/reviews/service/:serviceId
   * Get all reviews for a specific service
   */
  static async getServiceReviews(req: Request, res: Response): Promise<void> {
    try {
      const { serviceId } = req.params;

      const reviews = await ReviewService.getServiceReviews(serviceId);

      const response: ApiResponse<typeof reviews> = {
        success: true,
        data: reviews,
        message: 'Service reviews retrieved successfully',
      };

      res.json(response);
    } catch (error) {
      console.error('Get service reviews error:', error);

      const response: ApiResponse = {
        success: false,
        error: 'Failed to retrieve service reviews',
      };

      res.status(500).json(response);
    }
  }

  /**
   * GET /api/v1/reviews/provider/:userId
   * Get all reviews for a specific provider
   */
  static async getProviderReviews(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      const reviews = await ReviewService.getProviderReviews(userId);

      const response: ApiResponse<typeof reviews> = {
        success: true,
        data: reviews,
        message: 'Provider reviews retrieved successfully',
      };

      res.json(response);
    } catch (error) {
      console.error('Get provider reviews error:', error);

      const response: ApiResponse = {
        success: false,
        error: 'Failed to retrieve provider reviews',
      };

      res.status(500).json(response);
    }
  }

  /**
   * GET /api/v1/reviews/booking/:bookingId/can-review
   * Check if user can review a specific booking
   */
  static async canReviewBooking(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId } = req.params;

      if (!req.user?.id) {
        const response: ApiResponse = {
          success: false,
          error: 'Authentication required',
        };
        res.status(401).json(response);
        return;
      }

      const canReview = await ReviewService.canReviewBooking(req.user.id, bookingId);

      const response: ApiResponse<{ canReview: boolean }> = {
        success: true,
        data: { canReview },
        message: 'Review availability checked successfully',
      };

      res.json(response);
    } catch (error) {
      console.error('Check review availability error:', error);

      const response: ApiResponse = {
        success: false,
        error: 'Failed to check review availability',
      };

      res.status(500).json(response);
    }
  }
}
