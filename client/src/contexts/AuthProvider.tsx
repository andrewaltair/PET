'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { AuthResponse } from '../api/auth';

// Define the shape of our authentication context
interface AuthContextType {
  user: AuthResponse['user'] | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (authData: AuthResponse) => void;
  logout: () => void;
}

// Create the context with undefined as default (will be checked in useAuth hook)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component that manages authentication state
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // State for user and token
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Derived state for authentication status
  const isAuthenticated = user !== null;

  // Login function - accepts AuthResponse and updates state + localStorage
  const login = (authData: AuthResponse) => {
    setUser(authData.user);
    setToken(authData.token);

    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', authData.token);
    }
  };

  // Logout function - clears state and localStorage
  const logout = () => {
    setUser(null);
    setToken(null);

    // Remove from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  };

  // useEffect to check localStorage on mount and restore session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        // If token exists, you might want to validate it with the server
        // For now, we'll just restore the token (user validation can be added later)
        setToken(storedToken);
        // Note: In a real app, you'd typically validate the token with an API call
        // and restore the user object. For this implementation, we're keeping it simple.
      }
    }
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo<AuthContextType>(() => ({
    user,
    token,
    isAuthenticated,
    login,
    logout,
  }), [user, token, isAuthenticated]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
