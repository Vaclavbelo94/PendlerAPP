import React, { useState, useMemo, useRef } from 'react';
import Layout from '@/components/layouts/Layout';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';
import { useSupabaseNotifications } from '@/hooks/useSupabaseNotifications';
import { MobileNotificationItem } from '@/components/mobile/MobileNotificationItem';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  RefreshCw, 
  Filter,
  Calendar,
  Car,
  Settings,
  Shield,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import DashboardBackground from '@/components/common/DashboardBackground';

type NotificationFilter = 'all' | 'shift' | 'rideshare' | 'system' | 'admin';

const NotificationsPage: React.FC = () => {
  const { t } = useTranslation('notifications');
  const isMobile = useIsMobile();
  const {
    notifications,
    unreadCount,
    loading,
    markAllAsRead,
    clearNotifications,
    refresh
  } = useSupabaseNotifications();

  const [selectedFilter, setSelectedFilter] = useState<NotificationFilter>('all');

  // Filter notifications based on selected category
  const filteredNotifications = useMemo(() => {
    if (selectedFilter === 'all') return notifications;
    
    return notifications.filter(notification => {
      const type = notification.type.toLowerCase();
      
      switch (selectedFilter) {
        case 'shift':
          return type.includes('shift') || type.includes('overtime');
        case 'rideshare':
          return type.includes('rideshare') || type.includes('travel');
        case 'system':
          return type.includes('system') || type.includes('maintenance') || type.includes('update');
        case 'admin':
          return type.includes('admin') || type.includes('warning') || type.includes('critical');
        default:
          return true;
      }
    });
  }, [notifications, selectedFilter]);

  const getNotificationIcon = (type: string) => {
    const iconClass = "h-4 w-4";
    
    if (type.includes('shift') || type.includes('overtime')) {
      return <Calendar className={iconClass} />;
    }
    if (type.includes('rideshare') || type.includes('travel')) {
      return <Car className={iconClass} />;
    }
    if (type.includes('system') || type.includes('maintenance')) {
      return <Settings className={iconClass} />;
    }
    if (type.includes('admin') || type.includes('critical')) {
      return <Shield className={iconClass} />;
    }
    if (type.includes('error')) {
      return <XCircle className={iconClass} />;
    }
    if (type.includes('success')) {
      return <CheckCircle className={iconClass} />;
    }
    if (type.includes('warning')) {
      return <AlertCircle className={iconClass} />;
    }
    return <Info className={iconClass} />;
  };

  const scrollRef = useRef<HTMLDivElement>(null);

  const filterButtons: Array<{
    key: NotificationFilter;
    labelKey: string;
    icon: React.ReactNode;
  }> = [
    { key: 'all', labelKey: 'categories.all', icon: <Bell className="h-4 w-4" /> },
    { key: 'shift', labelKey: 'categories.shift', icon: <Calendar className="h-4 w-4" /> },
    { key: 'rideshare', labelKey: 'categories.rideshare', icon: <Car className="h-4 w-4" /> },
    { key: 'system', labelKey: 'categories.system', icon: <Settings className="h-4 w-4" /> },
    { key: 'admin', labelKey: 'categories.admin', icon: <Shield className="h-4 w-4" /> },
  ];

  const handleFilterSelect = (filter: NotificationFilter) => {
    setSelectedFilter(filter);
    
    // Auto-scroll to center the selected filter button on mobile
    if (isMobile && scrollRef.current) {
      const filterIndex = filterButtons.findIndex(btn => btn.key === filter);
      const buttonWidth = 120; // Approximate button width
      const containerWidth = scrollRef.current.offsetWidth;
      const scrollPosition = (filterIndex * buttonWidth) - (containerWidth / 2) + (buttonWidth / 2);
      
      scrollRef.current.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: 'smooth'
      });
    }
  };

  return (
    <Layout navbarRightContent={<NavbarRightContent />}>
      <DashboardBackground variant="default">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Bell className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    {t('status.notifications')}
                  </h1>
                  <p className="text-muted-foreground">
                    {notifications.length > 0 
                      ? `${notifications.length} ${t('status.notifications').toLowerCase()}, ${unreadCount} ${t('status.unread').toLowerCase()}`
                      : t('status.emptyDescription')
                    }
                  </p>
                </div>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refresh}
                  disabled={loading}
                  className="hidden sm:flex"
                >
                  <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                  {t('actions.refresh')}
                </Button>

                {unreadCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={markAllAsRead}
                    className="hidden sm:flex"
                  >
                    <CheckCheck className="h-4 w-4 mr-2" />
                    {t('actions.markAllAsRead')}
                  </Button>
                )}

                {notifications.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearNotifications}
                    className="text-destructive hover:text-destructive hidden sm:flex"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t('actions.deleteAll')}
                  </Button>
                )}
              </div>
            </div>

            {/* Mobile Actions */}
            {isMobile && notifications.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refresh}
                  disabled={loading}
                  className="flex-1"
                >
                  <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                  {t('actions.refresh')}
                </Button>

                {unreadCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={markAllAsRead}
                    className="flex-1"
                  >
                    <CheckCheck className="h-4 w-4 mr-2" />
                    {t('actions.markAllAsRead')}
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearNotifications}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Filter Carousel */}
            <div className="relative">
              <div 
                ref={scrollRef}
                className="flex gap-2 overflow-x-auto scrollbar-hide pb-2"
                style={{
                  scrollSnapType: 'x mandatory',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {filterButtons.map(({ key, labelKey, icon }) => {
                  const count = key === 'all' 
                    ? notifications.length 
                    : notifications.filter(n => {
                        const type = n.type.toLowerCase();
                        switch (key) {
                          case 'shift': return type.includes('shift') || type.includes('overtime');
                          case 'rideshare': return type.includes('rideshare') || type.includes('travel');
                          case 'system': return type.includes('system') || type.includes('maintenance') || type.includes('update');
                          case 'admin': return type.includes('admin') || type.includes('warning') || type.includes('critical');
                          default: return false;
                        }
                      }).length;

                  return (
                    <Button
                      key={key}
                      variant={selectedFilter === key ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleFilterSelect(key)}
                      className={cn(
                        "flex items-center gap-2 whitespace-nowrap flex-shrink-0",
                        "scroll-snap-align: center",
                        isMobile && "min-w-[110px] justify-center"
                      )}
                    >
                      {icon}
                      {t(labelKey)}
                      {count > 0 && (
                        <Badge 
                          variant={selectedFilter === key ? "secondary" : "default"} 
                          className="ml-1 text-xs"
                        >
                          {count}
                        </Badge>
                      )}
                    </Button>
                  );
                })}
              </div>
              
              {/* Scroll indicators for mobile */}
              {isMobile && (
                <div className="flex justify-center mt-2 gap-1">
                  {filterButtons.map((_, index) => {
                    const isActive = filterButtons[index].key === selectedFilter;
                    return (
                      <div
                        key={index}
                        className={cn(
                          "h-1.5 w-1.5 rounded-full transition-colors",
                          isActive ? "bg-primary" : "bg-muted-foreground/30"
                        )}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Notifications List */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">{t('status.loading')}</p>
                </div>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">{t('status.empty')}</h3>
                <p className="text-muted-foreground mb-4">
                  {selectedFilter === 'all' 
                    ? t('status.emptyDescription')
                    : `Žádná oznámení v kategorii "${t(`categories.${selectedFilter}`)}"` 
                  }
                </p>
                {selectedFilter !== 'all' && (
                  <Button
                    variant="outline"
                    onClick={() => setSelectedFilter('all')}
                  >
                    {t('categories.all')}
                  </Button>
                )}
              </div>
            ) : (
              <ScrollArea className="h-[calc(100vh-24rem)]">
                <div className="space-y-3 pr-4">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-4 rounded-lg border transition-colors",
                        !notification.read 
                          ? "bg-accent/50 border-primary/20" 
                          : "bg-card border-border hover:bg-accent/30"
                      )}
                    >
                      <MobileNotificationItem 
                        notification={notification}
                      />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </DashboardBackground>
    </Layout>
  );
};

export default NotificationsPage;