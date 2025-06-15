
import { useEffect, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

interface BundleOptimizationOptions {
  enableCodeSplitting?: boolean;
  enablePrefetching?: boolean;
  prefetchDelay?: number;
  enablePreloading?: boolean;
}

export const useBundleOptimization = (options: BundleOptimizationOptions = {}) => {
  const {
    enableCodeSplitting = true,
    enablePrefetching = false,
    prefetchDelay = 2000,
    enablePreloading = true
  } = options;

  const location = useLocation();

  // Memoized route predictions
  const routePredictions = useMemo(() => {
    const currentPath = location.pathname;
    
    // Predict likely next routes based on current path
    const predictions: string[] = [];
    
    if (currentPath === '/') {
      predictions.push('/dashboard', '/vocabulary');
    } else if (currentPath === '/dashboard') {
      predictions.push('/shifts', '/vehicle', '/vocabulary');
    } else if (currentPath.startsWith('/language')) {
      predictions.push('/vocabulary', '/translator', '/dashboard');
    }
    
    return predictions;
  }, [location.pathname]);

  // Prefetch route components
  const prefetchRoutes = useCallback(async () => {
    if (!enablePrefetching) return;

    for (const route of routePredictions) {
      try {
        // Dynamic import with error handling
        switch (route) {
          case '/dashboard':
            await import('@/pages/Dashboard');
            break;
          case '/vocabulary':
            await import('@/pages/Vocabulary');
            break;
          case '/shifts':
            await import('@/pages/Shifts');
            break;
          case '/vehicle':
            await import('@/pages/Vehicle');
            break;
          case '/translator':
            await import('@/pages/Translator');
            break;
        }
      } catch (error) {
        console.warn(`Failed to prefetch route ${route}:`, error);
      }
    }
  }, [routePredictions, enablePrefetching]);

  // Prefetch with delay
  useEffect(() => {
    if (!enablePrefetching) return;

    const timeoutId = setTimeout(prefetchRoutes, prefetchDelay);
    return () => clearTimeout(timeoutId);
  }, [prefetchRoutes, prefetchDelay, enablePrefetching]);

  // Resource preloading
  useEffect(() => {
    if (!enablePreloading) return;

    const preloadCriticalResources = () => {
      // Preload critical CSS
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = '/assets/critical.css';
      link.as = 'style';
      document.head.appendChild(link);
    };

    // Run after initial render
    requestIdleCallback ? 
      requestIdleCallback(preloadCriticalResources) : 
      setTimeout(preloadCriticalResources, 100);
  }, [enablePreloading]);

  return {
    routePredictions,
    prefetchRoutes
  };
};
