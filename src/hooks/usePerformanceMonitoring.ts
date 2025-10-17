import { useEffect } from 'react';
import { performanceMonitor } from '@/utils/performanceMonitor';
import { memoryManager } from '@/utils/memoryManager';

/**
 * Hook for performance monitoring
 */
export const usePerformanceMonitoring = (componentName?: string) => {
  useEffect(() => {
    if (!componentName) return;

    const startTime = performance.now();

    return () => {
      const renderTime = performance.now() - startTime;
      if (renderTime > 16) {
        console.warn(`${componentName} total time: ${renderTime.toFixed(2)}ms`);
      }
    };
  }, [componentName]);

  useEffect(() => {
    // Log metrics once on mount
    const timeout = setTimeout(() => {
      if (process.env.NODE_ENV === 'development') {
        performanceMonitor.logMetrics();
        memoryManager.logMemoryStatus();
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);
};
