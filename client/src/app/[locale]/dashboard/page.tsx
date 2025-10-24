'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from 'petservice-marketplace-shared-types';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useProfile } from '@/hooks/useProfile';
import { Skeleton } from '@/components/ui/skeleton';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { AchievementBadges } from '@/components/dashboard/AchievementBadges';
import { useOwnerBookings } from '@/hooks/useOwnerBookings';
import { useProviderBookings } from '@/hooks/useProviderBookings';
import { AnimatedCounter } from '@/components/AnimatedCounter';

function DashboardContent() {
  const { user } = useAuth();
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loadingUser')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Card */}
          <Card className="mb-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-transparent hover:border-blue-200">
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
                <div className="text-5xl transform transition-transform duration-300 hover:scale-110 hover:rotate-12">
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
                <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group border-2 border-transparent hover:border-blue-200">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-3xl transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">🔍</div>
                      <h3 className="text-lg font-semibold text-gray-900 text-right flex-1 ml-3 group-hover:text-blue-600 transition-colors">
                        {t('ownerCards.findServices.title')}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      {t('ownerCards.findServices.description')}
                    </p>
                    <Button asChild className="w-full shadow-md hover:shadow-lg">
                      <Link href="/services">
                        {t('ownerCards.findServices.button')}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group border-2 border-transparent hover:border-blue-200">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-3xl transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">📅</div>
                      <h3 className="text-lg font-semibold text-gray-900 text-right flex-1 ml-3 group-hover:text-blue-600 transition-colors">
                        {t('ownerCards.myBookings.title')}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      {t('ownerCards.myBookings.description')}
                    </p>
                    <Button asChild variant="outline" className="w-full shadow-md hover:shadow-lg">
                      <Link href="/dashboard/my-bookings">
                        {t('ownerCards.myBookings.button')}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group border-2 border-transparent hover:border-blue-200">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-3xl transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">⭐</div>
                      <h3 className="text-lg font-semibold text-gray-900 text-right flex-1 ml-3 group-hover:text-blue-600 transition-colors">
                        {t('ownerCards.reviews.title')}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      {t('ownerCards.reviews.description')}
                    </p>
                    <Button asChild variant="outline" className="w-full shadow-md hover:shadow-lg">
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
                <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group border-2 border-transparent hover:border-blue-200">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-3xl transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">👤</div>
                      <h3 className="text-lg font-semibold text-gray-900 text-right flex-1 ml-3 group-hover:text-blue-600 transition-colors">
                        {t('providerCards.profile.title')}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      {t('providerCards.profile.description')}
                    </p>
                    <Button asChild variant="outline" className="w-full shadow-md hover:shadow-lg">
                      <Link href="/dashboard/profile">
                        {t('providerCards.profile.button')}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group border-2 border-transparent hover:border-blue-200">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-3xl transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">➕</div>
                      <h3 className="text-lg font-semibold text-gray-900 text-right flex-1 ml-3 group-hover:text-blue-600 transition-colors">
                        {t('providerCards.addService.title')}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      {t('providerCards.addService.description')}
                    </p>
                    <Button asChild className="w-full shadow-md hover:shadow-lg">
                      <Link href="/dashboard/services/new">
                        {t('providerCards.addService.button')}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group border-2 border-transparent hover:border-blue-200">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-3xl transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">📋</div>
                      <h3 className="text-lg font-semibold text-gray-900 text-right flex-1 ml-3 group-hover:text-blue-600 transition-colors">
                        {t('providerCards.manageServices.title')}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      {t('providerCards.manageServices.description')}
                    </p>
                    <Button asChild variant="outline" className="w-full shadow-md hover:shadow-lg">
                      <Link href="/dashboard/services">
                        {t('providerCards.manageServices.button')}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group border-2 border-transparent hover:border-blue-200">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-3xl transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">📅</div>
                      <h3 className="text-lg font-semibold text-gray-900 text-right flex-1 ml-3 group-hover:text-blue-600 transition-colors">
                        {t('providerCards.incomingBookings.title')}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      {t('providerCards.incomingBookings.description')}
                    </p>
                    <Button asChild variant="outline" className="w-full shadow-md hover:shadow-lg">
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
                <div className="bg-white rounded-lg p-6 text-center shadow-sm border hover:shadow-md transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                  <div className="text-2xl font-bold text-blue-600">
                    <AnimatedCounter value={stats?.activeBookings || stats?.totalServices || 0} />
                  </div>
                  <div className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors">
                    {user.role === UserRole.OWNER ? t('stats.activeBookings') : t('stats.totalServices')}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-6 text-center shadow-sm border hover:shadow-md transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                  <div className="text-2xl font-bold text-blue-600">
                    <AnimatedCounter value={stats?.completedServices || stats?.totalBookings || 0} />
                  </div>
                  <div className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors">
                    {user.role === UserRole.OWNER ? t('stats.completedServices') : t('stats.totalBookings')}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-6 text-center shadow-sm border hover:shadow-md transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                  <div className="text-2xl font-bold text-purple-600">
                    <AnimatedCounter value={stats?.reviews || 0} />
                  </div>
                  <div className="text-sm text-gray-600 group-hover:text-purple-600 transition-colors">{t('stats.reviews')}</div>
                </div>
                <div className="bg-white rounded-lg p-6 text-center shadow-sm border hover:shadow-md transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                  <div className="text-2xl font-bold text-orange-600">
                    <AnimatedCounter value={stats?.favorites || 0} />
                  </div>
                  <div className="text-sm text-gray-600 group-hover:text-orange-600 transition-colors">{t('stats.favorites')}</div>
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
              role={user.role as 'OWNER' | 'PROVIDER'}
            />

            {/* Achievement Badges */}
            <AchievementBadges stats={stats || {}} role={user.role} />
          </div>
        </div>
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
