
import React, { createContext, useContext } from 'react';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';
import { useErrorTracking } from '@/hooks/useErrorTracking';
import { useUserAnalytics } from '@/hooks/useUserAnalytics';

interface AnalyticsContextType {
  trackEvent: (event: string, properties?: Record<string, any>) => void;
  trackPageView: (path?: string) => void;
  reportError: (error: Error, errorInfo?: any) => void;
  sessionId?: string;
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

interface AnalyticsProviderProps {
  children: React.ReactNode;
  config?: {
    enablePerformanceMonitoring?: boolean;
    enableErrorTracking?: boolean;
    enableUserAnalytics?: boolean;
  };
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ 
  children, 
  config = {} 
}) => {
  const {
    enablePerformanceMonitoring = true,
    enableErrorTracking = true,
    enableUserAnalytics = true
  } = config;

  // Initialize monitoring hooks
  usePerformanceMonitoring('AnalyticsProvider');

  const { reportError } = useErrorTracking({
    enableGlobalErrorHandling: enableErrorTracking,
    enableUnhandledRejectionTracking: enableErrorTracking
  });

  const { trackEvent, trackPageView, sessionId } = useUserAnalytics();

  const contextValue: AnalyticsContextType = {
    trackEvent: enableUserAnalytics ? trackEvent : () => {},
    trackPageView: enableUserAnalytics ? trackPageView : () => {},
    reportError: enableErrorTracking ? reportError : () => {},
    sessionId
  };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};
