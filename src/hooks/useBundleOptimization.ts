
import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

interface BundleOptimizationOptions {
  enableCodeSplitting?: boolean;
  enablePrefetching?: boolean;
  prefetchDelay?: number;
}

export const useBundleOptimization = (options: BundleOptimizationOptions = {}) => {
  const location = useLocation();
  const {
    enableCodeSplitting = true,
    enablePrefetching = true,
    prefetchDelay = 2000
  } = options;

  // Prefetch route modules based on current route
  const prefetchRoutes = useCallback(() => {
    if (!enablePrefetching) return;

    const routePrefetchMap: Record<string, string[]> = {
      '/': ['/dashboard', '/language', '/calculator'],
      '/dashboard': ['/language', '/shifts', '/vehicle'],
      '/language': ['/translator', '/dashboard'],
      '/calculator': ['/tax-advisor', '/dashboard'],
      '/shifts': ['/dashboard', '/vehicle'],
      '/vehicle': ['/dashboard', '/shifts'],
      '/premium': ['/dashboard'],
    };

    const currentRoutePrefetches = routePrefetchMap[location.pathname] || [];
    
    currentRoutePrefetches.forEach(route => {
      // Create invisible link elements for prefetching
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      link.as = 'document';
      document.head.appendChild(link);
    });
  }, [location.pathname, enablePrefetching]);

  // Optimize images on current route
  const optimizeCurrentRouteImages = useCallback(() => {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      // Add loading="lazy" if not already present
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
      
      // Add decoding="async" for better performance
      if (!img.hasAttribute('decoding')) {
        img.setAttribute('decoding', 'async');
      }
    });
  }, []);

  // Clean up unused resources when leaving route
  const cleanupRouteResources = useCallback(() => {
    // Remove prefetch links that are no longer needed
    const prefetchLinks = document.querySelectorAll('link[rel="prefetch"]');
    prefetchLinks.forEach(link => {
      if (link.getAttribute('href') !== location.pathname) {
        link.remove();
      }
    });
  }, [location.pathname]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      prefetchRoutes();
      optimizeCurrentRouteImages();
    }, prefetchDelay);

    return () => {
      clearTimeout(timeoutId);
      cleanupRouteResources();
    };
  }, [location.pathname, prefetchRoutes, optimizeCurrentRouteImages, cleanupRouteResources, prefetchDelay]);

  return {
    prefetchRoutes,
    optimizeCurrentRouteImages,
    cleanupRouteResources
  };
};
