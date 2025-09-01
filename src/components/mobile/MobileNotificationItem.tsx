import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Check, X, AlertTriangle, Info } from 'lucide-react';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SupabaseNotification, useSupabaseNotifications } from '@/hooks/useSupabaseNotifications';

interface MobileNotificationItemProps {
  notification: SupabaseNotification;
  onClose?: () => void;
}

export const MobileNotificationItem: React.FC<MobileNotificationItemProps> = ({
  notification,
  onClose
}) => {
  const navigate = useNavigate();
  const { markAsRead, deleteNotification } = useSupabaseNotifications();

  const handleClick = async () => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    
    // Navigate to related content if applicable
    if (notification.related_to) {
      if (notification.related_to.type === 'rideshare') {
        navigate('/profile?tab=submissions');
      } else if (notification.related_to.type === 'shift') {
        navigate('/shifts');
      }
    }
    
    if (onClose) {
      onClose();
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteNotification(notification.id);
  };

  // Format relative date in Czech
  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) {
      return 'Právě teď';
    } else if (diffMinutes < 60) {
      return `Před ${diffMinutes} min`;
    } else if (diffHours < 24) {
      return `Před ${diffHours} h`;
    } else if (diffDays === 1) {
      return 'Včera, ' + format(date, 'HH:mm');
    } else if (diffDays < 7) {
      return `Před ${diffDays} dny`;
    } else {
      return format(date, 'dd. MMMM', { locale: cs });
    }
  };

  // Get icon based on notification type
  const renderIcon = () => {
    const type = notification.type?.toLowerCase();
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'success':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'error':
        return <X className="h-5 w-5 text-red-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        'relative p-4 rounded-lg border transition-colors cursor-pointer',
        'touch-manipulation active:scale-[0.98]',
        notification.read ? 'bg-background' : 'bg-muted/50',
        !notification.read && 'border-primary/20 shadow-sm'
      )}
      onClick={handleClick}
    >
      {/* Unread indicator */}
      {!notification.read && (
        <div className="absolute left-2 top-4 w-2 h-2 bg-primary rounded-full" />
      )}
      
      <div className="flex items-start gap-3 ml-3">
        <div className="mt-1 flex-shrink-0">
          {renderIcon()}
        </div>
        
        <div className="flex-1 space-y-1 min-w-0">
          <div className={cn(
            'font-medium text-sm leading-tight',
            !notification.read && 'text-foreground font-semibold'
          )}>
            {notification.title}
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {notification.message}
          </p>
          
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatRelativeDate(notification.created_at)}
          </p>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-50 hover:opacity-100 flex-shrink-0"
          onClick={handleDelete}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
};