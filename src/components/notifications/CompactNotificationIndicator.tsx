
import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationItem } from './NotificationItem';
import { useIsMobile } from '@/hooks/use-mobile';

export const CompactNotificationIndicator = () => {
  const { notifications, unreadCount, markAllAsRead, clearNotifications } = useNotifications();
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size={isMobile ? "sm" : "icon"} 
          className={`relative ${
            isMobile ? 'min-h-[44px] min-w-[44px] p-2' : ''
          }`}
        >
          <Bell className={`${isMobile ? 'h-4 w-4' : 'h-[1.2rem] w-[1.2rem]'}`} />
          {unreadCount > 0 && (
            <span className={`absolute flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-medium ${
              isMobile 
                ? 'top-1 right-1 h-3 w-3' 
                : 'top-1 right-1 h-4 w-4'
            }`}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          <span className="sr-only">Oznámení</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm">Oznámení</h3>
          <div className="flex gap-1">
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-xs px-2"
                onClick={() => markAllAsRead()}
              >
                Označit jako přečtené
              </Button>
            )}
            {notifications.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-xs px-2"
                onClick={() => clearNotifications()}
              >
                Smazat
              </Button>
            )}
          </div>
        </div>
        
        <ScrollArea className="h-[300px] pr-4">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Žádná oznámení
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map(notification => (
                <NotificationItem 
                  key={notification.id} 
                  notification={notification} 
                  onClose={() => setOpen(false)}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
