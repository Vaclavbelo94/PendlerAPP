import { useEffect, useCallback } from 'react';
import { errorHandler } from '@/utils/errorHandler';

interface ErrorReport {
  message: string;
  stack?: string;
  componentStack?: string;
  url: string;
  userAgent: string;
  timestamp: number;
  userId?: string;
  errorBoundary?: boolean;
}

interface ErrorTrackingConfig {
  enableGlobalErrorHandling?: boolean;
  enableUnhandledRejectionTracking?: boolean;
  enableReactErrorBoundaries?: boolean;
  maxErrorReports?: number;
}

export const useErrorTracking = (config: ErrorTrackingConfig = {}) => {
  const {
    enableGlobalErrorHandling = true,
    enableUnhandledRejectionTracking = true,
    enableReactErrorBoundaries = true,
    maxErrorReports = 50
  } = config;

  const reportError = useCallback((error: Error, errorInfo?: any) => {
    const errorReport: ErrorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      errorBoundary: !!errorInfo
    };

    // Store error locally for admin panel
    const existingErrors = JSON.parse(localStorage.getItem('errorReports') || '[]');
    existingErrors.unshift(errorReport);
    
    // Keep only the most recent errors
    if (existingErrors.length > maxErrorReports) {
      existingErrors.splice(maxErrorReports);
    }
    
    localStorage.setItem('errorReports', JSON.stringify(existingErrors));

    // Check for security-related errors
    if (error.message.includes('RLS') || 
        error.message.includes('permission') || 
        error.message.includes('unauthorized') ||
        error.message.includes('Invalid') ||
        error.message.includes('SQL injection')) {
      
      // Log security incidents separately
      const securityIncident = {
        ...errorReport,
        severity: 'HIGH',
        type: 'SECURITY_INCIDENT'
      };
      
      const securityLogs = JSON.parse(localStorage.getItem('securityIncidents') || '[]');
      securityLogs.unshift(securityIncident);
      
      if (securityLogs.length > 20) {
        securityLogs.splice(20);
      }
      
      localStorage.setItem('securityIncidents', JSON.stringify(securityLogs));
      
      console.error('🚨 SECURITY INCIDENT DETECTED:', securityIncident);
    }

    // Use existing error handler
    errorHandler.handleError(error);

    // Log for development
    console.error('Error tracked:', errorReport);
  }, [maxErrorReports]);

  useEffect(() => {
    if (!enableGlobalErrorHandling) return;

    const handleGlobalError = (event: ErrorEvent) => {
      reportError(new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    };

    window.addEventListener('error', handleGlobalError);

    return () => {
      window.removeEventListener('error', handleGlobalError);
    };
  }, [enableGlobalErrorHandling, reportError]);

  useEffect(() => {
    if (!enableUnhandledRejectionTracking) return;

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
      reportError(error, { type: 'unhandledRejection' });
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [enableUnhandledRejectionTracking, reportError]);

  return {
    reportError
  };
};
