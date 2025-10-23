'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import { useAuth } from '../contexts/AuthContext';
import { useCreateBooking } from '../hooks/useOwnerBookings';
import { CreateBookingRequest, UserRole, ServiceWithProvider } from 'petservice-marketplace-shared-types';
import { LoadingSpinner } from './LoadingSpinner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BookingFormProps {
  service: ServiceWithProvider;
  isOpen: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function BookingForm({ service, isOpen, onSuccess, onCancel }: BookingFormProps) {
  const { user } = useAuth();
  const createBookingMutation = useCreateBooking();
  const t = useTranslations('bookingForm');

  const [formData, setFormData] = useState<CreateBookingRequest>({
    bookingTime: new Date(),
    notes: '',
  });

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  // If user is not logged in or not an OWNER, show login prompt
  if (!user) {
    return (
      <Dialog open={isOpen} onOpenChange={onCancel}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('signInRequired.title')}</DialogTitle>
            <DialogDescription>
              {t('signInRequired.description')}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-center">
            <Button asChild>
              <a href="/login">{t('signInRequired.signInButton')}</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/register?role=OWNER">{t('signInRequired.signUpButton')}</a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (user.role !== UserRole.OWNER) {
    return (
      <Dialog open={isOpen} onOpenChange={onCancel}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('accessDenied.title')}</DialogTitle>
            <DialogDescription>
              {t('accessDenied.description')}
            </DialogDescription>
          </DialogHeader>
          <Button variant="outline" asChild>
            <a href="/dashboard">{t('accessDenied.dashboardButton')}</a>
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  const handleInputChange = (field: keyof CreateBookingRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedDate) {
      newErrors.bookingTime = t('errors.selectDate');
    } else if (!selectedTimeSlot) {
      newErrors.bookingTime = t('errors.selectTimeSlot');
    } else {
      const bookingTime = new Date(selectedDate);
      const [hours, minutes] = selectedTimeSlot.split(':').map(Number);
      bookingTime.setHours(hours, minutes, 0, 0);
      const now = new Date();

      if (bookingTime <= now) {
        newErrors.bookingTime = t('errors.futureTime');
      }
    }

    if (formData.notes && formData.notes.length > 500) {
      newErrors.notes = t('errors.notesLength');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(t('errors.checkForm'));
      return;
    }

    try {
      const bookingTime = new Date(selectedDate!);
      const [hours, minutes] = selectedTimeSlot.split(':').map(Number);
      bookingTime.setHours(hours, minutes, 0, 0);

      await createBookingMutation.mutateAsync({
        serviceId: service.id,
        bookingData: {
          ...formData,
          bookingTime,
        },
      });

      toast.success(t('successMessage'));
      onSuccess?.();
    } catch (error) {
      toast.error(t('errors.createBookingFailed'));
    }
  };

  const handleCancel = () => {
    onCancel?.();
  };

  // Generate available time slots for the next 7 days
  const generateTimeOptions = () => {
    const options: { value: string; label: string }[] = [];
    const now = new Date();

    for (let i = 1; i <= 7; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() + i);
      date.setHours(0, 0, 0, 0); // Start of day

      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      const dayKey = dayName.toLowerCase().slice(0, 3); // 'mon', 'tue', etc.
      const dayAvailability = service.availability[dayKey];

      if (dayAvailability) {
        dayAvailability.forEach(timeSlot => {
          const [startTime] = timeSlot.split('-');
          const [hours, minutes] = startTime.split(':').map(Number);

          const bookingTime = new Date(date);
          bookingTime.setHours(hours, minutes, 0, 0);

          // Only show future times
          if (bookingTime > now) {
            options.push({
              value: bookingTime.toISOString(),
              label: `${dayName}, ${date.toLocaleDateString()} at ${startTime}`,
            });
          }
        });
      }
    }

    return options;
  };

  const timeOptions = generateTimeOptions();

  // Generate time slots for a specific date
  const generateTimeSlotsForDate = (date: Date) => {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase(); // 'mon', 'tue', etc.
    const dayAvailability = service.availability[dayName] || [];

    const allSlots = [
      '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
      '16:00', '17:00', '18:00', '19:00', '20:00'
    ];

    return allSlots.map(time => {
      const isAvailable = dayAvailability.some(slot => {
        const [start, end] = slot.split('-');
        return time >= start && time <= end;
      });

      return {
        time,
        available: isAvailable
      };
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>
            {t('description', { serviceTitle: service.title })}
          </DialogDescription>
        </DialogHeader>

        {/* Screen reader announcements */}
        <div role="alert" aria-live="polite" aria-atomic="true" className="sr-only">
          {errors.bookingTime && <span>{errors.bookingTime}</span>}
          {errors.notes && <span>{errors.notes}</span>}
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-4">
          <form onSubmit={handleSubmit} className="space-y-4">
          {/* Service Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{service.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{t('providerPrefix')}</p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{t('priceLabel')}</span>
                <span className="text-lg font-bold text-blue-600">${Number(service.price).toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label>{t('dateLabel')} *</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date()}
              className="rounded-md border"
            />
            {errors.bookingTime && (
              <p className="text-destructive text-sm">{errors.bookingTime}</p>
            )}
          </div>

          {/* Time Slot Selection */}
          {selectedDate && (
            <div className="space-y-2">
              <Label>{t('timeSlotLabel')} *</Label>
              <div className="grid grid-cols-2 gap-2" role="group" aria-label={t('timeSlotsAriaLabel')}>
                {generateTimeSlotsForDate(selectedDate).map((slot) => (
                  <Button
                    key={slot.time}
                    type="button"
                    variant={selectedTimeSlot === slot.time ? "default" : "outline"}
                    size="sm"
                    aria-label={`${slot.time} - ${slot.available ? t('available') : t('unavailable')}`}
                    aria-pressed={selectedTimeSlot === slot.time}
                    role="button"
                    tabIndex={slot.available ? 0 : -1}
                    onClick={() => {
                      setSelectedTimeSlot(slot.time);
                      const bookingTime = new Date(selectedDate);
                      const [hours, minutes] = slot.time.split(':').map(Number);
                      bookingTime.setHours(hours, minutes, 0, 0);
                      handleInputChange('bookingTime', bookingTime.toISOString());
                    }}
                    disabled={!slot.available}
                  >
                    {slot.time}
                    {!slot.available && <span className="sr-only">{t('unavailable')}</span>}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">{t('notesLabel')}</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder={t('notesPlaceholder')}
              rows={3}
            />
            {errors.notes && (
              <p className="text-destructive text-sm">{errors.notes}</p>
            )}
            <p className="text-muted-foreground text-sm">
              {t('charactersCount', { count: formData.notes?.length || 0 })}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={createBookingMutation.isPending}
              className="flex-1"
            >
              {t('cancelButton')}
            </Button>
            <Button
              type="submit"
              disabled={createBookingMutation.isPending || !selectedDate || !selectedTimeSlot}
              className="flex-1"
            >
              {createBookingMutation.isPending ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  {t('bookingButton')}...
                </>
              ) : (
                t('requestBookingButton')
              )}
            </Button>
          </div>

          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
