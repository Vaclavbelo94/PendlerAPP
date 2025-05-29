
import { useState, useCallback, useEffect } from 'react';
import { advancedErrorHandler, CategorizedError, ErrorContext } from '@/services/AdvancedErrorHandlingService';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';

export const useAdvancedErrorHandling = () => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [errorStats, setErrorStats] = useState<any>(null);
  const { error: showError, info: showInfo, success: showSuccess } = useStandardizedToast();

  // Execute operation with advanced retry logic
  const executeWithRetry = useCallback(async <T>(
    operation: () => Promise<T>,
    context: ErrorContext,
    showToasts = true
  ): Promise<T> => {
    setIsRetrying(true);
    
    try {
      const result = await advancedErrorHandler.executeWithRetry(operation, context);
      
      if (showToasts && context.retryCount > 0) {
        showSuccess(
          'Operace úspěšná', 
          `Operace byla dokončena po ${context.retryCount + 1} pokusech`
        );
      }
      
      return result;
    } catch (categorizedError: any) {
      if (showToasts) {
        showError('Chyba operace', categorizedError.userMessage);
      }
      throw categorizedError;
    } finally {
      setIsRetrying(false);
    }
  }, [showError, showInfo, showSuccess]);

  // Handle error with categorization
  const handleError = useCallback((error: any, context: ErrorContext): CategorizedError => {
    const categorizedError = advancedErrorHandler.categorizeError(error, context);
    
    // Show appropriate user message based on severity
    if (categorizedError.severity === 'critical') {
      showError('Kritická chyba', categorizedError.userMessage);
    } else if (categorizedError.severity === 'high') {
      showError('Vážná chyba', categorizedError.userMessage);
    } else if (categorizedError.retryable) {
      showInfo('Dočasná chyba', categorizedError.userMessage);
    } else {
      showError('Chyba', categorizedError.userMessage);
    }

    return categorizedError;
  }, [showError, showInfo]);

  // Queue failed operation for retry
  const queueForRetry = useCallback((operationType: string, operation: Function) => {
    advancedErrorHandler.queueFailedOperation(operationType, operation);
    showInfo('Operace zařazena', 'Operace bude zopakována, až bude připojení obnoveno');
  }, [showInfo]);

  // Process retry queue
  const processRetryQueue = useCallback(async (operationType: string) => {
    try {
      await advancedErrorHandler.processRetryQueue(operationType);
      showSuccess('Fronty zpracovány', 'Všechny čekající operace byly zpracovány');
    } catch (error) {
      showError('Chyba při zpracování', 'Některé operace se nepodařilo dokončit');
    }
  }, [showSuccess, showError]);

  // Update error statistics
  const updateErrorStats = useCallback(() => {
    const stats = advancedErrorHandler.getErrorStatistics();
    setErrorStats(stats);
  }, []);

  // Clear old errors
  const clearOldErrors = useCallback((hours: number = 24) => {
    advancedErrorHandler.clearOldErrors(hours);
    updateErrorStats();
    showSuccess('Historie vyčištěna', `Chyby starší než ${hours} hodin byly odstraněny`);
  }, [updateErrorStats, showSuccess]);

  // Update stats periodically
  useEffect(() => {
    updateErrorStats();
    const interval = setInterval(updateErrorStats, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, [updateErrorStats]);

  return {
    isRetrying,
    errorStats,
    executeWithRetry,
    handleError,
    queueForRetry,
    processRetryQueue,
    updateErrorStats,
    clearOldErrors
  };
};
