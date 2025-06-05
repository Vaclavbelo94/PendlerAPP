
import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';

interface SyncError {
  id: string;
  entity: string;
  entityId?: string;
  message: string;
  timestamp: Date;
  resolved: boolean;
}

export const useSyncErrorHandler = () => {
  const [errors, setErrors] = useState<SyncError[]>([]);

  const addError = useCallback((entity: string, entityId: string | undefined, message: string) => {
    const error: SyncError = {
      id: `${entity}-${entityId || 'unknown'}-${Date.now()}`,
      entity,
      entityId,
      message,
      timestamp: new Date(),
      resolved: false
    };

    setErrors(prev => [error, ...prev.slice(0, 9)]); // Keep only 10 most recent errors
    
    toast({
      title: "Synchronizační chyba",
      description: message,
      variant: "destructive"
    });
  }, []);

  const addErrorFromException = useCallback((
    exception: any, 
    entity: string, 
    entityId?: string,
    customMessage?: string
  ) => {
    const message = customMessage || exception?.message || 'Neznámá chyba při synchronizaci';
    addError(entity, entityId, message);
  }, [addError]);

  const resolveError = useCallback((errorId: string) => {
    setErrors(prev => prev.map(error => 
      error.id === errorId ? { ...error, resolved: true } : error
    ));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const clearResolvedErrors = useCallback(() => {
    setErrors(prev => prev.filter(error => !error.resolved));
  }, []);

  return {
    errors,
    addError,
    addErrorFromException,
    resolveError,
    clearErrors,
    clearResolvedErrors,
    hasUnresolvedErrors: errors.some(error => !error.resolved)
  };
};
