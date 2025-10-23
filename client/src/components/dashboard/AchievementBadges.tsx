import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Trophy, Star, Heart, CheckCircle } from 'lucide-react';
import { UserRole } from 'petservice-marketplace-shared-types';

interface AchievementBadgesProps {
  stats: {
    activeBookings?: number;
    completedServices?: number;
    totalServices?: number;
    totalBookings?: number;
    reviews?: number;
  };
  role: UserRole;
}

export function AchievementBadges({ stats, role }: AchievementBadgesProps) {
  const t = useTranslations('dashboard.achievements');

  const getAchievements = () => {
    const achievements = [];

    if (role === UserRole.OWNER) {
      if (stats.completedServices && stats.completedServices > 0) {
        achievements.push({
          icon: <CheckCircle className="w-6 h-6" />,
          title: t('owner.firstService.title'),
          description: t('owner.firstService.description'),
          color: 'text-blue-600 bg-blue-50',
          unlocked: true
        });
      }

      if (stats.activeBookings && stats.activeBookings >= 3) {
        achievements.push({
          icon: <Trophy className="w-6 h-6" />,
          title: t('owner.regularUser.title'),
          description: t('owner.regularUser.description'),
          color: 'text-blue-600 bg-blue-50',
          unlocked: true
        });
      }

      if (stats.reviews && stats.reviews > 0) {
        achievements.push({
          icon: <Star className="w-6 h-6" />,
          title: t('owner.reviewer.title'),
          description: t('owner.reviewer.description'),
          color: 'text-yellow-600 bg-yellow-50',
          unlocked: true
        });
      }
    } else {
      if (stats.totalServices && stats.totalServices > 0) {
        achievements.push({
          icon: <CheckCircle className="w-6 h-6" />,
          title: t('provider.serviceProvider.title'),
          description: t('provider.serviceProvider.description'),
          color: 'text-blue-600 bg-blue-50',
          unlocked: true
        });
      }

      if (stats.totalBookings && stats.totalBookings >= 5) {
        achievements.push({
          icon: <Trophy className="w-6 h-6" />,
          title: t('provider.popularProvider.title'),
          description: t('provider.popularProvider.description'),
          color: 'text-blue-600 bg-blue-50',
          unlocked: true
        });
      }

      if (stats.reviews && stats.reviews >= 3) {
        achievements.push({
          icon: <Star className="w-6 h-6" />,
          title: t('provider.topRated.title'),
          description: t('provider.topRated.description'),
          color: 'text-yellow-600 bg-yellow-50',
          unlocked: true
        });
      }
    }

    // Add locked achievements for motivation
    if (achievements.length < 3) {
      achievements.push({
        icon: <Heart className="w-6 h-6" />,
        title: t('locked.superstar.title'),
        description: t('locked.superstar.description'),
        color: 'text-gray-400 bg-gray-50',
        unlocked: false
      });
    }

    return achievements;
  };

  const achievements = getAchievements();

  if (achievements.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-yellow-600" />
          <span>{t('title')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`flex items-center space-x-3 p-3 rounded-lg border ${
                achievement.unlocked ? achievement.color : 'border-gray-200'
              } ${achievement.unlocked ? '' : 'opacity-60'}`}
            >
              <div className={`flex-shrink-0 ${achievement.unlocked ? achievement.color : 'text-gray-400'}`}>
                {achievement.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${achievement.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                  {achievement.title}
                </p>
                <p className="text-xs text-gray-600">
                  {achievement.description}
                </p>
              </div>
              {achievement.unlocked && (
                <div className="flex-shrink-0">
                  <span className="text-xs font-medium text-blue-600">✓</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


