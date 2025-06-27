
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/auth';
import { useNavigate } from 'react-router-dom';

interface MobileSidebarUserSectionProps {
  compact?: boolean;
}

export const MobileSidebarUserSection: React.FC<MobileSidebarUserSectionProps> = ({ 
  compact = false 
}) => {
  const { user, unifiedUser, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = async () => {
    await signOut();
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  if (compact) {
    return (
      <div className="flex flex-col items-center space-y-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">
            {user.email ? getInitials(user.email) : 'U'}
          </AvatarFallback>
        </Avatar>
        {unifiedUser?.isPremium && (
          <Crown className="h-3 w-3 text-amber-500" />
        )}
      </div>
    );
  }

  return (
    <div className="bg-muted/50 rounded-lg p-4">
      <div className="flex items-center space-x-3 mb-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback>
            {user.email ? getInitials(user.email) : 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">
            {user.email?.split('@')[0] || 'Uživatel'}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {user.email}
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-3">
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
      
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={handleProfileClick}
        >
          <User className="h-4 w-4 mr-1" />
          Profil
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
