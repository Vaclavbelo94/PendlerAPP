
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, X, LogOut, User, CreditCard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface UnifiedNavbarProps {
  rightContent?: React.ReactNode;
}

const UnifiedNavbar: React.FC<UnifiedNavbarProps> = ({ rightContent }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslation('common');

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
    <nav className={cn(
      "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50",
      isPublicPage ? "border-border/40" : "border-border"
    )}>
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
              {t('features')}
            </Link>
            <Link to="/pricing" className="text-sm font-medium transition-colors hover:text-primary">
              {t('pricing')}
            </Link>
            <Link to="/about" className="text-sm font-medium transition-colors hover:text-primary">
              {t('about')}
            </Link>
            <Link to="/contact" className="text-sm font-medium transition-colors hover:text-primary">
              {t('contact')}
            </Link>
          </div>
        )}

        {/* Right Content */}
        <div className="ml-auto flex items-center space-x-4">
          {rightContent}
          
          {/* User Menu */}
          {user ? (
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
                  <span>{t('profile')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/subscription')}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>{t('subscription')}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('signOut')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/auth/signin')}>
                {t('signIn')}
              </Button>
              <Button size="sm" onClick={() => navigate('/auth/signup')}>
                {t('signUp')}
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            className="md:hidden"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background p-4">
          {isPublicPage && !user && (
            <div className="flex flex-col space-y-3">
              <Link 
                to="/features" 
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('features')}
              </Link>
              <Link 
                to="/pricing" 
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('pricing')}
              </Link>
              <Link 
                to="/about" 
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('about')}
              </Link>
              <Link 
                to="/contact" 
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('contact')}
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default UnifiedNavbar;
