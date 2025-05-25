
import { useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface PerformanceOptions {
  enableImageOptimization?: boolean;
  enablePrefetching?: boolean;
  enableBundleSplitting?: boolean;
  prefetchDelay?: number;
}

export const usePerformanceOptimization = (options: PerformanceOptions = {}) => {
  const location = useLocation();
  const {
    enableImageOptimization = true,
    enablePrefetching = true,
    enableBundleSplitting = true,
    prefetchDelay = 2000
  } = options;

  const performanceRef = useRef({
    observedImages: new Set<HTMLImageElement>(),
    prefetchedRoutes: new Set<string>(),
    observers: [] as IntersectionObserver[]
  });

  // Image optimization with intersection observer
  const optimizeImages = useCallback(() => {
    if (!enableImageOptimization) return;

    const images = document.querySelectorAll('img[data-src]:not([data-optimized])');
    
    if (images.length === 0) return;

    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const dataSrc = img.getAttribute('data-src');
            
            if (dataSrc && !performanceRef.current.observedImages.has(img)) {
              img.src = dataSrc;
              img.removeAttribute('data-src');
              img.setAttribute('data-optimized', 'true');
              performanceRef.current.observedImages.add(img);
              imageObserver.unobserve(img);
            }
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    images.forEach(img => imageObserver.observe(img));
    performanceRef.current.observers.push(imageObserver);
  }, [enableImageOptimization]);

  // Route prefetching based on user behavior
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
      if (!performanceRef.current.prefetchedRoutes.has(route)) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        link.as = 'document';
        document.head.appendChild(link);
        performanceRef.current.prefetchedRoutes.add(route);
      }
    });
  }, [location.pathname, enablePrefetching]);

  // Bundle optimization and code splitting
  const optimizeBundles = useCallback(() => {
    if (!enableBundleSplitting) return;

    // Mark performance timing
    if ('performance' in window && 'mark' in performance) {
      performance.mark(`route-${location.pathname}-start`);
    }

    // Preload critical route modules
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
  }, [location.pathname, enableBundleSplitting]);

  // Memory cleanup
  const cleanupResources = useCallback(() => {
    // Clear observers
    performanceRef.current.observers.forEach(observer => observer.disconnect());
    performanceRef.current.observers = [];
    
    // Clear prefetch links after route change
    const prefetchLinks = document.querySelectorAll('link[rel="prefetch"]');
    prefetchLinks.forEach(link => {
      if (link.getAttribute('href') !== location.pathname) {
        link.remove();
      }
    });

    // Clear performance marks
    if ('performance' in window && 'clearMarks' in performance) {
      performance.clearMarks();
    }
  }, [location.pathname]);

  // Performance monitoring
  const monitorPerformance = useCallback(() => {
    if ('performance' in window && 'measure' in performance) {
      // Measure route change performance
      performance.mark(`route-${location.pathname}-end`);
      
      try {
        performance.measure(
          `route-${location.pathname}`,
          `route-${location.pathname}-start`,
          `route-${location.pathname}-end`
        );
      } catch (e) {
        // Marks might not exist, ignore
      }

      // Monitor memory usage
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
        
        if (memoryUsage > 50) {
          console.warn(`High memory usage detected: ${memoryUsage.toFixed(2)}MB`);
        }
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      optimizeImages();
      prefetchRoutes();
      optimizeBundles();
      monitorPerformance();
    }, prefetchDelay);

    return () => {
      clearTimeout(timeoutId);
      cleanupResources();
    };
  }, [location.pathname, optimizeImages, prefetchRoutes, optimizeBundles, monitorPerformance, cleanupResources, prefetchDelay]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      cleanupResources();
    };
  }, [cleanupResources]);

  return {
    optimizeImages,
    prefetchRoutes,
    optimizeBundles,
    monitorPerformance
  };
};
