import { Router, Request, Response } from 'express';
import { BookingController } from '../controllers/bookingController';
import { authenticateToken, requireOwnerRole, requireProviderRole } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { createBookingSchema, updateBookingStatusSchema } from 'petservice-marketplace-shared-types';

const router = Router();

/**
 * @swagger
 * /bookings/service/{serviceId}:
 *   post:
 *     tags:
 *       - Bookings
 *     summary: Create a booking
 *     description: Create a new booking for a specific service. Only users with OWNER role can create bookings.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the service to book
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingTime
 *             properties:
 *               bookingTime:
 *                 type: string
 *                 format: date-time
 *                 description: Date and time when the service is requested
 *                 example: "2024-01-15T10:00:00Z"
 *               notes:
 *                 type: string
 *                 maxLength: 500
 *                 description: Additional notes for the booking
 *                 example: "Please bring treats for my dog. He's very friendly!"
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     serviceId:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     ownerId:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     providerId:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     bookingTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-15T10:00:00Z"
 *                     status:
 *                       type: string
 *                       enum: [PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, REJECTED]
 *                       example: "PENDING"
 *                     notes:
 *                       type: string
 *                       example: "Please bring treats for my dog. He's very friendly!"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                 message:
 *                   type: string
 *                   example: "Booking created successfully"
 *       400:
 *         description: Validation error or invalid booking time
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Invalid booking time or service not available"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Access token is required"
 *       403:
 *         description: Forbidden - Owner role required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Owner role required"
 *       404:
 *         description: Service not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Service not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.post(
  '/service/:serviceId',
  authenticateToken,
  requireOwnerRole,
  validateRequest(createBookingSchema),
  BookingController.createBooking
);

// Mock bookings data for testing when database is not available
const mockBookings = [
  {
    id: 'booking-1',
    ownerId: 'user-1',
    serviceId: 'service-1',
    bookingTime: new Date(Date.now() + 86400000), // Tomorrow
    status: 'PENDING',
    paymentStatus: 'PENDING',
    notes: 'Please bring treats for my dog',
    createdAt: new Date(),
    updatedAt: new Date(),
    owner: {
      id: 'user-1',
      email: 'user@example.com',
      role: 'OWNER',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    service: {
      id: 'service-1',
      providerId: 'provider-1',
      serviceType: 'DOG_WALKING',
      title: 'Evening Dog Walk',
      description: 'A relaxing evening walk for your dog',
      price: 25,
      availability: {},
      createdAt: new Date(),
      updatedAt: new Date(),
      provider: {
        id: 'provider-1',
        email: 'provider@example.com',
        role: 'PROVIDER',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  },
  {
    id: 'booking-2',
    ownerId: 'user-1',
    serviceId: 'service-2',
    bookingTime: new Date(Date.now() + 172800000), // Day after tomorrow
    status: 'CONFIRMED',
    paymentStatus: 'PENDING',
    notes: 'My cat needs grooming',
    createdAt: new Date(),
    updatedAt: new Date(),
    owner: {
      id: 'user-1',
      email: 'user@example.com',
      role: 'OWNER',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    service: {
      id: 'service-2',
      providerId: 'provider-2',
      serviceType: 'PET_GROOMING',
      title: 'Cat Grooming Service',
      description: 'Professional grooming for cats',
      price: 40,
      availability: {},
      createdAt: new Date(),
      updatedAt: new Date(),
      provider: {
        id: 'provider-2',
        email: 'provider2@example.com',
        role: 'PROVIDER',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  },
];

/**
 * @swagger
 * /bookings/my-as-owner:
 *   get:
 *     tags:
 *       - Bookings
 *     summary: Get my bookings as owner
 *     description: Retrieve all bookings created by the authenticated user as a pet owner
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of bookings per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, REJECTED]
 *         description: Filter by booking status
 *     responses:
 *       200:
 *         description: Bookings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       allOf:
 *                         - $ref: '#/components/schemas/PaginatedResponse'
 *                         - type: object
 *                           properties:
 *                             data:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: string
 *                                     example: "123e4567-e89b-12d3-a456-426614174000"
 *                                   serviceId:
 *                                     type: string
 *                                     example: "123e4567-e89b-12d3-a456-426614174000"
 *                                   service:
 *                                     type: object
 *                                     properties:
 *                                       id:
 *                                         type: string
 *                                       title:
 *                                         type: string
 *                                       serviceType:
 *                                         type: string
 *                                       price:
 *                                         type: number
 *                                     description: Service information
 *                                   providerId:
 *                                     type: string
 *                                     example: "123e4567-e89b-12d3-a456-426614174000"
 *                                   provider:
 *                                     type: object
 *                                     properties:
 *                                       id:
 *                                         type: string
 *                                       name:
 *                                         type: string
 *                                       email:
 *                                         type: string
 *                                     description: Owner information
 *                                   bookingTime:
 *                                     type: string
 *                                     format: date-time
 *                                     example: "2024-01-15T10:00:00Z"
 *                                   status:
 *                                     type: string
 *                                     enum: [PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, REJECTED]
 *                                     example: "CONFIRMED"
 *                                   notes:
 *                                     type: string
 *                                     example: "Please bring treats for my dog"
 *                                   createdAt:
 *                                     type: string
 *                                     format: date-time
 *                                   updatedAt:
 *                                     type: string
 *                                     format: date-time
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Access token is required"
 *       403:
 *         description: Forbidden - Owner role required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Owner role required"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get(
  '/my-as-owner',
  authenticateToken,
  requireOwnerRole,
  (req: Request, res: Response) => {
    try {
      // Return mock data for testing
      const response = {
        success: true,
        data: { bookings: mockBookings },
        message: 'Bookings retrieved successfully',
      };
      res.json(response);
    } catch (error) {
      console.error('Mock bookings error:', error);
      const response = {
        success: false,
        error: 'Failed to get bookings',
      };
      res.status(500).json(response);
    }
  }
);

/**
 * @swagger
 * /bookings/my-as-provider:
 *   get:
 *     tags:
 *       - Bookings
 *     summary: Get my bookings as provider
 *     description: Retrieve all bookings for services provided by the authenticated user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of bookings per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, REJECTED]
 *         description: Filter by booking status
 *     responses:
 *       200:
 *         description: Bookings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       allOf:
 *                         - $ref: '#/components/schemas/PaginatedResponse'
 *                         - type: object
 *                           properties:
 *                             data:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   id:
 *                                     type: string
 *                                     example: "123e4567-e89b-12d3-a456-426614174000"
 *                                   serviceId:
 *                                     type: string
 *                                     example: "123e4567-e89b-12d3-a456-426614174000"
 *                                   service:
 *                                     type: object
 *                                     properties:
 *                                       id:
 *                                         type: string
 *                                       title:
 *                                         type: string
 *                                       serviceType:
 *                                         type: string
 *                                       price:
 *                                         type: number
 *                                     description: Service information
 *                                   ownerId:
 *                                     type: string
 *                                     example: "123e4567-e89b-12d3-a456-426614174000"
 *                                   owner:
 *                                     type: object
 *                                     properties:
 *                                       id:
 *                                         type: string
 *                                       name:
 *                                         type: string
 *                                       email:
 *                                         type: string
 *                                     description: Owner information
 *                                   bookingTime:
 *                                     type: string
 *                                     format: date-time
 *                                     example: "2024-01-15T10:00:00Z"
 *                                   status:
 *                                     type: string
 *                                     enum: [PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, REJECTED]
 *                                     example: "PENDING"
 *                                   notes:
 *                                     type: string
 *                                     example: "Please bring treats for my dog"
 *                                   createdAt:
 *                                     type: string
 *                                     format: date-time
 *                                   updatedAt:
 *                                     type: string
 *                                     format: date-time
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Access token is required"
 *       403:
 *         description: Forbidden - Provider role required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Provider role required"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get(
  '/my-as-provider',
  authenticateToken,
  requireProviderRole,
  (req: Request, res: Response) => {
    try {
      // Return mock data for testing
      const response = {
        success: true,
        data: { bookings: mockBookings },
        message: 'Bookings retrieved successfully',
      };
      res.json(response);
    } catch (error) {
      console.error('Mock provider bookings error:', error);
      const response = {
        success: false,
        error: 'Failed to get bookings',
      };
      res.status(500).json(response);
    }
  }
);

/**
 * @swagger
 * /bookings/{bookingId}/status:
 *   put:
 *     tags:
 *       - Bookings
 *     summary: Update booking status
 *     description: Update the status of a booking. Owners can cancel bookings, providers can confirm/reject/complete bookings.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the booking to update
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, REJECTED]
 *                 description: New status for the booking
 *                 example: "CONFIRMED"
 *     responses:
 *       200:
 *         description: Booking status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     status:
 *                       type: string
 *                       enum: [PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, REJECTED]
 *                       example: "CONFIRMED"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                 message:
 *                   type: string
 *                   example: "Booking status updated successfully"
 *       400:
 *         description: Validation error or invalid status transition
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Invalid status transition"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Access token is required"
 *       403:
 *         description: Forbidden - Not authorized to update this booking
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Not authorized to update this booking"
 *       404:
 *         description: Booking not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Booking not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.put(
  '/:bookingId/status',
  authenticateToken,
  validateRequest(updateBookingStatusSchema),
  BookingController.updateBookingStatus
);

export { router as bookingRouter };
