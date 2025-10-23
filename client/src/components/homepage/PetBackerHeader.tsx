'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Globe, Menu, X } from 'lucide-react';
import { LanguageSwitcher } from '../LanguageSwitcher';

export function PetBackerHeader() {
  const { isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = useTranslations();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2" suppressHydrationWarning>
            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">🐾</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">PetService</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/services" className="text-gray-700 hover:text-green-600 transition-colors font-medium" suppressHydrationWarning>
              {t('header.servicesNearMe')}
            </Link>
            <Link href="/register?role=provider" className="text-gray-700 hover:text-green-600 transition-colors font-medium" suppressHydrationWarning>
              {t('header.petSitterJobs')}
            </Link>
            <Link href="/help" className="text-gray-700 hover:text-green-600 transition-colors font-medium" suppressHydrationWarning>
              {t('header.helpCenter')}
            </Link>
            <LanguageSwitcher />
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <Link href="/dashboard" suppressHydrationWarning>
                <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white">
                  {t('header.dashboard')}
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/register" suppressHydrationWarning>
                  <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                    {t('header.signUp')}
                  </Button>
                </Link>
                <Link href="/login" suppressHydrationWarning>
                  <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white">
                    {t('header.login')}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={t('a11y.openMenu')}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </nav>

        {/* Mobile Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-3">
              <Link
                href="/services"
                className="block py-2 text-gray-700 hover:text-green-600 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
                suppressHydrationWarning
              >
                {t('header.servicesNearMe')}
              </Link>
              <Link
                href="/register?role=provider"
                className="block py-2 text-gray-700 hover:text-green-600 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
                suppressHydrationWarning
              >
                {t('header.petSitterJobs')}
              </Link>
              <Link
                href="/help"
                className="block py-2 text-gray-700 hover:text-green-600 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
                suppressHydrationWarning
              >
                {t('header.helpCenter')}
              </Link>
              <div className="py-2">
                <LanguageSwitcher />
              </div>
              <div className="pt-4 border-t border-gray-200 space-y-3">
                {isAuthenticated ? (
                  <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} suppressHydrationWarning>
                    <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white">
                      {t('header.dashboard')}
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} suppressHydrationWarning>
                      <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                        {t('header.signUp')}
                      </Button>
                    </Link>
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} suppressHydrationWarning>
                      <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white">
                        {t('header.login')}
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

