
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  date: string; // ISO string
  read: boolean;
  relatedTo?: {
    type: string;
    id: string;
  };
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load notifications from localStorage
  useEffect(() => {
    const loadNotifications = () => {
      try {
        const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        setNotifications(storedNotifications);
        
        // Count unread notifications
        const count = storedNotifications.filter((n: Notification) => !n.read).length;
        setUnreadCount(count);
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    };

    loadNotifications();
    
    // Add event listener for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'notifications') {
        loadNotifications();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Save notifications to localStorage
  const saveNotifications = (updatedNotifications: Notification[]) => {
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    setNotifications(updatedNotifications);
    
    // Update unread count
    const count = updatedNotifications.filter(n => !n.read).length;
    setUnreadCount(count);
  };

  // Add a new notification
  const addNotification = (notification: Omit<Notification, 'id' | 'date' | 'read'>) => {
    const newNotification: Notification = {
      id: Math.random().toString(36).substring(2, 11),
      date: new Date().toISOString(),
      read: false,
      ...notification
    };

    const updatedNotifications = [newNotification, ...notifications];
    saveNotifications(updatedNotifications);
    
    // Show toast for real-time feedback
    toast(notification.title, {
      description: notification.message,
    });
    
    return newNotification;
  };

  // Mark a notification as read
  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    saveNotifications(updatedNotifications);
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    saveNotifications(updatedNotifications);
  };

  // Delete a notification
  const deleteNotification = (id: string) => {
    const updatedNotifications = notifications.filter(notification => notification.id !== id);
    saveNotifications(updatedNotifications);
  };

  // Clear all notifications
  const clearNotifications = () => {
    saveNotifications([]);
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
