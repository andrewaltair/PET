'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { LogIn, UserPlus, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

export function AuthModal({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const router = useRouter();
  const t = useTranslations('auth');

  const handleSuccess = () => {
    onClose();
    router.push('/dashboard');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg overflow-hidden p-0 gap-0 border-0 shadow-2xl">
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-green-600 via-emerald-500 to-blue-600 p-6 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          
          <DialogHeader className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                {activeTab === 'login' ? (
                  <LogIn className="w-6 h-6 text-white" />
                ) : (
                  <UserPlus className="w-6 h-6 text-white" />
                )}
              </div>
              <DialogTitle className="text-3xl font-bold text-white tracking-tight">
                {activeTab === 'login' ? t('welcomeBackModal') : t('joinUsToday')}
              </DialogTitle>
            </div>
            <DialogDescription className="text-center text-white/90 text-base">
              {activeTab === 'login'
                ? t('signInToContinue')
                : t('createAccountAndConnect')}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Tab Switcher */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-4 px-6 text-sm font-semibold transition-all duration-300 relative ${
                activeTab === 'login'
                  ? 'text-green-600 bg-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <LogIn className={`w-4 h-4 transition-all ${activeTab === 'login' ? 'scale-110' : ''}`} />
                <span>{t('signIn')}</span>
              </div>
              {activeTab === 'login' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-600 to-blue-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-4 px-6 text-sm font-semibold transition-all duration-300 relative ${
                activeTab === 'register'
                  ? 'text-green-600 bg-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <UserPlus className={`w-4 h-4 transition-all ${activeTab === 'register' ? 'scale-110' : ''}`} />
                <span>{t('signUp')}</span>
              </div>
              {activeTab === 'register' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-600 to-blue-600"></div>
              )}
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 bg-white">
          {activeTab === 'login' ? (
            <LoginForm onSuccess={handleSuccess} />
          ) : (
            <RegisterForm onSuccess={handleSuccess} />
          )}
        </div>

        {/* Decorative Footer */}
        <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-blue-50 h-2"></div>
      </DialogContent>
    </Dialog>
  );
}

