
import { useState, useEffect, useCallback } from 'react';
import { crossDeviceSyncService, DeviceInfo, ConflictResolution } from '@/services/CrossDeviceSyncService';
import { useStandardizedToast } from '@/hooks/useStandardizedToast';

export const useCrossDeviceSync = () => {
  const [activeDevices, setActiveDevices] = useState<DeviceInfo[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const { success, info, error: showError } = useStandardizedToast();

  // Sync data with conflict resolution
  const syncData = useCallback(async (
    localData: any[], 
    entityType: string,
    showNotifications = true
  ) => {
    setIsSyncing(true);
    
    try {
      const result = await crossDeviceSyncService.syncWithConflictResolution(
        localData, 
        entityType
      );
      
      setLastSyncTime(new Date());
      
      if (showNotifications) {
        if (result.conflicts > 0) {
          info(
            'Synchronizace dokončena s konflikty', 
            `Synchronizováno: ${result.synced}, Konflikty: ${result.conflicts}`
          );
        } else {
          success(
            'Synchronizace úspěšná', 
            `Synchronizováno ${result.synced} položek`
          );
        }
      }
      
      return result;
    } catch (error) {
      console.error('Sync failed:', error);
      if (showNotifications) {
        showError('Chyba synchronizace', 'Nepodařilo se synchronizovat data');
      }
      throw error;
    } finally {
      setIsSyncing(false);
    }
  }, [success, info, showError]);

  // Broadcast change to other devices
  const broadcastChange = useCallback(async (
    entityType: string,
    entityId: string,
    action: 'create' | 'update' | 'delete',
    data: any
  ) => {
    try {
      await crossDeviceSyncService.broadcastSyncEvent(
        entityType,
        entityId,
        action,
        data
      );
    } catch (error) {
      console.error('Failed to broadcast change:', error);
    }
  }, []);

  // Register conflict resolver
  const registerConflictResolver = useCallback((
    entityType: string,
    resolver: (conflicts: any[]) => any
  ) => {
    crossDeviceSyncService.registerConflictResolver(entityType, resolver);
  }, []);

  // Get current device info
  const getCurrentDevice = useCallback(() => {
    return crossDeviceSyncService.getDeviceInfo();
  }, []);

  // Listen for cross-device sync events
  useEffect(() => {
    const handleSyncEvent = (event: CustomEvent) => {
      const { entityType, action, data } = event.detail;
      
      // Trigger UI update
      window.dispatchEvent(new CustomEvent(`${entityType}-updated`, {
        detail: { action, data, fromRemoteDevice: true }
      }));
      
      info(
        'Aktualizace z jiného zařízení',
        `${entityType} byl ${action === 'create' ? 'vytvořen' : 
                               action === 'update' ? 'upraven' : 'smazán'}`
      );
    };

    window.addEventListener('cross-device-sync', handleSyncEvent as EventListener);
    
    return () => {
      window.removeEventListener('cross-device-sync', handleSyncEvent as EventListener);
    };
  }, [info]);

  // Load active devices
  useEffect(() => {
    const loadActiveDevices = async () => {
      try {
        const devices = await crossDeviceSyncService.getActiveDevices();
        setActiveDevices(devices);
      } catch (error) {
        console.error('Failed to load active devices:', error);
      }
    };

    loadActiveDevices();
    const interval = setInterval(loadActiveDevices, 60000); // Every minute
    
    return () => clearInterval(interval);
  }, []);

  return {
    activeDevices,
    isSyncing,
    lastSyncTime,
    syncData,
    broadcastChange,
    registerConflictResolver,
    getCurrentDevice
  };
};
