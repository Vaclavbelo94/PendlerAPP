
import React, { useEffect } from 'react';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';
import { useBundleOptimization } from '@/hooks/useBundleOptimization';
import { DatabaseOptimizer } from './DatabaseOptimizer';
import { RouteOptimizer } from './RouteOptimizer';

interface GlobalPerformanceProviderProps {
  children: React.ReactNode;
}

export const GlobalPerformanceProvider: React.FC<GlobalPerformanceProviderProps> = ({ children }) => {
  // Zapnout všechny performance optimalizace
  usePerformanceOptimization();
  
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
      <RouteOptimizer>
        {children}
      </RouteOptimizer>
    </>
  );
};
