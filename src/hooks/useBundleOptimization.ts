
import { useEffect, useCallback } from 'react';

interface BundleOptimizationOptions {
  enableCodeSplitting?: boolean;
  enablePrefetching?: boolean;
  prefetchDelay?: number;
  enablePreloading?: boolean;
}

export const useBundleOptimization = (options: BundleOptimizationOptions = {}) => {
  const {
    enableCodeSplitting = true,
    enablePrefetching = true,
    prefetchDelay = 2000,
    enablePreloading = true
  } = options;

  // Prefetch critical routes
  const prefetchCriticalRoutes = useCallback(() => {
    if (!enablePrefetching) return;

    const criticalRoutes = [
      '/dashboard',
      '/shifts',
      '/tax-advisor',
      '/translator',
      '/vehicle'
    ];

    criticalRoutes.forEach(route => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    });
  }, [enablePrefetching]);

  // Preload critical resources
  const preloadCriticalResources = useCallback(() => {
    if (!enablePreloading) return;

    // Preload critical CSS
    const criticalCSS = document.createElement('link');
    criticalCSS.rel = 'preload';
    criticalCSS.as = 'style';
    criticalCSS.href = '/src/index.css';
    document.head.appendChild(criticalCSS);

    // Preload important fonts
    const fontPreload = document.createElement('link');
    fontPreload.rel = 'preload';
    fontPreload.as = 'font';
    fontPreload.type = 'font/woff2';
    fontPreload.crossOrigin = 'anonymous';
    document.head.appendChild(fontPreload);
  }, [enablePreloading]);

  // Dynamic import optimization
  const optimizeImports = useCallback(() => {
    if (!enableCodeSplitting) return;

    // Add module preload hints
    const modulePreloadScript = document.createElement('script');
    modulePreloadScript.innerHTML = `
      window.addEventListener('mouseover', (e) => {
        const link = e.target.closest('a[href]');
        if (link && !link.dataset.preloaded) {
          link.dataset.preloaded = 'true';
          const moduleLink = document.createElement('link');
          moduleLink.rel = 'modulepreload';
          moduleLink.href = link.href;
          document.head.appendChild(moduleLink);
        }
      });
    `;
    document.head.appendChild(modulePreloadScript);
  }, [enableCodeSplitting]);

  useEffect(() => {
    // Delayed execution to avoid blocking initial render
    const timer = setTimeout(() => {
      prefetchCriticalRoutes();
      preloadCriticalResources();
      optimizeImports();
    }, prefetchDelay);

    return () => clearTimeout(timer);
  }, [prefetchCriticalRoutes, preloadCriticalResources, optimizeImports, prefetchDelay]);

  return {
    prefetchCriticalRoutes,
    preloadCriticalResources,
    optimizeImports
  };
};
