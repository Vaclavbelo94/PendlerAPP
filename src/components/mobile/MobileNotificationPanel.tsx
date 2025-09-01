import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Trash2, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSupabaseNotifications } from '@/hooks/useSupabaseNotifications';
import { MobileNotificationItem } from './MobileNotificationItem';
import { useTranslation } from 'react-i18next';

interface MobileNotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNotificationPanel: React.FC<MobileNotificationPanelProps> = ({
  isOpen,
  onClose
}) => {
  const { t } = useTranslation('common');
  const { 
    notifications, 
    loading, 
    markAllAsRead, 
    clearNotifications,
    unreadCount 
  } = useSupabaseNotifications();

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleClearAll = async () => {
    await clearNotifications();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-background border-l shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <h2 className="font-semibold text-lg">
                  {t('notifications') || 'Oznámení'}
                  {unreadCount > 0 && (
                    <span className="ml-2 px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </h2>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Actions */}
            {notifications.length > 0 && (
              <div className="flex gap-2 p-4 border-b">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  disabled={unreadCount === 0}
                  className="flex-1"
                >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  {t('markAllRead') || 'Označit vše'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('clearAll') || 'Smazat vše'}
                </Button>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="font-medium text-muted-foreground">
                    {t('noNotifications') || 'Žádná oznámení'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('noNotificationsDesc') || 'Zde se zobrazí vaše oznámení'}
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-full">
                  <div className="p-4 space-y-3">
                    {notifications.map((notification) => (
                      <MobileNotificationItem
                        key={notification.id}
                        notification={notification}
                        onClose={onClose}
                      />
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};