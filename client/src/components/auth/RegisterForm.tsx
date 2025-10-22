'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutateData } from '../../hooks/useMutateData';
import { authAPI } from '../../api/auth';
import { Button } from '../ui/button';
import { UserPlus } from 'lucide-react';
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

interface RegisterFormProps {
  onSuccess?: () => void;
  defaultValues?: Partial<RegisterFormData>;
  className?: string;
}

export function RegisterForm({ onSuccess, defaultValues, className }: RegisterFormProps) {
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
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerMutation.mutateAsync(data as RegisterRequest);
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
                <FormLabel htmlFor="name">Full Name</FormLabel>
                <FormControl>
                  <Input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    aria-describedby="name-error"
                    {...field}
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
                    autoComplete="new-password"
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
            disabled={registerMutation.isPending}
            className="w-full shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 font-semibold"
            aria-describedby={registerMutation.isPending ? "register-loading" : undefined}
          >
            <UserPlus className="mr-2 h-5 w-5" aria-hidden="true" />
            <span id={registerMutation.isPending ? "register-loading" : undefined}>
              {registerMutation.isPending ? 'Registering...' : 'Sign up'}
            </span>
          </Button>
        </form>
      </Form>
    </div>
  );
}

// Export types for external use
export type { RegisterFormProps, RegisterFormData };
