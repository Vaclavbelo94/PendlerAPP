
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, User, LogOut, Crown, Shield, Briefcase } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import LanguageToggle from '@/components/common/LanguageToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { canAccessAdmin, canAccessDHLAdmin } from '@/utils/authStateUtils';

interface UnifiedNavbarProps {
  rightContent?: React.ReactNode;
}

const UnifiedNavbar: React.FC<UnifiedNavbarProps> = ({ rightContent }) => {
  const { user, signOut, isAdmin, isPremium } = useAuth();
  const location = useLocation();
  const { t } = useTranslation('navigation');
  const [isOpen, setIsOpen] = useState(false);

  const authState = {
    user,
    isAdmin,
    isPremium,
    isSpecialUser: user?.email === 'uzivatel@pendlerapp.com' || user?.email === 'admin@pendlerapp.com',
    isDHLAdmin: user?.email === 'admin_dhl@pendlerapp.com',
    isLoading: false
  };

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  const navigationItems = [
    { path: '/dashboard', key: 'dashboard', requiresAuth: true },
    { path: '/shifts', key: 'shifts', requiresAuth: true },
    { path: '/travel', key: 'travel', requiresAuth: true },
    { path: '/vehicle', key: 'vehicle', requiresAuth: true },
    { path: '/translator', key: 'translator', requiresAuth: true },
    { path: '/tax-advisor', key: 'taxAdvisor', requiresAuth: true },
    { path: '/laws', key: 'laws', requiresAuth: true },
  ];

  const NavLink = ({ item, mobile = false }: { item: typeof navigationItems[0], mobile?: boolean }) => (
    <Link
      to={item.path}
      className={`${mobile ? 'block py-2 px-3' : ''} text-foreground hover:text-primary transition-colors ${
        location.pathname === item.path ? 'text-primary font-medium' : ''
      }`}
      onClick={() => mobile && setIsOpen(false)}
    >
      {t(item.key)}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">PendlerApp</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {user && navigationItems.map((item) => (
              <NavLink key={item.key} item={item} />
            ))}
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            <LanguageToggle />
            {rightContent}
            
            {user ? (
              <>
                {/* Desktop User Menu */}
                <div className="hidden md:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {user.email?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium">{user.email}</p>
                          <div className="flex items-center gap-2">
                            {isPremium && (
                              <div className="flex items-center gap-1">
                                <Crown className="h-3 w-3 text-yellow-500" />
                                <span className="text-xs text-muted-foreground">{t('premium')}</span>
                              </div>
                            )}
                            {isAdmin && (
                              <div className="flex items-center gap-1">
                                <Shield className="h-3 w-3 text-red-500" />
                                <span className="text-xs text-muted-foreground">Admin</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/profile">
                          <User className="mr-2 h-4 w-4" />
                          {t('profile')}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard/premium">
                          <Crown className="mr-2 h-4 w-4 text-yellow-500" />
                          {t('premium')}
                        </Link>
                      </DropdownMenuItem>
                      {canAccessAdmin(authState) && (
                        <DropdownMenuItem asChild>
                          <Link to="/admin">
                            <Shield className="mr-2 h-4 w-4 text-red-500" />
                            Admin
                          </Link>
                        </DropdownMenuItem>
                      )}
                      {canAccessDHLAdmin(authState) && (
                        <DropdownMenuItem asChild>
                          <Link to="/dhl-admin">
                            <Shield className="mr-2 h-4 w-4 text-blue-500" />
                            DHL Admin
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        {t('logout')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Mobile Hamburger Menu */}
                <div className="md:hidden">
                  <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Menu className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <div className="flex flex-col space-y-4 mt-4">
                        {/* User info */}
                        <div className="flex items-center gap-2 pb-4 border-b">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {user.email?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{user.email}</p>
                            <div className="flex items-center gap-2">
                              {isPremium && (
                                <div className="flex items-center gap-1">
                                  <Crown className="h-3 w-3 text-yellow-500" />
                                  <span className="text-xs text-muted-foreground">{t('premium')}</span>
                                </div>
                              )}
                              {isAdmin && (
                                <div className="flex items-center gap-1">
                                  <Shield className="h-3 w-3 text-red-500" />
                                  <span className="text-xs text-muted-foreground">Admin</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Navigation Links */}
                        {navigationItems.map((item) => (
                          <NavLink key={item.key} item={item} mobile />
                        ))}

                        {/* User Actions */}
                        <div className="border-t pt-4 space-y-2">
                          <Button variant="outline" className="w-full justify-start" asChild>
                            <Link to="/profile" onClick={() => setIsOpen(false)}>
                              <User className="mr-2 h-4 w-4" />
                              {t('profile')}
                            </Link>
                          </Button>
                          
                          <Button variant="outline" className="w-full justify-start" asChild>
                            <Link to="/dashboard/premium" onClick={() => setIsOpen(false)}>
                              <Crown className="mr-2 h-4 w-4 text-yellow-500" />
                              {t('premium')}
                            </Link>
                          </Button>

                          {canAccessAdmin(authState) && (
                            <Button variant="outline" className="w-full justify-start" asChild>
                              <Link to="/admin" onClick={() => setIsOpen(false)}>
                                <Shield className="mr-2 h-4 w-4 text-red-500" />
                                Admin
                              </Link>
                            </Button>
                          )}

                          {canAccessDHLAdmin(authState) && (
                            <Button variant="outline" className="w-full justify-start" asChild>
                              <Link to="/dhl-admin" onClick={() => setIsOpen(false)}>
                                <Shield className="mr-2 h-4 w-4 text-blue-500" />
                                DHL Admin
                              </Link>
                            </Button>
                          )}

                          <Button variant="outline" className="w-full justify-start" onClick={handleSignOut}>
                            <LogOut className="mr-2 h-4 w-4" />
                            {t('logout')}
                          </Button>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </>
            ) : (
              /* Unauthenticated user buttons */
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">{t('login')}</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">{t('register')}</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default UnifiedNavbar;
