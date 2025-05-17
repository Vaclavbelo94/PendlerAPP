
// Service Worker pro offline funkcionalitu a PWA podporu
const CACHE_NAME = 'pendler-buddy-cache-v4';
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
  
  // Použijeme skipWaiting pro rychlejší převzetí kontroly
  self.skipWaiting();
  
  // Cachování základních zdrojů v pozadí bez blokování instalace
  setTimeout(() => {
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cachování aplikační schránky');
        // Přidáváme základní soubory ke cachování
        return cache.addAll(APP_SHELL);
      })
      .then(() => {
        // Po úspěšném cachování základních souborů přidáme další
        return caches.open(CACHE_NAME).then(cache => {
          // Rozdělíme cachování do více částí pro lepší výkon
          const cacheRoutes = cache.addAll(IMPORTANT_ROUTES);
          const cacheLanguage = cache.addAll(LANGUAGE_RESOURCES.filter(r => !r.includes('*')));
          
          return Promise.all([cacheRoutes, cacheLanguage]);
        });
      })
      .catch(err => console.error('Chyba při cachování:', err));
  }, 1000);
});

// Aktivační událost - vyčištění starých cache
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Aktivace');
  const cacheWhitelist = [CACHE_NAME];
  
  // Převezmeme kontrolu nad všemi klienty ihned
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
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
    ])
  );
});

// Optimalizovaná strategie pro fetch požadavky
self.addEventListener('fetch', (event) => {
  // Ignorujeme požadavky na jiné domény a API
  if (
    !event.request.url.includes(self.location.origin) || 
    event.request.method !== 'GET' || 
    event.request.url.includes('/api/') ||
    event.request.url.includes('/supabase/')
  ) {
    return;
  }
  
  // Optimalizovaná strategie podle typu požadavku
  const isStaticAsset = event.request.url.match(/\.(js|css|svg|png|jpg|jpeg|gif|ico|woff2|woff|ttf)$/);
  const isHTMLRequest = event.request.headers.get('accept')?.includes('text/html');
  
  if (isStaticAsset) {
    // Cache-First Strategy pro statické prostředky
    event.respondWith(
      caches.match(event.request)
        .then((cacheResponse) => {
          // Vrátíme cache, pokud existuje
          if (cacheResponse) {
            // Na pozadí aktualizujeme cache
            fetch(event.request)
              .then((response) => {
                if (response && response.status === 200) {
                  caches.open(CACHE_NAME)
                    .then((cache) => cache.put(event.request, response.clone()))
                    .catch(err => console.error('Chyba při aktualizaci cache:', err));
                }
              })
              .catch(() => {/* chyba tiše ignorována */});
              
            return cacheResponse;
          }
          
          // Není v cache, stáhneme a uložíme
          return fetch(event.request)
            .then((response) => {
              if (!response || response.status !== 200) return response;
              
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => cache.put(event.request, responseToCache))
                .catch(err => console.error('Chyba při ukládání do cache:', err));
                
              return response;
            })
            .catch(() => {
              // Fallback pro obrázky
              if (event.request.url.match(/\.(png|jpg|jpeg|gif|svg)$/)) {
                return caches.match('/placeholder.svg');
              }
            });
        })
    );
  } else if (isHTMLRequest) {
    // Network-First Strategy pro HTML požadavky s rychlým fallbackem
    event.respondWith(
      Promise.race([
        // Časový limit pro síťové volání
        new Promise((resolve) => setTimeout(() => resolve(null), 2000)),
        fetch(event.request.clone()).catch(() => null)
      ])
      .then((response) => {
        // Pokud je odpověď platná, použijeme ji a aktualizujeme cache
        if (response) {
          const clonedResponse = (response as Response).clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, clonedResponse))
            .catch(err => console.error('Chyba při ukládání HTML do cache:', err));
            
          return response;
        }
        
        // Fallback na cache
        return caches.match(event.request).then(cacheResponse => {
          return cacheResponse || caches.match('/');
        });
      })
    );
  } else {
    // Stale-While-Revalidate strategie pro ostatní požadavky
    event.respondWith(
      caches.match(event.request).then(cacheResponse => {
        const fetchPromise = fetch(event.request)
          .then(response => {
            // Aktualizace cache v pozadí
            if (response && response.status === 200) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, responseToCache))
                .catch(err => console.error('Chyba při ukládání do cache:', err));
            }
            return response;
          })
          .catch(() => {
            // V případě selhání sítě vrátíme null a pak použijeme cache
            return null;
          });
          
        // Vrátíme cache, pokud existuje, nebo počkáme na fetch
        return cacheResponse || fetchPromise;
      })
    );
  }
});

// Událost zprávy - pro komunikaci s webovou aplikací
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  // Kontrola dostupnosti offline
  if (event.data && event.data.type === 'CHECK_OFFLINE_READY') {
    // Provedeme asynchronní kontrolu
    const check = async () => {
      try {
        const keys = await caches.keys();
        const cacheExists = keys.includes(CACHE_NAME);
        const cachedCount = cacheExists ? await getCachedUrlsCount() : 0;
        
        // Odpověď na klientskou aplikaci
        event.ports[0].postMessage({
          offlineReady: cacheExists,
          cachedItems: cachedCount
        });
      } catch (error) {
        console.error('Chyba při kontrole cache:', error);
        event.ports[0].postMessage({
          offlineReady: false,
          cachedItems: 0,
          error: error.message
        });
      }
    };
    
    check();
  }
});

// Optimalizovaná funkce pro získání počtu položek v cache
async function getCachedUrlsCount() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    return keys.length;
  } catch (error) {
    console.error('Chyba při počítání položek v cache:', error);
    return 0;
  }
}

// Synchronizace na pozadí
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-pendler-data') {
    event.waitUntil(syncPendlerData());
  }
  
  // Synchronizace jazykových dat
  if (event.tag === 'sync-language-data') {
    event.waitUntil(syncLanguageData());
  }
});

// Funkce pro synchronizaci dat - zjednodušeno pro lepší výkon
async function syncPendlerData() {
  try {
    const offlineData = await getOfflineDataToSync();
    if (offlineData && offlineData.length) {
      console.log('Service Worker: Synchronizace offline dat', offlineData);
      // Zde by byla implementace synchronizace s API
      return Promise.resolve();
    }
    return Promise.resolve();
  } catch (error) {
    console.error('Chyba při synchronizaci dat:', error);
    return Promise.resolve();
  }
}

// Optimalizovaná funkce pro synchronizaci jazykových dat
async function syncLanguageData() {
  try {
    const cache = await caches.open(CACHE_NAME);
    
    // Synchronizujeme pouze nejdůležitější jazykové zdroje
    const criticalResources = LANGUAGE_RESOURCES.filter(r => !r.includes('*')).slice(0, 2);
    
    for (const resource of criticalResources) {
      try {
        const response = await fetch(resource, { cache: 'no-cache' });
        if (response && response.status === 200) {
          await cache.put(resource, response);
          console.log('Aktualizován jazykový zdroj:', resource);
        }
      } catch (err) {
        console.error('Chyba při aktualizaci jazykového zdroje:', resource, err);
      }
    }
    
    console.log('Service Worker: Synchronizace jazykových dat dokončena');
    return Promise.resolve();
  } catch (error) {
    console.error('Service Worker: Chyba při synchronizaci jazykových dat', error);
    return Promise.resolve();
  }
}

// Příprava pro získání offline dat
function getOfflineDataToSync() {
  // Tato funkce by normálně komunikovala s IndexedDB
  return Promise.resolve([]);
}

// Podpora push notifikací (základní) - optimalizováno
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
