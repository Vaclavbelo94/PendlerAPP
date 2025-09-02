import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSupabaseNotifications } from '@/hooks/useSupabaseNotifications';
import { MobileNotificationPanel } from '../mobile/MobileNotificationPanel';
import { CompactNotificationIndicator } from './CompactNotificationIndicator';
import { useResponsive } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';

export const UnifiedNotificationSystem: React.FC = () => {
  const { isMobile } = useResponsive();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { unreadCount } = useSupabaseNotifications();

  // On mobile, use slide-out panel
  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'relative h-10 w-10 touch-manipulation',
            'active:scale-95 transition-transform'
          )}
          onClick={() => setMobileOpen(true)}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </div>
          )}
        </Button>

        <MobileNotificationPanel
          isOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />
      </>
    );
  }

  // On desktop, use popover
  return <CompactNotificationIndicator />;
};