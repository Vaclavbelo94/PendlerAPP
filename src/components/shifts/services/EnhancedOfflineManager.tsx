
import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/auth';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { AdvancedOfflineService } from './AdvancedOfflineService';
import { toast } from 'sonner';

export const EnhancedOfflineManager: React.FC = () => {
  const { user } = useAuth();
  const { isOffline } = useOfflineStatus();
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle');
  
  const offlineService = AdvancedOfflineService.getInstance();

  const handleSync = useCallback(async () => {
    if (!user?.id || isOffline) return;
    
    setSyncStatus('syncing');
    try {
      const result = await offlineService.syncWithConflictResolution();
      
      if (result.synced > 0) {
        toast.success(`Synchronizováno ${result.synced} položek`);
      }
      
      if (result.conflicts > 0) {
        toast.warning(`Vyřešeno ${result.conflicts} konfliktů`);
      }
      
      setSyncStatus('idle');
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncStatus('error');
      toast.error('Synchronizace selhala');
    }
  }, [user?.id, isOffline, offlineService]);

  // Auto-sync when coming online
  useEffect(() => {
    if (!isOffline && user?.id) {
      handleSync();
    }
  }, [isOffline, user?.id, handleSync]);

  // Periodic sync when online
  useEffect(() => {
    if (isOffline || !user?.id) return;
    
    const interval = setInterval(() => {
      if (syncStatus === 'idle') {
        handleSync();
      }
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, [isOffline, user?.id, syncStatus, handleSync]);

  return null; // This is a background service component
};

export default EnhancedOfflineManager;
