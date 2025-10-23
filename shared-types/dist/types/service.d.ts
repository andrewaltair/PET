import { ServiceType } from '../enums';
export interface MultilingualContent {
    geo?: string;
    eng?: string;
    rus?: string;
}
export interface Service {
    id: string;
    providerId: string;
    serviceType: ServiceType;
    title?: string;
    description?: string;
    titleGeo?: string;
    titleEng?: string;
    titleRus?: string;
    descriptionGeo?: string;
    descriptionEng?: string;
    descriptionRus?: string;
    mainImageUrl?: string;
    subImages?: string[];
    price: number;
    availability: Record<string, string[]>;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateServiceRequest {
    providerId: string;
    serviceType: ServiceType;
    titleGeo?: string;
    titleEng?: string;
    titleRus?: string;
    descriptionGeo?: string;
    descriptionEng?: string;
    descriptionRus?: string;
    mainImageUrl?: string;
    subImages?: string[];
    price: number;
    availability: Record<string, string[]>;
}
export interface UpdateServiceRequest {
    titleGeo?: string;
    titleEng?: string;
    titleRus?: string;
    descriptionGeo?: string;
    descriptionEng?: string;
    descriptionRus?: string;
    mainImageUrl?: string;
    subImages?: string[];
    price?: number;
    availability?: Record<string, string[]>;
}
export interface Booking {
    id: string;
    ownerId: string;
    serviceId: string;
    bookingTime: Date;
    status: import('../enums').BookingStatus;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateBookingRequest {
    ownerId: string;
    serviceId: string;
    bookingTime: Date;
    notes?: string;
}
export interface UpdateBookingRequest {
    bookingTime?: Date;
    status?: import('../enums').BookingStatus;
    notes?: string;
}
