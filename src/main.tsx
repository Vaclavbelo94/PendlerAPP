
import { createRoot } from 'react-dom/client'
import { StrictMode, useEffect, useState } from 'react'
import App from './App.tsx'
import './index.css'
import { toast } from 'sonner'
import { performanceMonitor } from './utils/performanceMonitor'

// Optimalizovaná inicializace dat s batch operacemi
const initializeAppData = () => {
  const initData = () => {
    // Batch inicializace všech localStorage dat
    const defaultData = {
      premiumFeatures: [
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
          description: "Rozšířené funkce pro správa vozidla a nákladů",
          isEnabled: true,
          key: "vehicle"
        }
      ]
    };

    // Batch nastavení všech výchozích hodnot
    Object.entries(defaultData).forEach(([key, value]) => {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(value));
      }
    });

    // Inicializace performance monitoringu
    if ('performance' in window && 'mark' in performance) {
      performance.mark('app-data-initialized');
    }
  };

  // Optimalizované spuštění s prioritou
  if ('scheduler' in window && 'postTask' in (window as any).scheduler) {
    // Použijeme Scheduler API pokud je dostupný
    (window as any).scheduler.postTask(initData, { priority: 'background' });
  } else if ('requestIdleCallback' in window) {
    requestIdleCallback(initData, { timeout: 2000 });
  } else {
    setTimeout(initData, 100);
  }
}

// Optimalizovaná inicializace dat
initializeAppData();

// Vylepšený Service Worker manager s lepším error handling
const ServiceWorkerManager = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [registered, setRegistered] = useState(false);
  
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
    const registerServiceWorkerWithOptimizations = async () => {
      if ('serviceWorker' in navigator) {
        try {
          // Adaptivní zpoždění podle výkonu zařízení
          const delay = isLowEndDevice() ? 8000 : 3000;
          
          await new Promise(resolve => setTimeout(resolve, delay));
          
          const reg = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
            updateViaCache: 'none' // Vždy kontrolovat aktualizace
          });
          
          console.log('ServiceWorker registration successful with scope: ', reg.scope);
          setRegistration(reg);
          setRegistered(true);
          
          // Optimalizovaná kontrola aktualizací
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
                    duration: 15000 // Delší doba zobrazení
                  });
                }
              });
            }
          });

          // Pravidelná kontrola aktualizací (každých 30 minut)
          setInterval(() => {
            reg.update();
          }, 30 * 60 * 1000);

        } catch (error) {
          console.error('ServiceWorker registration failed: ', error);
        }
      }
    };
    
    if (document.readyState === 'complete') {
      registerServiceWorkerWithOptimizations();
    } else {
      window.addEventListener('load', registerServiceWorkerWithOptimizations);
      return () => {
        window.removeEventListener('load', registerServiceWorkerWithOptimizations);
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

// Optimalizované renderování s enhanced monitoring
const root = createRoot(document.getElementById("root")!);

// Enhanced performance monitoring
if ('performance' in window && 'mark' in performance) {
  performance.mark('app-start');
}

root.render(
  <StrictMode>
    <App />
    <ServiceWorkerManager />
  </StrictMode>
);

// Rozšířené performance metriky
if ('performance' in window) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const metrics = {
        DOMContentLoaded: navigationTiming.domContentLoadedEventEnd - navigationTiming.fetchStart,
        LoadComplete: navigationTiming.loadEventEnd - navigationTiming.fetchStart,
        FirstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 'N/A',
        FirstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 'N/A',
        TTI: navigationTiming.domInteractive - navigationTiming.fetchStart,
        TTFB: navigationTiming.responseStart - navigationTiming.requestStart
      };
      
      console.log('Enhanced Performance Metrics:', metrics);
      
      // Performance monitoring výstrahy
      if (metrics.LoadComplete > 3000) {
        console.warn('Slow page load detected:', metrics.LoadComplete, 'ms');
      }
      
      if (typeof metrics.FirstContentfulPaint === 'number' && metrics.FirstContentfulPaint > 2500) {
        console.warn('Slow FCP detected:', metrics.FirstContentfulPaint, 'ms');
      }
      
    }, 1500);
  });
}

// Cleanup při unload
window.addEventListener('beforeunload', () => {
  performanceMonitor.destroy();
});
