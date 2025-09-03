import React, { useState } from 'react';
import { Bell, Filter, MoreVertical, RefreshCw, Trash2, Check, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEnhancedNotifications } from '@/hooks/useEnhancedNotifications';
import { useResponsive } from '@/hooks/useResponsive';
import { NotificationItem } from './NotificationItem';
import { NotificationFilters } from './NotificationFilters';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export const UnifiedNotificationCenter: React.FC = () => {
  const { isMobile } = useResponsive();
  const { t } = useTranslation(['notifications']);
  const [isOpen, setIsOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    loadMoreNotifications,
    filterByCategory,
    handleNotificationClick,
    refreshNotifications,
    hasMore,
    filteredNotifications,
    selectedCategory
  } = useEnhancedNotifications();

  // Mobile panel component
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
          onClick={() => setIsOpen(true)}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>

        {/* Mobile slide-out panel */}
        {isOpen && (
          <div className="fixed inset-0 z-50 bg-background">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  <h2 className="text-lg font-semibold">
                    {t('notifications:status.notifications')}
                  </h2>
                  {unreadCount > 0 && (
                    <Badge variant="secondary">{unreadCount}</Badge>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsOpen(false)}
                >
                  ✕
                </Button>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshNotifications}
                    disabled={loading}
                  >
                    <RefreshCw className={cn("h-4 w-4 mr-1", loading && "animate-spin")} />
                    {t('notifications:actions.refresh')}
                  </Button>
                  {unreadCount > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={markAllAsRead}
                    >
                      <CheckCheck className="h-4 w-4 mr-1" />
                      {t('notifications:actions.markAllAsRead')}
                    </Button>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={deleteAllNotifications}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t('notifications:actions.deleteAll')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Filters */}
              <div className="p-4 border-b">
                <NotificationFilters
                  selectedCategory={selectedCategory}
                  onCategoryChange={filterByCategory}
                />
              </div>

              {/* Content */}
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-2">
                  {loading && filteredNotifications.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      {t('notifications:status.loading')}
                    </div>
                  ) : filteredNotifications.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>{t('notifications:status.empty')}</p>
                      <p className="text-sm">{t('notifications:status.emptyDescription')}</p>
                    </div>
                  ) : (
                    <>
                  {filteredNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={markAsRead}
                      onDelete={deleteNotification}
                      onClick={() => {
                        handleNotificationClick(notification);
                        setIsOpen(false);
                      }}
                      isMobile={true}
                    />
                  ))}
                      {hasMore && (
                        <Button
                          variant="outline"
                          className="w-full mt-4"
                          onClick={loadMoreNotifications}
                          disabled={loading}
                        >
                          {loading ? t('notifications:status.loading') : 'Načíst další'}
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}
      </>
    );
  }

  // Desktop popover component
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="relative"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0" 
        align="end"
        side="bottom"
        sideOffset={8}
      >
        <div className="flex flex-col max-h-96">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <h3 className="font-semibold">Oznámení</h3>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshNotifications}
                disabled={loading}
              >
                <RefreshCw className={cn("h-3 w-3", loading && "animate-spin")} />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {unreadCount > 0 && (
                    <DropdownMenuItem onClick={markAllAsRead}>
                      <CheckCheck className="h-4 w-4 mr-2" />
                      {t('notifications:actions.markAllAsRead')}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={deleteAllNotifications}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t('notifications:actions.deleteAll')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Filters */}
          <div className="p-3 border-b">
            <NotificationFilters
              selectedCategory={selectedCategory}
              onCategoryChange={filterByCategory}
              compact
            />
          </div>

          {/* Content */}
          <ScrollArea className="max-h-80">
            <div className="p-2">
              {loading && filteredNotifications.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  {t('notifications:status.loading')}
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <Bell className="h-6 w-6 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">{t('notifications:status.empty')}</p>
                  <p className="text-xs">{t('notifications:status.emptyDescription')}</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredNotifications.slice(0, 10).map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={markAsRead}
                      onDelete={deleteNotification}
                      onClick={() => {
                        handleNotificationClick(notification);
                        setIsOpen(false);
                      }}
                      compact
                    />
                  ))}
                  {filteredNotifications.length > 10 && (
                    <div className="text-center pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsOpen(false)}
                        className="text-xs"
                      >
                        Zobrazit všechna oznámení
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
};