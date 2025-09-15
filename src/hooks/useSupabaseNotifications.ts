import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export interface SupabaseNotification {
  id: string;
  title: string;
  message: string;
  type: string; // Changed to string to match DB type
  category?: string; // Added category field
  created_at: string;
  read: boolean;
  user_id: string;
  language?: string;
  metadata?: any;
  updated_at?: string;
  related_to?: any; // Changed to any to match DB JSON type
}

export const useSupabaseNotifications = () => {
  const { user } = useAuth();
  const { t } = useTranslation('toast');
  const [notifications, setNotifications] = useState<SupabaseNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load notifications from Supabase
  const loadNotifications = async () => {
    if (!user?.id) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: queryError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (queryError) {
        console.error('Error loading notifications:', queryError);
        setError('Failed to load notifications');
        return;
      }

      setNotifications(data || []);
    } catch (err) {
      console.error('Error in loadNotifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  // Create notification
  const addNotification = async (notification: Omit<SupabaseNotification, 'id' | 'created_at' | 'read' | 'user_id'>) => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          ...notification,
          user_id: user.id,
          read: false
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating notification:', error);
        return;
      }

      setNotifications(prev => [data, ...prev]);
    } catch (err) {
      console.error('Error in addNotification:', err);
    }
  };

  // Mark as read
  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error marking notification as read:', error);
        return;
      }

      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (err) {
      console.error('Error in markAsRead:', err);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) {
        console.error('Error marking all notifications as read:', error);
        return;
      }

      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );

      toast.success(t('success.allNotificationsRead'));
    } catch (err) {
      console.error('Error in markAllAsRead:', err);
    }
  };

  // Delete notification
  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error deleting notification:', error);
        return;
      }

      setNotifications(prev => prev.filter(notification => notification.id !== id));
    } catch (err) {
      console.error('Error in deleteNotification:', err);
    }
  };

  // Clear all notifications
  const clearNotifications = async () => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing notifications:', error);
        return;
      }

      setNotifications([]);
      toast.success(t('success.allNotificationsDeleted'));
    } catch (err) {
      console.error('Error in clearNotifications:', err);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [user?.id]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user?.id) return;

    const subscription = supabase
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
      subscription.unsubscribe();
    };
  }, [user?.id]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    loading,
    error,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearNotifications,
    refresh: loadNotifications
  };
};