import { UserRole, ServiceType, BookingStatus, PaymentStatus } from '../enums';
export interface User {
    id: string;
    email: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    password?: string;
    oauthProvider?: string;
    oauthId?: string;
    pets?: Pet[];
    veterinarians?: Veterinarian[];
    certifications?: Certification[];
}
export interface UserWithPassword extends User {
    passwordHash: string;
}
export interface UserWithProfile extends User {
    firstName?: string;
    lastName?: string;
    location?: string;
    avatarUrl?: string;
    bio?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    twitterUrl?: string;
    linkedinUrl?: string;
}
export interface CreateUserRequest {
    email: string;
    password: string;
    role: UserRole;
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface AuthResponse {
    user: User;
    token: string;
    refreshToken: string;
}
export interface Profile {
    id: string;
    userId: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    bio?: string;
    location?: string;
    address?: string;
    phone?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    tiktokUrl?: string;
    telegramUrl?: string;
    whatsappUrl?: string;
    viberUrl?: string;
    telegramUsername?: string;
    whatsappNumber?: string;
    viberNumber?: string;
    animalTypes?: 'DOGS_ONLY' | 'ALL_ANIMALS';
    servicesProvided?: string[];
    overallAverageRating: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateProfileRequest {
    userId: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    bio?: string;
    location?: string;
}
export interface UpdateProfileRequest {
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    bio?: string;
    location?: string;
    address?: string;
    phone?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    tiktokUrl?: string;
    telegramUrl?: string;
    whatsappUrl?: string;
    viberUrl?: string;
    telegramUsername?: string;
    whatsappNumber?: string;
    viberNumber?: string;
    animalTypes?: 'DOGS_ONLY' | 'ALL_ANIMALS';
    servicesProvided?: string[];
}
export interface Service {
    id: string;
    providerId: string;
    serviceType: ServiceType;
    title: string;
    description: string;
    price: number;
    imageUrl?: string;
    availability: Record<string, string[]>;
    createdAt: Date;
    updatedAt: Date;
    provider?: User;
}
export interface ServiceWithProvider extends Service {
    provider: UserWithProfile;
}
export interface CreateServiceRequest {
    providerId: string;
    serviceType: ServiceType;
    title: string;
    description: string;
    price: number;
    availability: Record<string, string[]>;
}
export interface UpdateServiceRequest {
    serviceType?: ServiceType;
    title?: string;
    description?: string;
    price?: number;
    availability?: Record<string, string[]>;
}
export interface PaginatedServicesResponse {
    data: ServiceWithProvider[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export interface Booking {
    id: string;
    ownerId: string;
    serviceId: string;
    bookingTime: Date;
    status: BookingStatus;
    paymentIntentId?: string;
    paymentStatus: PaymentStatus;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    owner?: User;
    service?: ServiceWithProvider;
}
export interface BookingWithDetails extends Booking {
    owner: User;
    service: ServiceWithProvider;
}
export interface CreateBookingRequest {
    bookingTime: Date;
    notes?: string;
}
export interface UpdateBookingStatusRequest {
    status: BookingStatus;
}
export interface BookingResponse {
    booking: BookingWithDetails;
}
export interface ProviderStats {
    averageRating: number;
    totalReviews: number;
    serviceCount: number;
    overallServiceRating: number;
}
export interface TopRatedProvider {
    id: string;
    email: string;
    role: UserRole;
    profile: {
        id: string;
        firstName?: string;
        lastName?: string;
        avatarUrl?: string;
        bio?: string;
        location?: string;
        overallAverageRating: number;
    } | null;
    stats: ProviderStats;
}
export interface Pet {
    id: string;
    ownerId: string;
    name: string;
    petType: string;
    breed?: string;
    age?: number;
    weight?: number;
    medicalNotes?: string;
    photoUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreatePetRequest {
    name: string;
    petType: string;
    breed?: string;
    age?: number;
    weight?: number;
    medicalNotes?: string;
    photoUrl?: string;
}
export interface UpdatePetRequest {
    name?: string;
    petType?: string;
    breed?: string;
    age?: number;
    weight?: number;
    medicalNotes?: string;
    photoUrl?: string;
}
export interface Availability {
    id: string;
    providerId: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateAvailabilityRequest {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    isAvailable?: boolean;
}
export interface UpdateAvailabilityRequest {
    dayOfWeek?: string;
    startTime?: string;
    endTime?: string;
    isAvailable?: boolean;
}
export interface Certification {
    id: string;
    providerId: string;
    title: string;
    issuer: string;
    issueDate: Date;
    expiryDate?: Date;
    certificateUrl?: string;
    verified: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateCertificationRequest {
    title: string;
    issuer: string;
    issueDate: Date;
    expiryDate?: Date;
    certificateUrl?: string;
}
export interface UpdateCertificationRequest {
    title?: string;
    issuer?: string;
    issueDate?: Date;
    expiryDate?: Date;
    certificateUrl?: string;
    verified?: boolean;
}
export interface Veterinarian {
    id: string;
    ownerId: string;
    name: string;
    clinicName?: string;
    phone?: string;
    email?: string;
    address?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateVeterinarianRequest {
    name: string;
    clinicName?: string;
    phone?: string;
    email?: string;
    address?: string;
    notes?: string;
}
export interface UpdateVeterinarianRequest {
    name?: string;
    clinicName?: string;
    phone?: string;
    email?: string;
    address?: string;
    notes?: string;
}
