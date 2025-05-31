
import { useCallback, useRef, useEffect } from 'react';
import { useQueryClient, QueryKey } from '@tanstack/react-query';

interface QueryManagerConfig {
  enablePredictivePreloading?: boolean;
  enableQueryBatching?: boolean;
  batchDelay?: number;
  maxConcurrentQueries?: number;
}

interface PendingQuery {
  queryKey: QueryKey;
  queryFn: () => Promise<any>;
  timestamp: number;
  priority: 'high' | 'medium' | 'low';
}

export const useQueryManager = (config: QueryManagerConfig = {}) => {
  const queryClient = useQueryClient();
  const {
    enablePredictivePreloading = true,
    enableQueryBatching = true,
    batchDelay = 50,
    maxConcurrentQueries = 5
  } = config;

  const pendingQueries = useRef<PendingQuery[]>([]);
  const batchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activeQueriesRef = useRef<Set<string>>(new Set());

  // Predictive preloading based on user behavior
  const predictivePreload = useCallback((currentPath: string, userRole?: string) => {
    if (!enablePredictivePreloading) return;

    const predictions = getPredictedQueries(currentPath, userRole);
    
    predictions.forEach(({ queryKey, queryFn, priority }) => {
      const keyString = JSON.stringify(queryKey);
      
      if (!activeQueriesRef.current.has(keyString)) {
        scheduleBatch({
          queryKey,
          queryFn,
          timestamp: Date.now(),
          priority
        });
      }
    });
  }, [enablePredictivePreloading]);

  // Get predicted queries based on current context
  const getPredictedQueries = (path: string, userRole?: string) => {
    const predictions: Omit<PendingQuery, 'timestamp'>[] = [];

    // Route-based predictions
    switch (path) {
      case '/dashboard':
        predictions.push(
          { queryKey: ['shifts', 'recent'], queryFn: () => Promise.resolve([]), priority: 'high' },
          { queryKey: ['notifications'], queryFn: () => Promise.resolve([]), priority: 'medium' }
        );
        break;
      case '/vocabulary':
        predictions.push(
          { queryKey: ['vocabulary', 'progress'], queryFn: () => Promise.resolve({}), priority: 'high' },
          { queryKey: ['vocabulary', 'items'], queryFn: () => Promise.resolve([]), priority: 'high' }
        );
        break;
      case '/shifts':
        predictions.push(
          { queryKey: ['shifts', 'calendar'], queryFn: () => Promise.resolve([]), priority: 'high' },
          { queryKey: ['vehicles'], queryFn: () => Promise.resolve([]), priority: 'medium' }
        );
        break;
    }

    // User role-based predictions
    if (userRole === 'premium') {
      predictions.push(
        { queryKey: ['premium', 'features'], queryFn: () => Promise.resolve([]), priority: 'medium' }
      );
    }

    return predictions;
  };

  // Schedule query for batching
  const scheduleBatch = useCallback((query: PendingQuery) => {
    if (!enableQueryBatching) {
      executeQuery(query);
      return;
    }

    pendingQueries.current.push(query);

    if (batchTimeoutRef.current) {
      clearTimeout(batchTimeoutRef.current);
    }

    batchTimeoutRef.current = setTimeout(() => {
      executeBatch();
    }, batchDelay);
  }, [enableQueryBatching, batchDelay]);

  // Execute single query
  const executeQuery = async (query: PendingQuery) => {
    const keyString = JSON.stringify(query.queryKey);
    
    if (activeQueriesRef.current.has(keyString)) return;
    if (activeQueriesRef.current.size >= maxConcurrentQueries) return;

    activeQueriesRef.current.add(keyString);

    try {
      await queryClient.prefetchQuery({
        queryKey: query.queryKey,
        queryFn: query.queryFn,
        staleTime: 5 * 60 * 1000 // 5 minutes
      });
    } catch (error) {
      console.warn('Predictive query failed:', error);
    } finally {
      activeQueriesRef.current.delete(keyString);
    }
  };

  // Execute batched queries
  const executeBatch = async () => {
    const queries = [...pendingQueries.current];
    pendingQueries.current = [];

    // Sort by priority and timestamp
    const sortedQueries = queries.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      return priorityDiff !== 0 ? priorityDiff : a.timestamp - b.timestamp;
    });

    // Execute queries respecting concurrency limit
    for (const query of sortedQueries) {
      if (activeQueriesRef.current.size < maxConcurrentQueries) {
        executeQuery(query);
      } else {
        // Re-schedule if we hit concurrency limit
        scheduleBatch(query);
        break;
      }
    }
  };

  // Intelligent query invalidation
  const smartInvalidate = useCallback((entity: string, action: 'create' | 'update' | 'delete') => {
    const invalidationMap: Record<string, string[]> = {
      shifts: ['shifts', 'calendar', 'dashboard', 'reports'],
      vehicles: ['vehicles', 'fuel-records', 'service-records', 'shifts'],
      vocabulary: ['vocabulary', 'progress', 'statistics', 'dashboard'],
      notifications: ['notifications', 'dashboard']
    };

    const toInvalidate = invalidationMap[entity] || [entity];
    
    toInvalidate.forEach(key => {
      queryClient.invalidateQueries({ 
        queryKey: [key],
        exact: false 
      });
    });

    // Predictive preload related data
    if (action === 'create' || action === 'update') {
      const relatedQueries = getRelatedQueries(entity);
      relatedQueries.forEach(query => scheduleBatch(query));
    }
  }, [queryClient]);

  // Get related queries for preloading
  const getRelatedQueries = (entity: string): PendingQuery[] => {
    const related: PendingQuery[] = [];
    const timestamp = Date.now();

    switch (entity) {
      case 'shifts':
        related.push(
          { queryKey: ['vehicles'], queryFn: () => Promise.resolve([]), timestamp, priority: 'medium' },
          { queryKey: ['reports', 'monthly'], queryFn: () => Promise.resolve({}), timestamp, priority: 'low' }
        );
        break;
      case 'vocabulary':
        related.push(
          { queryKey: ['vocabulary', 'statistics'], queryFn: () => Promise.resolve({}), timestamp, priority: 'medium' }
        );
        break;
    }

    return related;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (batchTimeoutRef.current) {
        clearTimeout(batchTimeoutRef.current);
      }
    };
  }, []);

  return {
    predictivePreload,
    smartInvalidate,
    scheduleBatch,
    activeQueries: activeQueriesRef.current.size,
    pendingQueries: pendingQueries.current.length
  };
};
