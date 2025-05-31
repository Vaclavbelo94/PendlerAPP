
import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import StateSyncService from '@/services/StateSyncService';
import OfflineQueueService from '@/services/OfflineQueueService';
import { useQueryManager } from '@/hooks/useQueryManager';
import { useStateSync } from '@/hooks/useStateSync';
import { useOptimisticUpdates } from '@/hooks/useOptimisticUpdates';
import { useAuth } from '@/hooks/useAuth';

interface StateManagerContextType {
  // Services
  stateSyncService: StateSyncService;
  offlineQueueService: OfflineQueueService;
  
  // Hooks
  queryManager: ReturnType<typeof useQueryManager>;
  stateSync: ReturnType<typeof useStateSync>;
  optimisticUpdates: ReturnType<typeof useOptimisticUpdates>;
  
  // Actions
  syncData: (entity: string, action: 'create' | 'update' | 'delete', data: any) => Promise<void>;
  performOptimisticAction: (
    queryKey: any[],
    action: () => Promise<any>,
    optimisticUpdater: (old: any) => any
  ) => Promise<any>;
  
  // Status
  isOnline: boolean;
  syncStatus: {
    inProgress: boolean;
    queueLength: number;
    lastSync: Date | null;
  };
}

const StateManagerContext = createContext<StateManagerContextType | null>(null);

interface StateManagerProviderProps {
  children: React.ReactNode;
}

export const StateManagerProvider: React.FC<StateManagerProviderProps> = ({ children }) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  // Initialize services
  const stateSyncService = useRef<StateSyncService>();
  const offlineQueueService = useRef<OfflineQueueService>();
  
  if (!stateSyncService.current) {
    stateSyncService.current = new StateSyncService(queryClient);
  }
  
  if (!offlineQueueService.current) {
    offlineQueueService.current = new OfflineQueueService({
      maxRetries: 3,
      baseBackoffDelay: 2000,
      concurrentJobs: 2
    });
  }

  // Initialize hooks
  const queryManager = useQueryManager({
    enablePredictivePreloading: true,
    enableQueryBatching: true,
    maxConcurrentQueries: 5
  });

  const stateSync = useStateSync({
    enableCrossTab: true,
    enableRealTime: true,
    conflictResolution: 'merge'
  });

  const optimisticUpdates = useOptimisticUpdates({
    timeout: 10000,
    maxPendingUpdates: 15,
    enableRollback: true
  });

  // Online/offline status
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  // Sync status
  const [syncStatus, setSyncStatus] = React.useState({
    inProgress: false,
    queueLength: 0,
    lastSync: null as Date | null
  });

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      offlineQueueService.current?.startProcessing();
    };

    const handleOffline = () => {
      setIsOnline(false);
      offlineQueueService.current?.stopProcessing();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Start background services
  useEffect(() => {
    if (user) {
      stateSyncService.current?.startPeriodicSync(30000);
      offlineQueueService.current?.startProcessing(5000);
      
      // Predictive preload based on current route
      const currentPath = window.location.pathname;
      // Get premium status from user metadata or use default
      const isPremium = user.user_metadata?.is_premium || false;
      queryManager.predictivePreload(currentPath, isPremium ? 'premium' : 'free');
    }

    return () => {
      stateSyncService.current?.stopPeriodicSync();
      offlineQueueService.current?.stopProcessing();
    };
  }, [user, queryManager]);

  // Update sync status periodically
  useEffect(() => {
    const updateSyncStatus = async () => {
      if (stateSyncService.current && offlineQueueService.current) {
        const queueStats = await offlineQueueService.current.getQueueStats();
        const syncServiceStatus = stateSyncService.current.getSyncStatus();
        
        setSyncStatus({
          inProgress: syncServiceStatus.inProgress,
          queueLength: queueStats.total,
          lastSync: syncServiceStatus.lastSync
        });
      }
    };

    const interval = setInterval(updateSyncStatus, 5000);
    updateSyncStatus(); // Initial update

    return () => clearInterval(interval);
  }, []);

  // Sync data action
  const syncData = async (entity: string, action: 'create' | 'update' | 'delete', data: any) => {
    if (isOnline) {
      // Online - sync immediately
      stateSyncService.current?.addEvent({
        type: action,
        entity,
        data,
        source: 'local'
      });
    } else {
      // Offline - add to queue
      await offlineQueueService.current?.addToQueue({
        type: 'data-sync',
        priority: 'medium',
        maxRetries: 3,
        data: { entity, action, data }
      });
    }

    // Cross-tab sync
    stateSync.syncDataUpdate([entity, data.id], data);
  };

  // Perform optimistic action
  const performOptimisticAction = async (
    queryKey: any[],
    action: () => Promise<any>,
    optimisticUpdater: (old: any) => any
  ): Promise<any> => {
    const mutation = optimisticUpdates.createOptimisticMutation(
      action,
      {
        queryKey,
        optimisticUpdater: () => optimisticUpdater,
        onSuccess: (data) => {
          // Broadcast success to other tabs
          stateSync.syncDataUpdate(queryKey, data);
        },
        onError: (error) => {
          console.error('Optimistic action failed:', error);
        }
      }
    );

    return mutation({});
  };

  const contextValue: StateManagerContextType = {
    // Services
    stateSyncService: stateSyncService.current,
    offlineQueueService: offlineQueueService.current,
    
    // Hooks
    queryManager,
    stateSync,
    optimisticUpdates,
    
    // Actions
    syncData,
    performOptimisticAction,
    
    // Status
    isOnline,
    syncStatus
  };

  return (
    <StateManagerContext.Provider value={contextValue}>
      {children}
    </StateManagerContext.Provider>
  );
};

export const useStateManager = (): StateManagerContextType => {
  const context = useContext(StateManagerContext);
  if (!context) {
    throw new Error('useStateManager must be used within StateManagerProvider');
  }
  return context;
};
