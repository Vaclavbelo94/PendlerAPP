
// Performance monitoring utilities for tracking page load times and component performance
export const performanceMonitor = {
  // Track page load times
  trackPageLoad: (pageName: string) => {
    const startTime = performance.now();
    
    return {
      finish: () => {
        const endTime = performance.now();
        const loadTime = endTime - startTime;
        
        console.log(`[PERFORMANCE] ${pageName} loaded in ${loadTime.toFixed(2)}ms`);
        
        // Log slow pages
        if (loadTime > 1000) {
          console.warn(`[PERFORMANCE] Slow page detected: ${pageName} took ${loadTime.toFixed(2)}ms`);
        }
        
        return loadTime;
      }
    };
  },

  // Track component render times
  trackComponentRender: (componentName: string) => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > 100) {
        console.warn(`[PERFORMANCE] Slow component render: ${componentName} took ${renderTime.toFixed(2)}ms`);
      }
      
      return renderTime;
    };
  },

  // Track memory usage
  checkMemoryUsage: () => {
    if (typeof window !== 'undefined' && 'performance' in window && (performance as any).memory) {
      const memory = (performance as any).memory;
      const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
      const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024);
      
      console.log(`[PERFORMANCE] Memory usage: ${usedMB}MB / ${totalMB}MB`);
      
      if (usedMB > 100) {
        console.warn(`[PERFORMANCE] High memory usage detected: ${usedMB}MB`);
      }
      
      return { used: usedMB, total: totalMB };
    }
    return null;
  },

  // Track user interactions
  trackUserInteraction: (action: string, element: string) => {
    const timestamp = Date.now();
    console.log(`[PERFORMANCE] User interaction: ${action} on ${element} at ${timestamp}`);
  },

  // Add the missing destroy method
  destroy: () => {
    console.log(`[PERFORMANCE] Performance monitor destroyed`);
    // Clean up any performance observers or timers if needed
    try {
      if ('performance' in window && 'clearMarks' in performance) {
        performance.clearMarks();
        performance.clearMeasures();
      }
    } catch (error) {
      console.warn('[PERFORMANCE] Error during cleanup:', error);
    }
  }
};
