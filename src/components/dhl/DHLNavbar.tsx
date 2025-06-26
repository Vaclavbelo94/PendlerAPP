
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Truck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';
import { cn } from '@/lib/utils';
import { canAccessDHLAdmin } from '@/utils/dhlAuthUtils';

const dhlNavigationItems = [
  { key: 'dhlDashboard', path: '/dhl-dashboard' },
  { key: 'shifts', path: '/shifts' },
];

const dhlAdminItems = [
  { key: 'dhlAdmin', path: '/dhl-admin' },
  { key: 'dhlDashboard', path: '/dhl-dashboard' },
  { key: 'shifts', path: '/shifts' },
];

export const DHLNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { t } = useTranslation('navigation');
  const location = useLocation();
  
  const isDHLAdmin = canAccessDHLAdmin(user);
  const navigationItems = isDHLAdmin ? dhlAdminItems : dhlNavigationItems;

  const DHLNavLink = ({ item, mobile = false }: { item: typeof navigationItems[0], mobile?: boolean }) => (
    <Link
      to={item.path}
      className={cn(
        "text-sm font-medium transition-colors hover:text-yellow-600",
        location.pathname === item.path ? "text-yellow-600" : "text-muted-foreground",
        mobile && "block px-3 py-2 text-base"
      )}
      onClick={() => mobile && setIsOpen(false)}
    >
      {t(item.key)}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link to="/dhl-dashboard" className="mr-6 flex items-center space-x-2">
          <Truck className="h-6 w-6 text-yellow-600" />
          <span className="font-bold text-xl bg-gradient-to-r from-yellow-600 to-red-600 bg-clip-text text-transparent">
            DHL Portal
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-6 flex-1">
          {navigationItems.map((item) => (
            <DHLNavLink key={item.key} item={item} />
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          
          {user && (
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/profile">
                <Button variant="ghost" size="sm">
                  {t('profile')}
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={signOut}>
                {t('logout')}
              </Button>
            </div>
          )}

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-6">
                {navigationItems.map((item) => (
                  <DHLNavLink key={item.key} item={item} mobile />
                ))}
                
                <div className="border-t pt-4 space-y-2">
                  {user && (
                    <>
                      <Link to="/profile" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">
                          {t('profile')}
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start" 
                        onClick={() => {
                          signOut();
                          setIsOpen(false);
                        }}
                      >
                        {t('logout')}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
