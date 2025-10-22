// Type-Safe User API Service
// Compatible with useFetchData hook

// User Profile Types
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'pet_owner' | 'service_provider';
  bio: string | null;
  services: string[] | null;
}

// Update User Profile Request - allows partial updates
export interface UpdateUserProfileRequest {
  name?: string;
  bio?: string | null;
  services?: string[] | null;
}

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// Utility function to get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// User API Functions
export const usersAPI = {
  /**
   * Get user profile by ID - GET to /api/users/{userId}
   * @param params - Object containing userId
   * @returns Promise<UserProfile>
   */
  getUserProfile: async (params: { userId: string }): Promise<UserProfile> => {
    const { userId } = params;
    const token = getAuthToken();

    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch user profile' }));
      throw new Error(errorData.message || 'Failed to fetch user profile');
    }

    const data = await response.json();
    return data.data || data;
  },

  /**
   * Update user profile by ID - PATCH to /api/users/{userId}
   * @param params - Object containing userId and updateData
   * @returns Promise<UserProfile>
   */
  updateUserProfile: async (params: { userId: string; updateData: UpdateUserProfileRequest }): Promise<UserProfile> => {
    const { userId, updateData } = params;
    const token = getAuthToken();

    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to update user profile' }));
      throw new Error(errorData.message || 'Failed to update user profile');
    }

    const data = await response.json();
    return data.data || data;
  },
};

// Export individual functions for direct use with useFetchData and useMutateData
export const getUserProfile = usersAPI.getUserProfile;
export const updateUserProfile = usersAPI.updateUserProfile;
