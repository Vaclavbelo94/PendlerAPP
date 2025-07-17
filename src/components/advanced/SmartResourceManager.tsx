import React, { useEffect, useState, useCallback } from 'react';
import { useAdvancedPerformance } from '@/hooks/performance/useAdvancedPerformance';
import { logger } from '@/utils/logger';

interface ResourceMetrics {
  memoryUsage: number;
  cacheSize: number;
  networkRequests: number;
  componentCount: number;
}

interface SmartResourceManagerProps {
  maxMemoryThreshold?: number;
  maxCacheSize?: number;
  enableAutoCleanup?: boolean;
  cleanupInterval?: number;
}

export const SmartResourceManager: React.FC<SmartResourceManagerProps> = ({
  maxMemoryThreshold = 100 * 1024 * 1024, // 100MB
  maxCacheSize = 50,
  enableAutoCleanup = true,
  cleanupInterval = 60000 // 1 minute
}) => {
  const { measurePerformance, optimizedCache } = useAdvancedPerformance();
  const [metrics, setMetrics] = useState<ResourceMetrics>({
    memoryUsage: 0,
    cacheSize: 0,
    networkRequests: 0,
    componentCount: 0
  });
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Resource monitoring
  const updateMetrics = useCallback(async () => {
    try {
      const performanceMetrics = await measurePerformance();
      
      setMetrics({
        memoryUsage: performanceMetrics.memoryUsage,
        cacheSize: optimizedCache.size(),
        networkRequests: performance.getEntriesByType('resource').length,
        componentCount: performanceMetrics.componentCount
      });
    } catch (error) {
      logger.error('Failed to update resource metrics:', error);
    }
  }, [measurePerformance, optimizedCache]);

  // Smart cleanup operations
  const performSmartCleanup = useCallback(async () => {
    if (isOptimizing) return;
    
    setIsOptimizing(true);
    
    try {
      logger.info('Starting smart resource cleanup...');
      
      // Memory cleanup
      if (metrics.memoryUsage > maxMemoryThreshold) {
        logger.warn(`Memory threshold exceeded: ${(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB`);
        
        // Clear unused caches
        if (optimizedCache.size() > maxCacheSize) {
          optimizedCache.clear();
          logger.info('Cache cleared due to memory pressure');
        }
        
        // Remove unused DOM elements
        const unusedElements = document.querySelectorAll('[data-cleanup-eligible="true"]');
        unusedElements.forEach(element => element.remove());
        
        // Force garbage collection if available
        if ((window as any).gc) {
          (window as any).gc();
        }
      }
      
      // Network resource cleanup
      const resourceEntries = performance.getEntriesByType('resource');
      if (resourceEntries.length > 200) {
        // Clear old resource timing entries
        performance.clearResourceTimings();
        logger.info('Cleared old resource timing entries');
      }
      
      // Component cleanup
      const unusedComponents = document.querySelectorAll('[data-component-unused="true"]');
      unusedComponents.forEach(component => {
        component.remove();
      });
      
      // Image optimization
      optimizeImages();
      
      // Service worker cache cleanup
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'CLEANUP_CACHE'
        });
      }
      
      logger.info('Smart resource cleanup completed');
      
    } catch (error) {
      logger.error('Smart cleanup failed:', error);
    } finally {
      setIsOptimizing(false);
    }
  }, [isOptimizing, metrics.memoryUsage, maxMemoryThreshold, optimizedCache, maxCacheSize]);

  // Image optimization
  const optimizeImages = useCallback(() => {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
      // Add loading="lazy" if not present
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
      
      // Decode images asynchronously
      if ('decode' in img && img.complete) {
        img.decode().catch(() => {}); // Ignore decode errors
      }
    });
  }, []);

  // Intelligent preloading
  const intelligentPreload = useCallback(() => {
    // Preload critical resources based on user behavior
    const criticalRoutes = ['/shifts', '/vehicles', '/calculations'];
    
    criticalRoutes.forEach(route => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = route;
      document.head.appendChild(link);
    });
    
    // Preload critical images
    const criticalImages = document.querySelectorAll('[data-critical-image]');
    criticalImages.forEach(img => {
      if (img instanceof HTMLImageElement && !img.complete) {
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'image';
        preloadLink.href = img.src;
        document.head.appendChild(preloadLink);
      }
    });
  }, []);

  // Resource monitoring interval
  useEffect(() => {
    const interval = setInterval(updateMetrics, 10000); // Update every 10 seconds
    updateMetrics(); // Initial update
    
    return () => clearInterval(interval);
  }, [updateMetrics]);

  // Auto cleanup interval
  useEffect(() => {
    if (!enableAutoCleanup) return;
    
    const interval = setInterval(() => {
      if (metrics.memoryUsage > maxMemoryThreshold * 0.8) { // Cleanup at 80% threshold
        performSmartCleanup();
      }
    }, cleanupInterval);
    
    return () => clearInterval(interval);
  }, [enableAutoCleanup, metrics.memoryUsage, maxMemoryThreshold, performSmartCleanup, cleanupInterval]);

  // Intelligent preloading on idle
  useEffect(() => {
    const schedulePreload = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(intelligentPreload);
      } else {
        setTimeout(intelligentPreload, 2000);
      }
    };
    
    schedulePreload();
  }, [intelligentPreload]);

  // Visibility change optimization
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, reduce resource usage
        logger.info('Page hidden, reducing resource usage');
        performSmartCleanup();
      } else {
        // Page is visible, resume normal operation
        logger.info('Page visible, resuming normal operation');
        updateMetrics();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [performSmartCleanup, updateMetrics]);

  // Return resource metrics for debugging
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="fixed top-4 left-4 bg-card border rounded-lg p-3 text-xs space-y-1 z-50 opacity-80">
        <div>Paměť: {(metrics.memoryUsage / 1024 / 1024).toFixed(1)}MB</div>
        <div>Cache: {metrics.cacheSize}/{maxCacheSize}</div>
        <div>Síť: {metrics.networkRequests}</div>
        <div>Komponenty: {metrics.componentCount}</div>
        {isOptimizing && <div className="text-primary">🔧 Optimalizace...</div>}
      </div>
    );
  }
  
  return null;
};