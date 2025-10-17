import { useEffect } from 'react';
import { memoryManager } from '@/utils/memoryManager';
import { performanceMonitor } from '@/utils/performanceMonitor';

/**
 * Global performance optimizer component
 * Monitors and optimizes app performance automatically
 */
export const PerformanceOptimizer = () => {
  useEffect(() => {
    // Initial performance check
    const timeout = setTimeout(() => {
      if (process.env.NODE_ENV === 'development') {
        console.log('=== Performance Metrics ===');
        performanceMonitor.logMetrics();
        memoryManager.logMemoryStatus();
      }
    }, 3000);

    // Cleanup on unmount
    return () => {
      clearTimeout(timeout);
      memoryManager.stopMonitoring();
      performanceMonitor.clearObservers();
    };
  }, []);

  return null;
};
