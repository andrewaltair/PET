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
import { AuthModal } from './auth/AuthModal';

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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  // If user is not logged in or not an OWNER, show login prompt
  if (!user) {
    return (
      <>
        <Dialog open={isOpen} onOpenChange={onCancel}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t('signInRequired.title')}</DialogTitle>
              <DialogDescription>
                {t('signInRequired.description')}
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => {
                setAuthModalTab('login');
                setIsAuthModalOpen(true);
              }}>
                {t('signInRequired.signInButton')}
              </Button>
              <Button variant="outline" onClick={() => {
                setAuthModalTab('register');
                setIsAuthModalOpen(true);
              }}>
                {t('signInRequired.signUpButton')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)}
          defaultTab={authModalTab}
        />
      </>
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
      <DialogContent className="sm:max-w-2xl max-h-[95vh] flex flex-col overflow-hidden p-0 gap-0 bg-gradient-to-br from-gray-50 to-white">
        {/* Animated Header */}
        <div className="relative overflow-hidden bg-[hsl(199,89%,48%)] px-6 py-5 shadow-md">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative">
            <DialogTitle className="text-xl font-bold text-white drop-shadow-md">
              {t('title')}
            </DialogTitle>
            <DialogDescription className="text-sm text-white/90 mt-1 font-medium">
              {t('completeBooking')}
            </DialogDescription>
          </div>
        </div>

        {/* Screen reader announcements */}
        <div role="alert" aria-live="polite" aria-atomic="true" className="sr-only">
          {errors.bookingTime && <span>{errors.bookingTime}</span>}
          {errors.notes && <span>{errors.notes}</span>}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-y-auto p-6 space-y-4">
          {/* Service Summary Card with Animation */}
          <div className="group relative rounded-xl bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 hover:border-[hsl(199,89%,48%)]/30 p-5 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute inset-0 bg-[hsl(199,89%,48%)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            <div className="relative flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[hsl(199,89%,48%)] animate-pulse"></div>
                  <span className="text-xs font-semibold text-[hsl(199,89%,48%)] uppercase tracking-wide">{t('providerPrefix')}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[hsl(199,89%,48%)] transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-600 font-medium">
                  {service.provider?.firstName && service.provider?.lastName 
                    ? `${service.provider.firstName} ${service.provider.lastName}` 
                    : service.provider?.firstName || 'N/A'}
                </p>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="text-xs text-gray-500 mb-1 font-medium">{t('priceLabel')}</div>
                <div className="text-3xl font-bold text-[hsl(199,89%,48%)]">
                  ${Number(service.price).toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Date and Time Selection - Side by Side */}
          <div className="flex-shrink-0">
            <div className="flex gap-4 items-start">
              {/* Calendar Section */}
              <div className="flex flex-col">
                <Label className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <div className="w-1 h-5 bg-[hsl(199,89%,48%)] rounded-full"></div>
                  {t('dateLabel')} <span className="text-red-500 animate-pulse">*</span>
                </Label>
                <div className="rounded-xl border-2 border-gray-200 hover:border-[hsl(199,89%,48%)]/50 bg-white p-3 flex justify-center shadow-sm hover:shadow-md transition-all duration-300">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    className="w-fit [--cell-size:1.75rem] p-1"
                  />
                </div>
              </div>

              {/* Time Slots Section */}
              {selectedDate && (
                <div className="flex-1 flex flex-col animate-fade-in">
                  <Label className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <div className="w-1 h-5 bg-[hsl(199,89%,48%)] rounded-full"></div>
                    {t('timeSlotLabel')} <span className="text-red-500 animate-pulse">*</span>
                  </Label>
                  <div className="grid grid-cols-3 gap-2" role="group" aria-label={t('timeSlotsAriaLabel')}>
                    {generateTimeSlotsForDate(selectedDate).map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => {
                          setSelectedTimeSlot(slot.time);
                          const bookingTime = new Date(selectedDate);
                          const [hours, minutes] = slot.time.split(':').map(Number);
                          bookingTime.setHours(hours, minutes, 0, 0);
                          handleInputChange('bookingTime', bookingTime.toISOString());
                        }}
                        disabled={!slot.available}
                        className={`
                          h-10 text-sm font-semibold rounded-lg transition-all duration-300 relative overflow-hidden
                          ${selectedTimeSlot === slot.time
                            ? 'bg-[hsl(199,89%,48%)] text-white shadow-lg scale-105 ring-2 ring-[hsl(199,89%,48%)]/30'
                            : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,48%)]/5 hover:shadow-md hover:scale-105'
                          }
                          ${!slot.available 
                            ? 'opacity-40 cursor-not-allowed bg-gray-100 hover:scale-100 hover:shadow-none' 
                            : 'cursor-pointer'
                          }
                        `}
                        aria-label={`${slot.time} - ${slot.available ? t('available') : t('unavailable')}`}
                        aria-pressed={selectedTimeSlot === slot.time}
                      >
                        {selectedTimeSlot === slot.time ? (
                          <span className="flex items-center justify-center gap-1">
                            <span className="text-xs">✓</span>
                            <span>{slot.time}</span>
                          </span>
                        ) : (
                          slot.time
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {errors.bookingTime && (
              <p className="text-red-600 text-xs font-medium mt-2 flex items-center gap-1">
                <span>⚠</span> {errors.bookingTime}
              </p>
            )}
          </div>

          {/* Notes Section */}
          <div className="flex-1 min-h-0 flex flex-col">
            <Label htmlFor="notes" className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <div className="w-1 h-5 bg-[hsl(199,89%,48%)] rounded-full"></div>
              {t('notesLabel')}
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder={t('notesPlaceholder')}
              rows={4}
              className="flex-1 resize-none border-2 border-gray-300 rounded-xl focus:border-[hsl(199,89%,48%)] focus:ring-2 focus:ring-[hsl(199,89%,48%)]/20 transition-all duration-300 text-sm p-4 bg-white hover:border-[hsl(199,89%,48%)]/50 shadow-sm hover:shadow-md"
            />
            {errors.notes && (
              <p className="text-red-600 text-xs font-medium mt-2 flex items-center gap-1">
                <span>⚠</span> {errors.notes}
              </p>
            )}
            <p className="text-gray-500 text-xs font-medium mt-2 ml-1">
              {t('charactersCount', { count: formData.notes?.length || 0 })}
            </p>
          </div>
        </form>

        {/* Action Buttons */}
        <div className="flex-shrink-0 border-t-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white p-5 shadow-lg">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={createBookingMutation.isPending}
              className="flex-1 h-12 text-sm font-semibold border-2 hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-md"
            >
              {t('cancelButton')}
            </Button>
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(e as any);
              }}
              disabled={createBookingMutation.isPending || !selectedDate || !selectedTimeSlot}
              className="flex-1 h-12 text-sm font-bold bg-[hsl(199,89%,48%)] hover:bg-[hsl(199,89%,44%)] text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg"
            >
              {createBookingMutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="sm" />
                  <span>{t('bookingButton')}...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span className="text-lg animate-bounce">✨</span>
                  <span>{t('requestBookingButton')}</span>
                </span>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
