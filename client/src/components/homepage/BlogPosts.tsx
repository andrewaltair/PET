'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight, Calendar, Tag, Eye, MessageCircle, Share2 } from 'lucide-react';
import { format } from 'date-fns';

export function BlogPosts() {
  const t = useTranslations('blog');
  const tPosts = useTranslations('blogPosts');

  const blogPosts = [
    {
      title: tPosts('post1Title'),
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
      category: 'tips',
      publishDate: new Date('2024-01-15'),
      views: 1234,
      comments: 45,
      shares: 23,
    },
    {
      title: tPosts('post2Title'),
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
      category: 'health',
      publishDate: new Date('2024-01-10'),
      views: 856,
      comments: 32,
      shares: 18,
    },
    {
      title: tPosts('post3Title'),
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
      category: 'training',
      publishDate: new Date('2024-01-05'),
      views: 2105,
      comments: 78,
      shares: 42,
    },
    {
      title: tPosts('post4Title'),
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
      category: 'news',
      publishDate: new Date('2024-01-01'),
      views: 1523,
      comments: 56,
      shares: 31,
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white via-green-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Tag className="w-4 h-4" />
            <span>{t('badge')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 leading-tight">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogPosts.map((post, index) => (
            <a key={index} href="#" className="group block">
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
                <div className="aspect-[4/3] relative overflow-hidden flex-shrink-0">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm text-green-600 px-2 py-1 rounded-lg text-xs font-semibold">
                      {t(`categories.${post.category}`)}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{format(post.publishDate, 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{post.views} {t('metadata.views')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>{post.comments} {t('metadata.comments')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Share2 className="w-3 h-3" />
                      <span>{post.shares} {t('metadata.shares')}</span>
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors">
                    {post.title}
                  </h4>
                  <div className="mt-auto pt-2">
                    <span className="text-green-600 group-hover:text-green-700 font-semibold text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      {t('readMore')}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

