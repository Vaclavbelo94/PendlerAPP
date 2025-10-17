import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDevice } from '@/hooks/useDevice';

export interface BottomNavItem {
  path: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

interface MobileBottomNavigationProps {
  items: BottomNavItem[];
  className?: string;
}

export const MobileBottomNavigation: React.FC<MobileBottomNavigationProps> = ({
  items,
  className,
}) => {
  const { isMobile } = useDevice();
  const location = useLocation();

  if (!isMobile) return null;

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border',
        'safe-area-bottom pb-[env(safe-area-inset-bottom)]',
        className
      )}
    >
      <div className="grid auto-cols-fr grid-flow-col h-16">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center gap-1 relative transition-colors',
                'min-h-[var(--touch-target)] px-2',
                'active:scale-95 active:bg-muted/50',
                isActive
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div className="relative">
                <Icon className={cn('h-5 w-5', isActive && 'scale-110')} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] leading-none truncate max-w-full">
                {item.label}
              </span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-primary rounded-b-full" />
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
