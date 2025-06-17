
import React, { Suspense, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';
import { performanceTracker } from '@/utils/performanceOptimizer';
import SimpleLoadingSpinner from '@/components/loading/SimpleLoadingSpinner';

interface ModernLayoutProps {
  children: React.ReactNode;
}

export const ModernLayout: React.FC<ModernLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  usePerformanceMonitoring({
    enableRealTimeTracking: true,
    trackUserInteractions: true,
    trackMemoryUsage: true,
    reportingInterval: 60000 // 1 minuta
  });

  // Track route changes
  useEffect(() => {
    const routeName = location.pathname;
    const tracker = performanceTracker.trackPageLoad(routeName);
    
    // Mark route as ready after render
    const timer = setTimeout(() => {
      tracker.finish();
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Suspense fallback={<SimpleLoadingSpinner />}>
        {children}
      </Suspense>
    </div>
  );
};
