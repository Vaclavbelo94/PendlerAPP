
import { useState, useCallback } from 'react';

interface LoadingState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

interface LoadingOptions {
  successMessage?: string;
  errorMessage?: string;
  timeout?: number;
}

/**
 * Standardizovaný hook pro loading states
 */
export const useStandardLoading = (initialLoading = false) => {
  const [state, setState] = useState<LoadingState>({
    isLoading: initialLoading,
    error: null,
    success: false
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({
      ...prev,
      isLoading: loading,
      error: loading ? null : prev.error,
      success: loading ? false : prev.success
    }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({
      ...prev,
      error,
      isLoading: false,
      success: false
    }));
  }, []);

  const setSuccess = useCallback((success = true) => {
    setState(prev => ({
      ...prev,
      success,
      isLoading: false,
      error: null
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      success: false
    });
  }, []);

  const executeAsync = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    options: LoadingOptions = {}
  ): Promise<T | null> => {
    setLoading(true);
    
    try {
      const result = await asyncFn();
      setSuccess();
      return result;
    } catch (error: any) {
      const errorMsg = options.errorMessage || error?.message || 'Nastala chyba';
      setError(errorMsg);
      return null;
    }
  }, [setLoading, setSuccess, setError]);

  return {
    ...state,
    setLoading,
    setError,
    setSuccess,
    reset,
    executeAsync
  };
};
