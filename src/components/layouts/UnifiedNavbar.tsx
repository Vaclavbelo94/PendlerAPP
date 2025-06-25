import React, { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, X, LogOut, User, CreditCard, Home, Calendar, Calculator, Car, Languages, Book, Plane, Scale } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/use-mobile';
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

interface UnifiedNavbarProps {
  rightContent?: React.ReactNode;
}

const UnifiedNavbar: React.FC<UnifiedNavbarProps> = ({ rightContent }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslation(['common', 'navigation']);
  const isMobile = useIsMobile();

  // Touch event handling for swipe gestures
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    // Prevent scrolling during horizontal swipe
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartX.current);
    const deltaY = Math.abs(touch.clientY - touchStartY.current);
    
    if (deltaX > deltaY && deltaX > 10) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;
    
    // Only trigger swipe if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0 && touchStartX.current < 50) {
        // Swipe right from left edge - open menu
        setIsMobileMenuOpen(true);
      } else if (deltaX < 0 && isMobileMenuOpen) {
        // Swipe left - close menu
        setIsMobileMenuOpen(false);
      }
    }
    
    setIsDragging(false);
  };

  const navigationItems = [
    { icon: Home, label: t('navigation:dashboard'), href: '/dashboard' },
    { icon: Calendar, label: t('navigation:shifts'), href: '/shifts' },
    { icon: Calculator, label: t('navigation:taxAdvisor'), href: '/tax-advisor' },
    { icon: Car, label: t('navigation:vehicle'), href: '/vehicle' },
    { icon: Plane, label: t('navigation:travel'), href: '/travel' },
    { icon: Languages, label: t('navigation:translator'), href: '/translator' },
    { icon: Scale, label: t('navigation:laws'), href: '/laws' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isPublicPage = ['/', '/about', '/contact', '/features', '/pricing'].includes(location.pathname);

  return (
    <nav 
      className={cn(
        "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50",
        isPublicPage ? "border-border/40" : "border-border"
      )}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex h-16 items-center px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-xl">PendlerApp</span>
          </Link>
        </div>

        {/* Desktop Navigation - Public Pages */}
        {isPublicPage && !user && (
          <div className="hidden md:flex ml-8 space-x-6">
            <Link to="/features" className="text-sm font-medium transition-colors hover:text-primary">
              {t('common:features')}
            </Link>
            <Link to="/pricing" className="text-sm font-medium transition-colors hover:text-primary">
              {t('common:pricing')}
            </Link>
            <Link to="/about" className="text-sm font-medium transition-colors hover:text-primary">
              {t('common:about')}
            </Link>
            <Link to="/contact" className="text-sm font-medium transition-colors hover:text-primary">
              {t('common:contact')}
            </Link>
          </div>
        )}

        {/* Right Content */}
        <div className="ml-auto flex items-center space-x-2">
          {/* Language Switcher - Always visible */}
          <LanguageSwitcher />
          
          {rightContent}
          
          {/* User Menu */}
          {user ? (
            <>
              {/* Desktop User Menu */}
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                        <AvatarFallback>
                          {user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.user_metadata?.full_name || user.email}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>{t('common:profile')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/subscription')}>
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>{t('common:subscription')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{t('common:signOut')}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Mobile Hamburger Menu */}
              {isMobile && (
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="md:hidden">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80">
                    <div className="flex flex-col h-full">
                      {/* User Info */}
                      <div className="flex items-center gap-3 p-4 border-b">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                          <AvatarFallback>
                            {user.email?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {user.user_metadata?.full_name || user.email}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      {/* Navigation Items */}
                      <div className="flex-1 py-4">
                        <div className="space-y-2">
                          {navigationItems.map((item) => (
                            <Button
                              key={item.href}
                              variant={location.pathname === item.href ? "secondary" : "ghost"}
                              className="w-full justify-start gap-3 h-12"
                              onClick={() => {
                                navigate(item.href);
                                setIsMobileMenuOpen(false);
                              }}
                            >
                              <item.icon className="h-5 w-5" />
                              <span>{item.label}</span>
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Actions */}
                      <div className="border-t p-4 space-y-2">
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-3"
                          onClick={() => {
                            navigate('/profile');
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <User className="h-5 w-5" />
                          <span>{t('common:profile')}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-3"
                          onClick={() => {
                            handleSignOut();
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <LogOut className="h-5 w-5" />
                          <span>{t('common:signOut')}</span>
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              )}
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                {t('common:signIn')}
              </Button>
              <Button size="sm" onClick={() => navigate('/register')}>
                {t('common:signUp')}
              </Button>
            </div>
          )}

          {/* Mobile Menu Button for Public Pages */}
          {!user && isMobile && isPublicPage && (
            <Button
              variant="ghost"
              className="md:hidden"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Menu for Public Pages */}
      {!user && isMobileMenuOpen && isPublicPage && (
        <div className="md:hidden border-t bg-background p-4">
          <div className="flex flex-col space-y-3">
            <Link 
              to="/features" 
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('common:features')}
            </Link>
            <Link 
              to="/pricing" 
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('common:pricing')}
            </Link>
            <Link 
              to="/about" 
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('common:about')}
            </Link>
            <Link 
              to="/contact" 
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('common:contact')}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default UnifiedNavbar;
