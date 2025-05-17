
// Service Worker pro offline funkcionalitu a PWA podporu
const CACHE_NAME = 'pendler-buddy-cache-v3';
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

// Jazykové výukové materiály k cachování (nové)
const LANGUAGE_RESOURCES = [
  '/data/germanExercises.js',
  '/data/translatorData.js',
  '/assets/language-icons/*.svg'
];

// Instalační událost - cache základních zdrojů
self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalace');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cachování aplikační schránky');
        // Přidáváme i jazykové zdroje
        return cache.addAll([...APP_SHELL, ...IMPORTANT_ROUTES, ...LANGUAGE_RESOURCES]);
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

// Vylepšená strategie Network First pro API volání, ale Cache First pro statické zdroje
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

  // Pro jazykové zdroje a důležité statické soubory použij Cache First
  const isLanguageResource = LANGUAGE_RESOURCES.some(resource => 
    event.request.url.includes(resource.replace('*', ''))
  );
  const isStaticResource = event.request.url.match(/\.(js|css|svg|png|jpg|jpeg|gif|ico)$/);

  if (isLanguageResource || isStaticResource) {
    // Cache First strategy
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            // Na pozadí aktualizuje cache pro příští návštěvu
            fetch(event.request)
              .then((response) => {
                if (response && response.status === 200) {
                  caches.open(CACHE_NAME)
                    .then((cache) => cache.put(event.request, response));
                }
              })
              .catch(() => {/* chyba tiše ignorována */});
            
            return cachedResponse;
          }

          // Pokud není v cache, získá z network a cachuje
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
              // Fallback pro obrázky - prázdný obrázek
              if (event.request.url.match(/\.(png|jpg|jpeg|gif|svg)$/)) {
                return caches.match('/placeholder.svg');
              }
            });
        })
    );
  } else {
    // Network First strategy pro ostatní požadavky
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Klonuje odpověď, protože ji může spotřebovat pouze jednou
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
            
          return response;
        })
        .catch(() => {
          return caches.match(event.request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              
              // Pokud selže síť i cache, zobrazí fallback pro HTML požadavky
              if (event.request.headers.get('accept').includes('text/html')) {
                return caches.match('/');
              }
              
              return new Response('Network error happened', {
                status: 408,
                headers: { 'Content-Type': 'text/plain' },
              });
            });
        })
    );
  }
});

// Událost zprávy - pro komunikaci s webovou aplikací
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  // Nová funkcionalita - kontrola dostupnosti offline
  if (event.data && event.data.type === 'CHECK_OFFLINE_READY') {
    const check = async () => {
      const keys = await caches.keys();
      const cacheExists = keys.includes(CACHE_NAME);
      
      // Odpověď na klientskou aplikaci
      event.ports[0].postMessage({
        offlineReady: cacheExists,
        cachedItems: cacheExists ? await getCachedUrlsCount() : 0
      });
    };
    
    event.waitUntil(check());
  }
});

// Pomocná funkce pro získání počtu položek v cache
async function getCachedUrlsCount() {
  const cache = await caches.open(CACHE_NAME);
  const keys = await cache.keys();
  return keys.length;
}

// Synchronizace na pozadí pro offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-pendler-data') {
    event.waitUntil(syncPendlerData());
  }
  
  // Nová sync událost pro jazykové materiály
  if (event.tag === 'sync-language-data') {
    event.waitUntil(syncLanguageData());
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

// Nová funkce pro synchronizaci jazykových dat
async function syncLanguageData() {
  try {
    const cache = await caches.open(CACHE_NAME);
    
    // Kontrola a aktualizace cache jazykových zdrojů
    for (const resource of LANGUAGE_RESOURCES) {
      // Přeskočí zástupné znaky ve vzorech
      if (resource.includes('*')) continue;
      
      try {
        const response = await fetch(resource);
        if (response && response.status === 200) {
          await cache.put(resource, response);
          console.log('Aktualizován jazykový zdroj:', resource);
        }
      } catch (err) {
        console.error('Chyba při aktualizaci jazykového zdroje:', resource, err);
      }
    }
    
    console.log('Service Worker: Synchronizace jazykových dat dokončena');
  } catch (error) {
    console.error('Service Worker: Chyba při synchronizaci jazykových dat', error);
  }
}

// Příprava pro získání offline dat (zakomentované)
function getOfflineDataToSync() {
  // Tato funkce by normálně komunikovala s IndexedDB
  return Promise.resolve([]);
}

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
