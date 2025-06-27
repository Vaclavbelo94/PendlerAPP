
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Crown, User } from 'lucide-react';
import { useAuth } from '@/hooks/auth';

interface MobileSidebarUserSectionProps {
  compact?: boolean;
}

export const MobileSidebarUserSection: React.FC<MobileSidebarUserSectionProps> = ({ compact = false }) => {
  const { user, unifiedUser } = useAuth();

  if (!user) return null;

  const username = user.email?.split('@')[0] || 'User';

  return (
    <div className={`flex items-center gap-3 p-3 bg-muted/50 rounded-lg ${compact ? 'justify-center' : ''}`}>
      <Avatar className="h-10 w-10">
        <AvatarImage src={user.user_metadata?.avatar_url} />
        <AvatarFallback>
          <User className="h-5 w-5" />
        </AvatarFallback>
      </Avatar>
      
      {!compact && (
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{username}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          {unifiedUser?.isPremium && (
            <Badge variant="secondary" className="mt-1 bg-amber-100 text-amber-800">
              <Crown className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
