"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const reviewService_1 = require("../services/reviewService");
class ReviewController {
    /**
     * POST /api/v1/reviews/booking/:bookingId
     * Create a new review for a completed booking
     */
    static async createReview(req, res) {
        try {
            const { bookingId } = req.params;
            const reviewData = {
                bookingId,
                ...req.body,
            };
            if (!req.user?.id) {
                const response = {
                    success: false,
                    error: 'Authentication required',
                };
                res.status(401).json(response);
                return;
            }
            const review = await reviewService_1.ReviewService.createReview(req.user.id, reviewData);
            const response = {
                success: true,
                data: review,
                message: 'Review created successfully',
            };
            res.status(201).json(response);
        }
        catch (error) {
            console.error('Create review error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to create review';
            let statusCode = 500;
            if (errorMessage.includes('not found') || errorMessage.includes('already exists')) {
                statusCode = 400;
            }
            else if (errorMessage.includes('Only the booking owner') || errorMessage.includes('Only owners can leave reviews')) {
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
     * GET /api/v1/reviews/service/:serviceId
     * Get all reviews for a specific service
     */
    static async getServiceReviews(req, res) {
        try {
            const { serviceId } = req.params;
            const reviews = await reviewService_1.ReviewService.getServiceReviews(serviceId);
            const response = {
                success: true,
                data: reviews,
                message: 'Service reviews retrieved successfully',
            };
            res.json(response);
        }
        catch (error) {
            console.error('Get service reviews error:', error);
            const response = {
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
    static async getProviderReviews(req, res) {
        try {
            const { userId } = req.params;
            const reviews = await reviewService_1.ReviewService.getProviderReviews(userId);
            const response = {
                success: true,
                data: reviews,
                message: 'Provider reviews retrieved successfully',
            };
            res.json(response);
        }
        catch (error) {
            console.error('Get provider reviews error:', error);
            const response = {
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
    static async canReviewBooking(req, res) {
        try {
            const { bookingId } = req.params;
            if (!req.user?.id) {
                const response = {
                    success: false,
                    error: 'Authentication required',
                };
                res.status(401).json(response);
                return;
            }
            const canReview = await reviewService_1.ReviewService.canReviewBooking(req.user.id, bookingId);
            const response = {
                success: true,
                data: { canReview },
                message: 'Review availability checked successfully',
            };
            res.json(response);
        }
        catch (error) {
            console.error('Check review availability error:', error);
            const response = {
                success: false,
                error: 'Failed to check review availability',
            };
            res.status(500).json(response);
        }
    }
}
exports.ReviewController = ReviewController;
