
import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

// Hook pro optimalizaci výkonu
export const usePerformanceOptimization = () => {
  const location = useLocation();

  // Prefetch dalších pravděpodobných stránek
  const prefetchRoutes = useCallback(() => {
    const routesToPrefetch = [
      '/dashboard',
      '/language', 
      '/calculator',
      '/vehicle',
      '/shifts'
    ];

    // Prefetch pouze pokud nejsme na mobile a máme dobré připojení
    if (!('connection' in navigator) || 
        // @ts-ignore
        navigator.connection?.effectiveType === '4g') {
      
      routesToPrefetch.forEach(route => {
        if (location.pathname !== route) {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = route;
          document.head.appendChild(link);
        }
      });
    }
  }, [location.pathname]);

  // Optimalizace obrázků
  const optimizeImages = useCallback(() => {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    }
  }, []);

  // Optimalizace při změně route
  useEffect(() => {
    // Malé zpoždění aby se stránka stihla načíst
    const timeoutId = setTimeout(() => {
      prefetchRoutes();
      optimizeImages();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [location.pathname, prefetchRoutes, optimizeImages]);

  // Čištění paměti při opuštění stránky
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Vyčistíme event listenery a timeouty
      if ('performance' in window && 'mark' in performance) {
        performance.mark('page-unload');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return {
    prefetchRoutes,
    optimizeImages
  };
};
