import React from 'react';
import { Settings, Wrench, Download, Info, AlertTriangle, CheckCircle, Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { SupabaseNotification } from '@/hooks/useSupabaseNotifications';
import { cn } from '@/lib/utils';

interface SystemNotificationItemProps {
  notification: SupabaseNotification;
  onMarkAsRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const SystemNotificationItem: React.FC<SystemNotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDelete
}) => {
  const { t, i18n } = useTranslation('notifications');
  
  // Extract system info from metadata
  const systemType = notification.metadata?.system_type || '';
  const version = notification.metadata?.version || '';
  const maintenanceWindow = notification.metadata?.maintenance_window || '';
  const affectedServices = notification.metadata?.affected_services || [];
  const severity = notification.metadata?.severity || 'info';
  
  const getSystemIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'maintenance':
        return <Wrench className="h-4 w-4 text-orange-600" />;
      case 'update':
      case 'upgrade':
        return <Download className="h-4 w-4 text-blue-600" />;
      case 'announcement':
        return <Bell className="h-4 w-4 text-purple-600" />;
      case 'alert':
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Settings className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSeverityColor = (sev: string) => {
    switch (sev?.toLowerCase()) {
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

  const getSystemTypeLabel = () => {
    const type = notification.type?.toLowerCase();
    if (type?.includes('maintenance')) {
      return t('system.maintenance');
    }
    if (type?.includes('update')) {
      return t('system.update');
    }
    if (type?.includes('announcement')) {
      return t('system.announcement');
    }
    if (type?.includes('welcome')) {
      return t('system.welcome');
    }
    return notification.title;
  };

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      !notification.read && "ring-2 ring-primary/20 bg-primary/5",
      severity === 'critical' && "border-red-200 bg-red-50/50"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            {/* Header */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1">
                {getSystemIcon(systemType)}
                <h4 className="font-medium text-foreground">
                  {getSystemTypeLabel()}
                </h4>
              </div>
              
              {!notification.read && (
                <Badge variant="default" className="h-5 text-xs">
                  {t('status.unread')}
                </Badge>
              )}
              
              {severity && severity !== 'info' && (
                <Badge 
                  variant="outline" 
                  className={cn("h-5 text-xs border", getSeverityColor(severity))}
                >
                  {t(`priority.${severity}` as any) || severity}
                </Badge>
              )}
            </div>

            {/* System Details */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {notification.message}
              </p>
              
              {/* System Information */}
              {(version || maintenanceWindow || affectedServices.length > 0) && (
                <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                  {version && (
                    <div className="flex items-center gap-2 text-sm">
                      <Download className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <span className="text-muted-foreground">Verze:</span>
                      <span className="font-medium">{version}</span>
                    </div>
                  )}
                  
                  {maintenanceWindow && (
                    <div className="flex items-center gap-2 text-sm">
                      <Wrench className="h-4 w-4 text-orange-600 flex-shrink-0" />
                      <span className="text-muted-foreground">Údržba:</span>
                      <span className="font-medium">{maintenanceWindow}</span>
                    </div>
                  )}
                  
                  {affectedServices.length > 0 && (
                    <div className="flex items-start gap-2 text-sm">
                      <Settings className="h-4 w-4 text-gray-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-muted-foreground">Ovlivněné služby:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {affectedServices.map((service: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
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