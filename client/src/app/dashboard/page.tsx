'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from 'petservice-marketplace-shared-types';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Sheet, SheetContent, SheetTrigger } from '../../components/ui/sheet';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../../components/ui/breadcrumb';
import { Menu, X } from 'lucide-react';

function DashboardContent() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-gray-900">🐾 PetService</Link>
              <span className="text-sm text-gray-500 hidden sm:inline">Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-4">
                <Link href="/dashboard/profile" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Profile
                </Link>
                {user.role === UserRole.PROVIDER && (
                  <>
                    <Link href="/dashboard/services" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      Services
                    </Link>
                    <Link href="/dashboard/provider-bookings" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      Bookings
                    </Link>
                    <Link href="/dashboard/messages" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      Messages
                    </Link>
                  </>
                )}
                {user.role === UserRole.OWNER && (
                  <>
                    <Link href="/dashboard/my-bookings" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      My Bookings
                    </Link>
                    <Link href="/services" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      Browse Services
                    </Link>
                    <Link href="/dashboard/messages" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      Messages
                    </Link>
                  </>
                )}
              </nav>

              {/* Mobile Navigation */}
              <div className="md:hidden">
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" aria-label="Open menu">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80">
                    <div className="flex flex-col space-y-4 mt-8">
                      <div className="pb-4 border-b">
                        <p className="text-sm text-gray-600">Welcome, {user.email}</p>
                      </div>

                      <nav className="flex flex-col space-y-2">
                        <Link
                          href="/dashboard/profile"
                          className="text-gray-700 hover:text-blue-600 transition-colors py-2 px-3 rounded-md hover:bg-gray-50"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Profile Settings
                        </Link>

                        {user.role === UserRole.PROVIDER && (
                          <>
                            <Link
                              href="/dashboard/services"
                              className="text-gray-700 hover:text-blue-600 transition-colors py-2 px-3 rounded-md hover:bg-gray-50"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              My Services
                            </Link>
                            <Link
                              href="/dashboard/provider-bookings"
                              className="text-gray-700 hover:text-blue-600 transition-colors py-2 px-3 rounded-md hover:bg-gray-50"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              Incoming Bookings
                            </Link>
                            <Link
                              href="/dashboard/messages"
                              className="text-gray-700 hover:text-blue-600 transition-colors py-2 px-3 rounded-md hover:bg-gray-50"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              Messages
                            </Link>
                          </>
                        )}

                        {user.role === UserRole.OWNER && (
                          <>
                            <Link
                              href="/dashboard/my-bookings"
                              className="text-gray-700 hover:text-blue-600 transition-colors py-2 px-3 rounded-md hover:bg-gray-50"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              My Bookings
                            </Link>
                            <Link
                              href="/services"
                              className="text-gray-700 hover:text-blue-600 transition-colors py-2 px-3 rounded-md hover:bg-gray-50"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              Browse Services
                            </Link>
                            <Link
                              href="/dashboard/messages"
                              className="text-gray-700 hover:text-blue-600 transition-colors py-2 px-3 rounded-md hover:bg-gray-50"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              Messages
                            </Link>
                          </>
                        )}
                      </nav>

                      <div className="pt-4 border-t">
                        <Button
                          onClick={logout}
                          variant="outline"
                          className="w-full"
                        >
                          Logout
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Desktop User Info and Logout */}
              <div className="hidden md:flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {user.email}
                </span>
                <Button
                  onClick={logout}
                  variant="outline"
                  size="sm"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Card */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Welcome to PetService! 🎉
                  </h1>
                  <p className="text-gray-600">
                    {user.role === UserRole.OWNER
                      ? 'Find trusted service providers for your pets.'
                      : 'Manage your services and connect with pet owners.'
                    }
                  </p>
                </div>
                <div className="text-6xl">
                  {user.role === UserRole.OWNER ? '🐕' : '🏢'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role-specific content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.role === UserRole.OWNER ? (
              // Pet Owner Dashboard
              <>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-3xl mb-4">🔍</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Find Services
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Browse available pet services in your area.
                    </p>
                    <Button asChild className="w-full">
                      <Link href="/services">
                        Browse Services
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-3xl mb-4">📅</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      My Bookings
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      View and manage your service bookings.
                    </p>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/dashboard/my-bookings">
                        View Bookings
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-3xl mb-4">⭐</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Reviews
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Read reviews and share your experiences.
                    </p>
                    <Button variant="outline" className="w-full">
                      View Reviews
                    </Button>
                  </CardContent>
                </Card>
              </>
            ) : (
              // Service Provider Dashboard
              <>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-3xl mb-4">👤</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Profile Settings
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Update your profile information and bio.
                    </p>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/dashboard/profile">
                        Edit Profile
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-3xl mb-4">➕</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Add Service
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Create and publish new pet services.
                    </p>
                    <Button asChild className="w-full">
                      <Link href="/dashboard/services/new">
                        Add Service
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-3xl mb-4">📋</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Manage Services
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Edit and manage your existing services.
                    </p>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/dashboard/services">
                        Manage Services
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-3xl mb-4">📅</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Incoming Bookings
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Review and manage booking requests for your services.
                    </p>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/dashboard/provider-bookings">
                        View Bookings
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-6 text-center shadow-sm border">
              <div className="text-2xl font-bold text-blue-600">0</div>
              <div className="text-sm text-gray-600">
                {user.role === UserRole.OWNER ? 'Active Bookings' : 'Total Services'}
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-sm border">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-gray-600">
                {user.role === UserRole.OWNER ? 'Completed Services' : 'Total Bookings'}
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-sm border">
              <div className="text-2xl font-bold text-purple-600">0</div>
              <div className="text-sm text-gray-600">Reviews</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-sm border">
              <div className="text-2xl font-bold text-orange-600">0</div>
              <div className="text-sm text-gray-600">Favorites</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
