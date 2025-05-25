
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export interface SyncError {
  id: string;
  message: string;
  type: 'network' | 'validation' | 'server' | 'timeout' | 'unknown';
  timestamp: Date;
  retryCount: number;
  entityType?: string;
  entityId?: string;
  originalError?: any;
}

export const useSyncErrorHandler = () => {
  const [errors, setErrors] = useState<SyncError[]>([]);

  // Add new error
  const addError = useCallback((
    message: string,
    type: SyncError['type'] = 'unknown',
    entityType?: string,
    entityId?: string,
    originalError?: any
  ) => {
    const error: SyncError = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      message,
      type,
      timestamp: new Date(),
      retryCount: 0,
      entityType,
      entityId,
      originalError
    };

    setErrors(prev => [error, ...prev.slice(0, 19)]); // Keep only last 20 errors

    // Show toast for critical errors
    if (type === 'server' || type === 'validation') {
      toast({
        title: "Chyba synchronizace",
        description: message,
        variant: "destructive"
      });
    }

    return error.id;
  }, []);

  // Retry specific error
  const retryError = useCallback((errorId: string) => {
    setErrors(prev => prev.map(error => 
      error.id === errorId 
        ? { ...error, retryCount: error.retryCount + 1, timestamp: new Date() }
        : error
    ));
  }, []);

  // Dismiss error
  const dismissError = useCallback((errorId: string) => {
    setErrors(prev => prev.filter(error => error.id !== errorId));
  }, []);

  // Clear all errors
  const clearAllErrors = useCallback(() => {
    setErrors([]);
  }, []);

  // Clear errors by type
  const clearErrorsByType = useCallback((type: SyncError['type']) => {
    setErrors(prev => prev.filter(error => error.type !== type));
  }, []);

  // Clear old errors (older than 1 hour)
  const clearOldErrors = useCallback(() => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    setErrors(prev => prev.filter(error => error.timestamp > oneHourAgo));
  }, []);

  // Get errors by entity
  const getErrorsByEntity = useCallback((entityType: string, entityId?: string) => {
    return errors.filter(error => 
      error.entityType === entityType && 
      (!entityId || error.entityId === entityId)
    );
  }, [errors]);

  // Classify error from exception
  const classifyError = useCallback((error: any): SyncError['type'] => {
    if (!error) return 'unknown';

    const message = error.message?.toLowerCase() || '';
    
    if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
      return 'network';
    }
    
    if (message.includes('timeout') || message.includes('timed out')) {
      return 'timeout';
    }
    
    if (error.status >= 400 && error.status < 500) {
      return 'validation';
    }
    
    if (error.status >= 500) {
      return 'server';
    }
    
    return 'unknown';
  }, []);

  // Add error from exception
  const addErrorFromException = useCallback((
    error: any,
    entityType?: string,
    entityId?: string,
    customMessage?: string
  ) => {
    const type = classifyError(error);
    const message = customMessage || error.message || 'Neznámá chyba při synchronizaci';
    
    return addError(message, type, entityType, entityId, error);
  }, [addError, classifyError]);

  // Get active errors (not dismissed, less than 3 retries)
  const activeErrors = errors.filter(error => error.retryCount < 3);

  // Get error statistics
  const errorStats = {
    total: errors.length,
    active: activeErrors.length,
    byType: errors.reduce((acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1;
      return acc;
    }, {} as Record<SyncError['type'], number>)
  };

  return {
    errors,
    activeErrors,
    errorStats,
    addError,
    addErrorFromException,
    retryError,
    dismissError,
    clearAllErrors,
    clearErrorsByType,
    clearOldErrors,
    getErrorsByEntity,
    classifyError
  };
};

export default useSyncErrorHandler;
