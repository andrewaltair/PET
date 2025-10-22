'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BookingWithDetails, BookingStatus, PaymentStatus, UserRole } from 'petservice-marketplace-shared-types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { CreditCard, X, XCircle, Check, CheckCircle } from 'lucide-react';

interface BookingCardProps {
  booking: BookingWithDetails;
  userRole: UserRole;
  onStatusUpdate?: (bookingId: string, status: BookingStatus) => void;
  isUpdating?: boolean;
}

export function BookingCard({ booking, userRole, onStatusUpdate, isUpdating }: BookingCardProps) {
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    action: () => void;
    variant?: "default" | "destructive";
  }>({
    open: false,
    title: "",
    description: "",
    action: () => {},
  });

  const getStatusVariant = (status: BookingStatus): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case BookingStatus.PENDING:
        return 'secondary';
      case BookingStatus.CONFIRMED:
        return 'default';
      case BookingStatus.COMPLETED:
        return 'outline';
      case BookingStatus.CANCELLED:
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: BookingStatus): string => {
    switch (status) {
      case BookingStatus.PENDING:
        return 'Pending Review';
      case BookingStatus.CONFIRMED:
        return 'Confirmed';
      case BookingStatus.COMPLETED:
        return 'Completed';
      case BookingStatus.CANCELLED:
        return 'Cancelled';
      default:
        return status;
    }
  };

  const formatBookingTime = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const canCancelBooking = userRole === UserRole.OWNER &&
    (booking.status === BookingStatus.PENDING || booking.status === BookingStatus.CONFIRMED);

  const canPayBooking = userRole === UserRole.OWNER &&
    booking.status === BookingStatus.CONFIRMED &&
    booking.paymentStatus === PaymentStatus.PENDING;

  const canConfirmBooking = userRole === UserRole.PROVIDER && booking.status === BookingStatus.PENDING;
  const canRejectBooking = userRole === UserRole.PROVIDER && booking.status === BookingStatus.PENDING;
  const canCompleteBooking = userRole === UserRole.PROVIDER && booking.status === BookingStatus.CONFIRMED;

  const handleCancel = () => {
    setConfirmDialog({
      open: true,
      title: "Cancel Booking",
      description: "Are you sure you want to cancel this booking? This action cannot be undone.",
      action: () => onStatusUpdate?.(booking.id, BookingStatus.CANCELLED),
      variant: "destructive",
    });
  };

  const handleConfirm = () => {
    setConfirmDialog({
      open: true,
      title: "Confirm Booking",
      description: "Are you sure you want to confirm this booking?",
      action: () => onStatusUpdate?.(booking.id, BookingStatus.CONFIRMED),
      variant: "default",
    });
  };

  const handleReject = () => {
    setConfirmDialog({
      open: true,
      title: "Reject Booking",
      description: "Are you sure you want to reject this booking?",
      action: () => onStatusUpdate?.(booking.id, BookingStatus.CANCELLED),
      variant: "destructive",
    });
  };

  const handleComplete = () => {
    setConfirmDialog({
      open: true,
      title: "Complete Booking",
      description: "Mark this booking as completed?",
      action: () => onStatusUpdate?.(booking.id, BookingStatus.COMPLETED),
      variant: "default",
    });
  };

  const handlePay = () => {
    // Navigate to payment page
    window.location.href = `/booking/${booking.id}/pay`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <Link
              href={`/services/${booking.service.id}`}
              className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
            >
              {booking.service.title}
            </Link>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant={getStatusVariant(booking.status)}>
                {getStatusLabel(booking.status)}
              </Badge>
              <span className="text-sm text-muted-foreground">
                ${Number(booking.service.price).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Booking Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="font-medium w-16">Time:</span>
            <span>{formatBookingTime(booking.bookingTime)}</span>
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <span className="font-medium w-16">Service:</span>
            <span>{booking.service.serviceType.toLowerCase().replace('_', ' ')}</span>
          </div>

          {userRole === UserRole.OWNER ? (
            <div className="flex items-center text-sm text-muted-foreground">
              <span className="font-medium w-16">Provider:</span>
              <span>Provider</span>
            </div>
          ) : (
            <div className="flex items-center text-sm text-muted-foreground">
              <span className="font-medium w-16">Client:</span>
              <span>Client</span>
            </div>
          )}
        </div>

        {/* Notes */}
        {booking.notes && (
          <div className="bg-muted rounded-lg p-3 mb-4">
            <p className="text-sm text-foreground">{booking.notes}</p>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <div className="flex justify-between items-center w-full">
          <div className="text-xs text-muted-foreground">
            Booked on {new Intl.DateTimeFormat('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }).format(new Date(booking.createdAt))}
          </div>

          <div className="flex space-x-2">
            {canPayBooking && (
              <Button
                onClick={handlePay}
                variant="default"
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Pay Now
              </Button>
            )}

            {canCancelBooking && (
              <Button
                onClick={handleCancel}
                disabled={isUpdating}
                variant="destructive"
                size="sm"
              >
                <X className="mr-2 h-4 w-4" />
                {isUpdating ? '...' : 'Cancel'}
              </Button>
            )}

            {canRejectBooking && (
              <Button
                onClick={handleReject}
                disabled={isUpdating}
                variant="destructive"
                size="sm"
              >
                <XCircle className="mr-2 h-4 w-4" />
                {isUpdating ? '...' : 'Reject'}
              </Button>
            )}

            {canConfirmBooking && (
              <Button
                onClick={handleConfirm}
                disabled={isUpdating}
                variant="default"
                size="sm"
              >
                <Check className="mr-2 h-4 w-4" />
                {isUpdating ? '...' : 'Confirm'}
              </Button>
            )}

            {canCompleteBooking && (
              <Button
                onClick={handleComplete}
                disabled={isUpdating}
                variant="outline"
                size="sm"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {isUpdating ? '...' : 'Complete'}
              </Button>
            )}
          </div>
        </div>
      </CardFooter>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}
        title={confirmDialog.title}
        description={confirmDialog.description}
        onConfirm={confirmDialog.action}
        variant={confirmDialog.variant}
      />
    </Card>
  );
}
