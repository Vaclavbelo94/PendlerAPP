
import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('Main.tsx loading...');

// Render aplikace
const root = createRoot(document.getElementById("root")!);

console.log('Rendering React app...');

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

console.log('React app rendered successfully');

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
}, 5000);
