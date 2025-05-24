
import { useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useOptimizedQuery } from './useOptimizedQuery';
import type { Database } from '@/integrations/supabase/types';

type TableName = keyof Database['public']['Tables'];

interface OptimizedSupabaseOptions {
  enableCaching?: boolean;
  cacheTime?: number;
  staleTime?: number;
}

export const useOptimizedSupabase = (options: OptimizedSupabaseOptions = {}) => {
  const {
    enableCaching = true,
    cacheTime = 15 * 60 * 1000, // 15 minut
    staleTime = 5 * 60 * 1000   // 5 minut
  } = options;

  // Optimalizovaný select s cache
  const optimizedSelect = useCallback(
    <T extends TableName>(table: T, columns: string = '*', filters?: Record<string, any>) => {
      let query = supabase.from(table).select(columns);
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value);
          }
        });
      }
      
      return query;
    },
    []
  );

  // Batch operace pro lepší výkon
  const batchInsert = useCallback(
    async <T extends TableName>(table: T, data: any[]) => {
      const BATCH_SIZE = 100;
      const results = [];
      
      for (let i = 0; i < data.length; i += BATCH_SIZE) {
        const batch = data.slice(i, i + BATCH_SIZE);
        const result = await supabase.from(table).insert(batch);
        results.push(result);
      }
      
      return results;
    },
    []
  );

  // Optimalizovaný upsert
  const optimizedUpsert = useCallback(
    async <T extends TableName>(table: T, data: any, onConflict: string) => {
      return await supabase
        .from(table)
        .upsert(data, { onConflict })
        .select();
    },
    []
  );

  // Připravené queries pro často používané operace
  const preparedQueries = useMemo(() => ({
    getUserProfile: (userId: string) => 
      optimizedSelect('profiles', '*', { id: userId }),
    
    getUserShifts: (userId: string, startDate?: string, endDate?: string) => {
      let query = optimizedSelect('shifts', '*', { user_id: userId });
      if (startDate) query = query.gte('date', startDate);
      if (endDate) query = query.lte('date', endDate);
      return query.order('date', { ascending: false });
    },
    
    getUserVehicles: (userId: string) =>
      optimizedSelect('vehicles', '*', { user_id: userId }),
    
    getPromoCodes: () =>
      optimizedSelect('promo_codes', '*')
        .order('created_at', { ascending: false })
  }), [optimizedSelect]);

  return {
    optimizedSelect,
    batchInsert,
    optimizedUpsert,
    preparedQueries,
    enableCaching,
    cacheTime,
    staleTime
  };
};
