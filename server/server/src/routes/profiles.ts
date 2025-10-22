import { Router } from 'express';
import { ProfileController } from '../controllers/profileController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { updateProfileSchema } from 'petservice-marketplace-shared-types';

const router = Router();

/**
 * @swagger
 * /profiles/me:
 *   get:
 *     tags:
 *       - Profiles
 *     summary: Get my profile
 *     description: Retrieve the authenticated user's profile information
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
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
 *                     userId:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     bio:
 *                       type: string
 *                       example: "Professional pet sitter with 5 years of experience"
 *                     location:
 *                       type: string
 *                       example: "New York, NY"
 *                     phone:
 *                       type: string
 *                       example: "+1-555-0123"
 *                     avatar:
 *                       type: string
 *                       example: "https://example.com/avatar.jpg"
 *                     experience:
 *                       type: integer
 *                       example: 5
 *                     certifications:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Pet First Aid Certified", "Animal Behaviorist"]
 *                     servicesOffered:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["dog_walking", "pet_sitting"]
 *                     availability:
 *                       type: object
 *                       example: {"monday": ["09:00-17:00"]}
 *                     ratePerHour:
 *                       type: number
 *                       example: 25.50
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                 message:
 *                   type: string
 *                   example: "Profile retrieved successfully"
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/me', authenticateToken, ProfileController.getMyProfile);

/**
 * @swagger
 * /profiles/me:
 *   put:
 *     tags:
 *       - Profiles
 *     summary: Update my profile
 *     description: Update the authenticated user's profile information
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bio:
 *                 type: string
 *                 maxLength: 1000
 *                 description: User's biography
 *                 example: "Professional pet sitter with 5 years of experience"
 *               location:
 *                 type: string
 *                 maxLength: 100
 *                 description: User's location
 *                 example: "New York, NY"
 *               phone:
 *                 type: string
 *                 pattern: '^\+?[1-9]\d{1,14}$'
 *                 description: User's phone number
 *                 example: "+1-555-0123"
 *               avatar:
 *                 type: string
 *                 format: uri
 *                 description: Avatar image URL
 *                 example: "https://example.com/avatar.jpg"
 *               experience:
 *                 type: integer
 *                 minimum: 0
 *                 description: Years of experience
 *                 example: 5
 *               certifications:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of certifications
 *                 example: ["Pet First Aid Certified", "Animal Behaviorist"]
 *               servicesOffered:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [DOG_WALKING, PET_SITTING, VET_VISIT, GROOMING, TRAINING]
 *                 description: Services offered by provider
 *                 example: ["dog_walking", "pet_sitting"]
 *               availability:
 *                 type: object
 *                 description: Weekly availability schedule
 *                 additionalProperties:
 *                   type: array
 *                   items:
 *                     type: string
 *                     pattern: '^([01]\d|2[0-3]):([0-5]\d)-([01]\d|2[0-3]):([0-5]\d)$'
 *                 example:
 *                   monday: ["09:00-12:00", "14:00-18:00"]
 *               ratePerHour:
 *                 type: number
 *                 minimum: 0
 *                 description: Hourly rate for services
 *                 example: 25.50
 *     responses:
 *       200:
 *         description: Profile updated successfully
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
 *                     bio:
 *                       type: string
 *                       example: "Professional pet sitter with 5 years of experience"
 *                     location:
 *                       type: string
 *                       example: "New York, NY"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                 message:
 *                   type: string
 *                   example: "Profile updated successfully"
 *       400:
 *         description: Validation error
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
 *                   example: "Validation failed"
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.put(
  '/me',
  authenticateToken,
  validateRequest(updateProfileSchema),
  ProfileController.updateMyProfile
);

/**
 * @swagger
 * /profiles/me:
 *   post:
 *     tags:
 *       - Profiles
 *     summary: Create my profile
 *     description: Create a profile for the authenticated user (alternative to PUT for first-time setup)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bio:
 *                 type: string
 *                 maxLength: 1000
 *                 description: User's biography
 *                 example: "Professional pet sitter with 5 years of experience"
 *               location:
 *                 type: string
 *                 maxLength: 100
 *                 description: User's location
 *                 example: "New York, NY"
 *               phone:
 *                 type: string
 *                 pattern: '^\+?[1-9]\d{1,14}$'
 *                 description: User's phone number
 *                 example: "+1-555-0123"
 *               avatar:
 *                 type: string
 *                 format: uri
 *                 description: Avatar image URL
 *                 example: "https://example.com/avatar.jpg"
 *               experience:
 *                 type: integer
 *                 minimum: 0
 *                 description: Years of experience
 *                 example: 5
 *               certifications:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of certifications
 *                 example: ["Pet First Aid Certified", "Animal Behaviorist"]
 *               servicesOffered:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [DOG_WALKING, PET_SITTING, VET_VISIT, GROOMING, TRAINING]
 *                 description: Services offered by provider
 *                 example: ["dog_walking", "pet_sitting"]
 *               availability:
 *                 type: object
 *                 description: Weekly availability schedule
 *                 additionalProperties:
 *                   type: array
 *                   items:
 *                     type: string
 *                     pattern: '^([01]\d|2[0-3]):([0-5]\d)-([01]\d|2[0-3]):([0-5]\d)$'
 *                 example:
 *                   monday: ["09:00-12:00", "14:00-18:00"]
 *               ratePerHour:
 *                 type: number
 *                 minimum: 0
 *                 description: Hourly rate for services
 *                 example: 25.50
 *     responses:
 *       201:
 *         description: Profile created successfully
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
 *                     userId:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     bio:
 *                       type: string
 *                       example: "Professional pet sitter with 5 years of experience"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                 message:
 *                   type: string
 *                   example: "Profile created successfully"
 *       400:
 *         description: Validation error or profile already exists
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
 *                   example: "Profile already exists"
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.post(
  '/me',
  authenticateToken,
  validateRequest(updateProfileSchema),
  ProfileController.createMyProfile
);

/**
 * @swagger
 * /profiles/provider/{userId}:
 *   get:
 *     tags:
 *       - Profiles
 *     summary: Get provider profile
 *     description: Retrieve public profile information for a provider including their services
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the provider user
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Provider profile retrieved successfully
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
 *                     profile:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "123e4567-e89b-12d3-a456-426614174000"
 *                         userId:
 *                           type: string
 *                           example: "123e4567-e89b-12d3-a456-426614174000"
 *                         user:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             name:
 *                               type: string
 *                               example: "John Doe"
 *                             email:
 *                               type: string
 *                               example: "john@example.com"
 *                         bio:
 *                           type: string
 *                           example: "Professional pet sitter with 5 years of experience"
 *                         location:
 *                           type: string
 *                           example: "New York, NY"
 *                         phone:
 *                           type: string
 *                           example: "+1-555-0123"
 *                         avatar:
 *                           type: string
 *                           example: "https://example.com/avatar.jpg"
 *                         experience:
 *                           type: integer
 *                           example: 5
 *                         certifications:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example: ["Pet First Aid Certified"]
 *                         servicesOffered:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example: ["dog_walking", "pet_sitting"]
 *                         ratePerHour:
 *                           type: number
 *                           example: 25.50
 *                     services:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           title:
 *                             type: string
 *                           serviceType:
 *                             type: string
 *                           description:
 *                             type: string
 *                           price:
 *                             type: number
 *                           availability:
 *                             type: object
 *                           published:
 *                             type: boolean
 *                 message:
 *                   type: string
 *                   example: "Provider profile retrieved successfully"
 *       404:
 *         description: Provider not found or no provider profile
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
 *                   example: "Provider not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/provider/:userId', ProfileController.getProviderProfile);

export { router as profileRouter };
