import { z } from 'zod';
import { ServiceType, BookingStatus } from '../enums';
export declare const createServiceSchema: z.ZodObject<{
    providerId: z.ZodString;
    serviceType: z.ZodNativeEnum<typeof ServiceType>;
    title: z.ZodString;
    description: z.ZodString;
    price: z.ZodNumber;
    availability: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    serviceType: ServiceType;
    title: string;
    description: string;
    price: number;
    availability: Record<string, string[]>;
    providerId: string;
}, {
    serviceType: ServiceType;
    title: string;
    description: string;
    price: number;
    availability: Record<string, string[]>;
    providerId: string;
}>;
export declare const updateServiceSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodNumber>;
    availability: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString, "many">>>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    description?: string | undefined;
    price?: number | undefined;
    availability?: Record<string, string[]> | undefined;
}, {
    title?: string | undefined;
    description?: string | undefined;
    price?: number | undefined;
    availability?: Record<string, string[]> | undefined;
}>;
export declare const createBookingSchema: z.ZodObject<{
    ownerId: z.ZodString;
    serviceId: z.ZodString;
    bookingTime: z.ZodDate;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    bookingTime: Date;
    ownerId: string;
    serviceId: string;
    notes?: string | undefined;
}, {
    bookingTime: Date;
    ownerId: string;
    serviceId: string;
    notes?: string | undefined;
}>;
export declare const updateBookingSchema: z.ZodObject<{
    bookingTime: z.ZodOptional<z.ZodDate>;
    status: z.ZodOptional<z.ZodNativeEnum<typeof BookingStatus>>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status?: BookingStatus | undefined;
    bookingTime?: Date | undefined;
    notes?: string | undefined;
}, {
    status?: BookingStatus | undefined;
    bookingTime?: Date | undefined;
    notes?: string | undefined;
}>;
