import prisma from '../config/database';
import { CreateReviewRequest, ReviewResponse, BookingStatus, UserRole } from 'petservice-marketplace-shared-types';

export class ReviewService {
  /**
   * Create a new review for a completed booking
   * Includes rating recalculation in a transaction
   */
  static async createReview(userId: string, reviewData: CreateReviewRequest): Promise<ReviewResponse> {
    const { bookingId, rating, comment } = reviewData;

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // 1. Verify booking exists and is completed
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
        include: {
          owner: true,
          service: true,
        },
      });

      if (!booking) {
        throw new Error('Booking not found');
      }

      if (booking.status !== BookingStatus.COMPLETED) {
        throw new Error('Can only review completed bookings');
      }

      if (booking.ownerId !== userId) {
        throw new Error('Only the booking owner can leave a review');
      }

      if (booking.owner.role !== UserRole.OWNER) {
        throw new Error('Only owners can leave reviews');
      }

      // 2. Check if review already exists for this booking
      const existingReview = await tx.review.findUnique({
        where: { bookingId },
      });

      if (existingReview) {
        throw new Error('Review already exists for this booking');
      }

      // 3. Create the review
      const review = await tx.review.create({
        data: {
          bookingId,
          serviceId: booking.serviceId,
          ownerId: booking.ownerId,
          providerId: booking.service.providerId,
          rating,
          comment,
        },
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          service: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      // 4. Recalculate service average rating
      await this.recalculateServiceRating(tx, booking.serviceId);

      // 5. Recalculate provider overall average rating
      await this.recalculateProviderRating(tx, booking.service.providerId);

      return review;
    });

    return {
      id: result.id,
      bookingId: result.bookingId,
      serviceId: result.serviceId,
      ownerId: result.ownerId,
      providerId: result.providerId,
      rating: result.rating,
      comment: result.comment || undefined,
      createdAt: result.createdAt.toISOString(),
      owner: result.owner,
      service: result.service,
    };
  }

  /**
   * Get all reviews for a specific service
   */
  static async getServiceReviews(serviceId: string): Promise<ReviewResponse[]> {
    const reviews = await prisma.review.findMany({
      where: { serviceId },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        service: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return reviews.map(review => ({
      id: review.id,
      bookingId: review.bookingId,
      serviceId: review.serviceId,
      ownerId: review.ownerId,
      providerId: review.providerId,
      rating: review.rating,
      comment: review.comment || undefined,
      createdAt: review.createdAt.toISOString(),
      owner: review.owner,
      service: review.service,
    }));
  }

  /**
   * Get all reviews for a specific provider
   */
  static async getProviderReviews(providerId: string): Promise<ReviewResponse[]> {
    const reviews = await prisma.review.findMany({
      where: { providerId },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        service: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return reviews.map(review => ({
      id: review.id,
      bookingId: review.bookingId,
      serviceId: review.serviceId,
      ownerId: review.ownerId,
      providerId: review.providerId,
      rating: review.rating,
      comment: review.comment || undefined,
      createdAt: review.createdAt.toISOString(),
      owner: review.owner,
      service: review.service,
    }));
  }

  /**
   * Check if a user can review a specific booking
   */
  static async canReviewBooking(userId: string, bookingId: string): Promise<boolean> {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        owner: true,
        review: true,
      },
    });

    if (!booking) {
      return false;
    }

    // Check conditions:
    // 1. Booking is completed
    // 2. User is the owner
    // 3. No review exists yet
    return (
      booking.status === BookingStatus.COMPLETED &&
      booking.ownerId === userId &&
      booking.owner.role === UserRole.OWNER &&
      !booking.review
    );
  }

  /**
   * Recalculate average rating for a service
   */
  private static async recalculateServiceRating(tx: any, serviceId: string): Promise<void> {
    const result = await tx.review.aggregate({
      where: { serviceId },
      _avg: { rating: true },
    });

    const averageRating = result._avg.rating || 0;

    await tx.service.update({
      where: { id: serviceId },
      data: { averageRating },
    });
  }

  /**
   * Recalculate overall average rating for a provider
   */
  private static async recalculateProviderRating(tx: any, providerId: string): Promise<void> {
    // Get all services for this provider
    const services = await tx.service.findMany({
      where: { providerId },
      select: { id: true, averageRating: true },
    });

    if (services.length === 0) {
      return;
    }

    // Calculate weighted average across all services
    const totalRating = services.reduce((sum, service) => sum + service.averageRating, 0);
    const overallAverageRating = totalRating / services.length;

    await tx.profile.update({
      where: { userId: providerId },
      data: { overallAverageRating },
    });
  }
}
