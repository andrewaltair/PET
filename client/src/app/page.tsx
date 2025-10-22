'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { HomepageSearchBar } from '../components/HomepageSearchBar';
import { TopRatedProviders } from '../components/TopRatedProviders';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  // Don't render while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="text-2xl font-bold text-white">
            🐾 PetService
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/services" className="text-white hover:text-blue-200 font-medium transition-colors">
              Browse Services
            </Link>
            <div className="space-x-4">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1544568100-847a948585b9?w=1920&h=1080&fit=crop&crop=center")'
          }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50" />

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Find Trusted Pet Care Services Near You
          </h1>
          <p className="text-xl md:text-2xl mb-12 opacity-90">
            Connect with professional pet sitters, walkers, and groomers who love your furry friends as much as you do.
          </p>

          {/* Search Bar */}
          <HomepageSearchBar />
        </div>
      </section>

      {/* Top-Rated Providers Section */}
      <TopRatedProviders />

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional pet care services tailored to your needs, from trusted local providers.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: '🐕',
                title: 'Dog Walking',
                description: 'Professional walks with experienced, animal-loving walkers.',
              },
              {
                icon: '🏡',
                title: 'Pet Sitting',
                description: 'In-home care when you\'re away, ensuring your pets feel at home.',
              },
              {
                icon: '✂️',
                title: 'Grooming',
                description: 'Keep your pets looking and feeling their best.',
              },
              {
                icon: '🏥',
                title: 'Veterinary Care',
                description: 'Emergency and routine care from licensed professionals.',
              },
              {
                icon: '🚗',
                title: 'Pet Taxi',
                description: 'Safe transportation for vet visits and other needs.',
              },
              {
                icon: '🎾',
                title: 'Training',
                description: 'Professional training from certified dog trainers.',
              },
            ].map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardContent className="pt-8 pb-8">
                  <div className="text-5xl mb-6">{service.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-2xl font-bold mb-4">🐾 PetService</div>
            <p className="text-gray-400 mb-4">
              Connecting pet owners with trusted service providers since 2024.
            </p>
            <p className="text-sm text-gray-500">
              © 2024 Pet Service Marketplace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

