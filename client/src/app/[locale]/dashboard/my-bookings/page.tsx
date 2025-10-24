'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { useOwnerBookings, useCancelBooking } from '@/hooks/useOwnerBookings';
import { useCanReviewBooking, useCreateReview } from '@/hooks/useReviews';
import { UserRole, BookingStatus } from 'petservice-marketplace-shared-types';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { BookingCard } from '@/components/BookingCard';
import { BookingCardSkeleton } from '@/components/BookingCardSkeleton';
import { ReviewForm } from '@/components/ReviewForm';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

function OwnerBookingsContent() {
  const { user } = useAuth();
  const router = useRouter();
  const t = useTranslations('myBookings');
  const { data: bookingsData, isLoading, error } = useOwnerBookings();
  const cancelMutation = useCancelBooking();
  const createReviewMutation = useCreateReview();

  // Review form state
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<{
    id: string;
    serviceTitle: string;
  } | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const handleStatusUpdate = (bookingId: string, status: BookingStatus) => {
    if (status === BookingStatus.CANCELLED) {
      cancelMutation.mutate(bookingId);
    }
  };

  const handleLeaveReview = (bookingId: string, serviceTitle: string) => {
    setSelectedBookingForReview({ id: bookingId, serviceTitle });
    setShowReviewForm(true);
  };

  const handleReviewSuccess = () => {
    // Refresh bookings data to update the UI
    // The review creation will invalidate the necessary queries
  };

  if (user?.role !== UserRole.OWNER) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('accessDenied')}</h1>
          <p className="text-gray-600 mb-6">
            {t('onlyOwners')}
          </p>
          <Link href="/dashboard">
            <Button variant="default" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl">
              {t('backToDashboardButton')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-gray-300 rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-64 animate-pulse"></div>
          </div>

          {/* Booking sections skeleton */}
          <div className="space-y-8">
            {/* Pending section */}
            <div>
              <div className="h-6 bg-gray-300 rounded w-40 mb-4 animate-pulse"></div>
              <div className="space-y-6">
                {Array.from({ length: 2 }).map((_, index) => (
                  <BookingCardSkeleton key={`pending-${index}`} />
                ))}
              </div>
            </div>

            {/* Confirmed section */}
            <div>
              <div className="h-6 bg-gray-300 rounded w-44 mb-4 animate-pulse"></div>
              <div className="space-y-6">
                {Array.from({ length: 1 }).map((_, index) => (
                  <BookingCardSkeleton key={`confirmed-${index}`} />
                ))}
              </div>
            </div>

            {/* Completed section */}
            <div>
              <div className="h-6 bg-gray-300 rounded w-40 mb-4 animate-pulse"></div>
              <div className="space-y-6">
                {Array.from({ length: 2 }).map((_, index) => (
                  <BookingCardSkeleton key={`completed-${index}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">
            {t('failedToLoad')}
          </div>
          <p className="text-gray-600 mb-4">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </p>
          <Link href="/dashboard">
            <Button variant="default" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl">
              {t('backToDashboardButton')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const bookings = bookingsData?.bookings || [];

  // Group bookings by status
  const pendingBookings = bookings.filter(b => b.status === BookingStatus.PENDING);
  const confirmedBookings = bookings.filter(b => b.status === BookingStatus.CONFIRMED);
  const completedBookings = bookings.filter(b => b.status === BookingStatus.COMPLETED);
  const cancelledBookings = bookings.filter(b => b.status === BookingStatus.CANCELLED);

  const BookingSection = ({ title, bookings, emptyMessage, icon }: { title: string; bookings: any[]; emptyMessage: string; icon: string }) => (
    <div className="mb-8">
      <div className="bg-white rounded-lg shadow-md p-4 mb-4 border-2 border-transparent hover:border-blue-200 transition-all duration-300">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          {title} <span className="text-blue-600">({bookings.length})</span>
        </h2>
      </div>
      {bookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-gray-600 text-lg">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map(booking => (
            <div key={booking.id} className="relative">
              <div className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <BookingCard
                  booking={booking}
                  userRole={UserRole.OWNER}
                  onStatusUpdate={handleStatusUpdate}
                  isUpdating={cancelMutation.isPending}
                />
              </div>
              {/* Leave Review Button for completed bookings */}
              {booking.status === BookingStatus.COMPLETED && (
                <div className="mt-3 flex justify-end">
                  <LeaveReviewButton
                    bookingId={booking.id}
                    serviceTitle={booking.service.title}
                    onClick={() => handleLeaveReview(booking.id, booking.service.title)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const LeaveReviewButton = ({
    bookingId,
    serviceTitle,
    onClick
  }: {
    bookingId: string;
    serviceTitle: string;
    onClick: () => void;
  }) => {
    const { data: canReviewData } = useCanReviewBooking(bookingId);
    const canReview = canReviewData?.canReview ?? false;

    if (!canReview) {
      return null; // Don't show button if review already exists or conditions not met
    }

    return (
      <Button
        onClick={onClick}
        variant="default"
        size="sm"
        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl"
      >
        {t('leaveReview')}
      </Button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">{t('breadcrumbHome')}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">{t('breadcrumbDashboard')}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{t('breadcrumb')}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Hero Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="text-blue-600 hover:text-blue-800 mb-4 inline-block hover:underline transition-colors"
                >
                  ← {t('backToDashboard')}
                </button>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {t('title')} 📅
                </h1>
                <p className="text-gray-600 text-lg">
                  {t('subtitle')}
                </p>
              </div>
              <div className="text-6xl transform transition-transform duration-300 hover:scale-110 hover:rotate-12">
                📋
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Sections */}
        <BookingSection
          title={t('pendingApproval')}
          bookings={pendingBookings}
          emptyMessage={t('noPending')}
          icon="⏳"
        />

        <BookingSection
          title={t('confirmedBookings')}
          bookings={confirmedBookings}
          emptyMessage={t('noConfirmed')}
          icon="✅"
        />

        <BookingSection
          title={t('completedServices')}
          bookings={completedBookings}
          emptyMessage={t('noCompleted')}
          icon="🎉"
        />

        <BookingSection
          title={t('cancelledBookings')}
          bookings={cancelledBookings}
          emptyMessage={t('noCancelled')}
          icon="❌"
        />

        {/* Stats */}
        {bookings.length > 0 && (
          <div className="mt-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg p-6 border-2 border-transparent hover:border-blue-200 transition-all duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="text-2xl">📊</span>
              {t('bookingSummary')}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                <div className="text-3xl font-bold text-yellow-600 group-hover:scale-110 transition-transform">{pendingBookings.length}</div>
                <div className="text-sm text-gray-600 mt-1">{t('pending')}</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                <div className="text-3xl font-bold text-blue-600 group-hover:scale-110 transition-transform">{confirmedBookings.length}</div>
                <div className="text-sm text-gray-600 mt-1">{t('confirmed')}</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                <div className="text-3xl font-bold text-green-600 group-hover:scale-110 transition-transform">{completedBookings.length}</div>
                <div className="text-sm text-gray-600 mt-1">{t('completed')}</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                <div className="text-3xl font-bold text-red-600 group-hover:scale-110 transition-transform">{cancelledBookings.length}</div>
                <div className="text-sm text-gray-600 mt-1">{t('cancelled')}</div>
              </div>
            </div>
          </div>
        )}

        {/* Call to action */}
        {bookings.length === 0 && (
          <div className="mt-12 text-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg p-12 border-2 border-transparent hover:border-blue-200 transition-all duration-300">
            <div className="text-8xl mb-6 transform transition-transform duration-300 hover:scale-110 hover:rotate-12">
              🐾
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('noBookingsYet')}
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              {t('noBookingsDesc')}
            </p>
            <Link href="/services">
              <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-8 py-6 text-lg font-semibold">
                {t('browseServices')} →
              </Button>
            </Link>
          </div>
        )}

        {/* Review Form */}
        {selectedBookingForReview && (
          <ReviewForm
            bookingId={selectedBookingForReview.id}
            serviceTitle={selectedBookingForReview.serviceTitle}
            isOpen={showReviewForm}
            onClose={() => {
              setShowReviewForm(false);
              setSelectedBookingForReview(null);
            }}
            onSuccess={handleReviewSuccess}
          />
        )}
      </div>
    </div>
  );
}

export default function MyBookingsPage() {
  return (
    <ProtectedRoute>
      <OwnerBookingsContent />
    </ProtectedRoute>
  );
}
