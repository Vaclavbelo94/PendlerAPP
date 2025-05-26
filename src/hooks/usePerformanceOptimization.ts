
import { useEffect, useRef } from 'react';

export const usePerformanceOptimization = () => {
  const performanceRef = useRef<boolean>(false);

  useEffect(() => {
    // Spustit performance optimalizace jen jednou
    if (performanceRef.current) return;
    performanceRef.current = true;

    // Throttled performance monitoring
    let lastCheck = 0;
    const PERFORMANCE_CHECK_INTERVAL = 30000; // 30 sekund místo častějších kontrol

    const checkPerformance = () => {
      const now = Date.now();
      if (now - lastCheck < PERFORMANCE_CHECK_INTERVAL) return;
      lastCheck = now;

      // Lightweight performance check
      if (typeof window !== 'undefined' && 'performance' in window) {
        const memory = (performance as any).memory;
        if (memory && memory.usedJSHeapSize > 100 * 1024 * 1024) {
          console.warn('High memory usage detected');
        }
      }
    };

    // Passive event listeners pro lepší výkon
    const throttledCheck = () => {
      requestIdleCallback ? requestIdleCallback(checkPerformance) : setTimeout(checkPerformance, 0);
    };

    // Menší frekvence kontrol
    const intervalId = setInterval(throttledCheck, PERFORMANCE_CHECK_INTERVAL);

    return () => {
      clearInterval(intervalId);
    };
  }, []);
};
