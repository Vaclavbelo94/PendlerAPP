import { useEffect, useRef, useCallback } from 'react';
import { performanceMonitor } from '@/utils/performanceMonitor';
import { safeLocalStorageSet, checkLocalStorageSpace, cleanupAuthState } from '@/utils/authUtils';

interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  memoryUsage?: number;
  connectionType?: string;
}

interface PerformanceMonitoringConfig {
  enableRealTimeTracking?: boolean;
  trackUserInteractions?: boolean;
  trackMemoryUsage?: boolean;
  reportingInterval?: number;
}

export const usePerformanceMonitoring = (config: PerformanceMonitoringConfig = {}) => {
  const {
    enableRealTimeTracking = true,
    trackUserInteractions = true,
    trackMemoryUsage = true,
    reportingInterval = 30000
  } = config;

  const metricsRef = useRef<PerformanceMetrics>({
    pageLoadTime: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    cumulativeLayoutShift: 0,
    firstInputDelay: 0
  });

  const reportMetrics = useCallback((metrics: PerformanceMetrics) => {
    // Report to analytics service (could be integrated with Google Analytics, etc.)
    console.log('Performance Metrics:', metrics);
    
    // Check storage space before attempting to store
    if (checkLocalStorageSpace() < 1024) {
      console.warn('Low localStorage space, skipping performance metrics storage');
      return;
    }
    
    // Store in localStorage for admin panel with safe storage
    try {
      const existingMetrics = JSON.parse(localStorage.getItem('performanceMetrics') || '[]');
      existingMetrics.push({
        ...metrics,
        timestamp: Date.now(),
        url: window.location.pathname
      });
      
      // Keep only last 50 entries (reduced from 100)
      if (existingMetrics.length > 50) {
        existingMetrics.splice(0, existingMetrics.length - 50);
      }
      
      const success = safeLocalStorageSet('performanceMetrics', JSON.stringify(existingMetrics));
      if (!success) {
        console.warn('Failed to store performance metrics, localStorage may be full');
      }
    } catch (error) {
      console.warn('Error processing performance metrics:', error);
    }
  }, []);

  const collectWebVitals = useCallback(() => {
    if (!('performance' in window)) return;

    // Get navigation timing
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      metricsRef.current.pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
    }

    // Get paint timing
    const paintEntries = performance.getEntriesByType('paint');
    paintEntries.forEach((entry) => {
      if (entry.name === 'first-contentful-paint') {
        metricsRef.current.firstContentfulPaint = entry.startTime;
      }
    });

    // Memory usage (if available)
    if (trackMemoryUsage && 'memory' in performance) {
      const memoryInfo = (performance as any).memory;
      metricsRef.current.memoryUsage = Math.round(memoryInfo.usedJSHeapSize / 1024 / 1024);
    }

    // Connection type
    if ('connection' in navigator) {
      metricsRef.current.connectionType = (navigator as any).connection.effectiveType;
    }

    reportMetrics(metricsRef.current);
  }, [trackMemoryUsage, reportMetrics]);

  const trackUserInteraction = useCallback((event: Event) => {
    if (!trackUserInteractions) return;
    
    const interactionTime = performance.now();
    performanceMonitor.trackUserInteraction(event.type, (event.target as HTMLElement)?.tagName || 'unknown');
  }, [trackUserInteractions]);

  useEffect(() => {
    if (!enableRealTimeTracking) return;

    // Collect initial metrics after page load
    if (document.readyState === 'complete') {
      setTimeout(collectWebVitals, 1000);
    } else {
      window.addEventListener('load', () => {
        setTimeout(collectWebVitals, 1000);
      });
    }

    // Set up periodic monitoring
    const intervalId = setInterval(collectWebVitals, reportingInterval);

    // Track user interactions
    if (trackUserInteractions) {
      ['click', 'scroll', 'keydown'].forEach(eventType => {
        document.addEventListener(eventType, trackUserInteraction, { passive: true });
      });
    }

    return () => {
      clearInterval(intervalId);
      if (trackUserInteractions) {
        ['click', 'scroll', 'keydown'].forEach(eventType => {
          document.removeEventListener(eventType, trackUserInteraction);
        });
      }
    };
  }, [enableRealTimeTracking, reportingInterval, collectWebVitals, trackUserInteraction, trackUserInteractions]);

  return {
    metrics: metricsRef.current,
    collectMetrics: collectWebVitals
  };
};
