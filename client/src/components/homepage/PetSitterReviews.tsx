'use client';

import React from 'react';
import { Star, MapPin, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function PetSitterReviews() {
  const t = useTranslations('testimonials');
  const tAuthor = useTranslations('testimonialsAuthor');
  
  const testimonials = [
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
  ];

  return (
    <div className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Star className="w-4 h-4 fill-current" />
            {t('badge')}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-gray-700 mb-6 leading-relaxed italic">
                "{testimonial.review}"
              </p>

              {/* User Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{testimonial.name}</span>
                    {testimonial.verified && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-3 h-3" />
                    <span>{testimonial.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <a href="/services" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold text-lg">
            {t('viewAllProviders')}
            <ChevronRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
