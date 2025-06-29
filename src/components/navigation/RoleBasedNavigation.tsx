
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import { isRouteAllowed } from '@/config/routes';
import { cn } from '@/lib/utils';
import { Crown, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { navigationItems } from '@/data/navigationData';

interface RoleBasedNavigationProps {
  variant?: 'sidebar' | 'navbar' | 'mobile';
  className?: string;
}

const RoleBasedNavigation: React.FC<RoleBasedNavigationProps> = ({
  variant = 'sidebar',
  className
}) => {
  const { unifiedUser, canAccess } = useUnifiedAuth();
  const location = useLocation();
  const { t } = useTranslation('navigation');

  const isActive = (path: string) => location.pathname === path;

  const getFilteredNavItems = () => {
    return navigationItems.filter(item => {
      // Check admin only items
      if (item.adminOnly && !unifiedUser?.hasAdminAccess) {
        return false;
      }
      
      // Check DHL only items
      if (item.dhlOnly && !unifiedUser?.isDHLUser) {
        return false;
      }
      
      // Check DHL admin only items
      if (item.dhlAdminOnly && unifiedUser?.role !== 'dhl_admin') {
        return false;
      }
      
      // Check route permissions
      if (!isRouteAllowed(item.path, unifiedUser?.role, canAccess)) {
        return false;
      }
      
      return true;
    });
  };

  const filteredItems = getFilteredNavItems();

  if (variant === 'mobile') {
    return (
      <div className={cn("space-y-1", className)}>
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isLocked = item.premium && !unifiedUser?.hasPremiumAccess;
          const active = isActive(item.path);
          
          return (
            <Link
              key={item.path}
              to={isLocked ? '/premium' : item.path}
              className={cn(
                "flex items-center space-x-3 px-3 py-3 rounded-md text-base transition-colors",
                active 
                  ? 'bg-accent text-accent-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
                isLocked && 'opacity-60'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="flex-1">{t(item.titleKey)}</span>
              {isLocked && <Crown className="h-4 w-4 text-amber-500" />}
              {item.badge && (
                <Badge variant="secondary" className="h-5 text-xs">
                  {item.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </div>
    );
  }

  if (variant === 'navbar') {
    return (
      <div className={cn("hidden md:flex items-center space-x-6", className)}>
        {filteredItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isLocked = item.premium && !unifiedUser?.hasPremiumAccess;
          const active = isActive(item.path);
          
          return (
            <Link 
              key={item.path}
              to={isLocked ? '/premium' : item.path}
              className={cn(
                "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                active 
                  ? 'bg-accent text-accent-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
                isLocked && 'opacity-60'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{t(item.titleKey)}</span>
              {isLocked && <Crown className="h-3 w-3 text-amber-500" />}
            </Link>
          );
        })}
      </div>
    );
  }

  // Default sidebar variant
  return (
    <nav className={cn("space-y-2", className)}>
      {filteredItems.map((item) => {
        const Icon = item.icon;
        const isLocked = item.premium && !unifiedUser?.hasPremiumAccess;
        const active = isActive(item.path);
        
        return (
          <Link
            key={item.path}
            to={isLocked ? '/premium' : item.path}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors",
              active 
                ? 'bg-accent text-accent-foreground' 
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
              isLocked && 'opacity-60'
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="flex-1 truncate">{t(item.titleKey)}</span>
            {isLocked && <Crown className="h-3 w-3 text-amber-500" />}
            {item.badge && (
              <Badge variant="secondary" className="h-5 text-xs">
                {item.badge}
              </Badge>
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default RoleBasedNavigation;
