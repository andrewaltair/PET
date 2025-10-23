/* (Phase 27) Эта страница использует 'useLogin' хук */
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useLogin } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, ArrowLeft, Mail, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { loginSchema, type LoginFormData } from '@/lib/validators/auth';

export default function LoginPage() {
  const router = useRouter();
  const loginMutation = useLogin();
  const t = useTranslations();

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 relative overflow-hidden">
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
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 -ml-4"
          aria-label={t('auth.goBack')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('auth.back')}
        </Button>

        {/* Login Card */}
        <Card className="backdrop-blur-sm bg-white/80 border-green-100 shadow-2xl hover:shadow-green-500/20 transition-all duration-300">
          <CardHeader className="text-center space-y-2 pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 mb-2">
              <span className="text-3xl">🐾</span>
            </div>
            <CardTitle id="login-form-title" className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {t('auth.welcomeBack')}
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              {t('auth.signInToAccount')}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
                role="form"
                aria-labelledby="login-form-title"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email" className="text-gray-700 font-medium">
                        {t('auth.emailAddress')}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder={t('auth.enterYourEmail')}
                            aria-describedby="email-error"
                            className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500/20"
                            {...field}
                          />
                        </div>
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
                      <FormLabel htmlFor="password" className="text-gray-700 font-medium">
                        {t('auth.password')}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            placeholder={t('auth.enterYourPassword')}
                            aria-describedby="password-error"
                            className="pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500/20"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage id="password-error" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  variant="default"
                  disabled={loginMutation.isPending}
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transform hover:scale-[1.02] transition-all duration-200 font-semibold text-base"
                  aria-describedby={loginMutation.isPending ? "login-loading" : undefined}
                >
                  <LogIn className="mr-2 h-5 w-5" aria-hidden="true" />
                  <span id={loginMutation.isPending ? "login-loading" : undefined}>
                    {loginMutation.isPending ? t('auth.signingIn') : t('auth.signIn')}
                  </span>
                </Button>

                <div className="text-center pt-2">
                  <p className="text-sm text-gray-600">
                    {t('auth.dontHaveAccount')}{' '}
                    <Link
                      href="/register"
                      className="text-green-600 hover:text-green-700 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-sm"
                    >
                      {t('auth.signUp')}
                    </Link>
                  </p>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>{t('auth.secureLogin')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600">🔒</span>
            <span>{t('auth.encrypted')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}