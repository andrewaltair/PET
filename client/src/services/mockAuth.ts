// Mock authentication for demo purposes
import { User, AuthResponse, UserRole } from 'petservice-marketplace-shared-types';

const MOCK_USERS = [
  {
    id: 'admin-1',
    email: 'admin@example.com',
    role: UserRole.OWNER,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'user-1',
    email: 'user@example.com',
    role: UserRole.OWNER,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'provider-1',
    email: 'provider@example.com',
    role: UserRole.PROVIDER,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockAuthAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = MOCK_USERS.find(u => u.email === email);
    if (!user) {
      throw new Error('User not found');
    }

    // Simple password check for demo
    const validPasswords = ['admin', 'user', 'provider'];
    if (!validPasswords.includes(password)) {
      throw new Error('Invalid password');
    }

    const token = `mock-jwt-token-${user.id.replace('-', '-')}-${Date.now()}`;
    const refreshToken = `mock-refresh-token-${user.id.replace('-', '-')}-${Date.now()}`;

    return {
      user,
      token,
      refreshToken,
    };
  },

  register: async (email: string, password: string, role: UserRole): Promise<AuthResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user already exists
    if (MOCK_USERS.find(u => u.email === email)) {
      throw new Error('User already exists');
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    MOCK_USERS.push(newUser);

    const token = `mock-jwt-token-${newUser.id}-${Date.now()}`;
    const refreshToken = `mock-refresh-token-${newUser.id}-${Date.now()}`;

    return {
      user: newUser,
      token,
      refreshToken,
    };
  },

  getMe: async (): Promise<User> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const token = localStorage.getItem('auth_token');
    if (!token || !token.startsWith('mock-jwt-token-')) {
      throw new Error('Invalid token');
    }

    const userId = token.split('-')[3];
    const user = MOCK_USERS.find(u => u.id === userId);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  },

  refreshToken: async (refreshToken: string) => {
    // Simulate token refresh
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!refreshToken || !refreshToken.startsWith('mock-refresh-token-')) {
      throw new Error('Invalid refresh token');
    }

    const userId = refreshToken.split('-')[3];
    const user = MOCK_USERS.find(u => u.id === userId);

    if (!user) {
      throw new Error('User not found');
    }

    const newToken = `mock-jwt-token-${user.id}-${Date.now()}`;

    return { token: newToken };
  },
};
