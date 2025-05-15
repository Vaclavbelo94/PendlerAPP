
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

export const useOfflineNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isOffline } = useOfflineStatus();
  const { user } = useAuth();

  // Load notifications based on online/offline status
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        if (isOffline) {
          // Load from IndexedDB when offline
          const offlineNotifications = await getAllData<Notification>(STORES.notifications);
          setNotifications(offlineNotifications);
          const count = offlineNotifications.filter(n => !n.read).length;
          setUnreadCount(count);
        } else {
          if (user) {
            // Load from Supabase
            const { data, error } = await supabase
              .from('notifications')
              .select('*')
              .eq('user_id', user.id)
              .order('created_at', { ascending: false });
              
            if (error) throw error;
            
            if (data) {
              setNotifications(data);
              const count = data.filter((n: Notification) => !n.read).length;
              setUnreadCount(count);
            }
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
        if (e.key === 'notifications') {
          loadNotifications();
        }
      });
    }
    
    return () => {
      if (!isOffline) {
        window.removeEventListener('storage', () => {});
      }
    };
  }, [isOffline, user]);

  // Save notifications based on online/offline status
  const saveNotifications = async (updatedNotifications: Notification[]) => {
    try {
      if (isOffline) {
        // Save to IndexedDB when offline
        for (const notification of updatedNotifications) {
          await saveData(STORES.notifications, notification);
        }
      } else if (user) {
        // Save to Supabase when online and authenticated
        for (const notification of updatedNotifications.filter(n => !n.id.includes('local-'))) {
          if (notification.id.startsWith('temp-')) {
            // Nová notifikace
            const { data, error } = await supabase
              .from('notifications')
              .insert({
                title: notification.title,
                message: notification.message,
                type: notification.type,
                read: notification.read,
                user_id: user.id,
                related_to: notification.relatedTo
              })
              .select();
            
            if (error) throw error;
          } else {
            // Aktualizace existující notifikace
            const { error } = await supabase
              .from('notifications')
              .update({ read: notification.read })
              .eq('id', notification.id);
            
            if (error) throw error;
          }
        }
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
      
      // Pokud jsme offline a máme uživatele, přidáme do fronty k synchronizaci
      if (isOffline && user) {
        await addToSyncQueue('notifications', newNotification.id, 'INSERT', {
          title: newNotification.title,
          message: newNotification.message,
          type: newNotification.type,
          user_id: user.id,
          related_to: newNotification.relatedTo
        });
      }
      
      // Show toast for real-time feedback
      toast(notification.title, {
        description: notification.message,
      });
      
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
      
      // Pokud jsme offline a máme uživatele, přidáme do fronty k synchronizaci
      if (isOffline && user) {
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
      
      // Pokud jsme offline a máme uživatele, přidáme do fronty k synchronizaci pro každou notifikaci
      if (isOffline && user) {
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
      
      if (isOffline) {
        await deleteItemById(STORES.notifications, id);
        
        // Pokud jsme offline a máme uživatele, přidáme do fronty k synchronizaci
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

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearNotifications
  };
};
