
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogIn, UserPlus, LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface MobileSidebarUserSectionProps {
  handleLinkClick: () => void;
  handleLogout: () => void;
}

export const MobileSidebarUserSection: React.FC<MobileSidebarUserSectionProps> = ({
  handleLinkClick,
  handleLogout
}) => {
  const { user, isPremium, isAdmin } = useAuth();

  if (user) {
    return (
      <div className="mb-6 p-4 bg-muted rounded-lg">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">
              {user.user_metadata?.username || user.email?.split('@')[0] || 'Uživatel'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {isPremium && <Badge className="bg-amber-500 text-xs">Premium</Badge>}
          {isAdmin && <Badge className="bg-red-500 text-xs">Admin</Badge>}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 space-y-2">
      <Button asChild variant="outline" className="w-full justify-start" onClick={handleLinkClick}>
        <Link to="/login">
          <LogIn className="h-4 w-4 mr-2" />
          Přihlásit se
        </Link>
      </Button>
      <Button asChild className="w-full justify-start" onClick={handleLinkClick}>
        <Link to="/register">
          <UserPlus className="h-4 w-4 mr-2" />
          Registrovat se
        </Link>
      </Button>
    </div>
  );
};
