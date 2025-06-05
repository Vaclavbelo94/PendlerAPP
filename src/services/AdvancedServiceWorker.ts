
class AdvancedServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private isRegistering = false;

  async initialize(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Workers not supported');
      return;
    }

    if (this.isRegistering) return;
    this.isRegistering = true;

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });

      // Listen for updates
      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration?.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available
              this.notifyUpdate();
            }
          });
        }
      });

      // Register for background sync
      if ('sync' in window.ServiceWorkerRegistration.prototype) {
        await this.registerBackgroundSync();
      }

      console.log('Service Worker registered successfully');
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    } finally {
      this.isRegistering = false;
    }
  }

  private async registerBackgroundSync(): Promise<void> {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      if ('sync' in registration) {
        // Register different sync tags for different data types
        await registration.sync.register('sync-pendler-data');
        await registration.sync.register('sync-shifts');
        await registration.sync.register('sync-vehicles');
        await registration.sync.register('sync-calculations');
        
        console.log('Background sync registered');
      }
    } catch (error) {
      console.error('Background sync registration failed:', error);
    }
  }

  async triggerBackgroundSync(tag: string = 'sync-pendler-data'): Promise<void> {
    try {
      if (!this.registration) {
        await this.initialize();
      }

      const registration = await navigator.serviceWorker.ready;
      if ('sync' in registration) {
        await registration.sync.register(tag);
      }
    } catch (error) {
      console.error('Failed to trigger background sync:', error);
    }
  }

  private notifyUpdate(): void {
    // Show update notification to user
    const event = new CustomEvent('sw-update-available');
    window.dispatchEvent(event);
  }

  async skipWaiting(): Promise<void> {
    if (this.registration?.waiting) {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }

  // Request push notification permission
  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  // Subscribe to push notifications
  async subscribeToPush(): Promise<PushSubscription | null> {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          process.env.REACT_APP_VAPID_PUBLIC_KEY || ''
        )
      });

      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return null;
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Message communication with service worker
  async sendMessage(message: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        if (event.data.error) {
          reject(event.data.error);
        } else {
          resolve(event.data);
        }
      };

      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2]);
      } else {
        reject(new Error('No service worker controller'));
      }
    });
  }

  // Cache management
  async clearCache(cacheName?: string): Promise<void> {
    try {
      if (cacheName) {
        await caches.delete(cacheName);
      } else {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  // Get cache usage
  async getCacheUsage(): Promise<{ quota: number; usage: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        quota: estimate.quota || 0,
        usage: estimate.usage || 0
      };
    }
    return { quota: 0, usage: 0 };
  }
}

export const serviceWorkerManager = new AdvancedServiceWorkerManager();
