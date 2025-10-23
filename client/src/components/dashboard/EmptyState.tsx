import Link from 'next/link';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { UserRole } from 'petservice-marketplace-shared-types';
import { Search, Plus, Calendar, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  type: 'bookings' | 'services' | 'dashboard';
  role: UserRole;
}

export function EmptyState({ type, role }: EmptyStateProps) {
  const getContent = () => {
    if (type === 'dashboard') {
      return {
        icon: <Sparkles className="w-16 h-16 text-blue-500" />,
        title: role === UserRole.OWNER 
          ? 'Welcome to PetService! 🎉' 
          : 'Get Started as a Provider',
        description: role === UserRole.OWNER
          ? 'Find trusted pet service providers in your area. Start by browsing available services.'
          : 'Start offering your pet services to pet owners. Create your first service to get started.',
        primaryAction: role === UserRole.OWNER 
          ? { text: 'Browse Services', href: '/services' }
          : { text: 'Create Service', href: '/dashboard/services/new' },
        secondaryAction: role === UserRole.OWNER
          ? { text: 'Learn More', href: '/about' }
          : { text: 'View Profile', href: '/dashboard/profile' }
      };
    }

    if (type === 'bookings') {
      return {
        icon: <Calendar className="w-16 h-16 text-blue-500" />,
        title: 'No Bookings Yet',
        description: role === UserRole.OWNER
          ? 'You haven\'t booked any services yet. Browse available services to get started.'
          : 'No booking requests yet. Create services to attract pet owners.',
        primaryAction: role === UserRole.OWNER
          ? { text: 'Browse Services', href: '/services' }
          : { text: 'Create Service', href: '/dashboard/services/new' },
        secondaryAction: null
      };
    }

    if (type === 'services') {
      return {
        icon: <Plus className="w-16 h-16 text-blue-500" />,
        title: 'No Services Yet',
        description: 'Create your first service to start offering pet care services to owners.',
        primaryAction: { text: 'Create Service', href: '/dashboard/services/new' },
        secondaryAction: { text: 'Learn More', href: '/dashboard/help' }
      };
    }

    return null;
  };

  const content = getContent();
  if (!content) return null;

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 px-6">
        <div className="mb-4">{content.icon}</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
          {content.title}
        </h3>
        <p className="text-gray-600 text-center mb-6 max-w-md">
          {content.description}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild size="lg">
            <Link href={content.primaryAction.href}>
              {content.primaryAction.text}
            </Link>
          </Button>
          {content.secondaryAction && (
            <Button asChild variant="outline" size="lg">
              <Link href={content.secondaryAction.href}>
                {content.secondaryAction.text}
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}


