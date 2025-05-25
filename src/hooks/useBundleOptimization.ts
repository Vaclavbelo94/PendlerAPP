
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

  const prefetchRoutes = useCallback(() => {
    if (!enablePrefetching) return;

    const routePrefetchMap: Record<string, string[]> = {
      '/': ['/dashboard', '/language', '/calculator'],
      '/dashboard': ['/language', '/shifts', '/vehicle'],
      '/translator': ['/language', '/dashboard'],
      '/language': ['/translator', '/dashboard'],
      '/calculator': ['/tax-advisor', '/dashboard'],
      '/shifts': ['/dashboard', '/vehicle'],
      '/vehicle': ['/dashboard', '/shifts']
    };

    const currentRoutePrefetches = routePrefetchMap[location.pathname] || [];
    
    currentRoutePrefetches.forEach(route => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      link.as = 'document';
      document.head.appendChild(link);
    });
  }, [location.pathname, enablePrefetching]);

  const optimizeBundles = useCallback(() => {
    if (!enableCodeSplitting) return;

    // Preload critical modules
    const criticalModules = [
      '/src/components/ui/button.tsx',
      '/src/components/ui/card.tsx',
      '/src/hooks/useAuth.tsx'
    ];

    criticalModules.forEach(module => {
      const link = document.createElement('link');
      link.rel = 'modulepreload';
      link.href = module;
      document.head.appendChild(link);
    });
  }, [enableCodeSplitting]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      prefetchRoutes();
      optimizeBundles();
    }, prefetchDelay);

    return () => clearTimeout(timeoutId);
  }, [prefetchRoutes, optimizeBundles, prefetchDelay]);

  return {
    prefetchRoutes,
    optimizeBundles
  };
};
