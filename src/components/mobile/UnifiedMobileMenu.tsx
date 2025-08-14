import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, LogOut, LogIn, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

import { useAuth } from '@/hooks/auth';
import { useMobileMenuData } from '@/hooks/useMobileMenuData';
import LanguageSwitcherCompact from '@/components/ui/LanguageSwitcherCompact';
import { MobileMenuHeader } from './MobileMenuHeader';
import { MobileMenuContent } from './MobileMenuContent';
import { MobileMenuFooter } from './MobileMenuFooter';

interface UnifiedMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: 'overlay' | 'compact';
}

export const UnifiedMobileMenu: React.FC<UnifiedMobileMenuProps> = ({
  isOpen,
  onClose,
  variant = 'overlay'
}) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { menuSections, isLoading, userInfo } = useMobileMenuData();
  const { t } = useTranslation('navigation');

  // Disable body scroll when menu is open and handle escape key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
      };
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
  }, [isOpen, onClose]);

  const handleNavigation = (href: string) => {
    navigate(href);
    onClose();
  };

  const handleSignOut = async () => {
    await signOut();
    onClose();
    navigate('/');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      {variant === 'overlay' && (
        <div
          className="fixed inset-0 bg-black/50 z-[59] backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu */}
      <div className={cn(
        "fixed inset-0 z-[60] bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60 flex flex-col shadow-xl border-l",
        variant === 'compact' ? "w-80 right-auto" : "w-full"
      )}>
        {/* Header */}
        <MobileMenuHeader
          user={user}
          userInfo={userInfo}
          onClose={onClose}
        />

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <MobileMenuContent
            menuSections={menuSections}
            isLoading={isLoading}
            onNavigate={handleNavigation}
          />

          {/* Authentication Section */}
          <div className="px-4 py-4 border-t">
            {user ? (
              <Button
                variant="outline"
                className="w-full justify-start gap-3"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                {t('logout')}
              </Button>
            ) : (
              <div className="space-y-2">
                <Button
                  variant="default"
                  className="w-full justify-start gap-3"
                  onClick={() => handleNavigation('/login')}
                >
                  <LogIn className="h-4 w-4" />
                  {t('login')}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3"
                  onClick={() => handleNavigation('/register')}
                >
                  <UserPlus className="h-4 w-4" />
                  {t('register')}
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Language Switcher */}
          <div className="px-4 py-4 border-t sm:hidden">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t('language')}</span>
              <LanguageSwitcherCompact />
            </div>
          </div>
        </div>

        {/* Footer */}
        <MobileMenuFooter userInfo={userInfo} />
      </div>
    </>
  );
};