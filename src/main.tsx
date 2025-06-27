
import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Simplified initialization
const initializeCriticalData = () => {
  try {
    if (!localStorage.getItem('premiumFeatures')) {
      const criticalFeatures = [
        { id: "1", name: "Plánování směn", key: "shifts", isEnabled: true },
        { id: "2", name: "Pokročilý překladač", key: "translator", isEnabled: true },
        { id: "3", name: "Daňové kalkulačky", key: "calculator", isEnabled: true }
      ];
      localStorage.setItem('premiumFeatures', JSON.stringify(criticalFeatures));
    }
  } catch (error) {
    console.error('Error initializing critical data:', error);
  }
};

// Quick initialization
initializeCriticalData();

// Ensure React is available globally for React Query
if (typeof window !== 'undefined') {
  (window as any).React = React;
}

// Render aplikace
const root = createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Register service worker with delay to not block initial load
setTimeout(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none'
    }).then(registration => {
      console.log('ServiceWorker registered:', registration.scope);
    }).catch(error => {
      console.log('ServiceWorker registration failed:', error);
    });
  }
}, 3000);
