"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookingSchema = exports.createBookingSchema = exports.updateServiceSchema = exports.createServiceSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("../enums");
exports.createServiceSchema = zod_1.z.object({
    providerId: zod_1.z.string().uuid(),
    serviceType: zod_1.z.nativeEnum(enums_1.ServiceType),
    title: zod_1.z.string().min(1).max(100),
    description: zod_1.z.string().min(10).max(1000),
    price: zod_1.z.number().positive(),
    availability: zod_1.z.record(zod_1.z.array(zod_1.z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)-([01]\d|2[0-3]):([0-5]\d)$/))),
});
exports.updateServiceSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(100).optional(),
    description: zod_1.z.string().min(10).max(1000).optional(),
    price: zod_1.z.number().positive().optional(),
    availability: zod_1.z.record(zod_1.z.array(zod_1.z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)-([01]\d|2[0-3]):([0-5]\d)$/))).optional(),
});
exports.createBookingSchema = zod_1.z.object({
    ownerId: zod_1.z.string().uuid(),
    serviceId: zod_1.z.string().uuid(),
    bookingTime: zod_1.z.date(),
    notes: zod_1.z.string().max(500).optional(),
});
exports.updateBookingSchema = zod_1.z.object({
    bookingTime: zod_1.z.date().optional(),
    status: zod_1.z.nativeEnum(enums_1.BookingStatus).optional(),
    notes: zod_1.z.string().max(500).optional(),
});
