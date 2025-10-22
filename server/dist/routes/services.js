"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceRouter = void 0;
const express_1 = require("express");
const serviceController_1 = require("../controllers/serviceController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const petservice_marketplace_shared_types_1 = require("petservice-marketplace-shared-types");
const router = (0, express_1.Router)();
exports.serviceRouter = router;
/**
 * @swagger
 * /services:
 *   post:
 *     tags:
 *       - Services
 *     summary: Create a new service
 *     description: Create a new pet service. Only users with PROVIDER role can create services.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - providerId
 *               - serviceType
 *               - title
 *               - description
 *               - price
 *             properties:
 *               providerId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the provider creating the service
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               serviceType:
 *                 type: string
 *                 enum: [DOG_WALKING, PET_SITTING, VET_VISIT, GROOMING, TRAINING]
 *                 description: Type of pet service
 *                 example: "DOG_WALKING"
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 description: Service title
 *                 example: "Professional Dog Walking Service"
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 1000
 *                 description: Detailed service description
 *                 example: "I provide professional dog walking services in the local area..."
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 description: Service price per hour/unit
 *                 example: 25.50
 *               availability:
 *                 type: object
 *                 description: Weekly availability schedule
 *                 additionalProperties:
 *                   type: array
 *                   items:
 *                     type: string
 *                     pattern: '^([01]\d|2[0-3]):([0-5]\d)-([01]\d|2[0-3]):([0-5]\d)$'
 *                     example: "09:00-17:00"
 *                 example:
 *                   monday: ["09:00-12:00", "14:00-18:00"]
 *                   tuesday: ["09:00-12:00", "14:00-18:00"]
 *     responses:
 *       201:
 *         description: Service created successfully
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
 *                     providerId:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     serviceType:
 *                       type: string
 *                       enum: [DOG_WALKING, PET_SITTING, VET_VISIT, GROOMING, TRAINING]
 *                       example: "DOG_WALKING"
 *                     title:
 *                       type: string
 *                       example: "Professional Dog Walking Service"
 *                     description:
 *                       type: string
 *                       example: "I provide professional dog walking services..."
 *                     price:
 *                       type: number
 *                       example: 25.50
 *                     availability:
 *                       type: object
 *                       example: {"monday": ["09:00-12:00"]}
 *                     published:
 *                       type: boolean
 *                       example: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                 message:
 *                   type: string
 *                   example: "Service created successfully"
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
router.post('/', auth_1.authenticateToken, auth_1.requireProviderRole, (0, validation_1.validateRequest)(petservice_marketplace_shared_types_1.createServiceSchema), serviceController_1.ServiceController.createService);
/**
 * @swagger
 * /services/my:
 *   get:
 *     tags:
 *       - Services
 *     summary: Get my services
 *     description: Retrieve all services created by the authenticated provider
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
 *         description: Number of services per page
 *       - in: query
 *         name: published
 *         schema:
 *           type: boolean
 *         description: Filter by published status
 *     responses:
 *       200:
 *         description: Services retrieved successfully
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
 *                                   providerId:
 *                                     type: string
 *                                     example: "123e4567-e89b-12d3-a456-426614174000"
 *                                   serviceType:
 *                                     type: string
 *                                     enum: [DOG_WALKING, PET_SITTING, VET_VISIT, GROOMING, TRAINING]
 *                                     example: "DOG_WALKING"
 *                                   title:
 *                                     type: string
 *                                     example: "Professional Dog Walking Service"
 *                                   description:
 *                                     type: string
 *                                     example: "I provide professional dog walking services..."
 *                                   price:
 *                                     type: number
 *                                     example: 25.50
 *                                   availability:
 *                                     type: object
 *                                     example: {"monday": ["09:00-12:00"]}
 *                                   published:
 *                                     type: boolean
 *                                     example: true
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
router.get('/my', auth_1.authenticateToken, auth_1.requireProviderRole, serviceController_1.ServiceController.getMyServices);
/**
 * @swagger
 * /services/{serviceId}:
 *   put:
 *     tags:
 *       - Services
 *     summary: Update a service
 *     description: Update an existing service. Only the service owner (provider) can update their services.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the service to update
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               serviceType:
 *                 type: string
 *                 enum: [DOG_WALKING, PET_SITTING, VET_VISIT, GROOMING, TRAINING]
 *                 description: Type of pet service
 *                 example: "DOG_WALKING"
 *               title:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 100
 *                 description: Service title
 *                 example: "Professional Dog Walking Service"
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 1000
 *                 description: Detailed service description
 *                 example: "I provide professional dog walking services in the local area..."
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 description: Service price per hour/unit
 *                 example: 25.50
 *               availability:
 *                 type: object
 *                 description: Weekly availability schedule
 *                 additionalProperties:
 *                   type: array
 *                   items:
 *                     type: string
 *                     pattern: '^([01]\d|2[0-3]):([0-5]\d)-([01]\d|2[0-3]):([0-5]\d)$'
 *                     example: "09:00-17:00"
 *                 example:
 *                   monday: ["09:00-12:00", "14:00-18:00"]
 *                   tuesday: ["09:00-12:00", "14:00-18:00"]
 *               published:
 *                 type: boolean
 *                 description: Whether the service is published and visible to customers
 *                 example: true
 *     responses:
 *       200:
 *         description: Service updated successfully
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
 *                     providerId:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     serviceType:
 *                       type: string
 *                       enum: [DOG_WALKING, PET_SITTING, VET_VISIT, GROOMING, TRAINING]
 *                       example: "DOG_WALKING"
 *                     title:
 *                       type: string
 *                       example: "Professional Dog Walking Service"
 *                     description:
 *                       type: string
 *                       example: "I provide professional dog walking services..."
 *                     price:
 *                       type: number
 *                       example: 25.50
 *                     availability:
 *                       type: object
 *                       example: {"monday": ["09:00-12:00"]}
 *                     published:
 *                       type: boolean
 *                       example: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                 message:
 *                   type: string
 *                   example: "Service updated successfully"
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
 *       403:
 *         description: Forbidden - Provider role required or not service owner
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
 *                   example: "You can only update your own services"
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
router.put('/:serviceId', auth_1.authenticateToken, auth_1.requireProviderRole, (0, validation_1.validateRequest)(petservice_marketplace_shared_types_1.updateServiceSchema), serviceController_1.ServiceController.updateService);
/**
 * @swagger
 * /services/{serviceId}:
 *   delete:
 *     tags:
 *       - Services
 *     summary: Delete a service
 *     description: Delete an existing service. Only the service owner (provider) can delete their services.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the service to delete
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Service deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Service deleted successfully"
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
 *         description: Forbidden - Provider role required or not service owner
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
 *                   example: "You can only delete your own services"
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
router.delete('/:serviceId', auth_1.authenticateToken, auth_1.requireProviderRole, serviceController_1.ServiceController.deleteService);
/**
 * @swagger
 * /services:
 *   get:
 *     tags:
 *       - Services
 *     summary: Get all services
 *     description: Retrieve a paginated list of all published services with optional filtering
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
 *         description: Number of services per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter services by title or description
 *         example: "dog walking"
 *       - in: query
 *         name: serviceType
 *         schema:
 *           type: string
 *           enum: [DOG_WALKING, PET_SITTING, VET_VISIT, GROOMING, TRAINING]
 *         description: Filter by service type
 *         example: "DOG_WALKING"
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Minimum price filter
 *         example: 20
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Maximum price filter
 *         example: 50
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [price, rating, createdAt]
 *           default: createdAt
 *         description: Sort services by field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Services retrieved successfully
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
 *                                     description: Provider information (included for public access)
 *                                   serviceType:
 *                                     type: string
 *                                     enum: [DOG_WALKING, PET_SITTING, VET_VISIT, GROOMING, TRAINING]
 *                                     example: "DOG_WALKING"
 *                                   title:
 *                                     type: string
 *                                     example: "Professional Dog Walking Service"
 *                                   description:
 *                                     type: string
 *                                     example: "I provide professional dog walking services..."
 *                                   price:
 *                                     type: number
 *                                     example: 25.50
 *                                   availability:
 *                                     type: object
 *                                     example: {"monday": ["09:00-12:00"]}
 *                                   createdAt:
 *                                     type: string
 *                                     format: date-time
 *                                   updatedAt:
 *                                     type: string
 *                                     format: date-time
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/', auth_1.optionalAuth, serviceController_1.ServiceController.getServices);
/**
 * @swagger
 * /services/{serviceId}:
 *   get:
 *     tags:
 *       - Services
 *     summary: Get service details
 *     description: Retrieve detailed information about a specific service by ID
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the service to retrieve
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Service details retrieved successfully
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
 *                     providerId:
 *                       type: string
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     provider:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                       description: Provider information (included for public access)
 *                     serviceType:
 *                       type: string
 *                       enum: [DOG_WALKING, PET_SITTING, VET_VISIT, GROOMING, TRAINING]
 *                       example: "DOG_WALKING"
 *                     title:
 *                       type: string
 *                       example: "Professional Dog Walking Service"
 *                     description:
 *                       type: string
 *                       example: "I provide professional dog walking services in the local area with over 5 years of experience..."
 *                     price:
 *                       type: number
 *                       example: 25.50
 *                     availability:
 *                       type: object
 *                       example: {"monday": ["09:00-12:00", "14:00-18:00"], "tuesday": ["09:00-12:00", "14:00-18:00"]}
 *                     published:
 *                       type: boolean
 *                       example: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                 message:
 *                   type: string
 *                   example: "Service retrieved successfully"
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
router.get('/:serviceId', auth_1.optionalAuth, serviceController_1.ServiceController.getService);
