
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, Car, Settings, Users } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useTranslation } from 'react-i18next';

const ModernNavbar = () => {
  const { user, unifiedUser, signOut } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation('navigation');

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navigationItems = [
    { icon: Home, label: t('dashboard'), path: '/dashboard' },
    { icon: Car, label: t('vehicle'), path: '/vehicle' },
    { icon: Users, label: 'Komunita', path: '/community' },
    { icon: Settings, label: t('settings'), path: '/settings' },
  ];

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b">
      <div className="container max-w-6xl flex items-center justify-between p-4">
        {/* Logo */}
        <Link to="/" className="flex items-center text-lg font-semibold">
          <div className="mr-2 h-6 w-6 text-primary" />
          ModernApp
        </Link>

        {/* Desktop Navigation */}
        {user && (
          <div className="hidden md:flex items-center space-x-4">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
            {unifiedUser?.isAdmin && (
              <Link
                to="/admin"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Admin
              </Link>
            )}
          </div>
        )}

        {/* Auth buttons or user menu */}
        <div className="flex items-center space-x-2">
          {user ? (
            <Button variant="outline" onClick={handleSignOut}>
              {t('logout')}
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">{t('login')}</Link>
              </Button>
              <Button asChild>
                <Link to="/register">{t('register')}</Link>
              </Button>
            </>
          )}

          {/* Mobile Menu */}
          {user && (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex flex-col space-y-4 mt-4">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </nav>
  );
};

export default ModernNavbar;
