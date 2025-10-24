import { z } from 'zod';
import { UserRole, ServiceType, BookingStatus } from '../enums';
export declare const createUserSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodNativeEnum<typeof UserRole>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    role: UserRole;
}, {
    email: string;
    password: string;
    role: UserRole;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const createProfileSchema: z.ZodObject<{
    userId: z.ZodString;
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    avatarUrl: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    userId: string;
    firstName?: string | undefined;
    lastName?: string | undefined;
    avatarUrl?: string | undefined;
    bio?: string | undefined;
    location?: string | undefined;
}, {
    userId: string;
    firstName?: string | undefined;
    lastName?: string | undefined;
    avatarUrl?: string | undefined;
    bio?: string | undefined;
    location?: string | undefined;
}>;
export declare const updateProfileSchema: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    avatarUrl: z.ZodOptional<z.ZodString>;
    bio: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    facebookUrl: z.ZodOptional<z.ZodString>;
    instagramUrl: z.ZodOptional<z.ZodString>;
    tiktokUrl: z.ZodOptional<z.ZodString>;
    telegramUrl: z.ZodOptional<z.ZodString>;
    whatsappUrl: z.ZodOptional<z.ZodString>;
    viberUrl: z.ZodOptional<z.ZodString>;
    animalTypes: z.ZodOptional<z.ZodEnum<["DOGS_ONLY", "ALL_ANIMALS"]>>;
    servicesProvided: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    firstName?: string | undefined;
    lastName?: string | undefined;
    avatarUrl?: string | undefined;
    bio?: string | undefined;
    location?: string | undefined;
    address?: string | undefined;
    phone?: string | undefined;
    facebookUrl?: string | undefined;
    instagramUrl?: string | undefined;
    tiktokUrl?: string | undefined;
    telegramUrl?: string | undefined;
    whatsappUrl?: string | undefined;
    viberUrl?: string | undefined;
    animalTypes?: "DOGS_ONLY" | "ALL_ANIMALS" | undefined;
    servicesProvided?: string[] | undefined;
}, {
    firstName?: string | undefined;
    lastName?: string | undefined;
    avatarUrl?: string | undefined;
    bio?: string | undefined;
    location?: string | undefined;
    address?: string | undefined;
    phone?: string | undefined;
    facebookUrl?: string | undefined;
    instagramUrl?: string | undefined;
    tiktokUrl?: string | undefined;
    telegramUrl?: string | undefined;
    whatsappUrl?: string | undefined;
    viberUrl?: string | undefined;
    animalTypes?: "DOGS_ONLY" | "ALL_ANIMALS" | undefined;
    servicesProvided?: string[] | undefined;
}>;
export declare const createServiceSchema: z.ZodObject<{
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
}, {
    serviceType: ServiceType;
    title: string;
    description: string;
    price: number;
    availability: Record<string, string[]>;
}>;
export declare const updateServiceSchema: z.ZodObject<{
    serviceType: z.ZodOptional<z.ZodNativeEnum<typeof ServiceType>>;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodNumber>;
    availability: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString, "many">>>;
}, "strip", z.ZodTypeAny, {
    serviceType?: ServiceType | undefined;
    title?: string | undefined;
    description?: string | undefined;
    price?: number | undefined;
    availability?: Record<string, string[]> | undefined;
}, {
    serviceType?: ServiceType | undefined;
    title?: string | undefined;
    description?: string | undefined;
    price?: number | undefined;
    availability?: Record<string, string[]> | undefined;
}>;
export declare const createBookingSchema: z.ZodObject<{
    bookingTime: z.ZodString;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    bookingTime: string;
    notes?: string | undefined;
}, {
    bookingTime: string;
    notes?: string | undefined;
}>;
export declare const updateBookingStatusSchema: z.ZodObject<{
    status: z.ZodNativeEnum<typeof BookingStatus>;
}, "strip", z.ZodTypeAny, {
    status: BookingStatus;
}, {
    status: BookingStatus;
}>;
