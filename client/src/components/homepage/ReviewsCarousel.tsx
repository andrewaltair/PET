'use client';

import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '../ui/button';
import { useTranslations } from 'next-intl';

interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  review: string;
  avatar: string;
  petType: string;
  verified: boolean;
}

export function ReviewsCarousel() {
  const t = useTranslations('testimonials');
  const tAuthor = useTranslations('testimonialsAuthor');
  
  const reviews: Review[] = [
    {
      id: '1',
      name: tAuthor('name1'),
      location: tAuthor('location1'),
      rating: 5,
      review: t('review1'),
      avatar: '/avatars/1a270860bac2c66b434968a3047822e3.webp',
      petType: 'Dog',
      verified: true,
    },
    {
      id: '2',
      name: tAuthor('name2'),
      location: tAuthor('location2'),
      rating: 5,
      review: t('review2'),
      avatar: '/avatars/2b04cc0b930f82afe6c38d3209dcbdfd.webp',
      petType: 'Cat',
      verified: true,
    },
    {
      id: '3',
      name: tAuthor('name3'),
      location: tAuthor('location3'),
      rating: 5,
      review: t('review3'),
      avatar: '/avatars/1c9a4dd0bbd964e3eecbd40caf3b7e37.webp',
      petType: 'Dog',
      verified: true,
    },
    {
      id: '4',
      name: tAuthor('name4'),
      location: tAuthor('location4'),
      rating: 5,
      review: t('review4'),
      avatar: '/avatars/1dd1b479633b29ff2fd9d6644581f394.webp',
      petType: 'Dog',
      verified: true,
    },
    {
      id: '5',
      name: tAuthor('name5'),
      location: tAuthor('location5'),
      rating: 5,
      review: t('review5'),
      avatar: '/avatars/2244af71ad0c25f2cb0a8efa167491fb.webp',
      petType: 'Cat',
      verified: true,
    },
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Star className="w-4 h-4 fill-current" />
            {t('carouselBadge')}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('carouselTitle')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('carouselSubtitle')}
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Carousel Container */}
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {reviews.map((review) => (
                <div key={review.id} className="min-w-full">
                  <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
                    <div className="max-w-3xl mx-auto text-center">
                      {/* Quote Icon */}
                      <Quote className="w-12 h-12 text-green-200 mx-auto mb-6" />

                      {/* Rating */}
                      <div className="flex items-center justify-center gap-1 mb-6">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                        ))}
                      </div>

                      {/* Review Text */}
                      <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed italic">
                        "{review.review}"
                      </p>

                      {/* User Info */}
                      <div className="flex items-center justify-center gap-4">
                        <img
                          src={review.avatar}
                          alt={review.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-green-200"
                        />
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">{review.name}</span>
                            {review.verified && (
                              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{review.location} • {review.petType} Owner</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110"
            aria-label="Next review"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-green-600 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

