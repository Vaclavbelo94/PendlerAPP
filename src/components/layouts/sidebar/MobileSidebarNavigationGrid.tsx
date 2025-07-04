
import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, Calendar, Car, Settings, BarChart3, Crown } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface MobileSidebarNavigationGridProps {
  compact?: boolean;
}

export const MobileSidebarNavigationGrid: React.FC<MobileSidebarNavigationGridProps> = ({ compact = false }) => {
  const { unifiedUser } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation('navigation');

  const navigationItems = [
    { icon: Home, label: t('dashboard'), path: '/dashboard' },
    { icon: Calendar, label: t('shifts'), path: '/shifts' },
    { icon: Car, label: t('vehicle'), path: '/vehicle' },
    { icon: BarChart3, label: t('analytics'), path: '/analytics', premium: true },
    { icon: Settings, label: t('settings'), path: '/settings' },
  ];

  return (
    <div className={`grid gap-2 ${compact ? 'grid-cols-1' : 'grid-cols-2'}`}>
      {navigationItems.map((item) => {
        const isLocked = item.premium && !unifiedUser?.isPremium;
        const Icon = item.icon;
        
        return (
          <Button
            key={item.path}
            variant="ghost"
            className={`${compact ? 'justify-center' : 'justify-start'} h-auto py-3`}
            onClick={() => navigate(isLocked ? '/premium' : item.path)}
          >
            <Icon className={`h-4 w-4 ${compact ? '' : 'mr-2'}`} />
            {!compact && (
              <>
                <span className="flex-1 text-left">{item.label}</span>
                {isLocked && <Crown className="h-3 w-3 text-amber-500" />}
              </>
            )}
          </Button>
        );
      })}
    </div>
  );
};
