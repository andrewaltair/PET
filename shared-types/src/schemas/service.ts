import { z } from 'zod';
import { ServiceType, BookingStatus } from '../enums';

export const createServiceSchema = z.object({
  providerId: z.string().uuid(),
  serviceType: z.nativeEnum(ServiceType),
  title: z.string().min(1).max(100),
  description: z.string().min(10).max(1000),
  price: z.number().positive(),
  availability: z.record(z.array(z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)-([01]\d|2[0-3]):([0-5]\d)$/))),
});

export const updateServiceSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().min(10).max(1000).optional(),
  price: z.number().positive().optional(),
  availability: z.record(z.array(z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)-([01]\d|2[0-3]):([0-5]\d)$/))).optional(),
});

export const createBookingSchema = z.object({
  ownerId: z.string().uuid(),
  serviceId: z.string().uuid(),
  bookingTime: z.date(),
  notes: z.string().max(500).optional(),
});

export const updateBookingSchema = z.object({
  bookingTime: z.date().optional(),
  status: z.nativeEnum(BookingStatus).optional(),
  notes: z.string().max(500).optional(),
});

