"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookingStatusSchema = exports.createBookingSchema = exports.updateServiceSchema = exports.createServiceSchema = exports.updateProfileSchema = exports.createProfileSchema = exports.loginSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("../enums");
exports.createUserSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
    role: zod_1.z.nativeEnum(enums_1.UserRole),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
exports.createProfileSchema = zod_1.z.object({
    userId: zod_1.z.string().uuid(),
    firstName: zod_1.z.string().min(1).max(50).optional(),
    lastName: zod_1.z.string().min(1).max(50).optional(),
    avatarUrl: zod_1.z.string().url().optional(),
    bio: zod_1.z.string().max(500).optional(),
    location: zod_1.z.string().max(100).optional(),
});
exports.updateProfileSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1).max(50).optional(),
    lastName: zod_1.z.string().min(1).max(50).optional(),
    avatarUrl: zod_1.z.string().url().optional(),
    bio: zod_1.z.string().max(500).optional(),
    location: zod_1.z.string().max(100).optional(),
    address: zod_1.z.string().max(200).optional(),
    phone: zod_1.z.string().max(20).optional(),
    facebookUrl: zod_1.z.string().url().optional(),
    instagramUrl: zod_1.z.string().url().optional(),
    tiktokUrl: zod_1.z.string().url().optional(),
    telegramUrl: zod_1.z.string().url().optional(),
    whatsappUrl: zod_1.z.string().url().optional(),
    viberUrl: zod_1.z.string().url().optional(),
    animalTypes: zod_1.z.enum(['DOGS_ONLY', 'ALL_ANIMALS']).optional(),
    servicesProvided: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.createServiceSchema = zod_1.z.object({
    serviceType: zod_1.z.nativeEnum(enums_1.ServiceType),
    title: zod_1.z.string().min(5).max(100),
    description: zod_1.z.string().min(10).max(1000),
    price: zod_1.z.number().positive(),
    availability: zod_1.z.record(zod_1.z.array(zod_1.z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)-([01]\d|2[0-3]):([0-5]\d)$/))),
});
exports.updateServiceSchema = zod_1.z.object({
    serviceType: zod_1.z.nativeEnum(enums_1.ServiceType).optional(),
    title: zod_1.z.string().min(5).max(100).optional(),
    description: zod_1.z.string().min(10).max(1000).optional(),
    price: zod_1.z.number().positive().optional(),
    availability: zod_1.z.record(zod_1.z.array(zod_1.z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)-([01]\d|2[0-3]):([0-5]\d)$/))).optional(),
});
exports.createBookingSchema = zod_1.z.object({
    bookingTime: zod_1.z.string().datetime(), // ISO datetime string
    notes: zod_1.z.string().max(500).optional(),
});
exports.updateBookingStatusSchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(enums_1.BookingStatus),
});
