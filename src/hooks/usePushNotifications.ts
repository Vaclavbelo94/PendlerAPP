import { useState, useEffect } from 'react';

type NotificationPermission = 'default' | 'granted' | 'denied';

interface PushNotificationState {
  permission: NotificationPermission;
  isSupported: boolean;
  requestPermission: () => Promise<void>;
  showNotification: (title: string, options?: NotificationOptions) => Promise<void>;
  unregister: () => Promise<void>;
}

/**
 * Hook for managing push notifications
 */
export const usePushNotifications = (): PushNotificationState => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  
  const isSupported = 'Notification' in window && 'serviceWorker' in navigator;

  useEffect(() => {
    if (isSupported) {
      setPermission(Notification.permission);
    }
  }, [isSupported]);

  const requestPermission = async () => {
    if (!isSupported) {
      console.warn('Notifications are not supported');
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        // Register for push notifications
        const registration = await navigator.serviceWorker.ready;
        
        // Subscribe to push notifications
        const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
        const subscribeOptions: any = {
          userVisibleOnly: true,
          ...(vapidKey && { applicationServerKey: urlBase64ToUint8Array(vapidKey) })
        };
        
        const subscription = await registration.pushManager.subscribe(subscribeOptions);

        // Send subscription to server (implement your endpoint)
        console.log('Push subscription:', subscription);
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const showNotification = async (title: string, options?: NotificationOptions) => {
    if (!isSupported || permission !== 'granted') {
      console.warn('Cannot show notification: permission not granted');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(title, {
        badge: '/icon-badge.png',
        icon: '/icon-192.png',
        ...options
      });
      
      // Trigger vibration separately
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  };

  const unregister = async () => {
    if (!isSupported) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        console.log('Unsubscribed from push notifications');
      }
    } catch (error) {
      console.error('Error unsubscribing:', error);
    }
  };

  return {
    permission,
    isSupported,
    requestPermission,
    showNotification,
    unregister
  };
};

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
