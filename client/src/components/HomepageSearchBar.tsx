'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Search, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar as CalendarComponent } from './ui/calendar';
import { format } from 'date-fns';
import { ServiceType } from 'petservice-marketplace-shared-types';

const getServiceTypeLabel = (serviceType: ServiceType): string => {
  const labels: Record<ServiceType, string> = {
    [ServiceType.WALKING]: 'Dog Walking',
    [ServiceType.SITTING]: 'Pet Sitting',
    [ServiceType.GROOMING]: 'Grooming',
    [ServiceType.VETERINARIAN_VISIT]: 'Vet Visit',
    [ServiceType.TAXI]: 'Pet Taxi',
    [ServiceType.TRAINING]: 'Training',
  };
  return labels[serviceType] || serviceType;
};

export function HomepageSearchBar() {
  const router = useRouter();
  const [serviceType, setServiceType] = useState<ServiceType | 'all'>('all');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState<Date>();

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (serviceType !== 'all') {
      params.set('serviceType', serviceType);
    }

    if (location.trim()) {
      params.set('location', location.trim());
    }

    if (date) {
      params.set('date', format(date, 'yyyy-MM-dd'));
    }

    router.push(`/services?${params.toString()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="p-2">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            {/* Service Type */}
            <div className="relative">
              <Select
                value={serviceType}
                onValueChange={(value) => setServiceType(value as ServiceType | 'all')}
              >
                <SelectTrigger className="h-14 bg-gray-50 border-0 focus:ring-2 focus:ring-blue-500">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-gray-400" />
                    <SelectValue placeholder="Service type" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All services</SelectItem>
                  <SelectItem value={ServiceType.WALKING}>🐕 Dog Walking</SelectItem>
                  <SelectItem value={ServiceType.SITTING}>🏡 Pet Sitting</SelectItem>
                  <SelectItem value={ServiceType.GROOMING}>✂️ Grooming</SelectItem>
                  <SelectItem value={ServiceType.VETERINARIAN_VISIT}>🏥 Vet Visit</SelectItem>
                  <SelectItem value={ServiceType.TAXI}>🚗 Pet Taxi</SelectItem>
                  <SelectItem value={ServiceType.TRAINING}>🎾 Training</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div className="relative">
              <Input
                type="text"
                placeholder="Location (city, zip)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyPress={handleKeyPress}
                className="h-14 bg-gray-50 border-0 focus:ring-2 focus:ring-blue-500 pl-12"
              />
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            {/* Date */}
            <div className="relative">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-14 w-full bg-gray-50 border-0 justify-start text-left font-normal focus:ring-2 focus:ring-blue-500"
                  >
                    <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                    {date ? format(date, 'MMM dd, yyyy') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              className="h-14 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
            >
              <Search className="mr-2 h-5 w-5" />
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
