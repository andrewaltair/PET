/* (Phase 27) Эта страница использует 'useLogin' хук */
'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '../../hooks/useAuth';
import { Button } from '../../components/ui/button';
import { LogIn } from 'lucide-react';
import { Input } from '../../components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import { loginSchema, type LoginFormData } from '../../lib/validators/auth';

export default function LoginPage() {
  const loginMutation = useLogin();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'testowner@test.com',
      password: 'password123',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data);
    } catch (err) {
      // Error is already handled by the mutation's onError callback via toast
      // No need to do anything here
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="text-4xl mb-4" aria-hidden="true">🐾</div>
          <h2 id="login-form-title" className="text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 space-y-6"
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
                {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
              </span>
            </Button>

            <div className="text-center">
              <Link
                href="/register"
                className="text-blue-600 hover:text-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm"
              >
                Don't have an account? Sign up
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}