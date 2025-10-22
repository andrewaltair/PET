import { UserRole, ServiceType, BookingStatus, PaymentStatus } from '../enums';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithPassword extends User {
  passwordHash: string;
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
  bio?: string; // Only for PROVIDER
  location?: string; // Only for PROVIDER
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
}

export interface Service {
  id: string;
  providerId: string;
  serviceType: ServiceType;
  title: string;
  description: string;
  price: number;
  availability: Record<string, string[]>; // JSONB field: {"monday": ["09:00-18:00"], "tuesday": ["10:00-17:00"]}
  createdAt: Date;
  updatedAt: Date;
  provider?: User; // Populated when needed
}

export interface ServiceWithProvider extends Service {
  provider: User;
}

export interface CreateServiceRequest {
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

