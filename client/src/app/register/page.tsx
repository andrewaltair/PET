'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../contexts/AuthContext';
import { useRegister } from '../../hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { UserRole } from 'petservice-marketplace-shared-types';
import { Button } from '../../components/ui/button';
import { UserPlus, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Input } from '../../components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { registerSchema, type RegisterFormData } from '../../lib/validators/auth';

export default function RegisterPage() {
  const { logout } = useAuth();
  const registerMutation = useRegister();
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      role: UserRole.OWNER,
    },
    mode: 'onChange', // Enable real-time validation
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  // Helper function to get field validation state
  const getFieldState = (fieldName: string) => {
    const fieldState = form.getFieldState(fieldName);
    const isTouched = touchedFields.has(fieldName);
    const hasError = fieldState.error;
    const hasValue = form.getValues(fieldName as keyof RegisterFormData);

    if (!isTouched || !hasValue) return 'default';
    if (hasError) return 'error';
    return 'success';
  };

  // Handle field touch
  const handleFieldTouch = (fieldName: string) => {
    setTouchedFields(prev => new Set(prev).add(fieldName));
  };

  // Get role from URL params
  useEffect(() => {
    const urlRole = searchParams.get('role');
    if (urlRole && (urlRole === UserRole.OWNER || urlRole === UserRole.PROVIDER)) {
      form.setValue('role', urlRole);
    }
  }, [searchParams, form]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerMutation.mutateAsync(data);
      // On successful registration, invalidate the 'me' query to refresh auth state
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      router.push('/dashboard');
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
          <h2 id="register-form-title" className="text-3xl font-bold text-gray-900">Join PetService</h2>
          <p className="mt-2 text-gray-600">Create your account</p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 space-y-6"
            role="form"
            aria-labelledby="register-form-title"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => {
                const fieldState = getFieldState('email');
                return (
                  <FormItem>
                    <FormLabel htmlFor="email" className="flex items-center gap-2">
                      Email address
                      {fieldState === 'success' && (
                        <CheckCircle className="w-4 h-4 text-green-600" aria-hidden="true" />
                      )}
                      {fieldState === 'error' && (
                        <XCircle className="w-4 h-4 text-red-600" aria-hidden="true" />
                      )}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          autoComplete="email"
                          placeholder="Enter your email"
                          aria-describedby="email-error"
                          className={`pr-10 ${
                            fieldState === 'success'
                              ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                              : fieldState === 'error'
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                              : ''
                          }`}
                          onBlur={() => handleFieldTouch('email')}
                          {...field}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          {fieldState === 'success' && (
                            <CheckCircle className="w-5 h-5 text-green-600" aria-hidden="true" />
                          )}
                          {fieldState === 'error' && (
                            <XCircle className="w-5 h-5 text-red-600" aria-hidden="true" />
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage id="email-error" />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="role">I am a</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger id="role" aria-describedby="role-error">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={UserRole.OWNER}>Pet Owner</SelectItem>
                      <SelectItem value={UserRole.PROVIDER}>Service Provider</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage id="role-error" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => {
                const fieldState = getFieldState('password');
                const passwordValue = field.value || '';
                const hasMinLength = passwordValue.length >= 8;
                const hasUppercase = /[A-Z]/.test(passwordValue);
                const hasLowercase = /[a-z]/.test(passwordValue);
                const hasNumber = /\d/.test(passwordValue);
                const strengthScore = [hasMinLength, hasUppercase, hasLowercase, hasNumber].filter(Boolean).length;

                return (
                  <FormItem>
                    <FormLabel htmlFor="password" className="flex items-center gap-2">
                      Password
                      {fieldState === 'success' && (
                        <CheckCircle className="w-4 h-4 text-green-600" aria-hidden="true" />
                      )}
                      {fieldState === 'error' && (
                        <XCircle className="w-4 h-4 text-red-600" aria-hidden="true" />
                      )}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="password"
                          type="password"
                          autoComplete="new-password"
                          placeholder="Create a password"
                          aria-describedby="password-error password-strength"
                          className={`pr-10 ${
                            fieldState === 'success'
                              ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                              : fieldState === 'error'
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                              : ''
                          }`}
                          onBlur={() => handleFieldTouch('password')}
                          {...field}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          {fieldState === 'success' && (
                            <CheckCircle className="w-5 h-5 text-green-600" aria-hidden="true" />
                          )}
                          {fieldState === 'error' && (
                            <XCircle className="w-5 h-5 text-red-600" aria-hidden="true" />
                          )}
                        </div>
                      </div>
                    </FormControl>

                    {/* Password Strength Indicator */}
                    {passwordValue && (
                      <div id="password-strength" className="mt-2">
                        <div className="flex gap-1 mb-1">
                          {[1, 2, 3, 4].map((level) => (
                            <div
                              key={level}
                              className={`h-1 flex-1 rounded-full ${
                                level <= strengthScore
                                  ? strengthScore === 1
                                    ? 'bg-red-500'
                                    : strengthScore === 2
                                    ? 'bg-yellow-500'
                                    : strengthScore === 3
                                    ? 'bg-blue-500'
                                    : 'bg-green-500'
                                  : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-600">
                          Password strength: {
                            strengthScore === 0 ? 'Very weak' :
                            strengthScore === 1 ? 'Weak' :
                            strengthScore === 2 ? 'Fair' :
                            strengthScore === 3 ? 'Good' :
                            'Strong'
                          }
                        </p>
                      </div>
                    )}

                    <FormMessage id="password-error" />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => {
                const fieldState = getFieldState('confirmPassword');
                const password = form.getValues('password');
                const confirmPassword = field.value;
                const passwordsMatch = password && confirmPassword && password === confirmPassword;

                return (
                  <FormItem>
                    <FormLabel htmlFor="confirmPassword" className="flex items-center gap-2">
                      Confirm Password
                      {fieldState === 'success' && passwordsMatch && (
                        <CheckCircle className="w-4 h-4 text-green-600" aria-hidden="true" />
                      )}
                      {fieldState === 'error' && (
                        <XCircle className="w-4 h-4 text-red-600" aria-hidden="true" />
                      )}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type="password"
                          autoComplete="new-password"
                          placeholder="Confirm your password"
                          aria-describedby="confirmPassword-error confirmPassword-match"
                          className={`pr-10 ${
                            fieldState === 'success' && passwordsMatch
                              ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                              : fieldState === 'error'
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                              : ''
                          }`}
                          onBlur={() => handleFieldTouch('confirmPassword')}
                          {...field}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          {fieldState === 'success' && passwordsMatch && (
                            <CheckCircle className="w-5 h-5 text-green-600" aria-hidden="true" />
                          )}
                          {fieldState === 'error' && (
                            <XCircle className="w-5 h-5 text-red-600" aria-hidden="true" />
                          )}
                        </div>
                      </div>
                    </FormControl>

                    {/* Password Match Indicator */}
                    {confirmPassword && (
                      <div id="confirmPassword-match" className="mt-1">
                        {passwordsMatch ? (
                          <p className="text-xs text-green-600 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Passwords match
                          </p>
                        ) : password ? (
                          <p className="text-xs text-red-600 flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            Passwords do not match
                          </p>
                        ) : null}
                      </div>
                    )}

                    <FormMessage id="confirmPassword-error" />
                  </FormItem>
                );
              }}
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
                {registerMutation.isPending ? 'Creating account...' : 'Create account'}
              </span>
            </Button>

            <div className="text-center">
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
