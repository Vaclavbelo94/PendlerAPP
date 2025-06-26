
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Calendar, 
  Calculator, 
  Globe, 
  Car, 
  Map, 
  Scale,
  User,
  Settings,
  Crown,
  LogOut,
  Briefcase,
  Menu,
  X
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface UnifiedMobileSidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
  variant: 'compact' | 'overlay';
}

const navigationItems = [
  { key: 'dashboard', path: '/dashboard', icon: Home },
  { key: 'shifts', path: '/shifts', icon: Calendar },
  { key: 'taxAdvisor', path: '/tax-advisor', icon: Calculator },
  { key: 'translator', path: '/translator', icon: Globe },
  { key: 'vehicle', path: '/vehicle', icon: Car },
  { key: 'travel', path: '/travel', icon: Map },
  { key: 'laws', path: '/laws', icon: Scale },
  { key: 'premium', path: '/premium', icon: Crown },
];

export const UnifiedMobileSidebar: React.FC<UnifiedMobileSidebarProps> = ({
  isOpen,
  closeSidebar,
  variant
}) => {
  const { user, signOut, isPremium } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation('navigation');

  const handleNavigation = (path: string) => {
    navigate(path);
    if (variant === 'overlay') {
      closeSidebar();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    if (variant === 'overlay') {
      closeSidebar();
    }
  };

  const isCompact = variant === 'compact';
  const sidebarWidth = isCompact ? 'w-20' : 'w-64';

  return (
    <>
      {/* Mobile trigger button for overlay variant */}
      {variant === 'overlay' && (
        <Button
          variant="ghost"
          size="sm"
          className="fixed top-4 left-4 z-60 bg-background/80 backdrop-blur-sm shadow-sm"
          onClick={() => isOpen ? closeSidebar() : {}}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      )}

      {/* Backdrop for overlay variant */}
      {variant === 'overlay' && isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={closeSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full bg-background border-r border-border z-50 transition-transform duration-200",
        sidebarWidth,
        variant === 'overlay' ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={cn("p-4 border-b border-border", isCompact && "p-2")}>
            <div className="flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-primary flex-shrink-0" />
              {!isCompact && (
                <span className="font-semibold text-lg">PendlerApp</span>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-2">
            <nav className="space-y-1 px-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Button
                    key={item.key}
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 h-10",
                      isCompact && "px-2 justify-center"
                    )}
                    onClick={() => handleNavigation(item.path)}
                    title={isCompact ? t(item.key) : undefined}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!isCompact && (
                      <span className="truncate">{t(item.key)}</span>
                    )}
                  </Button>
                );
              })}
            </nav>
          </div>

          {/* User section */}
          {user && (
            <div className="border-t border-border p-2 space-y-1">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 h-10",
                  isCompact && "px-2 justify-center"
                )}
                onClick={() => handleNavigation('/profile')}
                title={isCompact ? t('profile') : undefined}
              >
                <User className="h-5 w-5 flex-shrink-0" />
                {!isCompact && (
                  <span className="truncate">{t('profile')}</span>
                )}
              </Button>
              
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 h-10",
                  isCompact && "px-2 justify-center"
                )}
                onClick={() => handleNavigation('/settings')}
                title={isCompact ? t('settings') : undefined}
              >
                <Settings className="h-5 w-5 flex-shrink-0" />
                {!isCompact && (
                  <span className="truncate">{t('settings')}</span>
                )}
              </Button>
              
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 h-10 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20",
                  isCompact && "px-2 justify-center"
                )}
                onClick={handleSignOut}
                title={isCompact ? t('logout') : undefined}
              >
                <LogOut className="h-5 w-5 flex-shrink-0" />
                {!isCompact && (
                  <span className="truncate">{t('logout')}</span>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
