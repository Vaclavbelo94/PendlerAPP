
import React from 'react';
import { Button } from '@/components/ui/button';
import { Crown } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { useHasPermission } from '@/hooks/useAuthPermissions';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getVisibleItems, getCategoryItems } from './modernNavigationData';

interface MobileSidebarNavigationGridProps {
  compact?: boolean;
}

export const MobileSidebarNavigationGrid: React.FC<MobileSidebarNavigationGridProps> = ({ compact = false }) => {
  const { unifiedUser } = useAuth();
  const { hasPremiumAccess, permissions } = useHasPermission();
  const navigate = useNavigate();
  const { t } = useTranslation('navigation');

  // Get main navigation items for mobile
  const allItems = getVisibleItems(
    permissions.companyType,
    !!unifiedUser,
    permissions.canAccessPremiumFeatures,
    permissions.canAccessAdminPanel
  );
  const mainItems = getCategoryItems('main', unifiedUser?.isDHLEmployee ? 'dhl' : undefined);
  
  // For compact mode, show only essential items
  const navigationItems = compact ? mainItems.slice(0, 4) : mainItems;

  return (
    <div className={`grid gap-2 ${compact ? 'grid-cols-1' : 'grid-cols-2'}`}>
      {navigationItems.map((item) => {
        const isLocked = item.isPremium && !hasPremiumAccess();
        const Icon = item.icon;
        
        return (
          <Button
            key={item.href}
            variant="ghost"
            className={`${compact ? 'justify-center' : 'justify-start'} h-auto py-3`}
            onClick={() => navigate(isLocked ? '/premium' : item.href)}
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
