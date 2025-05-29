
import { useNavigate } from 'react-router-dom';
import { Calendar, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { Notification, useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NotificationItemProps {
  notification: Notification;
  onClose?: () => void;
}

export const NotificationItem = ({ notification, onClose }: NotificationItemProps) => {
  const navigate = useNavigate();
  const { markAsRead, deleteNotification } = useNotifications();
  
  const handleClick = () => {
    markAsRead(notification.id);
    
    // Navigate to related content if applicable
    if (notification.related_to) {
      if (notification.related_to.type === 'shift') {
        navigate('/shifts');
      }
      // Add other navigation options as needed
    }
    
    if (onClose) {
      onClose();
    }
  };

  // Function to format the date in Czech
  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Dnes, ' + format(date, 'HH:mm');
    } else if (diffDays === 1) {
      return 'Včera, ' + format(date, 'HH:mm');
    } else {
      return format(date, 'dd. MMMM, HH:mm', { locale: cs });
    }
  };

  // Define icon based on notification type
  const renderIcon = () => {
    switch (notification.type) {
      case 'warning':
        return <Calendar className="h-4 w-4 text-amber-500" />;
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <Calendar className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div 
      className={cn(
        "p-3 rounded-md border transition-colors cursor-pointer",
        notification.read ? "bg-background" : "bg-muted",
        !notification.read && "border-blue-200"
      )}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1">{renderIcon()}</div>
        <div className="flex-1 space-y-1">
          <div className="font-medium">{notification.title}</div>
          <p className="text-sm text-muted-foreground">{notification.message}</p>
          <p className="text-xs text-muted-foreground">
            {formatRelativeDate(notification.created_at)}
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 opacity-50 hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            deleteNotification(notification.id);
          }}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};
