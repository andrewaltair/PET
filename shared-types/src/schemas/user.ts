import { z } from 'zod';
import { UserRole, ServiceType, BookingStatus } from '../enums';

export const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.nativeEnum(UserRole),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const createProfileSchema = z.object({
  userId: z.string().uuid(),
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  avatarUrl: z.string().url().optional(),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  avatarUrl: z.string().url().optional(),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
});

export const createServiceSchema = z.object({
  serviceType: z.nativeEnum(ServiceType),
  title: z.string().min(5).max(100),
  description: z.string().min(10).max(1000),
  price: z.number().positive(),
  availability: z.record(z.array(z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)-([01]\d|2[0-3]):([0-5]\d)$/))),
});

export const updateServiceSchema = z.object({
  serviceType: z.nativeEnum(ServiceType).optional(),
  title: z.string().min(5).max(100).optional(),
  description: z.string().min(10).max(1000).optional(),
  price: z.number().positive().optional(),
  availability: z.record(z.array(z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)-([01]\d|2[0-3]):([0-5]\d)$/))).optional(),
});

export const createBookingSchema = z.object({
  bookingTime: z.string().datetime(), // ISO datetime string
  notes: z.string().max(500).optional(),
});

export const updateBookingStatusSchema = z.object({
  status: z.nativeEnum(BookingStatus),
});

