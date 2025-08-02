import React from 'react';
import { X, Crown, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User } from '@supabase/supabase-js';

interface UserInfo {
  email: string;
  role: string;
  company?: string;
  isPremium: boolean;
  isAdmin: boolean;
}

interface MobileMenuHeaderProps {
  user: User | null;
  userInfo: UserInfo | null;
  onClose: () => void;
}

export const MobileMenuHeader: React.FC<MobileMenuHeaderProps> = ({
  user,
  userInfo,
  onClose
}) => {
  const getInitials = (email: string) => {
    return email.split('@')[0].substring(0, 2).toUpperCase();
  };

  const getRoleBadge = () => {
    if (!userInfo) return null;

    if (userInfo.isAdmin) {
      return (
        <Badge variant="destructive" className="gap-1">
          <Shield className="h-3 w-3" />
          Admin
        </Badge>
      );
    }

    if (userInfo.isPremium) {
      return (
        <Badge variant="secondary" className="gap-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-700 dark:text-yellow-300">
          <Crown className="h-3 w-3" />
          Premium
        </Badge>
      );
    }

    if (userInfo.company) {
      return (
        <Badge variant="outline">
          {userInfo.company.toUpperCase()}
        </Badge>
      );
    }

    return (
      <Badge variant="secondary">
        Standard
      </Badge>
    );
  };

  return (
    <div className="flex items-center justify-between p-4 border-b bg-muted/5">
      <div className="flex items-center gap-3 flex-1">
        {user ? (
          <>
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(user.email || '')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {user.email}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {getRoleBadge()}
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">PA</span>
            </div>
            <div>
              <p className="font-semibold">PendlerApp</p>
              <p className="text-xs text-muted-foreground">Přihlašte se pro více funkcí</p>
            </div>
          </div>
        )}
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
  );
};