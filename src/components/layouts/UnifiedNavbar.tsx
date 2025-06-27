import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { canAccessAdmin } from '@/utils/adminUtils';
import { useTranslation } from 'react-i18next';

const UnifiedNavbar = () => {
  const { user, unifiedUser, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation('navigation');

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isAdmin = canAccessAdmin(user);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navigationItems = [
    { key: 'dashboard', path: '/dashboard', label: t('dashboard') },
    { key: 'shifts', path: '/shifts', label: t('shifts') },
    { key: 'taxAdvisor', path: '/tax-advisor', label: t('taxAdvisor') },
    { key: 'translator', path: '/translator', label: t('translator') },
    { key: 'vehicle', path: '/vehicle', label: t('vehicle') },
    { key: 'travel', path: '/travel', label: t('travel') },
		{ key: 'laws', path: '/laws', label: t('laws') },
  ];

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b">
      <div className="container max-w-6xl flex items-center justify-between p-4">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center text-lg font-semibold">
          <Shield className="mr-2 h-6 w-6 text-primary" />
          PendlerApp
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          {navigationItems.map((item) => (
            <Link
              key={item.key}
              to={item.path}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Admin
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {/* Mobile Menu (Sheet) */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur md:hidden">
            <div className="flex flex-col h-full p-4">
              <div className="flex justify-end">
                <Button variant="ghost" size="icon" onClick={closeMenu}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex-1 flex flex-col space-y-4">
                {navigationItems.map((item) => (
                  <Link
                    key={item.key}
                    to={item.path}
                    className="block text-lg text-muted-foreground hover:text-foreground transition-colors py-2"
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                ))}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="block text-lg text-muted-foreground hover:text-foreground transition-colors py-2"
                    onClick={closeMenu}
                  >
                    Admin
                  </Link>
                )}
              </div>
              <Button variant="outline" onClick={handleSignOut} className="mt-auto">
                Odhlásit se
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default UnifiedNavbar;
