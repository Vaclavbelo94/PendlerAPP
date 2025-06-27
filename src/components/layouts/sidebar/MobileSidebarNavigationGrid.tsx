
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Settings, HelpCircle, Star, Crown, Car, BarChart3, Users } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface MobileSidebarNavigationGridProps {
  compact?: boolean;
}

export const MobileSidebarNavigationGrid: React.FC<MobileSidebarNavigationGridProps> = ({ 
  compact = false 
}) => {
  const { user, unifiedUser } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation('navigation');

  const navigationItems = [
    {
      icon: CalendarDays,
      label: t('shifts'),
      path: '/shifts',
      description: t('manageShifts'),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    },
    {
      icon: Car,
      label: t('vehicles'),
      path: '/vehicles',
      description: t('manageVehicles'),
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
    },
    {
      icon: BarChart3,
      label: t('analytics'),
      path: '/analytics',
      description: t('viewAnalytics'),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
      premium: true,
    },
    {
      icon: Settings,
      label: t('settings'),
      path: '/settings',
      description: t('appSettings'),
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 dark:bg-gray-950/20',
    },
    {
      icon: HelpCircle,
      label: t('help'),
      path: '/help',
      description: t('getHelp'),
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    },
  ];

  // Admin items
  if (unifiedUser?.isAdmin) {
    navigationItems.push({
      icon: Users,
      label: t('admin'),
      path: '/admin',
      description: t('adminPanel'),
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950/20',
    });
  }

  if (compact) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {navigationItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              onClick={() => navigate(item.path)}
              className="h-12 w-full flex flex-col gap-1 p-2"
            >
              <Icon className="h-4 w-4" />
              <span className="text-xs truncate">{item.label}</span>
            </Button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground px-2">
        {t('navigation')}
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isLocked = item.premium && !unifiedUser?.isPremium;
          
          return (
            <Card 
              key={item.path}
              className={`${item.bgColor} border-0 cursor-pointer transition-all hover:scale-105 ${
                isLocked ? 'opacity-60' : ''
              }`}
              onClick={() => !isLocked && navigate(item.path)}
            >
              <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
                <div className="relative">
                  <Icon className={`h-6 w-6 ${item.color}`} />
                  {item.premium && (
                    <Crown className="h-3 w-3 text-amber-500 absolute -top-1 -right-1" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-sm">{item.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.description}
                  </div>
                </div>
                {isLocked && (
                  <Badge variant="secondary" className="text-xs">
                    Premium
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {!unifiedUser?.isPremium && (
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
          <CardContent className="p-4 text-center">
            <Crown className="h-6 w-6 text-amber-600 mx-auto mb-2" />
            <div className="text-sm font-medium text-amber-800 dark:text-amber-200">
              {t('upgradeToPremium')}
            </div>
            <div className="text-xs text-amber-600 dark:text-amber-300 mt-1">
              {t('unlockAllFeatures')}
            </div>
            <Button 
              size="sm" 
              className="mt-3 bg-amber-600 hover:bg-amber-700"
              onClick={() => navigate('/premium')}
            >
              <Star className="h-4 w-4 mr-1" />
              {t('upgrade')}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
