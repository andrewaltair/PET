'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import { LogIn } from 'lucide-react';
import { Input } from '../ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { loginSchema, type LoginFormData } from '../../lib/validators/auth';
import { LoginRequest } from '../../api/auth';

interface LoginFormProps {
  onSuccess?: () => void;
  defaultValues?: Partial<LoginFormData>;
  className?: string;
}

export function LoginForm({ onSuccess, defaultValues, className }: LoginFormProps) {
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
                <FormLabel htmlFor="email">Email address</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    aria-describedby="email-error"
                    {...field}
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
                <FormLabel htmlFor="password">Password</FormLabel>
                <FormControl>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    aria-describedby="password-error"
                    {...field}
                  />
                </FormControl>
                <FormMessage id="password-error" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            variant="default"
            disabled={loginMutation.isPending}
            className="w-full shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 font-semibold"
            aria-describedby={loginMutation.isPending ? "login-loading" : undefined}
          >
            <LogIn className="mr-2 h-5 w-5" aria-hidden="true" />
            <span id={loginMutation.isPending ? "login-loading" : undefined}>
              {loginMutation.isPending ? 'Logging in...' : 'Sign in'}
            </span>
          </Button>
        </form>
      </Form>
    </div>
  );
}

// Export types for external use
export type { LoginFormProps, LoginFormData };
