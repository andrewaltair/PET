import Link from 'next/link';
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { icon: 'w-8 h-8', text: 'text-xl', iconText: 'text-lg' },
  md: { icon: 'w-10 h-10', text: 'text-2xl', iconText: 'text-xl' },
  lg: { icon: 'w-12 h-12', text: 'text-3xl', iconText: 'text-2xl' },
};

export function Logo({ size = 'md', showIcon = true, className = '' }: LogoProps) {
  const sizes = sizeMap[size];

  return (
    <Link 
      href="/" 
      className={`flex items-center gap-3 hover:opacity-80 transition-opacity ${className}`}
      suppressHydrationWarning
    >
      {showIcon && (
        <div className={`${sizes.icon} bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center shadow-md`}>
          <span className={`text-white ${sizes.iconText} font-bold`}>🐾</span>
        </div>
      )}
      <span className={`${sizes.text} font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent font-[var(--font-logo)] tracking-tight`}>
        PetService
      </span>
    </Link>
  );
}

