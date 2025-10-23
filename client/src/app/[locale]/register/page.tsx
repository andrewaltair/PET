'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { useRegister } from '@/hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { UserRole } from 'petservice-marketplace-shared-types';
import { Button } from '@/components/ui/button';
import { UserPlus, CheckCircle, XCircle, AlertCircle, Mail, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { registerFormSchema, type RegisterFormData } from '@/lib/validators/auth';

export default function RegisterPage() {
  const { logout } = useAuth();
  const registerMutation = useRegister();
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
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
    const fieldState = form.getFieldState(fieldName as any);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 relative overflow-hidden py-12">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="absolute top-20 right-20 w-96 h-96 bg-green-300 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #9333ea 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, #14b8a6 2px, transparent 2px)`,
          backgroundSize: '50px 50px',
          backgroundPosition: '0 0, 25px 25px',
        }}></div>
      </div>

      <div className="relative z-10 max-w-md w-full px-4">
        {/* Register Card */}
        <div className="backdrop-blur-sm bg-white/80 border-green-100 shadow-2xl hover:shadow-green-500/20 transition-all duration-300 rounded-xl p-8">
          <div className="text-center space-y-2 mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 mb-2">
              <span className="text-3xl">🐾</span>
            </div>
            <h2 id="register-form-title" className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">{t('register.title')}</h2>
            <p className="text-base text-gray-600">{t('register.subtitle')}</p>
          </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
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
                    <FormLabel htmlFor="email" className="flex items-center gap-2 text-gray-700 font-medium">
                      {t('register.emailLabel')}
                      {fieldState === 'success' && (
                        <CheckCircle className="w-4 h-4 text-blue-600" aria-hidden="true" />
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
                          placeholder={t('register.emailPlaceholder')}
                          aria-describedby="email-error"
                          className={`pl-10 pr-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500/20 ${
                            fieldState === 'success'
                              ? 'border-blue-500 focus:border-blue-500 focus:ring-blue-500'
                              : fieldState === 'error'
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                              : ''
                          }`}
                          {...field}
                          onBlur={() => {
                            field.onBlur();
                            handleFieldTouch('email');
                          }}
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <Mail className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          {fieldState === 'success' && (
                            <CheckCircle className="w-5 h-5 text-blue-600" aria-hidden="true" />
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
                  <FormLabel htmlFor="role" className="text-gray-700 font-medium">{t('register.roleLabel')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger id="role" aria-describedby="role-error" className="h-12 border-gray-200 focus:border-green-500 focus:ring-green-500/20">
                        <SelectValue placeholder={t('register.rolePlaceholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={UserRole.OWNER}>{t('register.roleOwner')}</SelectItem>
                      <SelectItem value={UserRole.PROVIDER}>{t('register.roleProvider')}</SelectItem>
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
                    <FormLabel htmlFor="password" className="flex items-center gap-2 text-gray-700 font-medium">
                      {t('register.passwordLabel')}
                      {fieldState === 'success' && (
                        <CheckCircle className="w-4 h-4 text-blue-600" aria-hidden="true" />
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
                          placeholder={t('register.passwordPlaceholder')}
                          aria-describedby="password-error password-strength"
                          className={`pl-10 pr-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500/20 ${
                            fieldState === 'success'
                              ? 'border-blue-500 focus:border-blue-500 focus:ring-blue-500'
                              : fieldState === 'error'
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                              : ''
                          }`}
                          {...field}
                          onBlur={() => {
                            field.onBlur();
                            handleFieldTouch('password');
                          }}
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <Lock className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          {fieldState === 'success' && (
                            <CheckCircle className="w-5 h-5 text-blue-600" aria-hidden="true" />
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
                                    : 'bg-blue-500'
                                  : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-600">
                          {t('register.passwordStrength')}{' '}
                          {strengthScore === 0
                            ? t('register.strengthVeryWeak')
                            : strengthScore === 1
                            ? t('register.strengthWeak')
                            : strengthScore === 2
                            ? t('register.strengthFair')
                            : strengthScore === 3
                            ? t('register.strengthGood')
                            : t('register.strengthStrong')}
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
                    <FormLabel htmlFor="confirmPassword" className="flex items-center gap-2 text-gray-700 font-medium">
                      {t('register.confirmPasswordLabel')}
                      {fieldState === 'success' && passwordsMatch && (
                        <CheckCircle className="w-4 h-4 text-blue-600" aria-hidden="true" />
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
                          placeholder={t('register.confirmPasswordPlaceholder')}
                          aria-describedby="confirmPassword-error confirmPassword-match"
                          className={`pl-10 pr-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500/20 ${
                            fieldState === 'success' && passwordsMatch
                              ? 'border-blue-500 focus:border-blue-500 focus:ring-blue-500'
                              : fieldState === 'error'
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                              : ''
                          }`}
                          {...field}
                          onBlur={() => {
                            field.onBlur();
                            handleFieldTouch('confirmPassword');
                          }}
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <Lock className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          {fieldState === 'success' && passwordsMatch && (
                            <CheckCircle className="w-5 h-5 text-blue-600" aria-hidden="true" />
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
                          <p className="text-xs text-blue-600 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            {t('register.passwordsMatch')}
                          </p>
                        ) : password ? (
                          <p className="text-xs text-red-600 flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            {t('register.passwordsDoNotMatch')}
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
              className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transform hover:scale-[1.02] transition-all duration-200 font-semibold text-base"
              aria-describedby={registerMutation.isPending ? "register-loading" : undefined}
            >
              <UserPlus className="mr-2 h-5 w-5" aria-hidden="true" />
              <span id={registerMutation.isPending ? "register-loading" : undefined}>
                {registerMutation.isPending ? t('register.creatingAccount') : t('register.createAccount')}
              </span>
            </Button>

            <div className="text-center pt-2">
              <p className="text-sm text-gray-600">
                {t('register.alreadyHaveAccount')}{' '}
                <Link
                  href="/login"
                  className="text-green-600 hover:text-green-700 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-sm"
                >
                  {t('register.signIn')}
                </Link>
              </p>
            </div>
          </form>
        </Form>
        </div>

        {/* Trust Indicators */}
        <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>{t('register.secureRegistration')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600">🔒</span>
            <span>{t('register.encrypted')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
