import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';
import { EnhancedNotification, NotificationCategory, NotificationType, NotificationPriority } from '@/services/NotificationService';
import { useNavigate } from 'react-router-dom';

interface UseEnhancedNotificationsResult {
  notifications: EnhancedNotification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  deleteAllNotifications: () => Promise<void>;
  loadMoreNotifications: () => Promise<void>;
  filterByCategory: (category: NotificationCategory | 'all') => void;
  handleNotificationClick: (notification: EnhancedNotification) => void;
  refreshNotifications: () => Promise<void>;
  hasMore: boolean;
  filteredNotifications: EnhancedNotification[];
  selectedCategory: NotificationCategory | 'all';
}

const NOTIFICATIONS_PER_PAGE = 20;

export const useEnhancedNotifications = (): UseEnhancedNotificationsResult => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<EnhancedNotification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<EnhancedNotification[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory | 'all'>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Load notifications from Supabase
  const loadNotifications = useCallback(async (isLoadMore = false) => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const currentOffset = isLoadMore ? offset : 0;
      
      const { data, error: fetchError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(currentOffset, currentOffset + NOTIFICATIONS_PER_PAGE - 1);

      if (fetchError) {
        console.error('Error loading notifications:', fetchError);
        setError('Nepodařilo se načíst oznámení');
        return;
      }

      const newNotifications = (data || []) as EnhancedNotification[];
      
      if (isLoadMore) {
        setNotifications(prev => {
          const existing = new Set(prev.map(n => n.id));
          const filtered = newNotifications.filter(n => !existing.has(n.id));
          return [...prev, ...filtered];
        });
        setOffset(currentOffset + NOTIFICATIONS_PER_PAGE);
      } else {
        setNotifications(newNotifications);
        setOffset(NOTIFICATIONS_PER_PAGE);
      }

      setHasMore(newNotifications.length === NOTIFICATIONS_PER_PAGE);
    } catch (err) {
      console.error('Error loading notifications:', err);
      setError('Nepodařilo se načíst oznámení');
    } finally {
      setLoading(false);
    }
  }, [user?.id, offset]);

  // Load more notifications
  const loadMoreNotifications = useCallback(async () => {
    if (!hasMore || loading) return;
    await loadNotifications(true);
  }, [hasMore, loading, loadNotifications]);

  // Refresh notifications
  const refreshNotifications = useCallback(async () => {
    setOffset(0);
    await loadNotifications(false);
  }, [loadNotifications]);

  // Mark notification as read
  const markAsRead = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error marking notification as read:', error);
        return;
      }

      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, [user?.id]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) {
        console.error('Error marking all notifications as read:', error);
        return;
      }

      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, [user?.id]);

  // Delete single notification
  const deleteNotification = useCallback(async (id: string) => {
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

      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, [user?.id]);

  // Delete all notifications
  const deleteAllNotifications = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting all notifications:', error);
        return;
      }

      setNotifications([]);
    } catch (error) {
      console.error('Error deleting all notifications:', error);
    }
  }, [user?.id]);

  // Filter notifications by category
  const filterByCategory = useCallback((category: NotificationCategory | 'all') => {
    setSelectedCategory(category);
    if (category === 'all') {
      setFilteredNotifications(notifications);
    } else {
      setFilteredNotifications(notifications.filter(n => n.category === category));
    }
  }, [notifications]);

  // Handle notification click - mark as read and navigate
  const handleNotificationClick = useCallback(async (notification: EnhancedNotification) => {
    // Mark as read if not already read
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    // Navigate based on action_url or category
    if (notification.action_url) {
      navigate(notification.action_url);
    } else {
      // Default navigation based on category
      switch (notification.category) {
        case 'shift':
          navigate('/shifts');
          break;
        case 'rideshare':
          navigate('/rideshare');
          break;
        case 'system':
          navigate('/profile');
          break;
        case 'admin':
          navigate('/profile');
          break;
        default:
          // No navigation for unknown categories
          break;
      }
    }
  }, [markAsRead, navigate]);

  // Setup real-time subscription
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newNotification = {
            ...payload.new,
            type: payload.new.type as NotificationType,
            category: payload.new.category as NotificationCategory,
            priority: payload.new.priority as NotificationPriority
          } as EnhancedNotification;
          setNotifications(prev => [newNotification, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const updatedNotification = {
            ...payload.new,
            type: payload.new.type as NotificationType,
            category: payload.new.category as NotificationCategory,
            priority: payload.new.priority as NotificationPriority
          } as EnhancedNotification;
          setNotifications(prev => 
            prev.map(n => n.id === updatedNotification.id ? updatedNotification : n)
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const deletedNotification = payload.old as EnhancedNotification;
          setNotifications(prev => prev.filter(n => n.id !== deletedNotification.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  // Load initial notifications
  useEffect(() => {
    if (user?.id) {
      loadNotifications(false);
    }
  }, [user?.id, loadNotifications]);

  // Update filtered notifications when notifications or category changes
  useEffect(() => {
    filterByCategory(selectedCategory);
  }, [notifications, selectedCategory, filterByCategory]);

  return {
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
  };
};