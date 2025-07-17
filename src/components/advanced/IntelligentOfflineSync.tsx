import React, { useEffect, useState, useCallback } from 'react';
import { useOfflineMaster } from '@/hooks/useOfflineMaster';
import { useAdvancedPerformance } from '@/hooks/performance/useAdvancedPerformance';
import { logger } from '@/utils/logger';
import { toast } from 'sonner';

interface SyncStrategy {
  priority: 'high' | 'medium' | 'low';
  retryCount: number;
  retryDelay: number;
  batchSize: number;
}

interface IntelligentOfflineSyncProps {
  strategy?: SyncStrategy;
  enableIntelligentBatching?: boolean;
  enablePriorityQueue?: boolean;
}

const DEFAULT_STRATEGY: SyncStrategy = {
  priority: 'medium',
  retryCount: 3,
  retryDelay: 1000,
  batchSize: 10
};

export const IntelligentOfflineSync: React.FC<IntelligentOfflineSyncProps> = ({
  strategy = DEFAULT_STRATEGY,
  enableIntelligentBatching = true,
  enablePriorityQueue = true
}) => {
  const { 
    isOffline, 
    totalPendingItems, 
    isSyncing, 
    syncAllPendingData,
    shifts,
    vehicles,
    calculations 
  } = useOfflineMaster();
  
  const { measurePerformance } = useAdvancedPerformance();
  const [syncProgress, setSyncProgress] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncQueue, setSyncQueue] = useState<any[]>([]);

  // Intelligent sync queue management
  const buildSyncQueue = useCallback(() => {
    const queue: any[] = [];
    
    // Priority-based queuing
    if (enablePriorityQueue) {
      // High priority: Critical shifts and current user data
      if (shifts.shifts?.length) {
        queue.push(...shifts.shifts.map(shift => ({ 
          ...shift, 
          type: 'shift', 
          priority: 'high',
          timestamp: new Date(shift.date || Date.now())
        })));
      }
      
      // Medium priority: Vehicles and calculations
      if (vehicles.vehicles?.length) {
        queue.push(...vehicles.vehicles.map(vehicle => ({ 
          ...vehicle, 
          type: 'vehicle', 
          priority: 'medium',
          timestamp: new Date()
        })));
      }
      
      if (calculations.offlineCalculations?.length) {
        queue.push(...calculations.offlineCalculations.map(calc => ({ 
          ...calc, 
          type: 'calculation', 
          priority: 'low',
          timestamp: new Date()
        })));
      }
      
      // Sort by priority and timestamp
      queue.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
    }
    
    setSyncQueue(queue);
    return queue;
  }, [shifts.shifts, vehicles.vehicles, calculations.offlineCalculations, enablePriorityQueue]);

  // Intelligent batching sync
  const performIntelligentSync = useCallback(async () => {
    if (isOffline || isSyncing) return;
    
    try {
      const startTime = performance.now();
      const queue = buildSyncQueue();
      
      if (queue.length === 0) return;
      
      logger.info(`Starting intelligent sync of ${queue.length} items`);
      setSyncProgress(0);
      
      if (enableIntelligentBatching) {
        // Batch sync with progress tracking
        const batches = [];
        for (let i = 0; i < queue.length; i += strategy.batchSize) {
          batches.push(queue.slice(i, i + strategy.batchSize));
        }
        
        for (let i = 0; i < batches.length; i++) {
          const batch = batches[i];
          
          // Sync batch with retry logic
          let retryCount = 0;
          while (retryCount < strategy.retryCount) {
            try {
              await syncBatch(batch);
              break;
            } catch (error) {
              retryCount++;
              if (retryCount >= strategy.retryCount) {
                logger.error(`Failed to sync batch after ${strategy.retryCount} retries:`, error);
                throw error;
              }
              await new Promise(resolve => setTimeout(resolve, strategy.retryDelay * retryCount));
            }
          }
          
          // Update progress
          setSyncProgress(((i + 1) / batches.length) * 100);
        }
      } else {
        // Traditional sync
        await syncAllPendingData();
      }
      
      const syncTime = performance.now() - startTime;
      setLastSyncTime(new Date());
      setSyncProgress(100);
      
      // Performance measurement
      const metrics = await measurePerformance();
      logger.info(`Sync completed in ${syncTime.toFixed(2)}ms`, { metrics });
      
      toast.success(`Synchronizace dokončena (${queue.length} položek)`);
      
    } catch (error) {
      logger.error('Intelligent sync failed:', error);
      toast.error('Chyba při synchronizaci');
    }
  }, [isOffline, isSyncing, buildSyncQueue, enableIntelligentBatching, strategy, syncAllPendingData, measurePerformance]);

  const syncBatch = async (batch: any[]) => {
    // Group by type for efficient sync
    const shiftBatch = batch.filter(item => item.type === 'shift');
    const vehicleBatch = batch.filter(item => item.type === 'vehicle');
    const calculationBatch = batch.filter(item => item.type === 'calculation');
    
    const promises = [];
    
    if (shiftBatch.length && shifts.syncOfflineShifts) {
      promises.push(shifts.syncOfflineShifts());
    }
    
    if (vehicleBatch.length && vehicles.syncPendingVehicles) {
      promises.push(vehicles.syncPendingVehicles());
    }
    
    if (calculationBatch.length && calculations.syncCalculations) {
      promises.push(calculations.syncCalculations());
    }
    
    await Promise.allSettled(promises);
  };

  // Auto-sync when coming online
  useEffect(() => {
    if (!isOffline && totalPendingItems > 0 && !isSyncing) {
      const timeout = setTimeout(performIntelligentSync, 2000);
      return () => clearTimeout(timeout);
    }
  }, [isOffline, totalPendingItems, isSyncing, performIntelligentSync]);

  // Periodic sync check
  useEffect(() => {
    if (isOffline) return;
    
    const interval = setInterval(() => {
      if (totalPendingItems > 0 && !isSyncing) {
        performIntelligentSync();
      }
    }, 300000); // Check every 5 minutes
    
    return () => clearInterval(interval);
  }, [isOffline, totalPendingItems, isSyncing, performIntelligentSync]);

  if (totalPendingItems === 0 && !isSyncing) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-card border rounded-lg p-4 shadow-lg min-w-[280px] z-50">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-sm">Inteligentní synchronizace</h4>
        <div className="text-xs text-muted-foreground">
          {totalPendingItems} položek
        </div>
      </div>
      
      {isSyncing && (
        <div className="space-y-2">
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${syncProgress}%` }}
            />
          </div>
          <div className="text-xs text-muted-foreground">
            Synchronizace... {syncProgress.toFixed(0)}%
          </div>
        </div>
      )}
      
      {!isSyncing && (
        <div className="space-y-2">
          <button
            onClick={performIntelligentSync}
            disabled={isOffline}
            className="w-full bg-primary text-primary-foreground px-3 py-2 rounded text-sm hover:bg-primary/90 disabled:opacity-50"
          >
            {isOffline ? 'Offline režim' : 'Synchronizovat nyní'}
          </button>
          
          {lastSyncTime && (
            <div className="text-xs text-muted-foreground">
              Poslední sync: {lastSyncTime.toLocaleTimeString()}
            </div>
          )}
        </div>
      )}
      
      {enablePriorityQueue && syncQueue.length > 0 && (
        <div className="mt-2 text-xs text-muted-foreground">
          <div>Vysoká priorita: {syncQueue.filter(item => item.priority === 'high').length}</div>
          <div>Střední priorita: {syncQueue.filter(item => item.priority === 'medium').length}</div>
          <div>Nízká priorita: {syncQueue.filter(item => item.priority === 'low').length}</div>
        </div>
      )}
    </div>
  );
};