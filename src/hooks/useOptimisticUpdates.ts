
import { useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface OptimisticUpdate<T = any> {
  id: string;
  queryKey: any[];
  optimisticData: T;
  rollbackData: T;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
}

interface OptimisticConfig {
  timeout?: number;
  maxPendingUpdates?: number;
  enableRollback?: boolean;
}

export const useOptimisticUpdates = (config: OptimisticConfig = {}) => {
  const queryClient = useQueryClient();
  const {
    timeout = 10000,
    maxPendingUpdates = 10,
    enableRollback = true
  } = config;

  const pendingUpdates = useRef<Map<string, OptimisticUpdate>>(new Map());
  const timeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Apply optimistic update
  const applyOptimisticUpdate = useCallback(<T>(
    queryKey: any[],
    updater: (old: T | undefined) => T,
    updateId?: string
  ): string => {
    const id = updateId || `opt_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    
    // Check if we've exceeded max pending updates
    if (pendingUpdates.current.size >= maxPendingUpdates) {
      console.warn('Max pending optimistic updates reached');
      return id;
    }

    // Get current data for rollback
    const currentData = queryClient.getQueryData<T>(queryKey);
    
    // Apply optimistic update
    const optimisticData = updater(currentData);
    queryClient.setQueryData(queryKey, optimisticData);

    // Store update for potential rollback
    const update: OptimisticUpdate<T> = {
      id,
      queryKey,
      optimisticData,
      rollbackData: currentData as T,
      timestamp: Date.now(),
      status: 'pending'
    };

    pendingUpdates.current.set(id, update);

    // Set timeout for automatic rollback
    const timeoutId = setTimeout(() => {
      if (enableRollback) {
        rollbackUpdate(id, 'timeout');
      }
    }, timeout);

    timeouts.current.set(id, timeoutId);

    return id;
  }, [queryClient, maxPendingUpdates, timeout, enableRollback]);

  // Confirm optimistic update
  const confirmUpdate = useCallback((updateId: string, serverData?: any) => {
    const update = pendingUpdates.current.get(updateId);
    if (!update) return;

    // Clear timeout
    const timeoutId = timeouts.current.get(updateId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeouts.current.delete(updateId);
    }

    // Update with server data if provided
    if (serverData !== undefined) {
      queryClient.setQueryData(update.queryKey, serverData);
    }

    // Mark as confirmed
    update.status = 'confirmed';
    pendingUpdates.current.set(updateId, update);

    // Clean up after a delay
    setTimeout(() => {
      pendingUpdates.current.delete(updateId);
    }, 5000);
  }, [queryClient]);

  // Rollback optimistic update
  const rollbackUpdate = useCallback((updateId: string, reason: 'error' | 'timeout' | 'manual' = 'manual') => {
    const update = pendingUpdates.current.get(updateId);
    if (!update || update.status !== 'pending') return;

    // Clear timeout
    const timeoutId = timeouts.current.get(updateId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeouts.current.delete(updateId);
    }

    // Rollback to original data
    queryClient.setQueryData(update.queryKey, update.rollbackData);

    // Mark as failed
    update.status = 'failed';
    pendingUpdates.current.set(updateId, update);

    console.warn(`Optimistic update rolled back (${reason}):`, updateId);

    // Clean up
    setTimeout(() => {
      pendingUpdates.current.delete(updateId);
    }, 1000);
  }, [queryClient]);

  // Optimistic mutation wrapper
  const createOptimisticMutation = useCallback(<TData, TVariables>(
    mutationFn: (variables: TVariables) => Promise<TData>,
    options: {
      queryKey: any[];
      optimisticUpdater: (variables: TVariables) => (old: TData | undefined) => TData;
      onSuccess?: (data: TData, variables: TVariables, updateId: string) => void;
      onError?: (error: any, variables: TVariables, updateId: string) => void;
    }
  ) => {
    return async (variables: TVariables): Promise<TData> => {
      // Apply optimistic update
      const updateId = applyOptimisticUpdate(
        options.queryKey,
        options.optimisticUpdater(variables)
      );

      try {
        // Execute mutation
        const result = await mutationFn(variables);
        
        // Confirm update with server data
        confirmUpdate(updateId, result);
        
        // Call success callback
        options.onSuccess?.(result, variables, updateId);
        
        return result;
      } catch (error) {
        // Rollback on error
        rollbackUpdate(updateId, 'error');
        
        // Call error callback
        options.onError?.(error, variables, updateId);
        
        throw error;
      }
    };
  }, [applyOptimisticUpdate, confirmUpdate, rollbackUpdate]);

  // Batch optimistic updates
  const batchOptimisticUpdates = useCallback(<T>(
    updates: Array<{
      queryKey: any[];
      updater: (old: T | undefined) => T;
    }>
  ): string[] => {
    return updates.map(({ queryKey, updater }) => 
      applyOptimisticUpdate(queryKey, updater)
    );
  }, [applyOptimisticUpdate]);

  // Get pending updates status
  const getPendingUpdates = useCallback(() => {
    return Array.from(pendingUpdates.current.values())
      .filter(update => update.status === 'pending');
  }, []);

  // Clear all pending updates
  const clearAllPending = useCallback((rollback = false) => {
    if (rollback) {
      Array.from(pendingUpdates.current.keys()).forEach(id => {
        rollbackUpdate(id, 'manual');
      });
    } else {
      Array.from(pendingUpdates.current.keys()).forEach(id => {
        confirmUpdate(id);
      });
    }
  }, [rollbackUpdate, confirmUpdate]);

  return {
    applyOptimisticUpdate,
    confirmUpdate,
    rollbackUpdate,
    createOptimisticMutation,
    batchOptimisticUpdates,
    getPendingUpdates,
    clearAllPending,
    pendingCount: pendingUpdates.current.size
  };
};
