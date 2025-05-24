
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useMemo } from 'react';

interface OptimizedQueryOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey'> {
  queryKey: (string | number | boolean | null | undefined)[];
  dependencies?: any[];
}

export const useOptimizedQuery = <T>(options: OptimizedQueryOptions<T>) => {
  // Memoizujeme query key pouze když se dependencies změní
  const memoizedQueryKey = useMemo(() => {
    return options.queryKey.filter(Boolean);
  }, options.dependencies || []);

  // Optimalizované query s aggressive caching
  return useQuery({
    ...options,
    queryKey: memoizedQueryKey,
    staleTime: options.staleTime || 5 * 60 * 1000, // 5 minut default
    gcTime: options.gcTime || 15 * 60 * 1000, // 15 minut default
    refetchOnWindowFocus: options.refetchOnWindowFocus ?? false,
    refetchOnMount: options.refetchOnMount ?? false,
    retry: options.retry || ((failureCount, error) => {
      if (failureCount >= 2) return false;
      // @ts-ignore
      if (error?.status === 404 || error?.status === 403) return false;
      return true;
    }),
  });
};
