import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import Layout from '@/components/layouts/Layout';
import { NavbarRightContent } from '@/components/layouts/NavbarPatch';
import { useSupabaseNotifications } from '@/hooks/useSupabaseNotifications';
import { useTestNotifications } from '@/hooks/useTestNotifications';
import { MobileNotificationItem } from '@/components/mobile/MobileNotificationItem';
import { ShiftNotificationItem } from '@/components/notifications/ShiftNotificationItem';
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
  XCircle,
  ChevronLeft,
  ChevronRight
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
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearNotifications,
    refresh
  } = useSupabaseNotifications();

  const { createSampleShiftNotification, isCreating } = useTestNotifications();

  const [selectedFilter, setSelectedFilter] = useState<NotificationFilter>('all');
  const [currentFilterIndex, setCurrentFilterIndex] = useState(0);
  const [isSwipeTransition, setIsSwipeTransition] = useState(false);
  
  const carouselRef = useRef<HTMLDivElement>(null);

  // Filter notifications based on selected category
  const filteredNotifications = useMemo(() => {
    if (selectedFilter === 'all') return notifications;
    
    return notifications.filter(notification => {
      const type = notification.type.toLowerCase();
      const category = notification.category?.toLowerCase() || '';
      
      switch (selectedFilter) {
        case 'shift':
          return (
            type.includes('shift') || 
            type.includes('overtime') ||
            category.includes('shift') ||
            notification.related_to?.type === 'shift'
          );
        case 'rideshare':
          return (
            type.includes('rideshare') || 
            type.includes('travel') ||
            category.includes('rideshare')
          );
        case 'system':
          return (
            type.includes('system') || 
            type.includes('maintenance') || 
            type.includes('update') ||
            category.includes('system')
          );
        case 'admin':
          return (
            type.includes('admin') || 
            type.includes('warning') || 
            type.includes('critical') ||
            category.includes('admin')
          );
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
    const newIndex = filterButtons.findIndex(btn => btn.key === filter);
    setCurrentFilterIndex(newIndex);
  };

  const handlePreviousFilter = useCallback(() => {
    setIsSwipeTransition(true);
    const newIndex = currentFilterIndex > 0 ? currentFilterIndex - 1 : filterButtons.length - 1;
    setCurrentFilterIndex(newIndex);
    setSelectedFilter(filterButtons[newIndex].key);
    setTimeout(() => setIsSwipeTransition(false), 300);
  }, [currentFilterIndex, filterButtons]);

  const handleNextFilter = useCallback(() => {
    setIsSwipeTransition(true);
    const newIndex = currentFilterIndex < filterButtons.length - 1 ? currentFilterIndex + 1 : 0;
    setCurrentFilterIndex(newIndex);
    setSelectedFilter(filterButtons[newIndex].key);
    setTimeout(() => setIsSwipeTransition(false), 300);
  }, [currentFilterIndex, filterButtons]);

  // Touch/Swipe handlers
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        // Swipe left - next filter
        handleNextFilter();
      } else {
        // Swipe right - previous filter
        handlePreviousFilter();
      }
    }
  }, [handleNextFilter, handlePreviousFilter]);

  // Update filter index when selectedFilter changes programmatically
  useEffect(() => {
    const newIndex = filterButtons.findIndex(btn => btn.key === selectedFilter);
    if (newIndex !== -1 && newIndex !== currentFilterIndex) {
      setCurrentFilterIndex(newIndex);
    }
  }, [selectedFilter, filterButtons, currentFilterIndex]);

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
                    Oznámení
                  </h1>
                  <p className="text-muted-foreground">
                    {notifications.length > 0 
                      ? `${notifications.length} ${notifications.length === 1 ? 'oznámení' : 'oznámení'}, ${unreadCount} ${unreadCount === 1 ? 'nepřečtené' : 'nepřečtených'}`
                      : 'Nemáte žádná nová oznámení'
                    }
                  </p>
                </div>
              </div>

              {/* Header Actions - Desktop only */}
              {!isMobile && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => createSampleShiftNotification()}
                    disabled={isCreating}
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Test oznámení
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refresh}
                    disabled={loading}
                  >
                    <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                    {t('actions.refresh')}
                  </Button>

                  {unreadCount > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={markAllAsRead}
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
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t('actions.deleteAll')}
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Actions */}
            {isMobile && (
              <div className="space-y-3 mb-6">
                {/* Test button always visible on mobile */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => createSampleShiftNotification()}
                  disabled={isCreating}
                  className="w-full justify-start"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Test oznámení
                </Button>

                {notifications.length > 0 && (
                  <div className="flex items-center gap-2">
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
              </div>
            )}

            {/* Mobile Actions */}
            {isMobile && (
              <div className="space-y-3 mb-6">
                {/* Test button always visible on mobile */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => createSampleShiftNotification()}
                  disabled={isCreating}
                  className="w-full justify-start"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Test oznámení
                </Button>

                {notifications.length > 0 && (
                  <div className="flex items-center gap-2">
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
              </div>
            )}

            {/* Filter Carousel - Mobile vs Desktop */}
            {isMobile ? (
              // Mobile Carousel with Navigation Arrows and Swipe Support
              <div className="relative mb-6">
                <div 
                  ref={carouselRef}
                  className={cn(
                    "flex items-center justify-between bg-muted/30 rounded-lg p-4",
                    "select-none touch-pan-y", // Prevent text selection and enable vertical scroll
                    isSwipeTransition && "transition-all duration-300"
                  )}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePreviousFilter}
                    className="h-10 w-10 flex-shrink-0 z-10 bg-background border-2 shadow-sm"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>

                  <div className={cn(
                    "flex-1 flex items-center justify-center min-w-0 overflow-hidden px-4",
                    isSwipeTransition && "animate-scale-in"
                  )}>
                    <div className="flex items-center gap-3 text-center">
                      {filterButtons[currentFilterIndex]?.icon}
                      <span className="font-medium truncate text-base">
                        {(() => {
                          const currentFilter = filterButtons[currentFilterIndex]?.key;
                          switch (currentFilter) {
                            case 'all': return 'Všechna oznámení';
                            case 'shift': return 'Směny a přesčasy';
                            case 'rideshare': return 'Spolujízdy a cesty';
                            case 'system': return 'Systémová oznámení';
                            case 'admin': return 'Správa a upozornění';
                            default: return 'Všechna oznámení';
                          }
                        })()}
                      </span>
                      {(() => {
                        const currentFilter = filterButtons[currentFilterIndex]?.key;
                        const count = currentFilter === 'all' 
                          ? notifications.length 
                          : notifications.filter(n => {
                              const type = n.type.toLowerCase();
                              switch (currentFilter) {
                                case 'shift': return type.includes('shift') || type.includes('overtime');
                                case 'rideshare': return type.includes('rideshare') || type.includes('travel');
                                case 'system': return type.includes('system') || type.includes('maintenance') || type.includes('update');
                                case 'admin': return type.includes('admin') || type.includes('warning') || type.includes('critical');
                                default: return false;
                              }
                            }).length;
                        
                        return count > 0 ? (
                          <Badge variant="secondary" className="ml-2 text-xs font-medium">
                            {count}
                          </Badge>
                        ) : null;
                      })()}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNextFilter}
                    className="h-10 w-10 flex-shrink-0 z-10 bg-background border-2 shadow-sm"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>

                {/* Progress Dots with Swipe Hint */}
                <div className="flex flex-col items-center gap-3 mt-4">
                  <div className="flex justify-center gap-2">
                    {filterButtons.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentFilterIndex(index);
                          setSelectedFilter(filterButtons[index].key);
                        }}
                        className={cn(
                          "h-2.5 w-2.5 rounded-full transition-all duration-200",
                          index === currentFilterIndex 
                            ? "bg-primary scale-125" 
                            : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                        )}
                      />
                    ))}
                  </div>
                  
                  {/* Swipe Hint Text */}
                  <p className="text-xs text-muted-foreground text-center opacity-70">
                    Potáhněte pro přepnutí kategorií
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 mb-6">
                {filterButtons.map(({ key, icon }) => {
                  const count = key === 'all' 
                    ? notifications.length 
                    : notifications.filter(n => {
                        const type = n.type.toLowerCase();
                        const category = n.category?.toLowerCase() || '';
                        switch (key) {
                          case 'shift': 
                            return (
                              type.includes('shift') || 
                              type.includes('overtime') ||
                              category.includes('shift') ||
                              n.related_to?.type === 'shift'
                            );
                          case 'rideshare': 
                            return (
                              type.includes('rideshare') || 
                              type.includes('travel') ||
                              category.includes('rideshare')
                            );
                          case 'system': 
                            return (
                              type.includes('system') || 
                              type.includes('maintenance') || 
                              type.includes('update') ||
                              category.includes('system')
                            );
                          case 'admin': 
                            return (
                              type.includes('admin') || 
                              type.includes('warning') || 
                              type.includes('critical') ||
                              category.includes('admin')
                            );
                          default: return false;
                        }
                      }).length;

                  const labelText = (() => {
                    switch (key) {
                      case 'all': return 'Všechna oznámení';
                      case 'shift': return 'Směny a přesčasy';
                      case 'rideshare': return 'Spolujízdy a cesty';
                      case 'system': return 'Systémová oznámení';
                      case 'admin': return 'Správa a upozornění';
                      default: return 'Všechna oznámení';
                    }
                  })();

                  return (
                    <Button
                      key={key}
                      variant={selectedFilter === key ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleFilterSelect(key)}
                      className="flex items-center gap-2"
                    >
                      {icon}
                      {labelText}
                      {count > 0 && (
                        <Badge 
                          variant={selectedFilter === key ? "secondary" : "default"} 
                          className="ml-1"
                        >
                          {count}
                        </Badge>
                      )}
                    </Button>
                  );
                })}
              </div>
            )}
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
                <h3 className="text-lg font-semibold mb-2">Žádná oznámení</h3>
                <p className="text-muted-foreground mb-4">
                  {selectedFilter === 'all' 
                    ? 'Nemáte žádná nová oznámení.'
                    : `Žádná oznámení v kategorii "${(() => {
                        switch (selectedFilter) {
                          case 'shift': return 'Směny a přesčasy';
                          case 'rideshare': return 'Spolujízdy a cesty';
                          case 'system': return 'Systémová oznámení';
                          case 'admin': return 'Správa a upozornění';
                          default: return 'Všechna oznámení';
                        }
                      })()}"`
                  }
                </p>
                {selectedFilter !== 'all' && (
                  <Button
                    variant="outline"
                    onClick={() => handleFilterSelect('all')}
                  >
                    Všechna oznámení
                  </Button>
                )}
              </div>
            ) : (
              <ScrollArea className="h-[calc(100vh-24rem)]">
                <div className="space-y-3 pr-4">
                  {filteredNotifications.map((notification) => {
                    // Use specialized component for shift notifications
                    if (notification.related_to?.type === 'shift' || notification.type === 'shift_reminder') {
                      return (
                        <ShiftNotificationItem
                          key={notification.id}
                          notification={notification}
                          onMarkAsRead={markAsRead}
                          onDelete={deleteNotification}
                        />
                      );
                    }
                    
                    // Use general component for other notifications
                    return (
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
                    );
                  })}
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