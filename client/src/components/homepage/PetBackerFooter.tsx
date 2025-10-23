'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Facebook, Instagram, Twitter, Youtube, ArrowUp } from 'lucide-react';
import { Button } from '../ui/button';

export function PetBackerFooter() {
  const t = useTranslations();
  
  const footerLinks = {
    petService: [
      { label: t('footer.careers'), href: '#' },
      { label: t('footer.blog'), href: '#' },
      { label: t('footer.about'), href: '#' },
      { label: t('footer.happenings'), href: '#' },
      { label: t('footer.help'), href: '#' },
      { label: t('footer.terms'), href: '#' },
      { label: t('footer.privacy'), href: '#' },
    ],
    petLover: [
      { label: t('footer.beSitter'), href: '/register?role=provider' },
      { label: t('footer.beWalker'), href: '/register?role=provider' },
      { label: t('footer.app'), href: '#' },
      { label: t('footer.protection'), href: '#' },
      { label: t('footer.rescue'), href: '#' },
    ],
    petServices: [
      { label: t('footer.board'), href: '/services' },
      { label: t('footer.sitting'), href: '/services' },
      { label: t('footer.walking'), href: '/services' },
      { label: t('footer.daycare'), href: '/services' },
      { label: t('footer.taxi'), href: '/services' },
      { label: t('footer.grooming'), href: '/services' },
    ],
    contact: [
      { label: t('footer.talk'), href: '/contact' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: t('social.facebook') },
    { icon: Instagram, href: '#', label: t('social.instagram') },
    { icon: Twitter, href: '#', label: t('social.twitter') },
    { icon: Youtube, href: '#', label: t('social.youtube') },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* PetService Column */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t('footer.column1Title')}</h3>
            <ul className="space-y-2">
              {footerLinks.petService.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pet Lover Column */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t('footer.column2Title')}</h3>
            <ul className="space-y-2">
              {footerLinks.petLover.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pet Services Column */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t('footer.column3Title')}</h3>
            <ul className="space-y-2">
              {footerLinks.petServices.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us Column */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t('footer.column4Title')}</h3>
            <ul className="space-y-2">
              {footerLinks.contact.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Media & Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Social Media Icons */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-green-600 hover:to-blue-600 transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>

            {/* Copyright */}
            <div className="text-sm text-gray-400">
              {t('footer.copyright')}
            </div>
          </div>

          {/* Back to Top */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={scrollToTop}
              className="text-gray-400 hover:text-white transition-colors text-sm inline-flex items-center gap-2"
            >
              {t('footer.backToTop')}
              <ArrowUp className="w-4 h-4 b-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

