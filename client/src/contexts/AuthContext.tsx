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
      console.log('[AuthContext DEBUG] Starting getMe query');

      // Проверяем токен ПЕРЕД запросом (используем СТАНДАРТИЗИРОВАННЫЙ ключ)
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        console.log('[AuthContext DEBUG] Token from localStorage:', token ? 'found' : 'NOT FOUND');

        if (!token) {
          console.log('[AuthContext DEBUG] No token found, throwing error');
          throw new Error('No token found');
        }

        console.log('[AuthContext DEBUG] Token exists, calling authAPI.getMe()');
      }

      const result = await authAPI.getMe();
      return result;
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });

  console.log('[AuthContext DEBUG] Query state - user:', user, 'isLoading:', isLoading, 'isError:', isError);

  const isAuthenticated = !!user && !isError;
  console.log('[AuthContext DEBUG] isAuthenticated calculated as:', isAuthenticated);

  const logout = () => {
    console.log('[AuthContext DEBUG] logout() called');

    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      console.log('[AuthContext DEBUG] Tokens removed from localStorage');
    }

    // Инвалидируем 'me' запрос, что приведет к 'isAuthenticated = false'
    queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    console.log('[AuthContext DEBUG] Query cache invalidated');
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
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