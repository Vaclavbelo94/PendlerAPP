
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useOfflineStatus } from './useOfflineStatus';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import {
  saveData,
  getAllData,
  getItemById,
  deleteItemById,
  STORES,
  addToSyncQueue
} from '@/utils/offlineStorage';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  date: string; // ISO string
  read: boolean;
  user_id?: string;
  relatedTo?: {
    type: string;
    id: string;
  };
}

// Kontrola, zda je aplikace v nativním prostředí
const isNativeApp = () => {
  // Detekce různých nativních prostředí
  return (
    window.navigator.userAgent.includes('PendlerApp') ||     // Vlastní User-Agent pro aplikaci
    document.URL.indexOf('http://') === -1 &&               // Kontrola lokálního souboru (file://)
    document.URL.indexOf('https://') === -1 ||              // Kontrola lokálního souboru
    window.matchMedia('(display-mode: standalone)').matches  // PWA v standalone módu
  );
};

export const useOfflineNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isOffline } = useOfflineStatus();
  const { user } = useAuth();
  const [nativeMode, setNativeMode] = useState(false);

  // Detekce nativního prostředí
  useEffect(() => {
    setNativeMode(isNativeApp());
  }, []);

  // Load notifications based on online/offline status
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        if (isOffline || nativeMode) {
          // Load from IndexedDB when offline or in native app
          const offlineNotifications = await getAllData<Notification>(STORES.notifications);
          setNotifications(offlineNotifications);
          const count = offlineNotifications.filter(n => !n.read).length;
          setUnreadCount(count);
        } else {
          if (user) {
            // Pro online režim s přihlášeným uživatelem použijeme localStorage
            // Poznámka: V této verzi nepodporujeme ukládání notifikací do Supabase
            const storedNotifications = JSON.parse(localStorage.getItem(`notifications_${user.id}`) || '[]');
            setNotifications(storedNotifications);
            const count = storedNotifications.filter((n: Notification) => !n.read).length;
            setUnreadCount(count);
          } else {
            // Load from localStorage when online but not authenticated
            const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
            setNotifications(storedNotifications);
            const count = storedNotifications.filter((n: Notification) => !n.read).length;
            setUnreadCount(count);
          }
        }
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    };

    loadNotifications();
    
    // Add event listener for storage changes when online
    if (!isOffline) {
      window.addEventListener('storage', (e) => {
        if (e.key === 'notifications' || e.key === `notifications_${user?.id}`) {
          loadNotifications();
        }
      });
    }
    
    return () => {
      if (!isOffline) {
        window.removeEventListener('storage', () => {});
      }
    };
  }, [isOffline, user, nativeMode]);

  // Save notifications based on online/offline status
  const saveNotifications = async (updatedNotifications: Notification[]) => {
    try {
      if (isOffline || nativeMode) {
        // Save to IndexedDB when offline or in native app
        for (const notification of updatedNotifications) {
          await saveData(STORES.notifications, notification);
        }
      } else if (user) {
        // Ukládání do localStorage s ID uživatele
        localStorage.setItem(`notifications_${user.id}`, JSON.stringify(updatedNotifications));
      } else {
        // Save to localStorage when online but not authenticated
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      }
      
      setNotifications(updatedNotifications);
      const count = updatedNotifications.filter(n => !n.read).length;
      setUnreadCount(count);
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  };

  // Add a new notification
  const addNotification = async (notification: Omit<Notification, 'id' | 'date' | 'read' | 'user_id'>) => {
    const newNotification: Notification = {
      id: user ? `temp-${Math.random().toString(36).substring(2, 11)}` : `local-${Math.random().toString(36).substring(2, 11)}`,
      date: new Date().toISOString(),
      read: false,
      user_id: user?.id,
      ...notification
    };

    try {
      const updatedNotifications = [newNotification, ...notifications];
      await saveNotifications(updatedNotifications);
      
      // Pokud jsme offline/v nativním módu a máme uživatele, přidáme do fronty k synchronizaci
      if ((isOffline || nativeMode) && user) {
        await addToSyncQueue('notifications', newNotification.id, 'INSERT', {
          title: newNotification.title,
          message: newNotification.message,
          type: newNotification.type,
        });
      }
      
      // Pokud jsme v nativní aplikaci, použijeme nativní notifikace (pokud jsou povoleny)
      if (nativeMode && 'Notification' in window && Notification.permission === 'granted') {
        try {
          navigator.serviceWorker?.ready.then(registration => {
            registration.showNotification(notification.title, {
              body: notification.message,
              icon: '/favicon.ico'
            });
          });
        } catch (error) {
          console.error('Native notification error:', error);
        }
      } else {
        // Standard toast for web
        toast(notification.title, {
          description: notification.message,
        });
      }
      
      return newNotification;
    } catch (error) {
      console.error('Error adding notification:', error);
      throw error;
    }
  };

  // Mark a notification as read
  const markAsRead = async (id: string) => {
    try {
      const updatedNotifications = notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      );
      await saveNotifications(updatedNotifications);
      
      // Pokud jsme offline/v nativním módu a máme uživatele, přidáme do fronty k synchronizaci
      if ((isOffline || nativeMode) && user) {
        await addToSyncQueue('notifications', id, 'UPDATE', { read: true });
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        read: true
      }));
      await saveNotifications(updatedNotifications);
      
      // Pokud jsme offline/v nativním módu a máme uživatele, přidáme do fronty k synchronizaci
      if ((isOffline || nativeMode) && user) {
        for (const notification of notifications) {
          if (!notification.read) {
            await addToSyncQueue('notifications', notification.id, 'UPDATE', { read: true });
          }
        }
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  };

  // Delete a notification
  const deleteNotification = async (id: string) => {
    try {
      const updatedNotifications = notifications.filter(notification => notification.id !== id);
      
      if (isOffline || nativeMode) {
        await deleteItemById(STORES.notifications, id);
        
        // Pokud jsme offline/v nativním módu a máme uživatele, přidáme do fronty k synchronizaci
        if (user) {
          await addToSyncQueue('notifications', id, 'DELETE', null);
        }
      }
      
      await saveNotifications(updatedNotifications);
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  };

  // Clear all notifications
  const clearNotifications = async () => {
    try {
      await saveNotifications([]);
    } catch (error) {
      console.error('Error clearing notifications:', error);
      throw error;
    }
  };

  // Požádat o povolení notifikací (pro budoucí použití v nativní aplikaci)
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearNotifications,
    requestNotificationPermission,
    isNativeMode: nativeMode
  };
};
