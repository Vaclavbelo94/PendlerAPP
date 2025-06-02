
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { NavigationItem } from './types';

interface MobileSidebarNavigationGridProps {
  items: NavigationItem[];
  title: string;
  handleLinkClick: () => void;
  gridHeight?: string;
}

export const MobileSidebarNavigationGrid: React.FC<MobileSidebarNavigationGridProps> = ({
  items,
  title,
  handleLinkClick,
  gridHeight = "h-20"
}) => {
  const location = useLocation();
  const { user, isPremium, isAdmin } = useAuth();

  // Filter items based on user status
  const getVisibleItems = (items: NavigationItem[]) => {
    return items.filter(item => {
      // Show public items always
      if (item.isPublic) return true;
      
      // Show auth required items only if user is logged in
      if (item.requiresAuth && !user) return false;
      
      // Show premium items if user has premium or is admin, or if it's public
      if (item.isPremium) {
        return isPremium || isAdmin;
      }
      
      return true;
    });
  };

  const visibleItems = getVisibleItems(items);

  return (
    <>
      <h3 className="text-sm font-medium text-muted-foreground mb-3">{title}</h3>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {visibleItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          const needsPremium = item.isPremium && !isPremium && !isAdmin;
          
          return (
            <Button
              key={item.href}
              asChild
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                `${gridHeight} flex flex-col gap-1 text-xs p-2 relative`,
                isActive && "bg-primary/10 border-primary/20"
              )}
              onClick={handleLinkClick}
            >
              <Link to={item.href}>
                <Icon className="h-5 w-5" />
                <span className="text-center leading-tight text-xs font-medium">
                  {item.label}
                </span>
                {needsPremium && (
                  <Lock className="h-3 w-3 text-muted-foreground absolute top-1 right-1" />
                )}
              </Link>
            </Button>
          );
        })}
      </div>
    </>
  );
};
