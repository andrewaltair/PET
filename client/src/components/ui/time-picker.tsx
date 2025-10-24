'use client';

import * as React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export function TimePicker({ value, onChange, className, disabled }: TimePickerProps) {
  const [hours, minutes] = value.split(':').map(Number);
  
  const hoursOptions = Array.from({ length: 24 }, (_, i) => i);
  const minutesOptions = Array.from({ length: 60 }, (_, i) => i);

  const formatTime = (h: number, m: number) => {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const handleHourChange = (hour: string) => {
    onChange(formatTime(Number(hour), minutes));
  };

  const handleMinuteChange = (minute: string) => {
    onChange(formatTime(hours, Number(minute)));
  };

  return (
    <div className={cn(
      "relative inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 shadow-sm transition-all",
      "hover:border-primary/50 hover:shadow-md",
      "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
      disabled && "opacity-50 cursor-not-allowed",
      className
    )}>
      <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      
      <div className="flex items-center gap-1">
        <Select value={String(hours)} onValueChange={handleHourChange} disabled={disabled}>
          <SelectTrigger className="h-8 w-16 px-2 border-none shadow-none hover:bg-muted/50 focus:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-[200px]">
            {hoursOptions.map((h) => (
              <SelectItem key={h} value={String(h)} className="justify-center">
                {String(h).padStart(2, '0')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <span className="text-lg font-semibold text-muted-foreground mx-0.5">:</span>
        
        <Select value={String(minutes)} onValueChange={handleMinuteChange} disabled={disabled}>
          <SelectTrigger className="h-8 w-16 px-2 border-none shadow-none hover:bg-muted/50 focus:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-[200px]">
            {minutesOptions.map((m) => (
              <SelectItem key={m} value={String(m)} className="justify-center">
                {String(m).padStart(2, '0')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

