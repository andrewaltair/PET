import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { BookingWithDetails } from 'petservice-marketplace-shared-types';
import { format } from 'date-fns';

interface RecentActivityProps {
  bookings?: BookingWithDetails[];
  isLoading?: boolean;
  role: 'OWNER' | 'PROVIDER';
}

export function RecentActivity({ bookings, isLoading, role }: RecentActivityProps) {
  const t = useTranslations('dashboard.recentActivity');

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentBookings = bookings?.slice(0, 3) || [];

  if (recentBookings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">{t('noActivity')}</p>
            <Button asChild variant="outline" size="sm">
              <Link href={role === 'OWNER' ? '/services' : '/dashboard/services/new'}>
                {role === 'OWNER' ? t('browseServices') : t('createService')}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t('title')}</CardTitle>
        <Button asChild variant="ghost" size="sm">
          <Link href={role === 'OWNER' ? '/dashboard/my-bookings' : '/dashboard/provider-bookings'}>
            {t('viewAll')}
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentBookings.map((booking) => (
            <div
              key={booking.id}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {booking.service?.title || 'Service'}
                  </p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    booking.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                    booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    booking.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{format(new Date(booking.bookingTime), 'MMM d, yyyy')}</span>
                  </div>
                  {role === 'PROVIDER' && booking.owner && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{booking.owner.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


