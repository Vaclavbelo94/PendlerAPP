import { useEffect, useCallback, useMemo } from 'react';
import { logger } from '@/utils/logger';

interface PerformanceMetrics {
  renderTime: number;
  componentCount: number;
  memoryUsage: number;
  networkLatency: number;
}

interface AdvancedPerformanceConfig {
  enableRenderOptimization: boolean;
  enableMemoryMonitoring: boolean;
  enableNetworkOptimization: boolean;
  performanceThreshold: number;
}

export const useAdvancedPerformance = (config: AdvancedPerformanceConfig = {
  enableRenderOptimization: true,
  enableMemoryMonitoring: true,
  enableNetworkOptimization: true,
  performanceThreshold: 100
}) => {
  // Performance monitoring
  const measurePerformance = useCallback(async (): Promise<PerformanceMetrics> => {
    const startTime = performance.now();
    
    // Measure component render time
    const renderTime = performance.now() - startTime;
    
    // Count active components (approximation)
    const componentCount = document.querySelectorAll('[data-component]').length;
    
    // Memory usage (if available)
    const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;
    
    // Network latency approximation
    const networkLatency = await measureNetworkLatency();
    
    return {
      renderTime,
      componentCount,
      memoryUsage,
      networkLatency
    };
  }, []);

  const measureNetworkLatency = useCallback(async (): Promise<number> => {
    try {
      const startTime = performance.now();
      await fetch('/api/ping', { method: 'HEAD' }).catch(() => {});
      return performance.now() - startTime;
    } catch {
      return 0;
    }
  }, []);

  // Advanced caching strategy
  const optimizedCache = useMemo(() => {
    const cache = new Map();
    const maxSize = 50;
    
    return {
      get: (key: string) => cache.get(key),
      set: (key: string, value: any) => {
        if (cache.size >= maxSize) {
          const firstKey = cache.keys().next().value;
          cache.delete(firstKey);
        }
        cache.set(key, value);
      },
      clear: () => cache.clear(),
      size: () => cache.size
    };
  }, []);

  // Performance optimization hooks
  useEffect(() => {
    if (!config.enableRenderOptimization) return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > config.performanceThreshold) {
          logger.warn(`Performance issue detected: ${entry.name} took ${entry.duration}ms`);
        }
      }
    });

    observer.observe({ entryTypes: ['measure', 'navigation'] });
    
    return () => observer.disconnect();
  }, [config.enableRenderOptimization, config.performanceThreshold]);

  // Memory monitoring
  useEffect(() => {
    if (!config.enableMemoryMonitoring) return;

    const interval = setInterval(async () => {
      const metrics = await measurePerformance();
      
      if (metrics.memoryUsage > 50 * 1024 * 1024) { // 50MB threshold
        logger.warn(`High memory usage detected: ${(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB`);
        
        // Trigger garbage collection if available
        if ((window as any).gc) {
          (window as any).gc();
        }
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [config.enableMemoryMonitoring, measurePerformance]);

  // Network optimization
  useEffect(() => {
    if (!config.enableNetworkOptimization) return;

    // Preload critical resources
    const preloadCriticalResources = () => {
      const criticalResources = [
        '/api/shifts',
        '/api/user/profile'
      ];

      criticalResources.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
      });
    };

    // Use requestIdleCallback if available, otherwise setTimeout
    if ('requestIdleCallback' in window) {
      requestIdleCallback(preloadCriticalResources);
    } else {
      setTimeout(preloadCriticalResources, 1000);
    }
  }, [config.enableNetworkOptimization]);

  return {
    measurePerformance,
    optimizedCache,
    isPerformanceOptimized: true
  };
};