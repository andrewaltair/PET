// Type-Safe Authentication API Service
// Compatible with useMutateData hook

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  name: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// Authentication API Functions
export const authAPI = {
  /**
   * Login function - POST to /api/auth/login
   * @param credentials - Login credentials
   * @returns Promise<AuthResponse>
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    return data.data || data;
  },

  /**
   * Register function - POST to /api/auth/register
   * @param data - Registration data
   * @returns Promise<AuthResponse>
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Registration failed' }));
      throw new Error(errorData.message || 'Registration failed');
    }

    const responseData = await response.json();
    return responseData.data || responseData;
  },
};

// Export individual functions for direct use with useMutateData
export const login = authAPI.login;
export const register = authAPI.register;
