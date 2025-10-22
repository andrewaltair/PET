export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface ProviderProfileWithServices {
  profile: import('./user').Profile;
  services: import('./user').ServiceWithProvider[];
}

export interface ReviewResponse {
  id: string;
  bookingId: string;
  serviceId: string;
  ownerId: string;
  providerId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  owner: {
    id: string;
    firstName?: string;
    lastName?: string;
  };
  service: {
    id: string;
    title: string;
  };
}

