
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App.tsx'
import './index.css'

// Optimalizovaná inicializace - pouze kritické data
const initializeCriticalData = () => {
  // Pouze základní localStorage data
  if (!localStorage.getItem('premiumFeatures')) {
    const criticalFeatures = [
      { id: "1", name: "Plánování směn", key: "shifts", isEnabled: true },
      { id: "2", name: "Pokročilý překladač", key: "translator", isEnabled: true },
      { id: "3", name: "Daňové kalkulačky", key: "calculator", isEnabled: true }
    ];
    localStorage.setItem('premiumFeatures', JSON.stringify(criticalFeatures));
  }
};

// Rychlá inicializace bez čekání
initializeCriticalData();

// Optimalizovaný Service Worker manager s významným zpožděním
const registerServiceWorkerLater = () => {
  if ('serviceWorker' in navigator) {
    // Odložit registraci o 8 sekund pro rychlejší initial load
    setTimeout(async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none'
        });
        console.log('ServiceWorker registered after delay:', registration.scope);
      } catch (error) {
        console.log('ServiceWorker registration failed:', error);
      }
    }, 8000);
  }
};

// Minimální performance tracking
const trackCriticalMetrics = () => {
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const loadTime = navigation.loadEventEnd - navigation.fetchStart;
        console.log('Page load time:', loadTime.toFixed(2) + 'ms');
        
        if (loadTime > 3000) {
          console.warn('Slow page load detected:', loadTime.toFixed(2) + 'ms');
        }
      }, 1000);
    });
  }
};

// Render aplikace
const root = createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Spustit non-critical operace až po render
requestIdleCallback(() => {
  registerServiceWorkerLater();
  trackCriticalMetrics();
}, { timeout: 2000 });
