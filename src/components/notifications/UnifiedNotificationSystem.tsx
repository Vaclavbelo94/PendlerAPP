import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSupabaseNotifications } from '@/hooks/useSupabaseNotifications';
import { useResponsive } from '@/hooks/useResponsive';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const UnifiedNotificationSystem: React.FC = () => {
  const { isMobile } = useResponsive();
  const navigate = useNavigate();
  const { unreadCount } = useSupabaseNotifications();

  const handleNotificationClick = () => {
    navigate('/notifications');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        'relative h-10 w-10 touch-manipulation',
        'active:scale-95 transition-transform'
      )}
      onClick={handleNotificationClick}
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
          {unreadCount > 99 ? '99+' : unreadCount}
        </div>
      )}
    </Button>
  );
};