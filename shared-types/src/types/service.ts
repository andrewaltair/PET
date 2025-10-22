import { ServiceType } from '../enums';

export interface Service {
  id: string;
  providerId: string;
  serviceType: ServiceType;
  title: string;
  description: string;
  price: number;
  availability: Record<string, string[]>; // e.g., {"monday": ["09:00-18:00"]}
  createdAt: Date;
  updatedAt: Date;
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
  title?: string;
  description?: string;
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

