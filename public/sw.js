
const CACHE_NAME = 'pendleruv-pomocnik-v2.0';
const STATIC_CACHE = 'static-v2.0';
const DYNAMIC_CACHE = 'dynamic-v2.0';

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/lovable-uploads/88ef4e0f-4d33-458c-98f4-7b644e5b8588.png',
  '/offline.html'
];

// Routes to cache dynamically
const CACHEABLE_ROUTES = [
  '/dashboard',
  '/vocabulary',
  '/translator',
  '/calculator',
  '/shifts',
  '/vehicle',
  '/travel-planning',
  '/tax-advisor'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim()
    ])
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension requests
  if (url.protocol === 'chrome-extension:') return;

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Handle static assets with cache-first strategy
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }

  // Handle app routes with stale-while-revalidate strategy
  if (CACHEABLE_ROUTES.some(route => url.pathname.startsWith(route))) {
    event.respondWith(staleWhileRevalidateStrategy(request));
    return;
  }

  // Default: network-first with offline fallback
  event.respondWith(networkFirstWithFallback(request));
});

// Network-first strategy (for API calls)
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

// Cache-first strategy (for static assets)
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Failed to fetch:', request.url);
    return new Response('Asset not available offline', { status: 503 });
  }
}

// Stale-while-revalidate strategy (for app pages)
async function staleWhileRevalidateStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      const cache = caches.open(DYNAMIC_CACHE);
      cache.then(c => c.put(request, networkResponse.clone()));
    }
    return networkResponse;
  }).catch(() => cachedResponse);

  return cachedResponse || fetchPromise;
}

// Network-first with offline fallback
async function networkFirstWithFallback(request) {
  try {
    return await fetch(request);
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline.html');
    }
    
    return new Response('Content not available offline', { status: 503 });
  }
}

// Helper function to check if URL is a static asset
function isStaticAsset(pathname) {
  return pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|eot|ico)$/);
}

// Background sync for offline data
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(syncOfflineData());
  }
  
  if (event.tag === 'shift-sync') {
    event.waitUntil(syncShiftData());
  }
});

// Sync offline data
async function syncOfflineData() {
  try {
    console.log('[SW] Starting offline data sync...');
    // Implementation would sync with IndexedDB and send to server
    const offlineData = await getOfflineDataFromIDB();
    
    for (const item of offlineData) {
      try {
        await fetch('/api/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        });
        
        await removeFromIDB(item.id);
      } catch (error) {
        console.log('[SW] Failed to sync item:', item.id);
      }
    }
    
    console.log('[SW] Offline data sync completed');
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

// Sync shift data specifically
async function syncShiftData() {
  try {
    console.log('[SW] Starting shift data sync...');
    // Implementation for shift-specific sync
  } catch (error) {
    console.error('[SW] Shift sync failed:', error);
  }
}

// Placeholder functions - would be implemented with IndexedDB
async function getOfflineDataFromIDB() {
  return [];
}

async function removeFromIDB(id) {
  // Implementation would remove synced data from IndexedDB
}

// Push notification handling
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/lovable-uploads/88ef4e0f-4d33-458c-98f4-7b644e5b8588.png',
    badge: '/lovable-uploads/88ef4e0f-4d33-458c-98f4-7b644e5b8588.png',
    vibrate: [200, 100, 200],
    data: data.data || {},
    actions: data.actions || []
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const action = event.action;
  const data = event.notification.data;

  let url = '/';
  if (action === 'view-shift') {
    url = '/shifts';
  } else if (action === 'view-vocabulary') {
    url = '/vocabulary';
  } else if (data.url) {
    url = data.url;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      // Check if app is already open
      for (const client of clientList) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Open new window if app not open
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
