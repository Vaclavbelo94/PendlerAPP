import { useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface StateSyncConfig {
  enableCrossTab?: boolean;
  enableRealTime?: boolean;
  syncInterval?: number;
  conflictResolution?: 'client-wins' | 'server-wins' | 'merge';
}

interface SyncMessage {
  type: 'query-invalidate' | 'data-update' | 'conflict-resolution';
  payload: any;
  timestamp: number;
  source: string;
}

export const useStateSync = (config: StateSyncConfig = {}) => {
  const queryClient = useQueryClient();
  const {
    enableCrossTab = true,
    enableRealTime = true,
    syncInterval = 30000,
    conflictResolution = 'client-wins'
  } = config;

  const channelRef = useRef<BroadcastChannel | null>(null);
  const sourceId = useRef<string>(Math.random().toString(36).substr(2, 9));
  const lastSyncRef = useRef<Record<string, number>>({});

  // Initialize cross-tab communication
  useEffect(() => {
    if (!enableCrossTab || typeof BroadcastChannel === 'undefined') return;

    channelRef.current = new BroadcastChannel('app-state-sync');

    channelRef.current.onmessage = (event) => {
      handleSyncMessage(event.data);
    };

    return () => {
      channelRef.current?.close();
    };
  }, [enableCrossTab]);

  // Handle incoming sync messages
  const handleSyncMessage = useCallback((message: SyncMessage) => {
    if (message.source === sourceId.current) return;

    switch (message.type) {
      case 'query-invalidate':
        queryClient.invalidateQueries({ 
          queryKey: message.payload.queryKey,
          exact: message.payload.exact 
        });
        break;
      
      case 'data-update':
        handleDataUpdate(message.payload);
        break;
      
      case 'conflict-resolution':
        handleConflictResolution(message.payload);
        break;
    }
  }, [queryClient]);

  // Handle data updates with conflict detection
  const handleDataUpdate = useCallback((payload: any) => {
    const { queryKey, data, timestamp } = payload;
    const keyString = JSON.stringify(queryKey);
    const lastSync = lastSyncRef.current[keyString] || 0;

    // Check for conflicts
    if (timestamp < lastSync) {
      // Potential conflict - resolve based on strategy
      resolveConflict(queryKey, data, timestamp);
      return;
    }

    // Update cache with new data
    queryClient.setQueryData(queryKey, data);
    lastSyncRef.current[keyString] = timestamp;
  }, [queryClient]);

  // Resolve data conflicts
  const resolveConflict = useCallback((queryKey: any[], newData: any, timestamp: number) => {
    const currentData = queryClient.getQueryData(queryKey);
    
    switch (conflictResolution) {
      case 'server-wins':
        queryClient.setQueryData(queryKey, newData);
        lastSyncRef.current[JSON.stringify(queryKey)] = timestamp;
        break;
      
      case 'client-wins':
        // Keep current data, ignore update
        break;
      
      case 'merge':
        const mergedData = mergeData(currentData, newData);
        queryClient.setQueryData(queryKey, mergedData);
        lastSyncRef.current[JSON.stringify(queryKey)] = Date.now();
        break;
    }
  }, [queryClient, conflictResolution]);

  // Handle conflict resolution messages
  const handleConflictResolution = useCallback((payload: any) => {
    // Implementation for handling conflict resolution
    console.log('Conflict resolution:', payload);
  }, []);

  // Merge data for conflict resolution
  const mergeData = (current: any, incoming: any): any => {
    if (!current || !incoming) return incoming || current;
    
    if (Array.isArray(current) && Array.isArray(incoming)) {
      // Merge arrays by ID
      const merged = [...current];
      incoming.forEach((item: any) => {
        const existingIndex = merged.findIndex(m => m.id === item.id);
        if (existingIndex >= 0) {
          merged[existingIndex] = { ...merged[existingIndex], ...item };
        } else {
          merged.push(item);
        }
      });
      return merged;
    }
    
    if (typeof current === 'object' && typeof incoming === 'object') {
      return { ...current, ...incoming };
    }
    
    return incoming;
  };

  // Broadcast state changes to other tabs
  const broadcastUpdate = useCallback((type: SyncMessage['type'], payload: any) => {
    if (!channelRef.current) return;

    const message: SyncMessage = {
      type,
      payload,
      timestamp: Date.now(),
      source: sourceId.current
    };

    channelRef.current.postMessage(message);
  }, []);

  // Sync query invalidation across tabs
  const syncInvalidateQueries = useCallback((queryKey: any[], exact = false) => {
    broadcastUpdate('query-invalidate', { queryKey, exact });
    queryClient.invalidateQueries({ queryKey, exact });
  }, [broadcastUpdate, queryClient]);

  // Sync data updates across tabs
  const syncDataUpdate = useCallback((queryKey: any[], data: any) => {
    const timestamp = Date.now();
    lastSyncRef.current[JSON.stringify(queryKey)] = timestamp;
    
    broadcastUpdate('data-update', { queryKey, data, timestamp });
    queryClient.setQueryData(queryKey, data);
  }, [broadcastUpdate, queryClient]);

  // Real-time subscription management
  const subscribeToRealTime = useCallback((channel: string, callback: (data: any) => void) => {
    if (!enableRealTime) return () => {};

    // Implementation would depend on WebSocket or SSE setup
    console.log(`Subscribing to real-time channel: ${channel}`);
    
    return () => {
      console.log(`Unsubscribing from channel: ${channel}`);
    };
  }, [enableRealTime]);

  // Periodic sync check
  useEffect(() => {
    if (!syncInterval) return;

    const interval = setInterval(() => {
      // Check for stale data and trigger sync if needed
      const staleCutoff = Date.now() - syncInterval;
      
      Object.entries(lastSyncRef.current).forEach(([queryKey, lastSync]) => {
        if (lastSync < staleCutoff) {
          const parsedKey = JSON.parse(queryKey);
          queryClient.invalidateQueries({ queryKey: parsedKey });
        }
      });
    }, syncInterval);

    return () => clearInterval(interval);
  }, [syncInterval, queryClient]);

  return {
    syncInvalidateQueries,
    syncDataUpdate,
    subscribeToRealTime,
    broadcastUpdate,
    isConnected: !!channelRef.current
  };
};
