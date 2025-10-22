'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import {
  useProviderBookings,
  useConfirmBooking,
  useRejectBooking,
  useCompleteBooking
} from '../../../hooks/useProviderBookings';
import { UserRole, BookingStatus } from 'petservice-marketplace-shared-types';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import { BookingCard } from '../../../components/BookingCard';
import { BookingCardSkeleton } from '../../../components/BookingCardSkeleton';
import { Button } from '../../../components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../../../components/ui/breadcrumb';

function ProviderBookingsContent() {
  const { user } = useAuth();
  const router = useRouter();
  const { data: bookingsData, isLoading, error } = useProviderBookings();
  const confirmMutation = useConfirmBooking();
  const rejectMutation = useRejectBooking();
  const completeMutation = useCompleteBooking();

  const handleStatusUpdate = (bookingId: string, status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        confirmMutation.mutate(bookingId);
        break;
      case BookingStatus.CANCELLED:
        rejectMutation.mutate(bookingId);
        break;
      case BookingStatus.COMPLETED:
        completeMutation.mutate(bookingId);
        break;
    }
  };

  const isUpdating = confirmMutation.isPending || rejectMutation.isPending || completeMutation.isPending;

  if (user?.role !== UserRole.PROVIDER) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            Only service providers can view incoming bookings.
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
            <div className="h-8 bg-gray-300 rounded w-56 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-72 animate-pulse"></div>
          </div>

          {/* Booking sections skeleton */}
          <div className="space-y-8">
            {/* Pending section */}
            <div>
              <div className="h-6 bg-gray-300 rounded w-36 mb-4 animate-pulse"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, index) => (
                  <BookingCardSkeleton key={`pending-${index}`} />
                ))}
              </div>
            </div>

            {/* Confirmed section */}
            <div>
              <div className="h-6 bg-gray-300 rounded w-44 mb-4 animate-pulse"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Array.from({ length: 2 }).map((_, index) => (
                  <BookingCardSkeleton key={`confirmed-${index}`} />
                ))}
              </div>
            </div>

            {/* Completed section */}
            <div>
              <div className="h-6 bg-gray-300 rounded w-40 mb-4 animate-pulse"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {bookings.map(booking => (
            <BookingCard
              key={booking.id}
              booking={booking}
              userRole={UserRole.PROVIDER}
              onStatusUpdate={handleStatusUpdate}
              isUpdating={isUpdating}
            />
          ))}
        </div>
      )}
    </div>
  );

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
                <BreadcrumbPage>Incoming Bookings</BreadcrumbPage>
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
          <h1 className="text-3xl font-bold text-gray-900">Incoming Bookings</h1>
          <p className="text-gray-600 mt-2">
            Manage booking requests for your services
          </p>
        </div>

        {/* Urgent Actions Alert */}
        {pendingBookings.length > 0 && (
          <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="text-yellow-600 text-xl mr-3">⚡</div>
              <div>
                <h3 className="text-yellow-800 font-medium">
                  {pendingBookings.length} booking{pendingBookings.length > 1 ? 's' : ''} waiting for your review
                </h3>
                <p className="text-yellow-700 text-sm mt-1">
                  Please confirm or reject these bookings to keep your clients informed.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bookings Sections */}
        <BookingSection
          title="Pending Review"
          bookings={pendingBookings}
          emptyMessage="No bookings waiting for your review"
        />

        <BookingSection
          title="Confirmed Bookings"
          bookings={confirmedBookings}
          emptyMessage="No confirmed bookings"
        />

        <BookingSection
          title="Completed Services"
          bookings={completedBookings}
          emptyMessage="No completed services"
        />

        <BookingSection
          title="Rejected/Cancelled"
          bookings={cancelledBookings}
          emptyMessage="No rejected or cancelled bookings"
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
              When pet owners book your services, their requests will appear here for you to review and confirm.
            </p>
            <Link href="/dashboard/services">
              <Button>
                Manage My Services
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProviderBookingsPage() {
  return (
    <ProtectedRoute>
      <ProviderBookingsContent />
    </ProtectedRoute>
  );
}
