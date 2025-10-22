"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingService = void 0;
const database_1 = __importDefault(require("../config/database"));
const petservice_marketplace_shared_types_1 = require("petservice-marketplace-shared-types");
class BookingService {
    /**
     * Create a new booking
     */
    static async createBooking(ownerId, serviceId, bookingData) {
        try {
            // Validate that the user is an OWNER
            await this.validateOwnerRole(ownerId);
            // Validate that the service exists and is active
            const service = await this.validateServiceExists(serviceId);
            // Validate booking time constraints
            await this.validateBookingTime(bookingData.bookingTime, serviceId);
            // Create booking with Prisma
            const booking = await database_1.default.booking.create({
                data: {
                    ownerId,
                    serviceId,
                    bookingTime: bookingData.bookingTime,
                    notes: bookingData.notes,
                    status: petservice_marketplace_shared_types_1.BookingStatus.PENDING,
                    paymentStatus: 'PENDING',
                },
                include: {
                    owner: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                    service: {
                        include: {
                            provider: {
                                select: {
                                    id: true,
                                    email: true,
                                    role: true,
                                    createdAt: true,
                                    updatedAt: true,
                                },
                            },
                        },
                    },
                },
            });
            const bookingWithDetails = {
                id: booking.id,
                ownerId: booking.ownerId,
                serviceId: booking.serviceId,
                bookingTime: booking.bookingTime,
                status: booking.status,
                paymentStatus: booking.paymentStatus,
                notes: booking.notes,
                createdAt: booking.createdAt,
                updatedAt: booking.updatedAt,
                owner: {
                    id: booking.owner.id,
                    email: booking.owner.email,
                    role: booking.owner.role,
                    createdAt: booking.owner.createdAt,
                    updatedAt: booking.owner.updatedAt,
                },
                service: {
                    id: booking.service.id,
                    providerId: booking.service.providerId,
                    serviceType: booking.service.serviceType,
                    title: booking.service.title,
                    description: booking.service.description,
                    price: booking.service.price,
                    availability: booking.service.availability,
                    createdAt: booking.service.createdAt,
                    updatedAt: booking.service.updatedAt,
                    provider: {
                        id: booking.service.provider.id,
                        email: booking.service.provider.email,
                        role: booking.service.provider.role,
                        createdAt: booking.service.provider.createdAt,
                        updatedAt: booking.service.provider.updatedAt,
                    },
                },
            };
            return bookingWithDetails;
        }
        catch (error) {
            console.error('Error creating booking:', error);
            throw error;
        }
    }
    /**
     * Get bookings by owner ID (for OWNER users)
     */
    static async getBookingsByOwnerId(ownerId) {
        try {
            const bookings = await database_1.default.booking.findMany({
                where: { ownerId },
                include: {
                    owner: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                    service: {
                        include: {
                            provider: {
                                select: {
                                    id: true,
                                    email: true,
                                    role: true,
                                    createdAt: true,
                                    updatedAt: true,
                                },
                            },
                        },
                    },
                },
                orderBy: { bookingTime: 'desc' },
            });
            return bookings.map(booking => ({
                id: booking.id,
                ownerId: booking.ownerId,
                serviceId: booking.serviceId,
                bookingTime: booking.bookingTime,
                status: booking.status,
                paymentStatus: booking.paymentStatus,
                notes: booking.notes,
                createdAt: booking.createdAt,
                updatedAt: booking.updatedAt,
                owner: {
                    id: booking.owner.id,
                    email: booking.owner.email,
                    role: booking.owner.role,
                    createdAt: booking.owner.createdAt,
                    updatedAt: booking.owner.updatedAt,
                },
                service: {
                    id: booking.service.id,
                    providerId: booking.service.providerId,
                    serviceType: booking.service.serviceType,
                    title: booking.service.title,
                    description: booking.service.description,
                    price: booking.service.price,
                    availability: booking.service.availability,
                    createdAt: booking.service.createdAt,
                    updatedAt: booking.service.updatedAt,
                    provider: {
                        id: booking.service.provider.id,
                        email: booking.service.provider.email,
                        role: booking.service.provider.role,
                        createdAt: booking.service.provider.createdAt,
                        updatedAt: booking.service.provider.updatedAt,
                    },
                },
            }));
        }
        catch (error) {
            console.error('Error fetching bookings by owner:', error);
            throw new Error('Failed to fetch bookings');
        }
    }
    /**
     * Get bookings by provider ID (for PROVIDER users)
     */
    static async getBookingsByProviderId(providerId) {
        try {
            const bookings = await database_1.default.booking.findMany({
                where: {
                    service: {
                        providerId: providerId,
                    },
                },
                include: {
                    owner: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                    service: {
                        include: {
                            provider: {
                                select: {
                                    id: true,
                                    email: true,
                                    role: true,
                                    createdAt: true,
                                    updatedAt: true,
                                },
                            },
                        },
                    },
                },
                orderBy: { bookingTime: 'desc' },
            });
            return bookings.map(booking => ({
                id: booking.id,
                ownerId: booking.ownerId,
                serviceId: booking.serviceId,
                bookingTime: booking.bookingTime,
                status: booking.status,
                paymentStatus: booking.paymentStatus,
                notes: booking.notes,
                createdAt: booking.createdAt,
                updatedAt: booking.updatedAt,
                owner: {
                    id: booking.owner.id,
                    email: booking.owner.email,
                    role: booking.owner.role,
                    createdAt: booking.owner.createdAt,
                    updatedAt: booking.owner.updatedAt,
                },
                service: {
                    id: booking.service.id,
                    providerId: booking.service.providerId,
                    serviceType: booking.service.serviceType,
                    title: booking.service.title,
                    description: booking.service.description,
                    price: booking.service.price,
                    availability: booking.service.availability,
                    createdAt: booking.service.createdAt,
                    updatedAt: booking.service.updatedAt,
                    provider: {
                        id: booking.service.provider.id,
                        email: booking.service.provider.email,
                        role: booking.service.provider.role,
                        createdAt: booking.service.provider.createdAt,
                        updatedAt: booking.service.provider.updatedAt,
                    },
                },
            }));
        }
        catch (error) {
            console.error('Error fetching bookings by provider:', error);
            throw new Error('Failed to fetch bookings');
        }
    }
    /**
     * Update booking status with proper authorization
     */
    static async updateBookingStatus(bookingId, userId, userRole, statusUpdate) {
        try {
            // Get the booking to check ownership and current status
            const booking = await this.getBookingById(bookingId);
            if (!booking) {
                throw new Error('Booking not found');
            }
            // Validate status transition and authorization
            await this.validateStatusTransition(booking, userId, userRole, statusUpdate.status);
            const updatedBooking = await database_1.default.booking.update({
                where: {
                    id: bookingId,
                },
                data: {
                    status: statusUpdate.status,
                },
                include: {
                    owner: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                    service: {
                        include: {
                            provider: {
                                select: {
                                    id: true,
                                    email: true,
                                    role: true,
                                    createdAt: true,
                                    updatedAt: true,
                                },
                            },
                        },
                    },
                },
            });
            return {
                id: updatedBooking.id,
                ownerId: updatedBooking.ownerId,
                serviceId: updatedBooking.serviceId,
                bookingTime: updatedBooking.bookingTime,
                status: updatedBooking.status,
                paymentStatus: updatedBooking.paymentStatus,
                notes: updatedBooking.notes,
                createdAt: updatedBooking.createdAt,
                updatedAt: updatedBooking.updatedAt,
                owner: {
                    id: updatedBooking.owner.id,
                    email: updatedBooking.owner.email,
                    role: updatedBooking.owner.role,
                    createdAt: updatedBooking.owner.createdAt,
                    updatedAt: updatedBooking.owner.updatedAt,
                },
                service: {
                    id: updatedBooking.service.id,
                    providerId: updatedBooking.service.providerId,
                    serviceType: updatedBooking.service.serviceType,
                    title: updatedBooking.service.title,
                    description: updatedBooking.service.description,
                    price: updatedBooking.service.price,
                    availability: updatedBooking.service.availability,
                    createdAt: updatedBooking.service.createdAt,
                    updatedAt: updatedBooking.service.updatedAt,
                    provider: {
                        id: updatedBooking.service.provider.id,
                        email: updatedBooking.service.provider.email,
                        role: updatedBooking.service.provider.role,
                        createdAt: updatedBooking.service.provider.createdAt,
                        updatedAt: updatedBooking.service.provider.updatedAt,
                    },
                },
            };
        }
        catch (error) {
            console.error('Error updating booking status:', error);
            throw error;
        }
    }
    /**
     * Get booking by ID with details
     */
    static async getBookingById(bookingId) {
        try {
            const booking = await database_1.default.booking.findUnique({
                where: {
                    id: bookingId,
                },
                include: {
                    owner: true,
                    service: {
                        include: {
                            provider: true,
                        },
                    },
                },
            });
            if (!booking) {
                return null;
            }
            const bookingWithDetails = {
                id: booking.id,
                ownerId: booking.ownerId,
                serviceId: booking.serviceId,
                bookingTime: booking.bookingTime,
                status: booking.status,
                paymentStatus: booking.paymentStatus,
                notes: booking.notes,
                createdAt: booking.createdAt,
                updatedAt: booking.updatedAt,
                owner: {
                    id: booking.owner.id,
                    email: booking.owner.email,
                    role: booking.owner.role,
                    createdAt: booking.owner.createdAt,
                    updatedAt: booking.owner.updatedAt,
                },
                service: {
                    id: booking.service.id,
                    providerId: booking.service.providerId,
                    serviceType: booking.service.serviceType,
                    title: booking.service.title,
                    description: booking.service.description,
                    price: booking.service.price,
                    availability: booking.service.availability,
                    createdAt: booking.service.createdAt,
                    updatedAt: booking.service.updatedAt,
                    provider: {
                        id: booking.service.provider.id,
                        email: booking.service.provider.email,
                        role: booking.service.provider.role,
                        createdAt: booking.service.provider.createdAt,
                        updatedAt: booking.service.provider.updatedAt,
                    },
                },
            };
            return bookingWithDetails;
        }
        catch (error) {
            console.error('Error fetching booking by ID:', error);
            throw new Error('Failed to fetch booking');
        }
    }
    /**
     * Validate that a user is an OWNER
     */
    static async validateOwnerRole(userId) {
        try {
            const user = await database_1.default.user.findUnique({
                where: { id: userId },
                select: { role: true },
            });
            if (!user) {
                throw new Error('User not found');
            }
            if (user.role !== petservice_marketplace_shared_types_1.UserRole.OWNER) {
                throw new Error('Only OWNER users can create bookings');
            }
        }
        catch (error) {
            console.error('Error validating owner role:', error);
            throw error;
        }
    }
    /**
     * Validate that a service exists and is active
     */
    static async validateServiceExists(serviceId) {
        try {
            const service = await database_1.default.service.findUnique({
                where: { id: serviceId },
                include: {
                    provider: true,
                },
            });
            if (!service) {
                throw new Error('Service not found');
            }
            return {
                id: service.id,
                providerId: service.providerId,
                serviceType: service.serviceType,
                title: service.title,
                description: service.description,
                price: service.price,
                availability: service.availability,
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
        }
        catch (error) {
            console.error('Error validating service exists:', error);
            throw error;
        }
    }
    /**
     * Validate booking time constraints
     */
    static async validateBookingTime(bookingTime, serviceId) {
        try {
            const now = new Date();
            const bookingDate = new Date(bookingTime);
            // Booking must be in the future
            if (bookingDate <= now) {
                throw new Error('Booking time must be in the future');
            }
            // Booking can't be more than 3 months in advance
            const maxAdvance = new Date();
            maxAdvance.setMonth(maxAdvance.getMonth() + 3);
            if (bookingDate > maxAdvance) {
                throw new Error('Bookings can only be made up to 3 months in advance');
            }
            // Check for existing bookings at the same time for this service
            const existingBookingCount = await database_1.default.booking.count({
                where: {
                    serviceId,
                    bookingTime,
                    status: {
                        not: petservice_marketplace_shared_types_1.BookingStatus.CANCELLED,
                    },
                },
            });
            if (existingBookingCount > 0) {
                throw new Error('This time slot is already booked');
            }
            // Additional business logic can be added here (e.g., provider availability, business hours)
        }
        catch (error) {
            console.error('Error validating booking time:', error);
            throw error;
        }
    }
    /**
     * Validate status transition and authorization
     */
    static async validateStatusTransition(booking, userId, userRole, newStatus) {
        // Only the booking owner (OWNER) can cancel
        if (newStatus === petservice_marketplace_shared_types_1.BookingStatus.CANCELLED) {
            if (userRole !== petservice_marketplace_shared_types_1.UserRole.OWNER || userId !== booking.ownerId) {
                throw new Error('Only the booking owner can cancel this booking');
            }
            return;
        }
        // Only the service provider (PROVIDER) can confirm or reject
        if (newStatus === petservice_marketplace_shared_types_1.BookingStatus.CONFIRMED || newStatus === petservice_marketplace_shared_types_1.BookingStatus.CANCELLED) {
            if (userRole !== petservice_marketplace_shared_types_1.UserRole.PROVIDER || userId !== booking.service.providerId) {
                throw new Error('Only the service provider can confirm or reject this booking');
            }
            return;
        }
        // Only PROVIDER can mark as completed
        if (newStatus === petservice_marketplace_shared_types_1.BookingStatus.COMPLETED) {
            if (userRole !== petservice_marketplace_shared_types_1.UserRole.PROVIDER || userId !== booking.service.providerId) {
                throw new Error('Only the service provider can mark this booking as completed');
            }
            return;
        }
        // Invalid status transition
        throw new Error('Invalid status transition');
    }
    /**
     * Get user by ID
     */
    static async getUserById(userId) {
        try {
            const user = await database_1.default.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                throw new Error('User not found');
            }
            return {
                id: user.id,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            };
        }
        catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    }
}
exports.BookingService = BookingService;
