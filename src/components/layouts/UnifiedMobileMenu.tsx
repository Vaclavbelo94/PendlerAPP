import React, { useEffect } from 'react';
import { X, User, Settings, LogOut, Crown, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/auth';
import { useHasPermission } from '@/hooks/useAuthPermissions';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getVisibleItems } from '@/components/layouts/sidebar/modernNavigationData';
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';
import { cn } from '@/lib/utils';

interface UnifiedMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UnifiedMobileMenu: React.FC<UnifiedMobileMenuProps> = ({
  isOpen,
  onClose
}) => {
  const { user, signOut, unifiedUser } = useAuth();
  const permissions = useHasPermission();
  const navigate = useNavigate();
  const { t } = useTranslation('navigation');

  // Disable body scroll when menu is open and handle escape key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      
      // Handle escape key
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
  };

  const visibleItems = getVisibleItems(
    permissions.permissions.companyType === 'dhl' ? 'dhl' : null,
    !!user,
    permissions.hasPremiumAccess(),
    permissions.hasAdminAccess()
  );

  const username = user?.email?.split('@')[0] || 'User';

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Menu Panel */}
      <div className={cn(
        "fixed top-16 right-0 h-[calc(100vh-4rem)] w-80 bg-gradient-to-b from-background to-background/95 backdrop-blur-lg border-l shadow-2xl transform transition-transform duration-300 ease-out z-[80] md:hidden safe-area-inset-top",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">PA</span>
            </div>
            <span className="font-bold">PendlerApp</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col h-full">
          {/* User Section */}
          {user && (
            <div className="p-4 border-b">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{username}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  {permissions.hasPremiumAccess() && (
                    <Badge variant="secondary" className="mt-1 bg-amber-100 text-amber-800">
                      <Crown className="h-3 w-3 mr-1" />
                      {permissions.permissions.isDHLEmployee ? 'DHL Employee' : 'Premium'}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {user && (
            <div className="p-4 border-b">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="h-12 flex-col gap-1"
                  onClick={() => handleNavigation('/profile')}
                >
                  <User className="h-4 w-4" />
                  <span className="text-xs">{t('profile')}</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-12 flex-col gap-1"
                  onClick={() => handleNavigation('/settings')}
                >
                  <Settings className="h-4 w-4" />
                  <span className="text-xs">{t('settings')}</span>
                </Button>
              </div>
            </div>
          )}

          {/* Navigation Modules */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {visibleItems.map((item) => {
                const Icon = item.icon;
                const isLocked = item.isPremium && !permissions.hasPremiumAccess();
                
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start h-12 gap-3",
                      isLocked && "opacity-60"
                    )}
                    onClick={() => {
                      if (isLocked) {
                        handleNavigation('/premium');
                      } else {
                        handleNavigation(item.href);
                      }
                    }}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{t(item.label)}</span>
                    {isLocked && <Crown className="h-4 w-4 ml-auto text-amber-500" />}
                  </Button>
                );
              })}
            </div>
          </div>


          {/* Auth Section */}
          <div className="p-4 border-t space-y-2">
            {!unifiedUser?.isPremium && user && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleNavigation('/premium')}
              >
                <Crown className="h-4 w-4 mr-2" />
                Upgrade
              </Button>
            )}
            
            {user ? (
              <Button
                variant="ghost"
                className="w-full"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t('logout')}
              </Button>
            ) : (
              <div className="space-y-2">
                <Button
                  className="w-full"
                  onClick={() => handleNavigation('/login')}
                >
                  {t('login')}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleNavigation('/register')}
                >
                  {t('register')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};