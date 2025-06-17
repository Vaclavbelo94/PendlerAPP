import { lazy } from 'react';

// Lazy loading utilities
export const createLazyComponent = (importFn: () => Promise<any>) => {
  return lazy(importFn);
};

// Bundle splitting for feature modules - using existing pages
export const LazyShiftsModule = createLazyComponent(() => import('@/pages/Shifts'));
export const LazyVehicleModule = createLazyComponent(() => import('@/pages/Vehicle'));
export const LazySettingsModule = createLazyComponent(() => import('@/pages/Settings'));

// Performance monitoring utilities
class PerformanceTracker {
  private metrics: Map<string, number> = new Map();
  
  startTiming(label: string): void {
    this.metrics.set(label, performance.now());
  }
  
  endTiming(label: string): number | null {
    const startTime = this.metrics.get(label);
    if (!startTime) return null;
    
    const duration = performance.now() - startTime;
    this.metrics.delete(label);
    
    // Log slow operations
    if (duration > 100) {
      console.warn(`Slow operation detected: ${label} took ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }

  trackPageLoad(routeName: string): { finish: () => void } {
    const startTime = performance.now();
    
    return {
      finish: () => {
        const duration = performance.now() - startTime;
        console.log(`Page load for ${routeName}: ${duration.toFixed(2)}ms`);
        
        // Store metric for analytics
        if (typeof window !== 'undefined') {
          try {
            const metrics = JSON.parse(localStorage.getItem('pageLoadMetrics') || '[]');
            metrics.push({
              route: routeName,
              duration: Math.round(duration),
              timestamp: Date.now()
            });
            
            // Keep only last 50 entries
            if (metrics.length > 50) {
              metrics.splice(0, metrics.length - 50);
            }
            
            localStorage.setItem('pageLoadMetrics', JSON.stringify(metrics));
          } catch (error) {
            console.warn('Failed to store page load metrics:', error);
          }
        }
      }
    };
  }
  
  measureRender<T extends (...args: any[]) => any>(
    fn: T,
    componentName: string
  ): T {
    return ((...args: any[]) => {
      this.startTiming(`render-${componentName}`);
      const result = fn(...args);
      this.endTiming(`render-${componentName}`);
      return result;
    }) as T;
  }
}

export const performanceTracker = new PerformanceTracker();

// Memory leak detection
export const detectMemoryLeaks = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const usedJSHeapSize = (performance as any).memory?.usedJSHeapSize;
    if (usedJSHeapSize > 50 * 1024 * 1024) { // 50MB threshold
      console.warn('High memory usage detected:', usedJSHeapSize);
    }
  }
};

// Image optimization
export const optimizeImage = (src: string, width?: number, height?: number): string => {
  if (!src) return '';
  
  // For production, you might integrate with a service like Cloudinary
  const params = new URLSearchParams();
  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  
  return params.toString() ? `${src}?${params.toString()}` : src;
};
