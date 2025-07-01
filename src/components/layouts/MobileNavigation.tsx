
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import { isRouteAllowed } from '@/config/routes';
import { navigationItems } from '@/data/navigationData';
import { Crown } from 'lucide-react';

const MobileNavigation: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation('navigation');
  const { unifiedUser, canAccess } = useUnifiedAuth();

  // Get key navigation items for mobile bottom bar
  const getMobileNavItems = () => {
    const priorityPaths = ['/dashboard', '/translator', '/shifts', '/vehicle', '/profile'];
    
    return navigationItems
      .filter(item => {
        // Only show items that are allowed for current user
        if (!isRouteAllowed(item.path, unifiedUser?.role, canAccess)) {
          return false;
        }
        
        // Check admin/DHL restrictions
        if (item.adminOnly && !unifiedUser?.hasAdminAccess) return false;
        if (item.dhlOnly && !unifiedUser?.isDHLUser) return false;
        if (item.dhlAdminOnly && unifiedUser?.role !== 'dhl_admin') return false;
        
        return priorityPaths.includes(item.path);
      })
      .slice(0, 5); // Limit to 5 items for mobile
  };

  const mobileNavItems = getMobileNavItems();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isLocked = item.premium && !unifiedUser?.hasPremiumAccess;
          const isActive = location.pathname === item.path;
          
          return (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              asChild
              className={cn(
                "flex flex-col items-center gap-1 h-14 px-2 min-w-0 flex-1 relative",
                isActive && "text-primary bg-primary/10",
                isLocked && "opacity-60"
              )}
            >
              <Link to={isLocked ? '/premium' : item.path}>
                <Icon className="h-5 w-5" />
                <span className="text-xs truncate">{t(item.titleKey)}</span>
                {isLocked && (
                  <Crown className="h-3 w-3 text-amber-500 absolute -top-1 -right-1" />
                )}
              </Link>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavigation;
