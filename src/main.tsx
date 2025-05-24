
import { createRoot } from 'react-dom/client'
import { StrictMode, useEffect, useState } from 'react'
import App from './App.tsx'
import './index.css'
import { toast } from 'sonner'

// Funkce pro inicializaci dat s optimalizací
const initializeAppData = () => {
  // Použijeme requestIdleCallback pokud je dostupný
  const initData = () => {
    if (!localStorage.getItem('premiumFeatures')) {
      const defaultFeatures = [
        {
          id: "1",
          name: "Plánování směn",
          description: "Přidávání a správa směn v kalendáři",
          isEnabled: true,
          key: "shifts"
        },
        {
          id: "2",
          name: "Pokročilý překladač",
          description: "Překlad delších textů a dokumentů",
          isEnabled: true,
          key: "translator"
        },
        {
          id: "3",
          name: "Daňové kalkulačky",
          description: "Rozšířené kalkulačky pro výpočet daní a odvodů",
          isEnabled: true,
          key: "calculator"
        },
        {
          id: "4",
          name: "Rozšířené materiály k němčině",
          description: "Prémiové výukové materiály a cvičení",
          isEnabled: true,
          key: "language"
        },
        {
          id: "5",
          name: "Správa vozidla",
          description: "Rozšířené funkce pro správu vozidla a nákladů",
          isEnabled: true,
          key: "vehicle"
        }
      ];
      localStorage.setItem('premiumFeatures', JSON.stringify(defaultFeatures));
    }
  };

  // Použijeme requestIdleCallback pokud je dostupný, jinak setTimeout
  if ('requestIdleCallback' in window) {
    requestIdleCallback(initData);
  } else {
    setTimeout(initData, 100);
  }
}

// Optimalizovaná inicializace dat
initializeAppData();

// Service Worker wrapper component s optimalizacemi
const ServiceWorkerManager = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [registered, setRegistered] = useState(false);
  
  // Detekce pomalých zařízení
  const isLowEndDevice = () => {
    const isSlowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    // @ts-ignore
    const isLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
    const isSlowConnection = 'connection' in navigator && 
      // @ts-ignore
      (navigator.connection?.effectiveType === 'slow-2g' || navigator.connection?.effectiveType === '2g');
    
    return isSlowCPU || isLowMemory || isSlowConnection;
  };

  useEffect(() => {
    const registerServiceWorkerWithDelay = async () => {
      if ('serviceWorker' in navigator) {
        try {
          // Na pomalých zařízeních nebo pomalém připojení přidáme větší zpoždění
          const delay = isLowEndDevice() ? 5000 : 2000;
          
          await new Promise(resolve => setTimeout(resolve, delay));
          
          const reg = await navigator.serviceWorker.register('/sw.js');
          console.log('ServiceWorker registration successful with scope: ', reg.scope);
          setRegistration(reg);
          setRegistered(true);
          
          // Kontrola aktualizací
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setUpdateAvailable(true);
                  toast('Je k dispozici aktualizace aplikace', {
                    description: 'Klikněte pro instalaci a restartování',
                    action: {
                      label: 'Aktualizovat',
                      onClick: () => updateServiceWorker()
                    },
                    duration: 10000
                  });
                }
              });
            }
          });
        } catch (error) {
          console.error('ServiceWorker registration failed: ', error);
        }
      }
    };
    
    // Registrujeme až po načtení stránky
    if (document.readyState === 'complete') {
      registerServiceWorkerWithDelay();
    } else {
      window.addEventListener('load', registerServiceWorkerWithDelay);
      return () => {
        window.removeEventListener('load', registerServiceWorkerWithDelay);
      };
    }
    
    // Performance tracking
    if ('performance' in window && 'mark' in performance) {
      performance.mark('sw-manager-init');
    }
  }, []);
  
  const updateServiceWorker = () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      setUpdateAvailable(false);
      window.location.reload();
    }
  };
  
  return null;
};

// Optimalizované renderování s performance monitoring
const root = createRoot(document.getElementById("root")!);

// Performance monitoring
if ('performance' in window && 'mark' in performance) {
  performance.mark('app-start');
}

root.render(
  <StrictMode>
    <App />
    <ServiceWorkerManager />
  </StrictMode>
);

// Log performance metrics
if ('performance' in window) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      console.log('Performance metrics:', {
        DOMContentLoaded: navigationTiming.domContentLoadedEventEnd - navigationTiming.fetchStart,
        LoadComplete: navigationTiming.loadEventEnd - navigationTiming.fetchStart,
        FirstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 'N/A',
        FirstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 'N/A'
      });
    }, 1000);
  });
}
