import axios from 'axios';
import {
  AuthResponse,
  User,
  LoginRequest,
  CreateUserRequest,
  Profile,
  UpdateProfileRequest,
  Service,
  ServiceWithProvider,
  CreateServiceRequest,
  UpdateServiceRequest,
  PaginatedServicesResponse,
  TopRatedProvider,
  BookingWithDetails,
  CreateBookingRequest,
  UpdateBookingStatusRequest,
  ProviderProfileWithServices,
  ReviewResponse,
  CreateReviewRequest,
  ConversationsResponse,
  ConversationResponse,
  MessagesResponse,
  ApiResponse
} from 'petservice-marketplace-shared-types';

// ЧИТАЕМ ПРАВИЛЬНУЮ ПЕРЕМЕННУЮ NEXT.JS
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ----------------------------------------------------------------------
// Интерсептор для добавления JWT токена (из твоего fullstack.md)
// ----------------------------------------------------------------------
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ----------------------------------------------------------------------
// Интерсептор для обновления токена (из твоего fullstack.md)
// ----------------------------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Проверяем, что это ошибка 401 и мы еще не пытались обновить токен
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
          return Promise.reject(error);
        }

        // Запрос на обновление токена (убедись, что этот эндпоинт есть: POST /api/v1/auth/refresh)
        const { data } = await axios.post<AuthResponse>(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken }
        );

        const { token: newToken, refreshToken: newRefreshToken } = data;
        localStorage.setItem('auth_token', newToken);
        if (newRefreshToken) {
          localStorage.setItem('refresh_token', newRefreshToken);
        }

        // Обновляем заголовок Authorization и повторяем оригинальный запрос
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        console.error('Refresh token failed:', refreshError);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ----------------------------------------------------------------------
// API ЭКСПОРТЫ (восстановлены для хуков)
// ----------------------------------------------------------------------

// Authentication API
export const authAPI = {
  login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return response.data.data!;
  },

  register: async (data: { email: string; password: string; role: string }): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return response.data.data!;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data.data!;
  },
};

// Profile API
export const profileAPI = {
  getMyProfile: async (): Promise<Profile> => {
    const response = await api.get<ApiResponse<Profile>>('/profiles/me');
    return response.data.data!;
  },

  updateMyProfile: async (profileData: UpdateProfileRequest): Promise<Profile> => {
    const response = await api.put<ApiResponse<Profile>>('/profiles/me', profileData);
    return response.data.data!;
  },

  createMyProfile: async (profileData: UpdateProfileRequest): Promise<Profile> => {
    const response = await api.post<ApiResponse<Profile>>('/profiles/me', profileData);
    return response.data.data!;
  },

  getProviderProfile: async (userId: string): Promise<ProviderProfileWithServices> => {
    const response = await api.get<ApiResponse<ProviderProfileWithServices>>(`/profiles/provider/${userId}`);
    return response.data.data!;
  },
};

// Services API
export const servicesAPI = {
  createService: async (serviceData: CreateServiceRequest): Promise<Service> => {
    const response = await api.post<ApiResponse<Service>>('/services', serviceData);
    return response.data.data!;
  },

  getMyServices: async (): Promise<Service[]> => {
    const response = await api.get<ApiResponse<Service[]>>('/services/my');
    return response.data.data!;
  },

  updateService: async (serviceId: string, serviceData: UpdateServiceRequest): Promise<Service> => {
    const response = await api.put<ApiResponse<Service>>(`/services/${serviceId}`, serviceData);
    return response.data.data!;
  },

  deleteService: async (serviceId: string): Promise<void> => {
    await api.delete(`/services/${serviceId}`);
  },

  getServices: async (
    page: number = 1,
    limit: number = 10,
    search?: string,
    serviceType?: string,
    location?: string,
    date?: string
  ): Promise<PaginatedServicesResponse> => {
    const params: Record<string, any> = { page, limit };
    if (search) params.search = search;
    if (serviceType) params.serviceType = serviceType;
    if (location) params.location = location;
    if (date) params.date = date;

    const response = await api.get<ApiResponse<PaginatedServicesResponse>>('/services', {
      params,
    });
    return response.data.data!;
  },

  getTopRatedProviders: async (limit: number = 10): Promise<TopRatedProvider[]> => {
    const response = await api.get<ApiResponse<TopRatedProvider[]>>('/services/top-rated-providers', {
      params: { limit },
    });
    return response.data.data!;
  },

  getService: async (serviceId: string): Promise<ServiceWithProvider> => {
    const response = await api.get<ApiResponse<ServiceWithProvider>>(`/services/${serviceId}`);
    return response.data.data!;
  },
};

// Bookings API
export const bookingsAPI = {
  createBooking: async (serviceId: string, bookingData: CreateBookingRequest): Promise<{ booking: BookingWithDetails }> => {
    const response = await api.post<ApiResponse<{ booking: BookingWithDetails }>>(`/bookings/service/${serviceId}`, bookingData);
    return response.data.data!;
  },

  getMyBookingsAsOwner: async (): Promise<{ bookings: BookingWithDetails[] }> => {
    const response = await api.get<ApiResponse<{ bookings: BookingWithDetails[] }>>('/bookings/my-as-owner');
    return response.data.data!;
  },

  getMyBookingsAsProvider: async (): Promise<{ bookings: BookingWithDetails[] }> => {
    const response = await api.get<ApiResponse<{ bookings: BookingWithDetails[] }>>('/bookings/my-as-provider');
    return response.data.data!;
  },

  updateBookingStatus: async (bookingId: string, statusUpdate: UpdateBookingStatusRequest): Promise<{ booking: BookingWithDetails }> => {
    const response = await api.put<ApiResponse<{ booking: BookingWithDetails }>>(`/bookings/${bookingId}/status`, statusUpdate);
    return response.data.data!;
  },
};

// Reviews API
export const reviewsAPI = {
  createReview: async (bookingId: string, reviewData: CreateReviewRequest): Promise<ReviewResponse> => {
    const response = await api.post<ApiResponse<ReviewResponse>>(`/reviews/booking/${bookingId}`, reviewData);
    return response.data.data!;
  },

  getServiceReviews: async (serviceId: string): Promise<ReviewResponse[]> => {
    const response = await api.get<ApiResponse<ReviewResponse[]>>(`/reviews/service/${serviceId}`);
    return response.data.data!;
  },

  getProviderReviews: async (providerId: string): Promise<ReviewResponse[]> => {
    const response = await api.get<ApiResponse<ReviewResponse[]>>(`/reviews/provider/${providerId}`);
    return response.data.data!;
  },

  canReviewBooking: async (bookingId: string): Promise<{ canReview: boolean }> => {
    const response = await api.get<ApiResponse<{ canReview: boolean }>>(`/reviews/booking/${bookingId}/can-review`);
    return response.data.data!;
  },
};

// Conversations API
export const conversationsAPI = {
  getConversations: async (): Promise<ConversationsResponse> => {
    const response = await api.get<ApiResponse<ConversationsResponse>>('/conversations');
    return response.data.data!;
  },

  createConversationWithProvider: async (providerId: string): Promise<ConversationResponse> => {
    const response = await api.post<ApiResponse<ConversationResponse>>(`/conversations/provider/${providerId}`);
    return response.data.data!;
  },

  getConversationMessages: async (conversationId: string): Promise<MessagesResponse> => {
    const response = await api.get<ApiResponse<MessagesResponse>>(`/conversations/${conversationId}/messages`);
    return response.data.data!;
  },
};

// Admin API
export const adminAPI = {
  getAnalytics: async () => {
    const response = await api.get<ApiResponse<any>>('/admin/analytics');
    return response.data.data!;
  },

  getChartData: async (days: number = 30) => {
    const response = await api.get<ApiResponse<any>>('/admin/analytics/charts', {
      params: { days },
    });
    return response.data.data!;
  },

  getAllUsers: async (page: number = 1, limit: number = 20) => {
    const response = await api.get<ApiResponse<any>>('/admin/users', {
      params: { page, limit },
    });
    return response.data.data!;
  },

  updateUserRole: async (userId: string, role: string) => {
    const response = await api.put<ApiResponse<any>>(`/admin/users/${userId}/role`, { role });
    return response.data.data!;
  },

  deleteUser: async (userId: string) => {
    await api.delete(`/admin/users/${userId}`);
  },

  getPendingVerifications: async () => {
    const response = await api.get<ApiResponse<any>>('/admin/verifications/pending');
    return response.data.data!;
  },

  getAllServices: async (page: number = 1, limit: number = 20) => {
    const response = await api.get<ApiResponse<any>>('/admin/services', {
      params: { page, limit },
    });
    return response.data.data!;
  },

  getAllBookings: async (page: number = 1, limit: number = 20) => {
    const response = await api.get<ApiResponse<any>>('/admin/bookings', {
      params: { page, limit },
    });
    return response.data.data!;
  },
};

// Export the main api instance for direct usage (like in useStripe.ts)
export { api };

export default api;
