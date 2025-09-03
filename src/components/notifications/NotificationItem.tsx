import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { cs, de, pl } from 'date-fns/locale';
import { 
  Bell, 
  Calendar, 
  Car, 
  Settings, 
  Shield, 
  Check, 
  Trash2,
  Clock,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EnhancedNotification, NotificationCategory, NotificationPriority } from '@/services/NotificationService';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface NotificationItemProps {
  notification: EnhancedNotification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onClick: () => void;
  compact?: boolean;
  isMobile?: boolean;
}

const getCategoryIcon = (category: NotificationCategory) => {
  switch (category) {
    case 'shift':
      return Calendar;
    case 'rideshare':
      return Car;
    case 'system':
      return Settings;
    case 'admin':
      return Shield;
    default:
      return Bell;
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'success':
      return CheckCircle;
    case 'warning':
      return AlertTriangle;
    case 'error':
      return AlertCircle;
    default:
      return Info;
  }
};

const getPriorityColor = (priority: NotificationPriority) => {
  switch (priority) {
    case 'critical':
      return 'text-red-500';
    case 'high':
      return 'text-orange-500';
    case 'medium':
      return 'text-blue-500';
    case 'low':
      return 'text-gray-500';
    default:
      return 'text-blue-500';
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'success':
      return 'text-green-500';
    case 'warning':
      return 'text-yellow-500';
    case 'error':
      return 'text-red-500';
    default:
      return 'text-blue-500';
  }
};

const formatRelativeTime = (date: string, language: string = 'cs') => {
  const localeMap = { cs, de, pl };
  const locale = localeMap[language as keyof typeof localeMap] || cs;
  
  return formatDistanceToNow(new Date(date), { 
    addSuffix: true,
    locale 
  });
};

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
  onClick,
  compact = false,
  isMobile = false
}) => {
  const { t, i18n } = useTranslation(['notifications']);
  
  const CategoryIcon = getCategoryIcon(notification.category);
  const TypeIcon = getTypeIcon(notification.type);
  
  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMarkAsRead(notification.id);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(notification.id);
  };

  return (
    <div
      className={cn(
        'group relative p-3 rounded-lg border cursor-pointer transition-all hover:bg-accent/50',
        !notification.read && 'bg-primary/5 border-primary/20',
        notification.read && 'bg-background border-border',
        compact && 'p-2',
        isMobile && 'min-h-[60px] touch-manipulation active:bg-accent/70'
      )}
      onClick={onClick}
    >
      {/* Unread indicator */}
      {!notification.read && (
        <div className="absolute left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full" />
      )}

      <div className={cn('flex gap-3', !notification.read && 'ml-4')}>
        {/* Category/Type Icon */}
        <div className="flex-shrink-0 pt-0.5">
          <div className={cn(
            'p-1.5 rounded-full',
            notification.read ? 'bg-muted' : 'bg-primary/10'
          )}>
            <CategoryIcon className={cn(
              'h-4 w-4',
              notification.read ? 'text-muted-foreground' : getTypeColor(notification.type)
            )} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h4 className={cn(
                'text-sm font-medium truncate',
                notification.read ? 'text-muted-foreground' : 'text-foreground'
              )}>
                {notification.title}
              </h4>
              {!compact && (
                <p className={cn(
                  'text-xs mt-1 line-clamp-2',
                  notification.read ? 'text-muted-foreground/70' : 'text-muted-foreground'
                )}>
                  {notification.message}
                </p>
              )}
            </div>

            {/* Priority indicator */}
            {notification.priority && notification.priority !== 'medium' && (
              <Badge 
                variant={notification.priority === 'critical' ? 'destructive' : 'secondary'}
                className="text-xs"
              >
                {t(`notifications:priority.${notification.priority}`)}
              </Badge>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{formatRelativeTime(notification.created_at, i18n.language)}</span>
              
              {/* Category badge */}
              <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                {t(`notifications:categories.${notification.category}`)}
              </Badge>
            </div>

            {/* Actions */}
            <div className={cn(
              'flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity',
              isMobile && 'opacity-100'
            )}>
              {!notification.read && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAsRead}
                  className="h-6 w-6 p-0"
                  title={t('notifications:actions.markAsRead')}
                >
                  <Check className="h-3 w-3" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="h-6 w-6 p-0 hover:text-destructive"
                title={t('notifications:actions.delete')}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};