
// Service Worker pro offline funkcionalitu a PWA podporu
const CACHE_NAME = 'pendler-buddy-cache-v2';
const APP_SHELL = [
  '/',
  '/index.html',
  '/assets/index.css',
  '/assets/index.js',
  '/favicon.ico',
  '/placeholder.svg',
  '/manifest.json'
];

// Další důležité stránky k cachování
const IMPORTANT_ROUTES = [
  '/language',
  '/translator',
  '/calculator',
  '/vehicle',
  '/shifts',
  '/profile'
];

// Instalační událost - cache základních zdrojů
self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalace');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cachování aplikační schránky');
        return cache.addAll([...APP_SHELL, ...IMPORTANT_ROUTES]);
      })
      .then(() => self.skipWaiting()) // Přeskočí čekání na aktivaci
  );
});

// Aktivační událost - vyčištění starých cache
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Aktivace');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Mazání staré cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => self.clients.claim()) // Převezme kontrolu nad všemi klienty
  );
});

// Strategie Cache First, pak Network s aktualizací cache
self.addEventListener('fetch', (event) => {
  // Odmítne zpracovat požadavky na jiné domény (např. API volání)
  if (!event.request.url.includes(self.location.origin)) {
    return;
  }
  
  // Vynechá POST požadavky a API endpointy
  if (
    event.request.method !== 'GET' || 
    event.request.url.includes('/api/') ||
    event.request.url.includes('/supabase/')
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Cache hit - vrátí odpověď
        if (cachedResponse) {
          // Na pozadí aktualizuje cache pro příští návštěvu
          fetch(event.request)
            .then((response) => {
              // Aktualizace cache jen pro validní odpovědi
              if (response && response.status === 200) {
                caches.open(CACHE_NAME)
                  .then((cache) => cache.put(event.request, response));
              }
            })
            .catch(() => {/* chyba tiše ignorována */});
          
          return cachedResponse;
        }

        // Cache miss - získá z network a cachuje
        return fetch(event.request)
          .then((response) => {
            // Vrátí odpověď, pokud je neplatná
            if (!response || response.status !== 200) {
              return response;
            }

            // Klonuje odpověď, protože ji může spotřebovat pouze jednou
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Pokud selže síť i cache, zobrazí fallback pro HTML požadavky
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/');
            }
          });
      })
  );
});

// Událost zprávy - pro komunikaci s webovou aplikací
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Synchronizace na pozadí pro offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-pendler-data') {
    event.waitUntil(syncPendlerData());
  }
});

// Funkce pro synchronizaci dat
async function syncPendlerData() {
  const offlineData = await getOfflineDataToSync();
  if (offlineData && offlineData.length) {
    // Zde by byla implementace synchronizace s API
    console.log('Service Worker: Synchronizace offline dat', offlineData);
  }
}

// Příprava pro získání offline dat (zakomentované)
function getOfflineDataToSync() {
  // Tato funkce by normálně komunikovala s IndexedDB
  return Promise.resolve([]);
}

// Funkce pro získání přístupu k IndexedDB (přidání později)

// Podpora push notifikací (základní)
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    const options = {
      body: data.body || 'Nové oznámení od Pendler Buddy',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      data: {
        url: data.url || '/'
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(
        data.title || 'Pendler Buddy', 
        options
      )
    );
  } catch (error) {
    // Fallback pro textové zprávy
    event.waitUntil(
      self.registration.showNotification('Pendler Buddy', {
        body: event.data.text(),
        icon: '/favicon.ico'
      })
    );
  }
});

// Zpracování kliknutí na notifikaci
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // Pokud je již aplikace otevřená, zaměří se na ni
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.navigate(event.notification.data.url).then(client => client.focus());
          }
        }
        
        // Jinak otevře nové okno/kartu
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data.url);
        }
      })
    );
  }
});
