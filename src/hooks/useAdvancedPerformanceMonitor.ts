
import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  memoryUsage?: number;
  renderTime: number;
  rerenderCount: number;
  componentName: string;
}

interface PerformanceConfig {
  enabled?: boolean;
  memoryThreshold?: number;
  renderTimeThreshold?: number;
  logToConsole?: boolean;
}

export const useAdvancedPerformanceMonitor = (
  componentName: string,
  config: PerformanceConfig = {}
) => {
  const {
    enabled = true,
    memoryThreshold = 50,
    renderTimeThreshold = 16,
    logToConsole = false
  } = config;

  const renderStartTime = useRef<number>(0);
  const renderCount = useRef<number>(0);
  const lastMemoryCheck = useRef<number>(0);

  const startRender = useCallback(() => {
    if (!enabled) return;
    renderStartTime.current = performance.now();
    renderCount.current += 1;
  }, [enabled]);

  const endRender = useCallback(() => {
    if (!enabled || renderStartTime.current === 0) return;
    
    const renderTime = performance.now() - renderStartTime.current;
    const metrics: PerformanceMetrics = {
      renderTime,
      rerenderCount: renderCount.current,
      componentName
    };

    // Check memory usage (if available)
    if ('memory' in performance) {
      const memoryInfo = (performance as any).memory;
      const memoryUsage = memoryInfo.usedJSHeapSize / 1024 / 1024; // MB
      metrics.memoryUsage = memoryUsage;

      if (memoryUsage > memoryThreshold && 
          Date.now() - lastMemoryCheck.current > 5000) {
        console.warn(`High memory usage in ${componentName}: ${memoryUsage.toFixed(2)}MB`);
        lastMemoryCheck.current = Date.now();
      }
    }

    // Log slow renders
    if (renderTime > renderTimeThreshold) {
      console.warn(`Slow render in ${componentName}: ${renderTime.toFixed(2)}ms`);
    }

    if (logToConsole) {
      console.log(`Performance metrics for ${componentName}:`, metrics);
    }

    renderStartTime.current = 0;
  }, [enabled, componentName, memoryThreshold, renderTimeThreshold, logToConsole]);

  useEffect(() => {
    startRender();
    return endRender;
  });

  const measureAsync = useCallback(async <T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> => {
    if (!enabled) return operation();

    const start = performance.now();
    try {
      const result = await operation();
      const duration = performance.now() - start;
      
      if (logToConsole) {
        console.log(`${componentName} - ${operationName}: ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`${componentName} - ${operationName} failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  }, [enabled, componentName, logToConsole]);

  return {
    measureAsync,
    renderCount: renderCount.current
  };
};
