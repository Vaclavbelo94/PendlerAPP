import React from 'react';
import { Shield, AlertTriangle, Info, MessageSquare, Crown, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { SupabaseNotification } from '@/hooks/useSupabaseNotifications';
import { cn } from '@/lib/utils';

interface AdminNotificationItemProps {
  notification: SupabaseNotification;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const AdminNotificationItem: React.FC<AdminNotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDelete
}) => {
  const { t, i18n } = useTranslation('notifications');
  
  // Extract admin info from metadata
  const adminType = notification.metadata?.admin_type || '';
  const priority = notification.metadata?.priority || 'medium';
  const adminUser = notification.metadata?.admin_user || '';
  const targetCompany = notification.metadata?.target_company || '';
  const actionRequired = notification.metadata?.action_required || false;
  const expiresAt = notification.metadata?.expires_at || '';
  
  const getAdminIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'announcement':
        return <MessageSquare className="h-4 w-4 text-blue-600" />;
      case 'super_admin':
        return <Crown className="h-4 w-4 text-purple-600" />;
      default:
        return <Shield className="h-4 w-4 text-indigo-600" />;
    }
  };

  const getPriorityColor = (prio: string) => {
    switch (prio?.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return t('time.now');
    if (diffInMinutes < 60) return `${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} h`;
    return `${Math.floor(diffInMinutes / 1440)} d`;
  };

  const getAdminTypeLabel = () => {
    const type = notification.type?.toLowerCase();
    if (type?.includes('warning')) {
      return t('admin.warning');
    }
    if (type?.includes('critical')) {
      return t('admin.critical');
    }
    if (type?.includes('announcement')) {
      return t('admin.announcement');
    }
    if (type?.includes('message')) {
      return t('admin.message');
    }
    return notification.title;
  };

  const isExpired = () => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      !notification.read && "ring-2 ring-primary/20 bg-primary/5",
      priority === 'critical' && "border-red-200 bg-red-50/50 shadow-md",
      priority === 'high' && "border-orange-200 bg-orange-50/30",
      isExpired() && "opacity-75"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            {/* Header */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1">
                {getAdminIcon(adminType)}
                <h4 className="font-medium text-foreground">
                  {getAdminTypeLabel()}
                </h4>
                {priority === 'critical' && (
                  <AlertTriangle className="h-4 w-4 text-red-500 animate-pulse" />
                )}
              </div>
              
              {!notification.read && (
                <Badge variant="default" className="h-5 text-xs">
                  {t('status.unread')}
                </Badge>
              )}
              
              {priority && priority !== 'medium' && (
                <Badge 
                  variant="outline" 
                  className={cn("h-5 text-xs border", getPriorityColor(priority))}
                >
                  {t(`priority.${priority}` as any) || priority}
                </Badge>
              )}
              
              {actionRequired && (
                <Badge variant="destructive" className="h-5 text-xs animate-pulse">
                  Akce vyžadována
                </Badge>
              )}
            </div>

            {/* Admin Details */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {notification.message}
              </p>
              
              {/* Admin Information */}
              {(adminUser || targetCompany || expiresAt) && (
                <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                  {adminUser && (
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                      <span className="text-muted-foreground">Od:</span>
                      <span className="font-medium">{adminUser}</span>
                    </div>
                  )}
                  
                  {targetCompany && (
                    <div className="flex items-center gap-2 text-sm">
                      <Info className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <span className="text-muted-foreground">Společnost:</span>
                      <Badge variant="secondary" className="text-xs">
                        {targetCompany.toUpperCase()}
                      </Badge>
                    </div>
                  )}
                  
                  {expiresAt && (
                    <div className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                      <span className="text-muted-foreground">Vyprší:</span>
                      <span className={cn(
                        "font-medium",
                        isExpired() && "text-red-600"
                      )}>
                        {new Date(expiresAt).toLocaleDateString('cs-CZ')}
                      </span>
                      {isExpired() && (
                        <Badge variant="destructive" className="text-xs">
                          Vypršelo
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground">
                {formatRelativeTime(notification.created_at)}
              </span>
              
              <div className="flex items-center gap-1">
                {!notification.read && onMarkAsRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onMarkAsRead(notification.id)}
                    className="h-7 px-2 text-xs"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {t('actions.markAsRead')}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};