'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useLogin } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import { LogIn, Mail, Lock } from 'lucide-react';
import { Input } from '../ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '../ui/form';
import { loginSchema, type LoginFormData } from '../../lib/validators/auth';
import { LoginRequest } from '../../api/auth';
import { SocialAuthButton } from './SocialAuthButton';

interface LoginFormProps {
  onSuccess?: () => void;
  defaultValues?: Partial<LoginFormData>;
  className?: string;
}

export function LoginForm({ onSuccess, defaultValues, className }: LoginFormProps) {
  const t = useTranslations('auth');
  const loginMutation = useLogin();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: defaultValues?.email || '',
      password: defaultValues?.password || '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data);
      // Call onSuccess callback if provided (e.g., for additional redirect logic)
      onSuccess?.();
      console.log('Login Successful: redirecting');
    } catch (err) {
      // Error is already handled by the mutation's onError callback via toast
      // No need to do anything here
    }
  };

  return (
    <div className={className}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
          role="form"
          aria-labelledby="login-form-title"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="email">{t('emailAddress')}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder={t('enterYourEmail')}
                    aria-describedby="email-error"
                    leftIcon={<Mail className="h-4 w-4" />}
                  />
                </FormControl>
                <FormMessage id="email-error" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="password">{t('password')}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder={t('enterYourPassword')}
                    aria-describedby="password-error"
                    leftIcon={<Lock className="h-4 w-4" />}
                  />
                </FormControl>
                <FormDescription>
                  {t('usePasswordAssociated')}
                </FormDescription>
                <FormMessage id="password-error" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 font-semibold"
            aria-describedby={loginMutation.isPending ? "login-loading" : undefined}
          >
            <LogIn className="mr-2 h-5 w-5" aria-hidden="true" />
            <span id={loginMutation.isPending ? "login-loading" : undefined}>
              {loginMutation.isPending ? t('loggingIn') : t('signIn')}
            </span>
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t('orContinueWith')}
              </span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-1 gap-3">
            <SocialAuthButton provider="google" onSuccess={onSuccess} />
            <SocialAuthButton provider="facebook" onSuccess={onSuccess} />
            <SocialAuthButton provider="instagram" onSuccess={onSuccess} />
          </div>
        </form>
      </Form>
    </div>
  );
}

// Export types for external use
export type { LoginFormProps, LoginFormData };
