'use client';

import React, { Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { PetBackerHeader } from '../../components/homepage/PetBackerHeader';
import { PetBackerSearchBar } from '../../components/homepage/PetBackerSearchBar';
import { ServiceCategories } from '../../components/homepage/ServiceCategories';
import { PetSitterReviews } from '../../components/homepage/PetSitterReviews';
import { AppDownload } from '../../components/homepage/AppDownload';
import { HowItWorks } from '../../components/homepage/HowItWorks';
import { Benefits } from '../../components/homepage/Benefits';
import { CostEstimates } from '../../components/homepage/CostEstimates';
import { WhyChooseUs } from '../../components/homepage/WhyChooseUs';
import { Locations } from '../../components/homepage/Locations';
import { BecomeProvider } from '../../components/homepage/BecomeProvider';
import { BlogPosts } from '../../components/homepage/BlogPosts';
import { PetBackerFooter } from '../../components/homepage/PetBackerFooter';
import { AnimatedCounter } from '../../components/homepage/AnimatedCounter';
import { TrustBadges } from '../../components/homepage/TrustBadges';
import { FAQ } from '../../components/homepage/FAQ';
import { LiveChat } from '../../components/homepage/LiveChat';
import { ReviewsCarousel } from '../../components/homepage/ReviewsCarousel';

export default function HomePage() {
  const t = useTranslations();
  return (
    <div className="min-h-screen bg-white">
      {/* Skip to content link for accessibility */}
      <a 
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-gradient-to-r focus:from-green-600 focus:to-blue-600 focus:text-white focus:rounded-md focus:shadow-lg"
      >
        {t('hero.skipToContent')}
      </a>
      
      {/* Header */}
      <PetBackerHeader />

      {/* Hero Section */}
      <section id="main-content" className="relative pt-12 pb-20 bg-gradient-to-br from-green-50 via-white to-blue-50 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden opacity-5">
          <div className="absolute top-20 right-20 w-96 h-96 bg-green-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 pt-8 pb-12">
          {/* Social Proof Badge */}
          <div className="flex justify-center mb-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md border border-green-100 hover:shadow-lg transition-all duration-300 hover:scale-105 group">
              <div className="flex -space-x-2">
                {[
                  '0450249b131eec36dc8333b7cf847bc4.webp',
                  '06d29f74c2f85239efe3f9ade1b96da7.webp',
                  '098d5b19a0870d95bee0cdbcef632be1.webp',
                  '112413f070536d15170606f2d00aa15d.webp'
                ].map((avatar, i) => (
                  <img 
                    key={i}
                    src={`/avatars/${avatar}`}
                    alt={`User ${i + 1}`}
                    className="w-8 h-8 rounded-full border-2 border-white object-cover transform transition-transform duration-300 group-hover:scale-110"
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-700 group-hover:text-green-600 transition-colors">
                {t('hero.join')} <span className="text-green-600">50,000+</span> {t('hero.petParents')}
              </span>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 text-center max-w-5xl mx-auto leading-tight animate-slide-in-right">
            {t('hero.titleLine1')}<br className="hidden md:block" />
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent animate-subtle-glow"> {t('hero.titleLine2')}</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-600 mb-10 text-center max-w-3xl mx-auto animate-fade-in">
            {t('hero.subtitle')}
          </p>

          {/* Search Bar */}
          <PetBackerSearchBar />

          {/* Quick Stats */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 md:gap-12">
            <div className="text-center">
              <AnimatedCounter 
                value={50000} 
                suffix="+" 
                className="text-3xl md:text-4xl font-bold text-green-600"
              />
              <div className="text-sm text-gray-600">{t('hero.happyPets')}</div>
            </div>
            <div className="text-center">
              <AnimatedCounter 
                value={10000} 
                suffix="+" 
                className="text-3xl md:text-4xl font-bold text-blue-600"
              />
              <div className="text-sm text-gray-600">{t('hero.verifiedProviders')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-600">4.9★</div>
              <div className="text-sm text-gray-600">{t('hero.averageRating')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600">24/7</div>
              <div className="text-sm text-gray-600">{t('hero.support')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <TrustBadges />

      {/* Service Categories */}
      <ServiceCategories />

      {/* Pet Sitter Reviews */}
      <Suspense fallback={<div className="py-16 bg-white"><div className="text-center">{t('common.loading')}</div></div>}>
        <PetSitterReviews />
      </Suspense>

      {/* How It Works */}
      <HowItWorks />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* App Download Section */}
      <AppDownload />

      {/* Become Provider */}
      <BecomeProvider />

      {/* Blog Posts */}
      <BlogPosts />

      {/* FAQ Section */}
      <FAQ />

      {/* Reviews Carousel */}
      <ReviewsCarousel />

      {/* Footer */}
      <PetBackerFooter />

      {/* Live Chat */}
      <LiveChat />
    </div>
  );
}

