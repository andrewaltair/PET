import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Zap, MessageSquare, Settings, HelpCircle } from 'lucide-react';
import { UserRole } from 'petservice-marketplace-shared-types';

interface QuickActionsProps {
  role: UserRole;
}

export function QuickActions({ role }: QuickActionsProps) {
  const t = useTranslations('dashboard.quickActions');

  const ownerActions = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: t('owner.quickSearch.title'),
      description: t('owner.quickSearch.description'),
      href: '/services',
      color: 'text-blue-600 bg-blue-50'
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: t('owner.messages.title'),
      description: t('owner.messages.description'),
      href: '/dashboard/messages',
      color: 'text-blue-600 bg-blue-50'
    },
    {
      icon: <Settings className="w-5 h-5" />,
      title: t('owner.settings.title'),
      description: t('owner.settings.description'),
      href: '/dashboard/profile',
      color: 'text-purple-600 bg-purple-50'
    },
    {
      icon: <HelpCircle className="w-5 h-5" />,
      title: t('owner.help.title'),
      description: t('owner.help.description'),
      href: '/help',
      color: 'text-orange-600 bg-orange-50'
    }
  ];

  const providerActions = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: t('provider.createService.title'),
      description: t('provider.createService.description'),
      href: '/dashboard/services/new',
      color: 'text-blue-600 bg-blue-50'
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: t('provider.messages.title'),
      description: t('provider.messages.description'),
      href: '/dashboard/messages',
      color: 'text-blue-600 bg-blue-50'
    },
    {
      icon: <Settings className="w-5 h-5" />,
      title: t('provider.settings.title'),
      description: t('provider.settings.description'),
      href: '/dashboard/profile',
      color: 'text-purple-600 bg-purple-50'
    },
    {
      icon: <HelpCircle className="w-5 h-5" />,
      title: t('provider.help.title'),
      description: t('provider.help.description'),
      href: '/help',
      color: 'text-orange-600 bg-orange-50'
    }
  ];

  const actions = role === UserRole.OWNER ? ownerActions : providerActions;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-blue-600" />
          <span>{t('title')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Link key={index} href={action.href}>
              <div className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${action.color}`}>
                <div className="flex-shrink-0">
                  {action.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {action.title}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


