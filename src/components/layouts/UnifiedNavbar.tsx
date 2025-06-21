
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, User, LogOut, Crown, Shield, Briefcase } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LanguageSelector } from '@/components/modern/LanguageSelector';
import { cn } from '@/lib/utils';

interface UnifiedNavbarProps {
  toggleSidebar?: () => void;
  rightContent?: React.ReactNode;
  sidebarOpen?: boolean;
}

const navigationItems = [
  { key: 'dashboard', path: '/dashboard' },
  { key: 'shifts', path: '/shifts' },
  { key: 'taxAdvisor', path: '/tax-advisor' },
  { key: 'translator', path: '/translator' },
  { key: 'vehicle', path: '/vehicle' },
  { key: 'travel', path: '/travel' },
  { key: 'laws', path: '/laws' },
];

export const UnifiedNavbar: React.FC<UnifiedNavbarProps> = ({ 
  toggleSidebar, 
  rightContent, 
  sidebarOpen 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut, isPremium, isAdmin } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);

  // Swipe detection for mobile menu
  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!e.changedTouches[0]) return;
      
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = endX - startX;
      const deltaY = endY - startY;

      // Check if it's a horizontal swipe and started from the left edge
      if (
        Math.abs(deltaX) > Math.abs(deltaY) && 
        Math.abs(deltaX) > 50 && 
        startX < 50 && 
        deltaX > 0 && 
        user &&
        window.innerWidth <= 768
      ) {
        if (toggleSidebar) {
          toggleSidebar();
        } else {
          setIsOpen(true);
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [toggleSidebar, user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

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
    <nav ref={navRef} className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-3 md:px-4">
        {/* Logo */}
        <Link to="/" className="mr-4 md:mr-6 flex items-center space-x-2 flex-shrink-0">
          <Briefcase className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          <span className="font-bold text-lg md:text-xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            PendlerApp
          </span>
        </Link>

        {/* Desktop Navigation - only show if user is authenticated */}
        {user && (
          <div className="hidden md:flex items-center space-x-6 flex-1">
            {navigationItems.map((item) => (
              <NavLink key={item.key} item={item} />
            ))}
          </div>
        )}

        {/* Right side content */}
        <div className="flex items-center space-x-2 md:space-x-4 ml-auto">
          {/* Language Selector - always visible */}
          <div className="flex-shrink-0">
            <LanguageSelector />
          </div>
          
          {/* Right content from props (theme toggle, notifications, etc.) */}
          {rightContent && (
            <div className="flex-shrink-0">
              {rightContent}
            </div>
          )}
          
          {user ? (
            /* Authenticated user content */
            <>
              {/* Desktop user menu */}
              <div className="hidden md:block flex-shrink-0">
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
                              <span className="text-xs text-muted-foreground">Premium</span>
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
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      {t('profile') || 'Profil'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/premium')}>
                      <Crown className="mr-2 h-4 w-4 text-yellow-500" />
                      {t('premium') || 'Premium'}
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        <Shield className="mr-2 h-4 w-4 text-red-500" />
                        {t('admin') || 'Administrace'}
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      {t('logout') || 'Odhlásit se'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Mobile hamburger menu for authenticated users */}
              <div className="md:hidden flex-shrink-0">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Menu className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <div className="flex flex-col space-y-4 mt-4">
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
                                <span className="text-xs text-muted-foreground">Premium</span>
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
                      
                      {/* Mobile navigation links */}
                      {navigationItems.map((item) => (
                        <NavLink key={item.key} item={item} mobile />
                      ))}
                      
                      <Button variant="outline" onClick={() => { navigate('/profile'); setIsOpen(false); }}>
                        <User className="mr-2 h-4 w-4" />
                        {t('profile') || 'Profil'}
                      </Button>
                      <Button variant="outline" onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        {t('logout') || 'Odhlásit se'}
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </>
          ) : (
            /* Non-authenticated user content */
            <>
              {/* Desktop login/register buttons */}
              <div className="hidden md:flex items-center space-x-2 flex-shrink-0">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    {t('login') || 'Přihlásit'}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    {t('register') || 'Registrovat'}
                  </Button>
                </Link>
              </div>

              {/* Mobile hamburger menu for non-authenticated users */}
              <div className="md:hidden flex-shrink-0">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Menu className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80">
                    <div className="flex flex-col space-y-4 mt-6">
                      <div className="border-t pt-4 space-y-2">
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
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
