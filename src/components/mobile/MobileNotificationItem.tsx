import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Check, X, AlertTriangle, Info, Car, Clock, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
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
    
    // Navigate based on notification type and metadata
    if (notification.type?.includes('rideshare')) {
      navigate('/rideshare');
    } else if (notification.type?.includes('shift')) {
      navigate('/shifts');
    }
    
    onClose?.();
  };

  const handleApprove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const contactId = notification.metadata?.contact_id;
    
    console.log('Attempting to approve contact:', contactId, notification);
    
    if (!contactId) {
      console.error('No contact_id in notification metadata:', notification.metadata);
      toast.error('Chyba: chybí ID kontaktu');
      return;
    }

    try {
      const { rideshareContactService } = await import('@/services/rideshareContactService');
      const result = await rideshareContactService.updateContactStatus(contactId, 'approved');
      
      console.log('Successfully approved contact:', result);
      toast.success('Žádost byla schválena');
      
      // Remove this notification since it's now handled
      deleteNotification(notification.id);
    } catch (error) {
      console.error('Failed to approve request:', error);
      toast.error('Nepodařilo se schválit žádost');
    }
  };

  const handleReject = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const contactId = notification.metadata?.contact_id;
    
    console.log('Attempting to reject contact:', contactId, notification);
    
    if (!contactId) {
      console.error('No contact_id in notification metadata:', notification.metadata);
      toast.error('Chyba: chybí ID kontaktu');
      return;
    }

    try {
      const { rideshareContactService } = await import('@/services/rideshareContactService');
      const result = await rideshareContactService.updateContactStatus(contactId, 'rejected');
      
      console.log('Successfully rejected contact:', result);
      toast.success('Žádost byla zamítnuta');
      
      // Remove this notification since it's now handled
      deleteNotification(notification.id);
    } catch (error) {
      console.error('Failed to reject request:', error);
      toast.error('Nepodařilo se zamítnout žádost');
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
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'rideshare_match':
        return <Car className="h-5 w-5 text-blue-500" />;
      case 'rideshare_request':
        return <Clock className="h-5 w-5 text-orange-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  // Check if this is a pending rideshare match that can be approved/rejected
  const canApprove = notification.type === 'rideshare_match' && 
                    notification.metadata?.status === 'pending';

  // Check if this shows approval result
  const isApprovalResult = notification.title?.includes('✅') || notification.title?.includes('❌');

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

          {canApprove && (
            <div className="flex gap-2 mt-2">
              <Button
                onClick={handleApprove}
                size="sm"
                className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 border-green-200"
                variant="outline"
              >
                ✅ Schválit
              </Button>
              <Button
                onClick={handleReject}
                size="sm"
                className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 border-red-200"
                variant="outline"
              >
                ❌ Zamítnout
              </Button>
            </div>
          )}
          
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