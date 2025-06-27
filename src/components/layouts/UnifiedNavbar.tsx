
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Settings, LogOut, Crown } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useTranslation } from 'react-i18next';

interface UnifiedNavbarProps {
  rightContent?: React.ReactNode;
}

const UnifiedNavbar: React.FC<UnifiedNavbarProps> = ({ rightContent }) => {
  const { user, unifiedUser, signOut } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation(['navigation', 'auth']);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">PA</span>
            </div>
            <span className="hidden font-bold sm:inline-block">PendlerApp</span>
          </div>
        </Link>

        {/* Right Side */}
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          {rightContent}
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {user.email ? getInitials(user.email) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.email?.split('@')[0] || t('auth:user')}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {unifiedUser?.isPremium && (
                        <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800">
                          <Crown className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                      {unifiedUser?.isAdmin && (
                        <Badge variant="secondary" className="text-xs bg-red-100 text-red-800">
                          Admin
                        </Badge>
                      )}
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>{t('profile')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>{t('settings')}</span>
                </DropdownMenuItem>
                {unifiedUser?.isAdmin && (
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    <Crown className="mr-2 h-4 w-4" />
                    <span>{t('admin')}</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('auth:logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link to="/login">{t('auth:login')}</Link>
              </Button>
              <Button asChild>
                <Link to="/register">{t('auth:register')}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default UnifiedNavbar;
