
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useBundleOptimization } from '@/hooks/useBundleOptimization';

interface RouteOptimizerProps {
  children: React.ReactNode;
}

export const RouteOptimizer: React.FC<RouteOptimizerProps> = ({ children }) => {
  const location = useLocation();
  const [isRouteReady, setIsRouteReady] = useState(false);
  
  // Use bundle optimization hook
  useBundleOptimization({
    enableCodeSplitting: true,
    enablePrefetching: true,
    prefetchDelay: 1500
  });

  useEffect(() => {
    // Mark route as ready after a small delay
    const timer = setTimeout(() => {
      setIsRouteReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Add route-specific optimizations
  useEffect(() => {
    if (isRouteReady) {
      // Performance mark for route loading
      if ('performance' in window && 'mark' in performance) {
        performance.mark(`route-${location.pathname}-ready`);
      }
    }
  }, [isRouteReady, location.pathname]);

  return (
    <div className="route-optimizer">
      {children}
    </div>
  );
};
