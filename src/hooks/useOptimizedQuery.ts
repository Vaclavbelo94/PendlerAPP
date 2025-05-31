
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useMemo, useRef, useEffect } from 'react';

interface OptimizedQueryOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey'> {
  queryKey: (string | number | boolean | null | undefined)[];
  dependencies?: any[];
  enableBackgroundRefresh?: boolean;
  priorityLevel?: 'high' | 'normal' | 'low';
  enableSmartRetry?: boolean;
  cacheStrategy?: 'aggressive' | 'normal' | 'minimal';
}

interface QueryMetrics {
  executionTime: number;
  cacheHit: boolean;
  retryCount: number;
  lastExecuted: number;
}

export const useOptimizedQuery = <T>(options: OptimizedQueryOptions<T>) => {
  const metricsRef = useRef<QueryMetrics>({
    executionTime: 0,
    cacheHit: false,
    retryCount: 0,
    lastExecuted: 0
  });

  // Memoize query key with dependency tracking
  const memoizedQueryKey = useMemo(() => {
    return options.queryKey.filter(Boolean);
  }, options.dependencies || []);

  // Enhanced cache strategies
  const getCacheConfig = (strategy: 'aggressive' | 'normal' | 'minimal' = 'normal') => {
    switch (strategy) {
      case 'aggressive':
        return {
          staleTime: 15 * 60 * 1000, // 15 minutes
          gcTime: 60 * 60 * 1000,    // 1 hour
          refetchOnWindowFocus: false,
          refetchOnMount: false,
          refetchOnReconnect: false
        };
      case 'minimal':
        return {
          staleTime: 30 * 1000,      // 30 seconds
          gcTime: 5 * 60 * 1000,     // 5 minutes
          refetchOnWindowFocus: true,
          refetchOnMount: true,
          refetchOnReconnect: true
        };
      default: // normal
        return {
          staleTime: 5 * 60 * 1000,  // 5 minutes
          gcTime: 15 * 60 * 1000,    // 15 minutes
          refetchOnWindowFocus: false,
          refetchOnMount: false,
          refetchOnReconnect: true
        };
    }
  };

  // Smart retry logic with exponential backoff
  const getSmartRetry = (enableSmartRetry: boolean = true) => {
    if (!enableSmartRetry) return false;

    return (failureCount: number, error: any) => {
      // Don't retry on client errors (4xx)
      if (error?.status >= 400 && error?.status < 500) return false;
      
      // Max 3 retries with exponential backoff
      if (failureCount >= 3) return false;
      
      // Don't retry on specific error types
      if (error?.code === 'NETWORK_ERROR' && !navigator.onLine) return false;
      
      return true;
    };
  };

  // Performance monitoring wrapper
  const wrappedQueryFn = useMemo(() => {
    if (!options.queryFn) return undefined;

    return async (...args: any[]) => {
      const startTime = performance.now();
      const wasInCache = !!options.queryKey && 
        typeof window !== 'undefined' && 
        !!localStorage.getItem(`query_${JSON.stringify(options.queryKey)}`);

      try {
        const result = await options.queryFn!(...args);
        
        // Update metrics
        metricsRef.current = {
          executionTime: performance.now() - startTime,
          cacheHit: wasInCache,
          retryCount: metricsRef.current.retryCount,
          lastExecuted: Date.now()
        };

        return result;
      } catch (error) {
        metricsRef.current.retryCount++;
        throw error;
      }
    };
  }, [options.queryFn, options.queryKey]);

  // Background refresh for high-priority queries
  const enableBackgroundRefresh = options.enableBackgroundRefresh && options.priorityLevel === 'high';

  // Get cache configuration based on strategy
  const cacheConfig = getCacheConfig(options.cacheStrategy);

  // Build final query options
  const queryOptions: UseQueryOptions<T> = {
    ...options,
    queryKey: memoizedQueryKey,
    queryFn: wrappedQueryFn,
    retry: getSmartRetry(options.enableSmartRetry),
    ...cacheConfig,
    meta: {
      ...options.meta,
      priority: options.priorityLevel || 'normal',
      cacheStrategy: options.cacheStrategy || 'normal',
      backgroundRefresh: enableBackgroundRefresh
    }
  };

  // Execute the query
  const queryResult = useQuery(queryOptions);

  // Background refresh effect
  useEffect(() => {
    if (!enableBackgroundRefresh || !queryResult.data) return;

    const interval = setInterval(() => {
      // Only refresh if data is stale and component is still mounted
      if (queryResult.isStale && !queryResult.isFetching) {
        queryResult.refetch();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [enableBackgroundRefresh, queryResult]);

  // Performance logging for development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && metricsRef.current.lastExecuted > 0) {
      const metrics = metricsRef.current;
      
      if (metrics.executionTime > 1000) {
        console.warn(`Slow query detected: ${JSON.stringify(memoizedQueryKey)}`, {
          executionTime: `${metrics.executionTime.toFixed(2)}ms`,
          retryCount: metrics.retryCount,
          cacheHit: metrics.cacheHit
        });
      }
    }
  }, [memoizedQueryKey, queryResult.dataUpdatedAt]);

  // Enhanced query result with metrics and controls
  return {
    ...queryResult,
    
    // Performance metrics
    metrics: metricsRef.current,
    
    // Enhanced controls
    forceRefresh: () => queryResult.refetch({ cancelRefetch: true }),
    
    invalidateAndRefetch: () => {
      // This would require query client access
      queryResult.refetch();
    },
    
    // Cache information
    cacheInfo: {
      strategy: options.cacheStrategy || 'normal',
      priority: options.priorityLevel || 'normal',
      backgroundRefresh: enableBackgroundRefresh,
      staleTime: cacheConfig.staleTime,
      gcTime: cacheConfig.gcTime
    },
    
    // Performance helpers
    isSlowQuery: metricsRef.current.executionTime > 1000,
    hasHighRetryRate: metricsRef.current.retryCount > 2
  };
};
