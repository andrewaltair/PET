'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { useOwnerBookings, useCancelBooking } from '../../../hooks/useOwnerBookings';
import { useCanReviewBooking, useCreateReview } from '../../../hooks/useReviews';
import { UserRole, BookingStatus } from 'petservice-marketplace-shared-types';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import { BookingCard } from '../../../components/BookingCard';
import { BookingCardSkeleton } from '../../../components/BookingCardSkeleton';
import { ReviewForm } from '../../../components/ReviewForm';
import { Button } from '../../../components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../../../components/ui/breadcrumb';

function OwnerBookingsContent() {
  const { user } = useAuth();
  const router = useRouter();
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            Only pet owners can view their bookings.
          </p>
          <Link href="/dashboard">
            <Button variant="outline">
              Back to Dashboard
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
            Failed to load bookings
          </div>
          <p className="text-gray-600 mb-4">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </p>
          <Link href="/dashboard">
            <Button variant="outline">
              Back to Dashboard
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

  const BookingSection = ({ title, bookings, emptyMessage }: { title: string; bookings: any[]; emptyMessage: string }) => (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{title} ({bookings.length})</h2>
      {bookings.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map(booking => (
            <div key={booking.id} className="relative">
              <BookingCard
                booking={booking}
                userRole={UserRole.OWNER}
                onStatusUpdate={handleStatusUpdate}
                isUpdating={cancelMutation.isPending}
              />
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
        variant="outline"
        size="sm"
        className="text-blue-600 border-blue-600 hover:bg-blue-50"
      >
        Leave Review
      </Button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>My Bookings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-2">
            Manage your pet service bookings
          </p>
        </div>

        {/* Bookings Sections */}
        <BookingSection
          title="Pending Approval"
          bookings={pendingBookings}
          emptyMessage="No bookings waiting for approval"
        />

        <BookingSection
          title="Confirmed Bookings"
          bookings={confirmedBookings}
          emptyMessage="No confirmed bookings"
        />

        <BookingSection
          title="Completed Services"
          bookings={completedBookings}
          emptyMessage="No completed services yet"
        />

        <BookingSection
          title="Cancelled Bookings"
          bookings={cancelledBookings}
          emptyMessage="No cancelled bookings"
        />

        {/* Stats */}
        {bookings.length > 0 && (
          <div className="mt-12 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{pendingBookings.length}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{confirmedBookings.length}</div>
                <div className="text-sm text-gray-600">Confirmed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{completedBookings.length}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{cancelledBookings.length}</div>
                <div className="text-sm text-gray-600">Cancelled</div>
              </div>
            </div>
          </div>
        )}

        {/* Call to action */}
        {bookings.length === 0 && (
          <div className="mt-12 text-center bg-blue-50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              No bookings yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start by browsing available pet services and booking with trusted providers.
            </p>
            <Link href="/services">
              <Button>
                Browse Services
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
