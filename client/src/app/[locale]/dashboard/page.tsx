'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from 'petservice-marketplace-shared-types';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Menu, X } from 'lucide-react';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useProfile } from '@/hooks/useProfile';
import { Skeleton } from '@/components/ui/skeleton';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { AchievementBadges } from '@/components/dashboard/AchievementBadges';
import { useOwnerBookings } from '@/hooks/useOwnerBookings';
import { useProviderBookings } from '@/hooks/useProviderBookings';

function DashboardContent() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations('dashboard');
  const { data: stats, isLoading: statsLoading } = useDashboardStats(user?.role || UserRole.OWNER);
  const { data: profile } = useProfile();
  const { data: ownerBookings, isLoading: ownerBookingsLoading } = useOwnerBookings();
  const { data: providerBookings, isLoading: providerBookingsLoading } = useProviderBookings();

  // Get user's display name
  const getUserDisplayName = () => {
    if (!user) return '';
    if (profile?.firstName) return profile.firstName;
    if (user.email) return user.email.split('@')[0];
    return user.email;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loadingUser')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-gray-900">🐾 PetService</Link>
              <span className="text-sm text-gray-500 hidden sm:inline">{t('title')}</span>
            </div>
            <div className="flex items-center space-x-4">
              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-4">
                <Link href="/dashboard/profile" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  {t('nav.profile')}
                </Link>
                {user.role === UserRole.PROVIDER && (
                  <>
                    <Link href="/dashboard/services" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      {t('nav.services')}
                    </Link>
                    <Link href="/dashboard/provider-bookings" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      {t('nav.bookings')}
                    </Link>
                    <Link href="/dashboard/messages" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      {t('nav.messages')}
                    </Link>
                  </>
                )}
                {user.role === UserRole.OWNER && (
                  <>
                    <Link href="/dashboard/my-bookings" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      {t('nav.myBookings')}
                    </Link>
                    <Link href="/services" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      {t('nav.browseServices')}
                    </Link>
                    <Link href="/dashboard/messages" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      {t('nav.messages')}
                    </Link>
                  </>
                )}
              </nav>

              {/* Mobile Navigation */}
              <div className="md:hidden">
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" aria-label={t('nav.openMenu')}>
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80">
                    <div className="flex flex-col space-y-4 mt-8">
                      <div className="pb-4 border-b">
                        <p className="text-sm text-gray-600">{t('welcome')}, {getUserDisplayName()}</p>
                      </div>

                      <nav className="flex flex-col space-y-2">
                        <Link
                          href="/dashboard/profile"
                          className="text-gray-700 hover:text-blue-600 transition-colors py-2 px-3 rounded-md hover:bg-gray-50"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {t('nav.profileSettings')}
                        </Link>

                        {user.role === UserRole.PROVIDER && (
                          <>
                            <Link
                              href="/dashboard/services"
                              className="text-gray-700 hover:text-blue-600 transition-colors py-2 px-3 rounded-md hover:bg-gray-50"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {t('nav.myServices')}
                            </Link>
                            <Link
                              href="/dashboard/provider-bookings"
                              className="text-gray-700 hover:text-blue-600 transition-colors py-2 px-3 rounded-md hover:bg-gray-50"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {t('nav.incomingBookings')}
                            </Link>
                            <Link
                              href="/dashboard/messages"
                              className="text-gray-700 hover:text-blue-600 transition-colors py-2 px-3 rounded-md hover:bg-gray-50"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {t('nav.messages')}
                            </Link>
                          </>
                        )}

                        {user.role === UserRole.OWNER && (
                          <>
                            <Link
                              href="/dashboard/my-bookings"
                              className="text-gray-700 hover:text-blue-600 transition-colors py-2 px-3 rounded-md hover:bg-gray-50"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {t('nav.myBookings')}
                            </Link>
                            <Link
                              href="/services"
                              className="text-gray-700 hover:text-blue-600 transition-colors py-2 px-3 rounded-md hover:bg-gray-50"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {t('nav.browseServices')}
                            </Link>
                            <Link
                              href="/dashboard/messages"
                              className="text-gray-700 hover:text-blue-600 transition-colors py-2 px-3 rounded-md hover:bg-gray-50"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {t('nav.messages')}
                            </Link>
                          </>
                        )}
                      </nav>

                      <div className="pt-4 border-t">
                        <Button
                          onClick={() => {
                            if (confirm(t('logoutConfirm'))) {
                              logout();
                            }
                          }}
                          variant="outline"
                          className="w-full"
                        >
                          {t('logout')}
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Desktop User Info and Logout */}
              <div className="hidden md:flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {t('welcome')}, {getUserDisplayName()}
                </span>
                <Button
                  onClick={() => {
                    if (confirm(t('logoutConfirm'))) {
                      logout();
                    }
                  }}
                  variant="outline"
                  size="sm"
                >
                  {t('logout')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">{t('breadcrumbs.home')}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{t('breadcrumbs.dashboard')}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Card */}
          <Card className="mb-8 hover:shadow-lg transition-all duration-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {t('welcomeBack')}, {getUserDisplayName()}! 🎉
                  </h1>
                  <p className="text-gray-600">
                    {user.role === UserRole.OWNER
                      ? t('ownerSlogan')
                      : t('providerSlogan')
                    }
                  </p>
                </div>
                <div className="text-5xl">
                  {user.role === UserRole.OWNER ? '🐕' : '🏢'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="mb-8">
            <QuickActions role={user.role} />
          </div>

          {/* Role-specific content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {user.role === UserRole.OWNER ? (
              // Pet Owner Dashboard
              <>
                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="text-3xl mb-4">🔍</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {t('ownerCards.findServices.title')}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {t('ownerCards.findServices.description')}
                    </p>
                    <Button asChild className="w-full">
                      <Link href="/services">
                        {t('ownerCards.findServices.button')}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="text-3xl mb-4">📅</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {t('ownerCards.myBookings.title')}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {t('ownerCards.myBookings.description')}
                    </p>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/dashboard/my-bookings">
                        {t('ownerCards.myBookings.button')}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="text-3xl mb-4">⭐</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {t('ownerCards.reviews.title')}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {t('ownerCards.reviews.description')}
                    </p>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/services">
                        {t('ownerCards.reviews.button')}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </>
            ) : (
              // Service Provider Dashboard
              <>
                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="text-3xl mb-4">👤</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {t('providerCards.profile.title')}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {t('providerCards.profile.description')}
                    </p>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/dashboard/profile">
                        {t('providerCards.profile.button')}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="text-3xl mb-4">➕</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {t('providerCards.addService.title')}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {t('providerCards.addService.description')}
                    </p>
                    <Button asChild className="w-full">
                      <Link href="/dashboard/services/new">
                        {t('providerCards.addService.button')}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="text-3xl mb-4">📋</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {t('providerCards.manageServices.title')}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {t('providerCards.manageServices.description')}
                    </p>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/dashboard/services">
                        {t('providerCards.manageServices.button')}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="text-3xl mb-4">📅</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {t('providerCards.incomingBookings.title')}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {t('providerCards.incomingBookings.description')}
                    </p>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/dashboard/provider-bookings">
                        {t('providerCards.incomingBookings.button')}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {statsLoading ? (
              // Loading skeleton
              <>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg p-6 text-center shadow-sm border">
                    <Skeleton className="h-8 w-12 mx-auto mb-2" />
                    <Skeleton className="h-4 w-24 mx-auto" />
                  </div>
                ))}
              </>
            ) : (
              <>
                <div className="bg-white rounded-lg p-6 text-center shadow-sm border hover:shadow-md transition-shadow">
                  <div className="text-2xl font-bold text-blue-600">{stats?.activeBookings || stats?.totalServices || 0}</div>
                  <div className="text-sm text-gray-600">
                    {user.role === UserRole.OWNER ? t('stats.activeBookings') : t('stats.totalServices')}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-6 text-center shadow-sm border hover:shadow-md transition-shadow">
                  <div className="text-2xl font-bold text-blue-600">{stats?.completedServices || stats?.totalBookings || 0}</div>
                  <div className="text-sm text-gray-600">
                    {user.role === UserRole.OWNER ? t('stats.completedServices') : t('stats.totalBookings')}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-6 text-center shadow-sm border hover:shadow-md transition-shadow">
                  <div className="text-2xl font-bold text-purple-600">{stats?.reviews || 0}</div>
                  <div className="text-sm text-gray-600">{t('stats.reviews')}</div>
                </div>
                <div className="bg-white rounded-lg p-6 text-center shadow-sm border hover:shadow-md transition-shadow">
                  <div className="text-2xl font-bold text-orange-600">{stats?.favorites || 0}</div>
                  <div className="text-sm text-gray-600">{t('stats.favorites')}</div>
                </div>
              </>
            )}
          </div>

          {/* Additional Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <RecentActivity
              bookings={
                user.role === UserRole.OWNER
                  ? (ownerBookings?.bookings as any)
                  : (providerBookings?.bookings as any)
              }
              isLoading={
                user.role === UserRole.OWNER
                  ? ownerBookingsLoading
                  : providerBookingsLoading
              }
              role={user.role}
            />

            {/* Achievement Badges */}
            <AchievementBadges stats={stats || {}} role={user.role} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
