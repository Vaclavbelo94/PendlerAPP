
import { useCallback, useRef } from 'react';
import { useCacheManager } from './useCacheManager';

interface OptimizedSupabaseOptions {
  enableCaching?: boolean;
  cacheTime?: number;
  staleTime?: number;
}

export const useOptimizedSupabase = (options: OptimizedSupabaseOptions = {}) => {
  const {
    enableCaching = true,
    cacheTime = 10 * 60 * 1000, // 10 minut
    staleTime = 5 * 60 * 1000   // 5 minut
  } = options;

  const { set, get } = useCacheManager({
    enablePeriodicCleanup: true,
    maxCacheSize: 20 * 1024 * 1024 // 20MB
  });

  const pendingRequests = useRef(new Map<string, Promise<any>>());

  // Optimized query with caching and deduplication
  const optimizedQuery = useCallback(async (
    queryKey: string,
    queryFn: () => Promise<any>
  ) => {
    // Check cache first
    if (enableCaching) {
      const cached = get(queryKey);
      if (cached) {
        return cached;
      }
    }

    // Check for pending request (deduplication)
    const pendingRequest = pendingRequests.current.get(queryKey);
    if (pendingRequest) {
      return pendingRequest;
    }

    // Create new request
    const request = queryFn().then(result => {
      // Cache the result
      if (enableCaching) {
        set(queryKey, result, cacheTime);
      }
      
      // Remove from pending
      pendingRequests.current.delete(queryKey);
      
      return result;
    }).catch(error => {
      // Remove from pending on error
      pendingRequests.current.delete(queryKey);
      throw error;
    });

    // Store pending request
    pendingRequests.current.set(queryKey, request);

    return request;
  }, [enableCaching, get, set, cacheTime]);

  // Batch operations for better performance
  const batchOperations = useCallback(async (operations: Array<() => Promise<any>>) => {
    try {
      const results = await Promise.allSettled(operations.map(op => op()));
      return results.map(result => 
        result.status === 'fulfilled' ? result.value : null
      );
    } catch (error) {
      console.error('Batch operations failed:', error);
      throw error;
    }
  }, []);

  return {
    optimizedQuery,
    batchOperations
  };
};
