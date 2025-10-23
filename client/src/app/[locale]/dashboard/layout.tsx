'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from 'petservice-marketplace-shared-types';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations('dashboard');
  const { data: profile } = useProfile();

  // Get user's display name
  const getUserDisplayName = () => {
    if (!user) return '';
    if (profile?.firstName) return profile.firstName;
    if (user.email) return user.email.split('@')[0];
    return user.email;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                🐾 PetService
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-4">
                <Link href="/dashboard/profile" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  {t('nav.profile')}
                </Link>
                {user?.role === UserRole.PROVIDER && (
                  <>
                    <Link href="/dashboard/services" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      {t('nav.services')}
                    </Link>
                    <Link href="/dashboard/provider-bookings" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      {t('nav.bookings')}
                    </Link>
                    <Link href="/dashboard/messages" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      {t('nav.messages')}
                    </Link>
                  </>
                )}
                {user?.role === UserRole.OWNER && (
                  <>
                    <Link href="/dashboard/my-bookings" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      {t('nav.myBookings')}
                    </Link>
                    <Link href="/services" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      {t('nav.browseServices')}
                    </Link>
                    <Link href="/dashboard/messages" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      {t('nav.messages')}
                    </Link>
                  </>
                )}
              </nav>

              {/* Mobile Navigation */}
              <div className="md:hidden">
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" aria-label={t('nav.openMenu')}>
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80">
                    <div className="flex flex-col space-y-4 mt-8">
                      <div className="pb-4 border-b">
                        <p className="text-sm text-gray-600">
                          {t('welcome')}, {getUserDisplayName()}
                        </p>
                      </div>

                      <nav className="flex flex-col space-y-2">
                        <Link
                          href="/dashboard/profile"
                          className="text-gray-700 hover:text-blue-600 transition-colors py-2 px-3 rounded-md hover:bg-gray-50"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {t('nav.profileSettings')}
                        </Link>

                        {user?.role === UserRole.PROVIDER && (
                          <>
                            <Link
                              href="/dashboard/services"
                              className="text-gray-700 hover:text-blue-600 transition-colors py-2 px-3 rounded-md hover:bg-gray-50"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {t('nav.myServices')}
                            </Link>
                            <Link
                              href="/dashboard/provider-bookings"
                              className="text-gray-700 hover:text-blue-600 transition-colors py-2 px-3 rounded-md hover:bg-gray-50"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {t('nav.incomingBookings')}
                            </Link>
                            <Link
                              href="/dashboard/messages"
                              className="text-gray-700 hover:text-blue-600 transition-colors py-2 px-3 rounded-md hover:bg-gray-50"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {t('nav.messages')}
                            </Link>
                          </>
                        )}

                        {user?.role === UserRole.OWNER && (
                          <>
                            <Link
                              href="/dashboard/my-bookings"
                              className="text-gray-700 hover:text-blue-600 transition-colors py-2 px-3 rounded-md hover:bg-gray-50"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {t('nav.myBookings')}
                            </Link>
                            <Link
                              href="/services"
                              className="text-gray-700 hover:text-blue-600 transition-colors py-2 px-3 rounded-md hover:bg-gray-50"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {t('nav.browseServices')}
                            </Link>
                            <Link
                              href="/dashboard/messages"
                              className="text-gray-700 hover:text-blue-600 transition-colors py-2 px-3 rounded-md hover:bg-gray-50"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {t('nav.messages')}
                            </Link>
                          </>
                        )}
                      </nav>

                      <div className="pt-4 border-t">
                        <Button
                          variant="outline"
                          onClick={() => {
                            if (confirm(t('logoutConfirm'))) {
                              logout();
                              setMobileMenuOpen(false);
                            }
                          }}
                          className="w-full"
                        >
                          {t('logout')}
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Desktop User Info and Logout */}
              <div className="hidden md:flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {t('welcome')}, {getUserDisplayName()}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (confirm(t('logoutConfirm'))) {
                      logout();
                    }
                  }}
                >
                  {t('logout')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="pb-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            © 2024 PetService. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

