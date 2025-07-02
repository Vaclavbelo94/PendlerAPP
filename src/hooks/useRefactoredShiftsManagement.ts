
import { useState, useCallback, useEffect } from 'react';
import { useOptimizedQuery } from './useOptimizedQuery';
import { useMemoizedCallback } from './useMemoizedCallback';
import { Shift } from './shifts/useShiftsCRUD';

export const useRefactoredShiftsManagement = (userId?: string) => {
  const [isSaving, setIsSaving] = useState(false);

  // Optimalizovaný query pro shifts s agresivním cachingem
  const {
    data: shifts = [],
    isLoading,
    error,
    refetch: refreshShifts
  } = useOptimizedQuery<Shift[]>({
    queryKey: ['shifts', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      // Simulace API volání
      const mockShifts: Shift[] = [
        {
          id: '1',
          user_id: userId,
          date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
          type: 'morning',
          start_time: '06:00',
          end_time: '14:00',
          notes: 'Ukázková ranní směna',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      return mockShifts;
    },
    enabled: !!userId,
    cacheStrategy: 'aggressive',
    priorityLevel: 'high',
    enableBackgroundRefresh: true,
    dependencies: [userId]
  });

  // Optimalizované callback pro přidání směny
  const addShift = useMemoizedCallback(async (shiftData: Omit<Shift, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Shift | null> => {
    if (!userId) return null;
    
    setIsSaving(true);
    try {
      // Simulace API volání
      const newShift: Shift = {
        id: Date.now().toString(),
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...shiftData
      };
      
      // Refresh po úspěchu
      await refreshShifts();
      return newShift;
    } catch (error) {
      console.error('Failed to add shift:', error);
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [userId, refreshShifts]);

  // Optimalizované callback pro update směny
  const updateShift = useMemoizedCallback(async (shiftData: Shift): Promise<Shift | null> => {
    setIsSaving(true);
    try {
      // Simulace API volání
      const updatedShift: Shift = {
        ...shiftData,
        updated_at: new Date().toISOString()
      };
      
      // Refresh po úspěchu
      await refreshShifts();
      return updatedShift;
    } catch (error) {
      console.error('Failed to update shift:', error);
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [refreshShifts]);

  return {
    shifts,
    isLoading,
    error,
    isSaving,
    addShift,
    updateShift,
    refreshShifts,
    deleteShift: async (id: string) => {
      setIsSaving(true);
      try {
        // Simulace API volání
        await new Promise(resolve => setTimeout(resolve, 500));
        await refreshShifts();
        return true;
      } catch (error) {
        console.error('Failed to delete shift:', error);
        return false;
      } finally {
        setIsSaving(false);
      }
    }
  };
};
