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
  // Legacy fields (for backward compatibility)
  title?: string;
  description?: string;
  // Multilingual fields
  titleGeo?: string;
  titleEng?: string;
  titleRus?: string;
  descriptionGeo?: string;
  descriptionEng?: string;
  descriptionRus?: string;
  // Images
  mainImageUrl?: string;
  subImages?: string[]; // Array of image URLs (max 10)
  price: number;
  availability: Record<string, string[]>; // e.g., {"monday": ["09:00-18:00"]}
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateServiceRequest {
  providerId: string;
  serviceType: ServiceType;
  // Multilingual fields - at least one language must be provided
  titleGeo?: string;
  titleEng?: string;
  titleRus?: string;
  descriptionGeo?: string;
  descriptionEng?: string;
  descriptionRus?: string;
  // Images
  mainImageUrl?: string;
  subImages?: string[]; // Array of image URLs (max 10)
  price: number;
  availability: Record<string, string[]>;
}

export interface UpdateServiceRequest {
  // Multilingual fields
  titleGeo?: string;
  titleEng?: string;
  titleRus?: string;
  descriptionGeo?: string;
  descriptionEng?: string;
  descriptionRus?: string;
  // Images
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

