
import { useState, useEffect } from 'react';

export const useNotificationPermission = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('Notification' in window);
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!isSupported) {
      return 'denied';
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  };

  const showNotification = (title: string, options?: NotificationOptions) => {
    if (permission === 'granted' && isSupported) {
      try {
        const notification = new Notification(title, {
          icon: '/lovable-uploads/88ef4e0f-4d33-458c-98f4-7b644e5b8588.png',
          badge: '/lovable-uploads/88ef4e0f-4d33-458c-98f4-7b644e5b8588.png',
          ...options
        });

        // Auto close after 5 seconds
        setTimeout(() => {
          notification.close();
        }, 5000);

        return notification;
      } catch (error) {
        console.error('Error showing notification:', error);
      }
    }
    return null;
  };

  return {
    permission,
    isSupported,
    requestPermission,
    showNotification
  };
};
