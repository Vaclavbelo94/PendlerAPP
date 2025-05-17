
import { createRoot } from 'react-dom/client'
import { StrictMode, useEffect, useState } from 'react'
import App from './App.tsx'
import './index.css'
import { toast } from 'sonner'

// Funkce pro inicializaci dat
const initializeAppData = () => {
  // Inicializace prémiových funkcí, pokud ještě neexistují
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
}

// Inicializace dat při prvním načtení aplikace
initializeAppData();

// Service Worker wrapper component
const ServiceWorkerManager = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  
  // Pomocná funkce pro detekci pomalých zařízení
  const isLowEndDevice = () => {
    // Detekce pomalých zařízení (méně než 4 jader nebo méně než 4GB RAM)
    const isSlowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
    // @ts-ignore - deviceMemory není standardní vlastnost, ale je podporována v Chrome
    const isLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
    
    return isSlowCPU || isLowMemory;
  };

  useEffect(() => {
    // Přidáme zpoždění před registrací Service Workeru pro zlepšení výkonu načítání
    const registerServiceWorkerWithDelay = () => {
      if ('serviceWorker' in navigator) {
        // Na pomalých zařízeních přidáme větší zpoždění
        const delay = isLowEndDevice() ? 3000 : 1000;
        
        setTimeout(() => {
          navigator.serviceWorker.register('/sw.js')
            .then(reg => {
              console.log('ServiceWorker registration successful with scope: ', reg.scope);
              setRegistration(reg);
              
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
            })
            .catch(error => {
              console.log('ServiceWorker registration failed: ', error);
            });
        }, delay);
      }
    };
    
    // Provedeme registraci až po načtení stránky
    if (document.readyState === 'complete') {
      registerServiceWorkerWithDelay();
    } else {
      window.addEventListener('load', registerServiceWorkerWithDelay);
      return () => {
        window.removeEventListener('load', registerServiceWorkerWithDelay);
      };
    }
    
    // Naslouchání na controller změny
    const handleControllerChange = () => {
      console.log('Service Worker Controller Changed');
    };
    
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
      
      // Kontrola a oznámení o offline připravenosti - s větším zpožděním
      if (navigator.onLine) {
        // Funkce pro kontrolu offline připravenosti
        const checkOfflineReadiness = () => {
          if (navigator.serviceWorker.controller) {
            const messageChannel = new MessageChannel();
            messageChannel.port1.onmessage = (event) => {
              if (event.data.offlineReady) {
                toast.success('Aplikace je připravena pro offline použití', {
                  description: `Uloženo ${event.data.cachedItems} položek`,
                  duration: 3000
                });
              }
            };
            
            navigator.serviceWorker.controller.postMessage({
              type: 'CHECK_OFFLINE_READY'
            }, [messageChannel.port2]);
          }
        };
        
        // Odložíme kontrolu offline připravenosti
        setTimeout(checkOfflineReadiness, 5000);
      }
      
      return () => {
        navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
      };
    }
  }, []);
  
  const updateServiceWorker = () => {
    if (registration && registration.waiting) {
      // Pošleme zprávu čekajícímu service workeru aby převzal kontrolu
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      setUpdateAvailable(false);
      
      // Resetujeme stránku pro načtení nového service workeru
      window.location.reload();
    }
  };
  
  return null;
};

// Obalení aplikace do StrictMode pro lepší detekci chyb
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <ServiceWorkerManager />
  </StrictMode>
);
