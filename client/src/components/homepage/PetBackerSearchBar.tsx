'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Search, MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ServiceType } from 'petservice-marketplace-shared-types';

export function PetBackerSearchBar() {
  const router = useRouter();
  const t = useTranslations('searchBar');
  const [serviceType, setServiceType] = useState<ServiceType | 'all'>('all');
  const [location, setLocation] = useState('');
  const locationInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Ctrl+K or Cmd+K to focus search
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        locationInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (serviceType !== 'all') {
      params.set('serviceType', serviceType);
    }
    if (location.trim()) {
      params.set('location', location.trim());
    }
    router.push(`/services?${params.toString()}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Main Search Bar */}
      <div className="bg-white rounded-2xl shadow-2xl p-2 flex flex-col md:flex-row items-stretch md:items-center gap-2 border border-gray-100">
        {/* Service Type */}
        <Select
          value={serviceType}
          onValueChange={(value) => setServiceType(value as ServiceType | 'all')}
        >
          <SelectTrigger className="h-14 bg-gray-50 border-0 text-gray-700 font-medium flex-shrink-0 md:w-[180px]">
            <SelectValue placeholder={t('selectService')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allServices')}</SelectItem>
            <SelectItem value={ServiceType.WALKING}>{t('dogWalking')}</SelectItem>
            <SelectItem value={ServiceType.SITTING}>{t('petSitting')}</SelectItem>
            <SelectItem value={ServiceType.GROOMING}>{t('grooming')}</SelectItem>
            <SelectItem value={ServiceType.TAXI}>{t('petTaxi')}</SelectItem>
            <SelectItem value={ServiceType.TRAINING}>{t('training')}</SelectItem>
          </SelectContent>
        </Select>

        {/* Location */}
        <div className="relative flex-1">
          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            ref={locationInputRef}
            type="text"
            placeholder={t('enterLocation')}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="h-14 pl-12 bg-gray-50 border-0 text-gray-700 placeholder:text-gray-500 text-base"
          />
        </div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          className="h-12 md:h-14 w-full md:w-auto bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 md:px-8 font-semibold flex-shrink-0 shadow-lg hover:shadow-xl transition-all"
        >
          <Search className="w-5 h-5 md:mr-2" />
          <span className="hidden md:inline">{t('search')}</span>
        </Button>
      </div>

      {/* Trust Badge */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>{t('freeSearch')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>{t('noBookingFees')}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>{t('verifiedProviders')}</span>
        </div>
      </div>
    </div>
  );
}
