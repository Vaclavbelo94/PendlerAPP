
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Briefcase } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';
import { cn } from '@/lib/utils';

const navigationItems = [
  { key: 'dashboard', path: '/dashboard' },
  { key: 'shifts', path: '/shifts' },
  { key: 'taxAdvisor', path: '/tax-advisor' },
  { key: 'translator', path: '/translator' },
  { key: 'vehicle', path: '/vehicle' },
  { key: 'travel', path: '/travel' },
  { key: 'laws', path: '/laws' },
];

// Additional items for mobile menu only
const mobileOnlyItems = [
  { key: 'pricing', path: '/pricing' },
  { key: 'contact', path: '/contact' },
  { key: 'faq', path: '/faq' },
];

export const ModernNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { t } = useTranslation('navigation');
  const location = useLocation();

  const NavLink = ({ item, mobile = false }: { item: typeof navigationItems[0], mobile?: boolean }) => (
    <Link
      to={item.path}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        location.pathname === item.path ? "text-primary" : "text-muted-foreground",
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
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <Briefcase className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            PendlerApp
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-6 flex-1">
          {user && navigationItems.map((item) => (
            <NavLink key={item.key} item={item} />
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          
          {user ? (
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
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  {t('login')}
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">
                  {t('register')}
                </Button>
              </Link>
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
                {user && navigationItems.map((item) => (
                  <NavLink key={item.key} item={item} mobile />
                ))}
                
                {/* Mobile-only navigation items */}
                <div className="border-t pt-4 space-y-2">
                  {mobileOnlyItems.map((item) => (
                    <Link
                      key={item.key}
                      to={item.path}
                      className="block px-3 py-2 text-base text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {t(item.key)}
                    </Link>
                  ))}
                </div>
                
                <div className="border-t pt-4 space-y-2">
                  {user ? (
                    <>
                      <Link to="/profile" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">
                          {t('profile') || 'Profil'}
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
                        {t('logout') || 'Odhlásit'}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">
                          {t('login') || 'Přihlásit'}
                        </Button>
                      </Link>
                      <Link to="/register" onClick={() => setIsOpen(false)}>
                        <Button className="w-full justify-start">
                          {t('register') || 'Registrovat'}
                        </Button>
                      </Link>
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
