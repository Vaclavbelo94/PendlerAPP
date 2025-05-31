
import { useState, useCallback } from 'react';
import { useStandardizedToast } from './useStandardizedToast';

interface UseAsyncOperationOptions<T> {
  onSuccess?: (result: T) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
}

export const useAsyncOperation = <T = any>(options: UseAsyncOperationOptions<T> = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { success, error: showError } = useStandardizedToast();

  const execute = useCallback(async (operation: () => Promise<T>): Promise<T | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await operation();
      
      if (options.successMessage) {
        success('Úspěch', options.successMessage);
      }
      
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Neznámá chyba');
      setError(error);
      
      if (options.errorMessage) {
        showError('Chyba', options.errorMessage);
      }
      
      options.onError?.(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [options, success, showError]);

  const reset = useCallback(() => {
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    execute,
    isLoading,
    error,
    reset
  };
};
