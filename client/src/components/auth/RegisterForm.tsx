'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useMutateData } from '../../hooks/useMutateData';
import { authAPI } from '../../api/auth';
import { Button } from '../ui/button';
import { UserPlus, User, Mail, Lock } from 'lucide-react';
import { Input } from '../ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { registerFormSchema, type RegisterFormData } from '../../lib/validators/auth';
import { RegisterRequest } from '../../api/auth';
import { toast } from '@/hooks/use-toast';
import { SocialAuthButton } from './SocialAuthButton';
import { UserRole } from 'petservice-marketplace-shared-types';

interface RegisterFormProps {
  onSuccess?: () => void;
  defaultValues?: Partial<RegisterFormData>;
  className?: string;
}

export function RegisterForm({ onSuccess, defaultValues, className }: RegisterFormProps) {
  const t = useTranslations('register');
  const tAuth = useTranslations('auth');
  const registerMutation = useMutateData(authAPI.register, {
    onSuccess: (data) => {
      toast({ title: 'Registration Successful!', description: 'Welcome!' });
      onSuccess?.();
      console.log('Registration Successful: redirecting');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error || error?.message || 'Registration failed.';
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
    },
  });

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      email: defaultValues?.email || '',
      password: defaultValues?.password || '',
      confirmPassword: '',
      role: UserRole.OWNER,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const { confirmPassword, ...registerData } = data;
      await registerMutation.mutateAsync(registerData as RegisterRequest);
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
          aria-labelledby="register-form-title"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="name">{t('fullName')}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder={t('fullNamePlaceholder')}
                    aria-describedby="name-error"
                    leftIcon={<User className="h-4 w-4" />}
                  />
                </FormControl>
                <FormMessage id="name-error" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="email">{t('emailLabel')}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder={t('emailPlaceholder')}
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
                <FormLabel htmlFor="password">{t('passwordLabel')}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder={t('passwordPlaceholder')}
                    aria-describedby="password-error"
                    leftIcon={<Lock className="h-4 w-4" />}
                  />
                </FormControl>
                <FormMessage id="password-error" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="confirmPassword">{t('confirmPasswordLabel')}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder={t('confirmPasswordPlaceholder')}
                    aria-describedby="confirmPassword-error"
                    leftIcon={<Lock className="h-4 w-4" />}
                  />
                </FormControl>
                <FormMessage id="confirmPassword-error" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 font-semibold"
            aria-describedby={registerMutation.isPending ? "register-loading" : undefined}
          >
            <UserPlus className="mr-2 h-5 w-5" aria-hidden="true" />
            <span id={registerMutation.isPending ? "register-loading" : undefined}>
              {registerMutation.isPending ? t('registering') : t('signUp')}
            </span>
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {tAuth('orContinueWith')}
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
export type { RegisterFormProps, RegisterFormData };
