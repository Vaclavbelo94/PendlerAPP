
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Calendar, Settings, User, Car, Languages, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/auth';
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const MobileNavigation: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation('navigation');
  const { unifiedUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const mainNavItems = [
    {
      icon: Home,
      label: t('dashboard'),
      href: '/dashboard',
      isActive: location.pathname === '/dashboard'
    },
    {
      icon: Languages,
      label: t('translator'),
      href: '/translator',
      isActive: location.pathname === '/translator'
    },
    {
      icon: Calendar,
      label: t('shifts'),
      href: unifiedUser?.isPremium ? '/shifts' : '/premium',
      isActive: location.pathname === '/shifts'
    },
    {
      icon: User,
      label: t('profile'),
      href: '/profile',
      isActive: location.pathname === '/profile'
    }
  ];

  const moreNavItems = [
    {
      icon: Car,
      label: t('vehicle'),
      href: unifiedUser?.isPremium ? '/vehicle' : '/premium',
      isActive: location.pathname === '/vehicle'
    },
    {
      icon: Settings,
      label: t('settings'),
      href: '/settings',
      isActive: location.pathname === '/settings'
    }
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
        <div className="flex items-center justify-around h-16 px-2">
          {mainNavItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              size="sm"
              asChild
              className={cn(
                "flex flex-col items-center gap-1 h-14 px-2 min-w-0 flex-1",
                item.isActive && "text-primary bg-primary/10"
              )}
            >
              <Link to={item.href}>
                <item.icon className="h-5 w-5" />
                <span className="text-xs truncate">{item.label}</span>
              </Link>
            </Button>
          ))}
          
          {/* More menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex flex-col items-center gap-1 h-14 px-2 min-w-0 flex-1"
              >
                <Menu className="h-5 w-5" />
                <span className="text-xs">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-auto">
              <div className="flex flex-col space-y-4 py-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Menu</h3>
                  <LanguageSwitcher />
                </div>
                {moreNavItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center space-x-3 p-3 rounded-lg transition-colors",
                      item.isActive 
                        ? "bg-primary/10 text-primary" 
                        : "hover:bg-accent"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </>
  );
};

export default MobileNavigation;
