
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  created_at: string;
  read: boolean;
  related_to?: {
    type: string;
    id: string;
  };
  metadata?: any;
}

export interface NotificationPreferences {
  email_notifications: boolean;
  push_notifications: boolean;
  shift_reminders: boolean;
  weekly_summaries: boolean;
  system_updates: boolean;
  reminder_time: string;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load notifications from database
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    loadNotifications();
    loadPreferences();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('notifications_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          loadNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      setNotifications(data || []);
      const unread = (data || []).filter(n => !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error loading notifications:', error);
      // Fallback to localStorage
      loadNotificationsFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setPreferences(data);
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const loadNotificationsFromLocalStorage = () => {
    try {
      const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      setNotifications(storedNotifications);
      const count = storedNotifications.filter((n: Notification) => !n.read).length;
      setUnreadCount(count);
    } catch (error) {
      console.error('Error loading notifications from localStorage:', error);
    }
  };

  const addNotification = async (notification: Omit<Notification, 'id' | 'created_at' | 'read'>) => {
    if (!user) {
      // Fallback to localStorage for non-authenticated users
      addNotificationToLocalStorage(notification);
      return;
    }

    try {
      const response = await supabase.functions.invoke('manage-notifications', {
        body: {
          action: 'create',
          title: notification.title,
          message: notification.message,
          type: notification.type,
          relatedTo: notification.related_to
        }
      });

      if (response.error) throw response.error;

      toast(notification.title, {
        description: notification.message,
      });

      // Notifications will be updated via real-time subscription
      return response.data.notification;
    } catch (error) {
      console.error('Error adding notification:', error);
      // Fallback to localStorage
      addNotificationToLocalStorage(notification);
    }
  };

  const addNotificationToLocalStorage = (notification: Omit<Notification, 'id' | 'created_at' | 'read'>) => {
    const newNotification: Notification = {
      id: Math.random().toString(36).substring(2, 11),
      created_at: new Date().toISOString(),
      read: false,
      ...notification
    };

    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    setUnreadCount(prev => prev + 1);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    
    toast(notification.title, {
      description: notification.message,
    });
  };

  const markAsRead = async (id: string) => {
    if (!user) {
      // Fallback to localStorage
      const updatedNotifications = notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      );
      setNotifications(updatedNotifications);
      setUnreadCount(prev => Math.max(0, prev - 1));
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      return;
    }

    try {
      const response = await supabase.functions.invoke('manage-notifications', {
        body: {
          action: 'markRead',
          notificationId: id
        }
      });

      if (response.error) throw response.error;
      
      // Update local state immediately for better UX
      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) {
      // Fallback to localStorage
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        read: true
      }));
      setNotifications(updatedNotifications);
      setUnreadCount(0);
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      return;
    }

    try {
      const response = await supabase.functions.invoke('manage-notifications', {
        body: { action: 'markAllRead' }
      });

      if (response.error) throw response.error;
      
      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    if (!user) {
      // Fallback to localStorage
      const updatedNotifications = notifications.filter(notification => notification.id !== id);
      setNotifications(updatedNotifications);
      const count = updatedNotifications.filter(n => !n.read).length;
      setUnreadCount(count);
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      return;
    }

    try {
      const response = await supabase.functions.invoke('manage-notifications', {
        body: {
          action: 'delete',
          notificationId: id
        }
      });

      if (response.error) throw response.error;
      
      // Update local state
      setNotifications(prev => prev.filter(n => n.id !== id));
      setUnreadCount(prev => {
        const deletedNotification = notifications.find(n => n.id === id);
        return deletedNotification && !deletedNotification.read ? Math.max(0, prev - 1) : prev;
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const updatePreferences = async (newPreferences: Partial<NotificationPreferences>) => {
    if (!user) return;

    try {
      const response = await supabase.functions.invoke('manage-notifications', {
        body: {
          action: 'updatePreferences',
          preferences: newPreferences
        }
      });

      if (response.error) throw response.error;
      
      setPreferences(response.data.preferences);
      toast.success('Nastavení notifikací bylo uloženo');
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Nepodařilo se uložit nastavení');
    }
  };

  const clearNotifications = async () => {
    if (!user) {
      // Fallback to localStorage
      setNotifications([]);
      setUnreadCount(0);
      localStorage.removeItem('notifications');
      return;
    }

    // For database, we'll delete all notifications
    try {
      for (const notification of notifications) {
        await deleteNotification(notification.id);
      }
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  return {
    notifications,
    preferences,
    unreadCount,
    loading,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updatePreferences,
    clearNotifications,
    refreshNotifications: loadNotifications,
    refreshPreferences: loadPreferences
  };
};
