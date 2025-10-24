'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { TimePicker } from '@/components/ui/time-picker';
import { Calendar } from 'lucide-react';
import { User } from 'petservice-marketplace-shared-types';

interface ProviderAvailabilityFormProps {
  user: User;
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function ProviderAvailabilityForm({ user }: ProviderAvailabilityFormProps) {
  const t = useTranslations('providerProfile');
  const [availability, setAvailability] = useState<Record<string, { startTime: string; endTime: string; isAvailable: boolean }>>({
    Monday: { startTime: '09:00', endTime: '17:00', isAvailable: true },
    Tuesday: { startTime: '09:00', endTime: '17:00', isAvailable: true },
    Wednesday: { startTime: '09:00', endTime: '17:00', isAvailable: true },
    Thursday: { startTime: '09:00', endTime: '17:00', isAvailable: true },
    Friday: { startTime: '09:00', endTime: '17:00', isAvailable: true },
    Saturday: { startTime: '09:00', endTime: '17:00', isAvailable: false },
    Sunday: { startTime: '09:00', endTime: '17:00', isAvailable: false },
  });

  const handleDayToggle = (day: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: { ...prev[day], isAvailable: !prev[day].isAvailable }
    }));
  };

  const handleTimeChange = (day: string, field: 'startTime' | 'endTime', value: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  const handleSave = () => {
    // TODO: Implement API call to save availability
    console.log('Saving availability:', availability);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">{t('setAvailability')}</h3>
          </div>
          <div className="space-y-4">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day} className="flex items-center gap-4 p-4 border rounded-lg">
                <input
                  type="checkbox"
                  id={day}
                  checked={availability[day].isAvailable}
                  onChange={() => handleDayToggle(day)}
                  className="w-4 h-4"
                />
                <Label htmlFor={day} className="flex-1 font-medium cursor-pointer">
                  {t(day.toLowerCase() as any)}
                </Label>
                {availability[day].isAvailable && (
                  <div className="flex items-center gap-2">
                    <TimePicker
                      value={availability[day].startTime}
                      onChange={(value) => handleTimeChange(day, 'startTime', value)}
                      className="w-auto"
                    />
                    <span className="text-gray-500">to</span>
                    <TimePicker
                      value={availability[day].endTime}
                      onChange={(value) => handleTimeChange(day, 'endTime', value)}
                      className="w-auto"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-6">
            <Button onClick={handleSave} variant="success">Save Availability</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

