
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { getAllData, deleteItemById, saveData } from '@/utils/offlineStorage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useSyncErrorHandler } from '@/hooks/useSyncErrorHandler';

export interface SyncQueueItem {
  id: string;
  entity_type: string;
  entity_id: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  data: any;
  user_id: string;
  created_at: string;
  retry_count: number;
  last_attempt?: string;
}

export const useSyncQueue = () => {
  const { user } = useAuth();
  const { isOffline } = useOfflineStatus();
  const { addErrorFromException } = useSyncErrorHandler();
  const [queueItems, setQueueItems] = useState<SyncQueueItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load queue items
  const loadQueueItems = useCallback(async () => {
    if (!user) return;
    
    try {
      const items = await getAllData<SyncQueueItem>('syncQueue');
      setQueueItems(items.filter(item => item.user_id === user.id));
    } catch (error) {
      console.error('Error loading sync queue:', error);
      addErrorFromException(error, 'syncQueue', undefined, 'Chyba při načítání fronty synchronizace');
    }
  }, [user, addErrorFromException]);

  // Add item to queue
  const addToQueue = useCallback(async (item: Omit<SyncQueueItem, 'id' | 'retry_count' | 'user_id' | 'created_at'>) => {
    if (!user) return;

    const queueItem: SyncQueueItem = {
      ...item,
      id: `${item.entity_type}-${item.entity_id}-${Date.now()}`,
      user_id: user.id,
      created_at: new Date().toISOString(),
      retry_count: 0
    };

    try {
      await saveData('syncQueue', queueItem);
      setQueueItems(prev => [...prev, queueItem]);
    } catch (error) {
      console.error('Error adding to sync queue:', error);
      addErrorFromException(error, 'syncQueue', queueItem.id, 'Chyba při přidávání do fronty synchronizace');
    }
  }, [user, addErrorFromException]);

  // Process single queue item
  const processSyncItem = async (item: SyncQueueItem): Promise<boolean> => {
    try {
      let success = false;
      
      switch (item.entity_type) {
        case 'shifts':
          if (item.action === 'INSERT') {
            const { error } = await supabase
              .from('shifts')
              .insert(item.data);
            if (error) throw error;
            success = true;
          } else if (item.action === 'UPDATE') {
            const { error } = await supabase
              .from('shifts')
              .update(item.data)
              .eq('id', item.entity_id)
              .eq('user_id', user?.id);
            if (error) throw error;
            success = true;
          } else if (item.action === 'DELETE') {
            const { error } = await supabase
              .from('shifts')
              .delete()
              .eq('id', item.entity_id)
              .eq('user_id', user?.id);
            if (error) throw error;
            success = true;
          }
          break;

        case 'vehicles':
          if (item.action === 'INSERT') {
            const { error } = await supabase
              .from('vehicles')
              .insert(item.data);
            if (error) throw error;
            success = true;
          } else if (item.action === 'UPDATE') {
            const { error } = await supabase
              .from('vehicles')
              .update(item.data)
              .eq('id', item.entity_id)
              .eq('user_id', user?.id);
            if (error) throw error;
            success = true;
          } else if (item.action === 'DELETE') {
            const { error } = await supabase
              .from('vehicles')
              .delete()
              .eq('id', item.entity_id)
              .eq('user_id', user?.id);
            if (error) throw error;
            success = true;
          }
          break;

        case 'calculation_history':
          if (item.action === 'INSERT') {
            const { error } = await supabase
              .from('calculation_history')
              .insert(item.data);
            if (error) throw error;
            success = true;
          }
          break;
      }

      return success;
    } catch (error) {
      console.error('Error processing sync item:', error);
      addErrorFromException(
        error, 
        item.entity_type, 
        item.entity_id, 
        `Chyba při synchronizaci ${item.entity_type}`
      );
      return false;
    }
  };

  // Process entire queue
  const processQueue = useCallback(async () => {
    if (!user || isOffline || queueItems.length === 0) return;

    setIsSyncing(true);
    const processed: string[] = [];
    const failed: SyncQueueItem[] = [];

    for (const item of queueItems) {
      const success = await processSyncItem(item);
      
      if (success) {
        processed.push(item.id);
        try {
          await deleteItemById('syncQueue', item.id);
        } catch (error) {
          console.error('Error removing processed item:', error);
        }
      } else {
        // Increment retry count
        const updatedItem = {
          ...item,
          retry_count: item.retry_count + 1,
          last_attempt: new Date().toISOString()
        };
        
        if (updatedItem.retry_count < 3) {
          try {
            await saveData('syncQueue', updatedItem);
            failed.push(updatedItem);
          } catch (error) {
            console.error('Error updating failed item:', error);
          }
        } else {
          // Max retries reached, remove from queue
          try {
            await deleteItemById('syncQueue', item.id);
            addErrorFromException(
              new Error('Maximální počet pokusů dosažen'),
              item.entity_type,
              item.entity_id,
              `Synchronizace ${item.entity_type} selhala po 3 pokusech`
            );
          } catch (error) {
            console.error('Error removing failed item:', error);
          }
        }
      }
    }

    // Update local state
    setQueueItems(failed);
    
    if (processed.length > 0) {
      toast({
        title: "Synchronizace dokončena",
        description: `Synchronizováno ${processed.length} položek`
      });
    }

    if (failed.length > 0) {
      toast({
        title: "Částečná synchronizace",
        description: `${failed.length} položek se nepodařilo synchronizovat`,
        variant: "destructive"
      });
    }

    setIsSyncing(false);
  }, [user, isOffline, queueItems, addErrorFromException]);

  // Auto-sync when coming online
  useEffect(() => {
    if (!isOffline && queueItems.length > 0) {
      processQueue();
    }
  }, [isOffline, processQueue, queueItems.length]);

  // Load queue on mount
  useEffect(() => {
    loadQueueItems();
  }, [loadQueueItems]);

  return {
    queueItems,
    isSyncing,
    addToQueue,
    processQueue,
    loadQueueItems,
    queueCount: queueItems.length
  };
};
