/* (Phase 32) Исправлен: стандартизирован ключ localStorage + добавлена отладка */
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'petservice-marketplace-shared-types';
import { authAPI } from '../services/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  // Используем React Query для 'getMe'
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      // Проверяем токен ПЕРЕД запросом (используем СТАНДАРТИЗИРОВАННЫЙ ключ)
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');

        if (!token) {
          throw new Error('No token found');
        }
      }

      const result = await authAPI.getMe();
      return result;
    },
    retry: false, // Don't retry on error
    refetchOnWindowFocus: false,
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('auth_token'), // Only run if token exists
  });

  const isAuthenticated = !!user && !isError;

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
    }

    // Инвалидируем 'me' запрос, что приведет к 'isAuthenticated = false'
    queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
  };

  // Don't show loading if there's no token (query is disabled)
  const isLoadingAuth = typeof window !== 'undefined' && !!localStorage.getItem('auth_token') ? isLoading : false;

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading: isLoadingAuth,
        isAuthenticated,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}