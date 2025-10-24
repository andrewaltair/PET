/* (Phase 32) Исправлен: стандартизированы ключи localStorage + добавлена отладка */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '../services/api';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const t = useTranslations('auth');

  return useMutation({
    mutationFn: authAPI.register,
    onSuccess: (data) => {
      console.log('[useRegister DEBUG] onSuccess called with data:', data);

      // Сохраняем токены (используем СТАНДАРТИЗИРОВАННЫЕ ключи)
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('refresh_token', data.refreshToken);

      console.log('[useRegister DEBUG] Tokens saved to localStorage');
      console.log('[useRegister DEBUG] auth_token:', localStorage.getItem('auth_token'));
      console.log('[useRegister DEBUG] refresh_token:', localStorage.getItem('refresh_token'));

      // Обновляем 'me' запрос
      queryClient.setQueryData(['auth', 'me'], data.user);
      console.log('[useRegister DEBUG] queryClient updated with user:', data.user);

      toast({ title: t('loginSuccess'), description: t('loginSuccessDesc') });

      console.log('[useRegister DEBUG] About to redirect to /dashboard');
      router.push('/dashboard');
    },
    onError: (error: any) => {
      console.error('[useRegister DEBUG] onError called with error:', error);
      const errorMessage = error?.response?.data?.error || 'Registration failed.';
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const t = useTranslations('auth');

  return useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      console.log('[useLogin DEBUG] onSuccess called with data:', data);

      // Сохраняем токены (используем СТАНДАРТИЗИРОВАННЫЕ ключи)
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('refresh_token', data.refreshToken);

      console.log('[useLogin DEBUG] Tokens saved to localStorage');
      console.log('[useLogin DEBUG] auth_token:', localStorage.getItem('auth_token'));
      console.log('[useLogin DEBUG] refresh_token:', localStorage.getItem('refresh_token'));

      // Обновляем 'me' запрос
      queryClient.setQueryData(['auth', 'me'], data.user);
      console.log('[useLogin DEBUG] queryClient updated with user:', data.user);

      toast({ title: t('loginSuccess'), description: t('loginSuccessDesc') });

      console.log('[useLogin DEBUG] About to redirect to /dashboard');
      router.push('/dashboard');
    },
    onError: (error: any) => {
      console.error('[useLogin DEBUG] onError called with error:', error);
      const errorMessage = error?.response?.data?.error || 'Login failed.';
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
    },
  });
}