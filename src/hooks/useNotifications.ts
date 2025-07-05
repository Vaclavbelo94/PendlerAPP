
import { useState, useEffect } from 'react';

interface NotificationPreferences {
  shift_reminders: boolean;
  email_notifications: boolean;
  sms_notifications?: boolean;
  push_notifications?: boolean;
  immediate_notifications?: boolean;
  sms_reminder_advance?: number;
  weekly_summaries: boolean;
  system_updates: boolean;
  reminder_time: string;
  device_token?: string;
}

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
}

export const useNotifications = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load preferences from localStorage or API
    const loadPreferences = () => {
      const saved = localStorage.getItem('notification_preferences');
      if (saved) {
        setPreferences(JSON.parse(saved));
      } else {
        setPreferences({
          shift_reminders: true,
          email_notifications: true,
          sms_notifications: false,
          push_notifications: true,
          immediate_notifications: true,
          sms_reminder_advance: 30,
          weekly_summaries: false,
          system_updates: true,
          reminder_time: '08:00:00'
        });
      }
      setLoading(false);
    };

    // Load notifications from localStorage
    const loadNotifications = () => {
      const saved = localStorage.getItem('notifications');
      if (saved) {
        setNotifications(JSON.parse(saved));
      }
    };

    loadPreferences();
    loadNotifications();
  }, []);

  const updatePreferences = async (newPreferences: NotificationPreferences) => {
    setPreferences(newPreferences);
    localStorage.setItem('notification_preferences', JSON.stringify(newPreferences));
    // In real app, this would save to backend
  };

  const saveNotifications = (updatedNotifications: Notification[]) => {
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'created_at' | 'read'>) => {
    const newNotification: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      created_at: new Date().toISOString(),
      read: false,
      ...notification
    };

    const updatedNotifications = [newNotification, ...notifications];
    saveNotifications(updatedNotifications);
  };

  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    saveNotifications(updatedNotifications);
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    saveNotifications(updatedNotifications);
  };

  const deleteNotification = (id: string) => {
    const updatedNotifications = notifications.filter(notification => notification.id !== id);
    saveNotifications(updatedNotifications);
  };

  const clearNotifications = () => {
    saveNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    preferences,
    updatePreferences,
    loading,
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearNotifications
  };
};
