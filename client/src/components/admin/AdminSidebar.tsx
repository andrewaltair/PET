'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Calendar, 
  CheckCircle, 
  LogOut,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const adminMenuItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Admin Dashboard' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/services', icon: Briefcase, label: 'Services' },
  { href: '/admin/bookings', icon: Calendar, label: 'Bookings' },
  { href: '/admin/verifications', icon: CheckCircle, label: 'Verifications' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const t = useTranslations();
  const { logout } = useAuth();

  return (
    <div className="h-full bg-gray-900 text-white flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <p className="text-sm text-gray-400 mt-1">Pet Service Marketplace</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {adminMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800',
                  isActive && 'bg-gray-800 text-white'
                )}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <Link href="/">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
          >
            <BarChart3 className="mr-3 h-5 w-5" />
            Back to Main Site
          </Button>
        </Link>
        <Button
          variant="ghost"
          onClick={logout}
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800 mt-2"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );
}

