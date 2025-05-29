
import { useState, useEffect } from 'react';

interface NotificationPreferences {
  shift_reminders: boolean;
  email_notifications: boolean;
  weekly_summaries: boolean;
  system_updates: boolean;
  reminder_time: string;
}

export const useNotifications = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
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
          weekly_summaries: false,
          system_updates: true,
          reminder_time: '08:00:00'
        });
      }
      setLoading(false);
    };

    loadPreferences();
  }, []);

  const updatePreferences = async (newPreferences: NotificationPreferences) => {
    setPreferences(newPreferences);
    localStorage.setItem('notification_preferences', JSON.stringify(newPreferences));
    // In real app, this would save to backend
  };

  return {
    preferences,
    updatePreferences,
    loading
  };
};
