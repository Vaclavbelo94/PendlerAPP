import { useMemo } from 'react';
import { useShiftsManager } from './useShiftsManager';
import { useAdvancedPerformance } from '../performance/useAdvancedPerformance';
import { logger } from '@/utils/logger';

export const useOptimizedShiftsManager = (userId: string | null) => {
  const shiftsManager = useShiftsManager({ userId });
  const { optimizedCache } = useAdvancedPerformance();
  
  // Optimized shifts with intelligent caching
  const optimizedShifts = useMemo(() => {
    if (!shiftsManager.shifts) return null;
    
    const cacheKey = `shifts_optimized_${Date.now()}`;
    const cachedShifts = optimizedCache.get(cacheKey);
    
    if (cachedShifts) {
      logger.debug('Using cached shifts data');
      return cachedShifts;
    }
    
    // Apply performance optimizations
    const optimized = shiftsManager.shifts.map(shift => ({
      ...shift,
      // Pre-calculate frequently used derived data
      duration: calculateShiftDuration(shift.start_time, shift.end_time),
      isToday: isShiftToday(shift.date),
      isUpcoming: isShiftUpcoming(shift.date),
      displayName: formatShiftName(shift.type, shift.date)
    }));
    
    // Cache the optimized data
    optimizedCache.set(cacheKey, optimized);
    
    return optimized;
  }, [shiftsManager.shifts, optimizedCache]);
  
  // Optimized operations with batching
  const optimizedOperations = useMemo(() => ({
    // Batch multiple shift operations
    batchUpdate: async (updates: Array<{ id: string; data: any }>) => {
      try {
        logger.info(`Batching ${updates.length} shift updates`);
        
        const results = await Promise.allSettled(
          updates.map(update => 
            shiftsManager.updateShift({
              ...update.data,
              id: update.id
            })
          )
        );
        
        const successful = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;
        
        logger.info(`Batch update completed: ${successful} successful, ${failed} failed`);
        
        return { successful, failed, results };
      } catch (error) {
        logger.error('Batch update failed:', error);
        throw error;
      }
    },
    
    // Smart duplicate detection
    createShiftSmart: async (shiftData: any) => {
      // Check for potential duplicates
      const existingShift = optimizedShifts?.find(shift => 
        shift.date === shiftData.date &&
        shift.start_time === shiftData.start_time &&
        shift.end_time === shiftData.end_time
      );
      
      if (existingShift) {
        throw new Error('Podobná směna již existuje');
      }
      
      return shiftsManager.addShift(shiftData);
    }
  }), [shiftsManager, optimizedShifts]);
  
  return {
    ...shiftsManager,
    shifts: optimizedShifts,
    operations: optimizedOperations,
    isOptimized: true
  };
};

// Helper functions
const calculateShiftDuration = (startTime: string, endTime: string): number => {
  const start = new Date(`1970-01-01T${startTime}`);
  const end = new Date(`1970-01-01T${endTime}`);
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60); // hours
};

const isShiftToday = (date: string): boolean => {
  const today = new Date().toISOString().split('T')[0];
  return date === today;
};

const isShiftUpcoming = (date: string): boolean => {
  const shiftDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return shiftDate >= today;
};

const formatShiftName = (type: string, date: string): string => {
  const shiftDate = new Date(date);
  const dayName = shiftDate.toLocaleDateString('cs-CZ', { weekday: 'short' });
  return `${type} - ${dayName}`;
};