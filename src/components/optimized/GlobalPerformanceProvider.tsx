
import React, { useEffect } from 'react';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';
import { useBundleOptimization } from '@/hooks/useBundleOptimization';
import { useAdvancedPerformance } from '@/hooks/performance/useAdvancedPerformance';
import { DatabaseOptimizer } from './DatabaseOptimizer';
import { RouteOptimizer } from './RouteOptimizer';
import { IntelligentOfflineSync } from '../advanced/IntelligentOfflineSync';
import { SmartResourceManager } from '../advanced/SmartResourceManager';

interface GlobalPerformanceProviderProps {
  children: React.ReactNode;
}

export const GlobalPerformanceProvider: React.FC<GlobalPerformanceProviderProps> = ({ children }) => {
  // Advanced performance optimizations
  usePerformanceOptimization();
  useAdvancedPerformance({
    enableRenderOptimization: true,
    enableMemoryMonitoring: true,
    enableNetworkOptimization: true,
    performanceThreshold: 100
  });
  
  useBundleOptimization({
    enableCodeSplitting: true,
    enablePrefetching: true,
    prefetchDelay: 1500,
    enablePreloading: true
  });

  // Error boundary pro performance monitoring
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('[PERFORMANCE] Global error caught:', event.error);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('[PERFORMANCE] Unhandled promise rejection:', event.reason);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <>
      <DatabaseOptimizer />
      <SmartResourceManager />
      <IntelligentOfflineSync 
        enableIntelligentBatching={true}
        enablePriorityQueue={true}
        strategy={{
          priority: 'high',
          retryCount: 3,
          retryDelay: 1000,
          batchSize: 10
        }}
      />
      <RouteOptimizer>
        {children}
      </RouteOptimizer>
    </>
  );
};
