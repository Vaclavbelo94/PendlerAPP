
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useUnifiedAuth } from '@/contexts/UnifiedAuthContext';
import { isRouteAllowed } from '@/config/routes';
import { navigationItems } from '@/data/navigationData';
import { Crown } from 'lucide-react';

interface SidebarNavigationProps {
  collapsed: boolean;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ collapsed }) => {
  const location = useLocation();
  const { t } = useTranslation('navigation');
  const { unifiedUser, canAccess } = useUnifiedAuth();

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

  // Group items by category
  const mainItems = filteredItems.filter(item => 
    ['/dashboard', '/shifts', '/analytics'].includes(item.path)
  );
  
  const toolItems = filteredItems.filter(item =>
    ['/calculator', '/tax-advisor', '/vehicle', '/travel', '/translator', '/laws'].includes(item.path)
  );

  const accountItems = filteredItems.filter(item =>
    ['/profile', '/settings', '/premium'].includes(item.path)
  );

  const adminItems = filteredItems.filter(item =>
    ['/admin', '/dhl-setup', '/dhl-admin'].includes(item.path)
  );

  const renderNavSection = (items: typeof filteredItems, title: string, sectionIndex: number) => {
    if (items.length === 0) return null;

    return (
      <motion.div
        key={title}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: sectionIndex * 0.1 }}
      >
        {!collapsed && (
          <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {title}
          </h3>
        )}
        
        <div className="space-y-1">
          {items.map((item, itemIndex) => {
            const Icon = item.icon;
            const isLocked = item.premium && !unifiedUser?.hasPremiumAccess;
            const isActive = location.pathname === item.path;
            
            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: (sectionIndex * 0.1) + (itemIndex * 0.05) }}
              >
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  asChild
                  className={cn(
                    "w-full justify-start gap-3 h-9 transition-all duration-200",
                    collapsed && "px-2 justify-center",
                    isActive && "bg-primary/10 text-primary hover:bg-primary/15 shadow-sm",
                    isLocked && "opacity-60"
                  )}
                >
                  <Link to={isLocked ? '/premium' : item.path}>
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {!collapsed && (
                      <div className="flex items-center justify-between flex-1 min-w-0">
                        <span className="truncate">{t(item.titleKey)}</span>
                        <div className="flex items-center gap-1">
                          {isLocked && <Crown className="h-3 w-3 text-amber-500" />}
                          {item.badge && (
                            <Badge variant="secondary" className="h-5 text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </Link>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {renderNavSection(mainItems, 'Hlavní', 0)}
      {renderNavSection(toolItems, 'Nástroje', 1)}
      {renderNavSection(accountItems, 'Účet', 2)}  
      {renderNavSection(adminItems, 'Správa', 3)}
    </div>
  );
};

export default SidebarNavigation;
