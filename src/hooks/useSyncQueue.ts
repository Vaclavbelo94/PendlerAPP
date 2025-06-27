
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/auth';

interface SyncQueueItem {
  id: string;
  operation: 'create' | 'update' | 'delete';
  table: string;
  data: any;
  userId: string;
  createdAt: string;
}

interface SyncQueueState {
  queue: SyncQueueItem[];
  isSyncing: boolean;
  error: string | null;
  queueCount: number;
}

interface SyncQueueWithActions extends SyncQueueState {
  enqueue: (operation: 'create' | 'update' | 'delete', table: string, data: any) => Promise<void>;
  sync: () => Promise<void>;
  processQueue: () => Promise<void>;
}

export const useSyncQueue = (): SyncQueueWithActions => {
  const { user } = useAuth();
  const [state, setState] = useState<SyncQueueState>({
    queue: [],
    isSyncing: false,
    error: null,
    queueCount: 0,
  });

  useEffect(() => {
    const loadQueue = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('sync_queue')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });

        if (error) {
          throw error;
        }

        setState(prevState => ({ 
          ...prevState, 
          queue: data || [],
          queueCount: data?.length || 0
        }));
      } catch (error: any) {
        console.error('Error loading sync queue:', error);
        setState(prevState => ({
          ...prevState,
          error: error.message || 'Chyba při načítání fronty synchronizace',
        }));
      }
    };

    loadQueue();
  }, [user]);

  const enqueue = async (
    operation: 'create' | 'update' | 'delete',
    table: string,
    data: any
  ) => {
    if (!user) return;

    const newItem = {
      operation,
      table,
      data,
      userId: user.id,
      createdAt: new Date().toISOString(),
    };

    try {
      const { data: insertedData, error } = await supabase
        .from('sync_queue')
        .insert({
          operation: newItem.operation,
          table: newItem.table,
          data: newItem.data,
          user_id: newItem.userId,
        })
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      setState(prevState => ({
        ...prevState,
        queue: [...prevState.queue, insertedData],
        queueCount: prevState.queueCount + 1,
      }));
    } catch (error: any) {
      console.error('Error enqueuing item:', error);
      setState(prevState => ({
        ...prevState,
        error: error.message || 'Chyba při zařazování položky do fronty',
      }));
    }
  };

  const sync = async () => {
    if (!user || state.isSyncing) return;

    setState(prevState => ({ ...prevState, isSyncing: true, error: null }));

    try {
      const queueCopy = [...state.queue];
      for (const item of queueCopy) {
        try {
          switch (item.operation) {
            case 'create':
              await supabase.from(item.table).insert(item.data);
              break;
            case 'update':
              await supabase.from(item.table).update(item.data).eq('id', item.data.id);
              break;
            case 'delete':
              await supabase.from(item.table).delete().eq('id', item.data.id);
              break;
            default:
              console.warn('Unknown operation:', item.operation);
          }

          // Remove item from queue after successful sync
          const { error: deleteError } = await supabase
            .from('sync_queue')
            .delete()
            .eq('id', item.id);

          if (deleteError) {
            throw deleteError;
          }

          setState(prevState => ({
            ...prevState,
            queue: prevState.queue.filter(q => q.id !== item.id),
            queueCount: prevState.queueCount - 1,
          }));
        } catch (syncError: any) {
          console.error(`Error syncing item ${item.id}:`, syncError);
          setState(prevState => ({
            ...prevState,
            error:
              syncError.message ||
              `Chyba při synchronizaci položky ${item.id}`,
          }));
          break; // Stop syncing on first error
        }
      }

      setState(prevState => ({ ...prevState, isSyncing: false }));
    } catch (error: any) {
      console.error('Error during sync:', error);
      setState(prevState => ({
        ...prevState,
        isSyncing: false,
        error: error.message || 'Chyba během synchronizace',
      }));
    }
  };

  const processQueue = async () => {
    await sync();
  };

  return {
    ...state,
    enqueue,
    sync,
    processQueue,
  };
};
